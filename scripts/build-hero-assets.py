#!/usr/bin/env python3
"""
Build the hero assets from the raw intro video.

  python scripts/build-hero-assets.py <intro.mp4> [--crop W:H:X:Y] [--photo portrait.jpg]

Outputs
  public/hero/hero.mp4     H.264 yuv420p CRF 24 (slow) + AAC 96k, +faststart
  public/hero/hero.webm    VP9 CRF 36 + Opus 80k
  public/hero/poster.webp  first frame of the loop (video poster)
  public/portrait-bust.webp 480x600 head-to-shirt still
  public/og.jpg            1200x630 social card

Pipeline
  1. Detect the person (dark pixels vs. the light backdrop) on a handful of
     frames and crop tightly head-to-toe at 4:5, person centred.
     Override with --crop if detection is off.
  2. Whiten the backdrop with colorlevels (rimax/gimax/bimax) so it multiplies away
     on the page. 0.98 is the default; if the measured backdrop is a darker gray
     (vignetted studio sweep), the level is lowered to that gray so it becomes
     pure white. Override with --whiten.
  3. Seamless loop: the last FADE seconds of the picture cross-fade into the
     first FADE seconds (ffmpeg xfade). The audio gets the same cross-fade,
     done sample-accurately in numpy (equal-power), never retimed, so lips
     stay in sync and there is no click at the seam.

Requires ffmpeg/ffprobe on PATH and numpy.
"""
from __future__ import annotations

import argparse
import json
import shutil
import subprocess
import sys
import tempfile
import wave
from pathlib import Path

import numpy as np

ROOT = Path(__file__).resolve().parent.parent
OUT_W, OUT_H = 768, 960          # hero video, 4:5
MAX_LEN = 10.0                   # use at most the first 10 s
FADE = 0.5                       # loop cross-fade, seconds
SR = 48000
WHITEN_DEFAULT = 0.98  # spec value; auto-lowered when the backdrop is a darker gray
WHITEN = f"colorlevels=rimax={WHITEN_DEFAULT}:gimax={WHITEN_DEFAULT}:bimax={WHITEN_DEFAULT}"
PAPER = "0xf4f2ee"


def run(cmd: list[str], **kw) -> subprocess.CompletedProcess:
    print("  $", " ".join(str(c) for c in cmd)[:180])
    return subprocess.run(cmd, check=True, **kw)


def probe(src: Path) -> dict:
    out = subprocess.run(
        ["ffprobe", "-v", "error", "-show_streams", "-show_format", "-of", "json", str(src)],
        check=True, capture_output=True, text=True,
    ).stdout
    info = json.loads(out)
    v = next(s for s in info["streams"] if s["codec_type"] == "video")
    num, den = (int(x) for x in v["r_frame_rate"].split("/"))
    return {
        "w": int(v["width"]),
        "h": int(v["height"]),
        "fps": num / den,
        "dur": float(info["format"]["duration"]),
        "audio": any(s["codec_type"] == "audio" for s in info["streams"]),
    }


def grab_frames(src: Path, w: int, h: int, times: list[float]) -> list[np.ndarray]:
    frames = []
    for t in times:
        raw = subprocess.run(
            ["ffmpeg", "-v", "error", "-ss", f"{t:.3f}", "-i", str(src), "-frames:v", "1",
             "-f", "rawvideo", "-pix_fmt", "rgb24", "-"],
            check=True, capture_output=True,
        ).stdout
        frames.append(np.frombuffer(raw, np.uint8).reshape(h, w, 3).astype(np.float32))
    return frames


def person_mask(frame: np.ndarray) -> np.ndarray:
    """Pixels that differ clearly from the (light, low-saturation) backdrop."""
    lum = frame.mean(axis=2)
    sat = frame.max(axis=2) - frame.min(axis=2)
    bg = np.median(lum[:, : frame.shape[1] // 8])  # left strip is backdrop
    return (lum < bg - 38) | (sat > 40)


def detect_bbox(frames: list[np.ndarray]) -> tuple[int, int, int, int, int]:
    """Union bbox over frames -> (x0, y0, x1, y1, head_cx)."""
    m = np.zeros(frames[0].shape[:2], bool)
    for f in frames:
        m |= person_mask(f)
    # ignore the bottom-right corner (generator watermarks live there)
    h, w = m.shape
    m[int(h * 0.75):, int(w * 0.8):] = False
    rows = np.where(m.sum(axis=1) > 3)[0]
    cols = np.where(m.sum(axis=0) > 3)[0]
    y0, y1 = int(rows[0]), int(rows[-1])
    x0, x1 = int(cols[0]), int(cols[-1])
    head = m[y0 : y0 + max(8, (y1 - y0) // 12)]
    hc = np.where(head.any(axis=0))[0]
    head_cx = int(hc.mean()) if len(hc) else (x0 + x1) // 2
    return x0, y0, x1, y1, head_cx


def crop_for(bbox, src_w: int, src_h: int) -> tuple[int, int, int, int]:
    x0, y0, x1, y1, head_cx = bbox
    ph = y1 - y0
    pad = int(ph * 0.035)
    ch = min(src_h, ph + pad * 2 + int(ph * 0.02))  # a touch more room under the feet
    ch -= ch % 2
    cw = int(round(ch * OUT_W / OUT_H))
    cw -= cw % 2
    cx = head_cx  # centre on the head: the person stands upright
    x = max(0, min(src_w - cw, cx - cw // 2))
    y = max(0, min(src_h - ch, y0 - pad))
    return cw, ch, x, y


def backdrop_level(frames: list[np.ndarray], crop: tuple[int, int, int, int]) -> float:
    """Input max for colorlevels so the darkest backdrop pixel in the crop turns white."""
    cw, ch, cx, cy = crop
    lows = []
    for f in frames:
        c = f[cy : cy + ch, cx : cx + cw]
        m = person_mask(c)
        # grow the mask so shadows / soft edges around the person are excluded
        k = 14
        grown = m.copy()
        for dy in range(-k, k + 1, 7):
            for dx in range(-k, k + 1, 7):
                grown |= np.roll(np.roll(m, dy, 0), dx, 1)
        bg = c[~grown].min(axis=1)  # darkest channel per pixel
        if bg.size:
            lows.append(np.percentile(bg, 1.5))
    lvl = (min(lows) if lows else 250) / 255.0
    return float(min(WHITEN_DEFAULT, max(0.78, lvl - 0.01)))


def sharpness(f: np.ndarray) -> float:
    g = f.mean(axis=2)
    lap = g[1:-1, 1:-1] * 4 - g[:-2, 1:-1] - g[2:, 1:-1] - g[1:-1, :-2] - g[1:-1, 2:]
    return float(lap.var())


def read_audio(src: Path, start: float, dur: float) -> np.ndarray:
    raw = subprocess.run(
        ["ffmpeg", "-v", "error", "-ss", f"{start:.6f}", "-t", f"{dur:.6f}", "-i", str(src),
         "-vn", "-ac", "2", "-ar", str(SR), "-f", "f32le", "-"],
        check=True, capture_output=True,
    ).stdout
    return np.frombuffer(raw, np.float32).reshape(-1, 2).copy()


def write_wav(path: Path, x: np.ndarray) -> None:
    pcm = (np.clip(x, -1, 1) * 32767).astype("<i2")
    with wave.open(str(path), "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(pcm.tobytes())


def loop_audio(a: np.ndarray, length: float) -> np.ndarray:
    """out = a[f:L-f] ++ xfade(a[L-f:L] -> a[0:f]); total = L - f samples."""
    n = int(round(FADE * SR))
    total = int(round(length * SR))
    a = a[:total]
    if len(a) < total:
        a = np.pad(a, ((0, total - len(a)), (0, 0)))
    head, body = a[:n], a[n:]
    t = np.linspace(0, np.pi / 2, n, dtype=np.float32)[:, None]
    tail = body[-n:] * np.cos(t) + head * np.sin(t)  # equal-power
    return np.concatenate([body[:-n], tail])


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("src", nargs="?", help="intro video (mp4/mov)")
    ap.add_argument("--crop", help="override crop W:H:X:Y in source pixels")
    ap.add_argument("--photo", help="optional photo for the portrait still")
    ap.add_argument("--font", help="TTF for the OG card text")
    ap.add_argument("--whiten", type=float, help="colorlevels input max (default: measured from the backdrop, <= 0.98)")
    args = ap.parse_args()

    src = Path(args.src) if args.src else next(
        (p for p in ROOT.glob("*") if p.suffix.lower() in {".mp4", ".mov"}), None
    )
    if not src or not src.exists():
        sys.exit("intro video not found — pass its path")
    if not shutil.which("ffmpeg"):
        sys.exit("ffmpeg not on PATH")

    info = probe(src)
    fps = info["fps"]
    # length must be a whole number of frames
    length = min(MAX_LEN, info["dur"])
    length = int(length * fps) / fps
    print(f"source {info['w']}x{info['h']} @ {fps:g} fps, using {length:.3f}s")

    sample_t = list(np.linspace(0.2, length - 0.2, 8))
    frames = grab_frames(src, info["w"], info["h"], sample_t)

    if args.crop:
        cw, ch, cx, cy = (int(v) for v in args.crop.split(":"))
        bbox = (cx, cy, cx + cw, cy + ch, cx + cw // 2)
    else:
        bbox = detect_bbox(frames)
        cw, ch, cx, cy = crop_for(bbox, info["w"], info["h"])
    crop = f"crop={cw}:{ch}:{cx}:{cy}"
    print(f"person bbox {bbox[:4]} -> {crop}")

    global WHITEN
    lvl = args.whiten or backdrop_level(frames, (cw, ch, cx, cy))
    WHITEN = f"colorlevels=rimax={lvl:.3f}:gimax={lvl:.3f}:bimax={lvl:.3f}"
    print(f"whiten: {WHITEN}")

    out_dir = ROOT / "public" / "hero"
    out_dir.mkdir(parents=True, exist_ok=True)
    tmp = Path(tempfile.mkdtemp())

    # ---- audio: sample-accurate equal-power loop ----
    wav = tmp / "loop.wav"
    if info["audio"]:
        write_wav(wav, loop_audio(read_audio(src, 0, length), length))

    # ---- video: xfade(tail -> head), same timing as the audio ----
    vf = f"{crop},scale={OUT_W}:{OUT_H}:flags=lanczos,{WHITEN},setsar=1,fps={fps:g},format=yuv420p"
    fc = (
        f"[0:v]trim=0:{length:.6f},setpts=PTS-STARTPTS,{vf},split[a][b];"
        f"[a]trim={FADE}:{length:.6f},setpts=PTS-STARTPTS[body];"
        f"[b]trim=0:{FADE},setpts=PTS-STARTPTS[head];"
        f"[body][head]xfade=transition=fade:duration={FADE}:offset={length - 2 * FADE:.6f}[v]"
    )
    inputs = ["-i", str(src)] + (["-i", str(wav)] if info["audio"] else [])
    amap = ["-map", "1:a"] if info["audio"] else []

    run(["ffmpeg", "-v", "error", "-y", *inputs, "-filter_complex", fc, "-map", "[v]", *amap,
         "-c:v", "libx264", "-preset", "slow", "-crf", "24", "-pix_fmt", "yuv420p",
         "-c:a", "aac", "-b:a", "96k", "-movflags", "+faststart", "-shortest",
         str(out_dir / "hero.mp4")])
    run(["ffmpeg", "-v", "error", "-y", *inputs, "-filter_complex", fc, "-map", "[v]", *amap,
         "-c:v", "libvpx-vp9", "-crf", "36", "-b:v", "0", "-row-mt", "1", "-pix_fmt", "yuv420p",
         "-c:a", "libopus", "-b:a", "80k", "-shortest",
         str(out_dir / "hero.webm")])

    # ---- poster: first frame of the loop (paints before the video decodes, helps LCP) ----
    run(["ffmpeg", "-v", "error", "-y", "-i", str(out_dir / "hero.mp4"), "-frames:v", "1",
         "-c:v", "libwebp", "-q:v", "72", str(out_dir / "poster.webp")])

    # ---- portrait still: sharpest frame (or a provided photo), head-to-shirt ----
    pub = ROOT / "public"
    x0, y0, x1, y1, head_cx = bbox
    ph = y1 - y0
    bh = int(ph * 0.34)
    bw = int(bh * 480 / 600)
    by = max(0, y0 - int(ph * 0.04))
    bx = max(0, min(info["w"] - bw, head_cx - bw // 2))
    bust = f"crop={bw}:{bh}:{bx}:{by},scale=480:600:flags=lanczos,unsharp=5:5:0.6,{WHITEN}"
    if args.photo:
        run(["ffmpeg", "-v", "error", "-y", "-i", args.photo, "-vf",
             "scale=480:600:force_original_aspect_ratio=increase,crop=480:600",
             "-c:v", "libwebp", "-q:v", "90", "-compression_level", "6", str(pub / "portrait-bust.webp")])
    else:
        best = max(range(len(frames)), key=lambda i: sharpness(frames[i]))
        t = sample_t[best]
        print(f"sharpest frame at {t:.2f}s")
        run(["ffmpeg", "-v", "error", "-y", "-ss", f"{t:.3f}", "-i", str(src), "-frames:v", "1",
             "-vf", bust, "-c:v", "libwebp", "-q:v", "90", "-compression_level", "6", str(pub / "portrait-bust.webp")])

    # ---- OG card 1200x630: paper, bust on the right, name on the left ----
    font = args.font or next((f for f in [
        "C:/Windows/Fonts/arialbd.ttf",
        "/System/Library/Fonts/Supplemental/Arial Bold.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
    ] if Path(f).exists()), None)
    text = ""
    if font:
        ff = font.replace("\\", "/").replace(":", "\\:")
        text = (
            f",drawtext=fontfile='{ff}':text='Alur Taher Basha':fontsize=72:fontcolor=0x0d0d0d:x=80:y=230,"
            f"drawtext=fontfile='{ff}':text='Full Stack Developer':fontsize=36:fontcolor=0x77756f:x=82:y=330"
        )
    run(["ffmpeg", "-v", "error", "-y", "-f", "lavfi", "-i", f"color=c={PAPER}:s=1200x630",
         "-i", str(pub / "portrait-bust.webp"),
         "-filter_complex", f"[1:v]scale=400:500,format=rgba,colorchannelmixer=aa=1[p];"
         f"[0:v][p]overlay=720:65,format=yuv420p{text}",
         "-frames:v", "1", "-q:v", "3", str(pub / "og.jpg")])

    shutil.rmtree(tmp, ignore_errors=True)
    for p in [out_dir / "hero.mp4", out_dir / "hero.webm", out_dir / "poster.webp", pub / "portrait-bust.webp", pub / "og.jpg"]:
        print(f"  {p.relative_to(ROOT)}  {p.stat().st_size / 1024:.0f} kB")


if __name__ == "__main__":
    main()
