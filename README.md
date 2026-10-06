# Alur Taher Basha · Portfolio

A one-page personal site. It's quiet, light and monochrome, built with Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS 4 and Lenis.
There's no loader, no WebGL and no GSAP. Motion comes from CSS animations, IntersectionObserver and a few small `requestAnimationFrame` loops.

- First-load JS: **~131 kB** (`next build`)
- Fonts self-hosted in `src/fonts` via `next/font/local`
- No external requests at runtime

## Run it

```bash
npm install
npm run dev          # http://localhost:3000
```

Production build:

```bash
npm run build
npm run start
```

Checks:

```bash
npm run lint
npm run qa -- http://localhost:3000      # Playwright: screenshots, overflow, video, card, pinning, counters
```

The first time, run `npx playwright install chromium`. Screenshots are written to `screenshots/`.

Extra tooling in `tests/`:

| Script | What it does |
| --- | --- |
| `qa.mjs` | Screenshots at 1440×900 and 390×844. Checks `scrollWidth === innerWidth`, hero pause/resume, the ▶/❚❚ button, ID-card flip (Enter and tap), the pinned achievements track and count-up, the mobile menu (Esc), and console errors. |
| `lighthouse.mjs` | Lighthouse (mobile + desktop) through a Playwright-launched Chromium. Needs `npm i --no-save lighthouse@12`. |
| `load-profile.mjs`, `trace-longtasks.mjs`, `idle-profile.mjs` | Main-thread profiling under 4× CPU throttle. |

## Content

All copy lives in **`src/lib/data.ts`**: `PROFILE`, `NAV`, `SKILL_GROUPS`, `PROJECTS`, `EXPERIENCE`, `EDUCATION`, `TIMELINE`, `CERTIFICATIONS`, `ACHIEVEMENTS`. Components only read from it.

The source is `Alur_Taher_Basha_Full_Stack_Ai_Engineer_Resume.pdf`, both its text and its embedded links. A copy is served at `/Alur_Taher_Basha_Resume.pdf` for the Résumé ↓ buttons.

Items marked `ownerSupplied` (or commented *owner-supplied*) were given by Taher while the site was being built and are **not in the PDF yet**:

- At ZRUTAM LLP: 3 products built end to end, 10k+ users handled, built with MERN, Next.js, Bunny CDN and AWS.
- 200+ LeetCode problems solved.
- The Next.js and Bunny CDN skill tiles.

Add these to the résumé so the two stay in sync.

Not in the résumé, so not on the site:

- **Certifications:** the section component exists but renders nothing while `CERTIFICATIONS` is empty. To enable it, fill the array and add `{ id: "certifications", label: "Certifications" }` to `NAV` after Work.
- **Schooling before the M.Tech:** add entries to `EDUCATION` and the timeline picks them up in date order.
- **Project GitHub repos:** project buttons link to the live demos. Set `github` on a project to add "View on GitHub ↗".

## Sections

| # | Section | Component | Signature motion |
| --- | --- | --- | --- |
| – | Navigation | `Navigation.tsx` | Initials mark fills after 40 px and spins on hover; frosted pill; sliding ink indicator (IO, `-45% 0px -50% 0px`); 2 px progress bar; clip-path mobile overlay with staggered links, Esc, scroll lock |
| – | Hero | `hero/Hero.tsx` | `multiply`-blended looping video, outlined ghost name, sound-first autoplay with muted fallback, unlock on first interaction, pauses below 35 % visibility, ▶/❚❚ button with ping ring while blocked |
| 01 | About | `sections/About.tsx`, `ui/IdCard.tsx` | Lanyard ID card: damped pendulum driven by pointer velocity, idle sway, 3D flip (hover / tap / Enter·Space), gray holo sticker |
| 02 | Skills | `sections/Skills.tsx`, `ui/TechLogo.tsx` | Periodic table: diagonal wave reveal `(row+col)×40ms`, family filter dims tiles, sticky inspector with a 150 px logo pop |
| 03 | Work | `sections/Work.tsx`, `ui/MiniUI.tsx` | Expanding accordion (flex 1 → 8), vertical spines, clip-path wipe on the grayscale "Illustrative UI"; vertical accordion on mobile |
| 04 | Experience | `sections/Experience.tsx` | Spine draws with scroll progress; each stop lights up as the spine reaches it; dashed "Next: Your team?" card |
| 05 | Achievements | `sections/Achievements.tsx` | Pinned (`sticky`, height = 100 svh + travel) horizontal track, header progress bar, easeOutQuart count-up (1.4 s, once), the centre card lifts 12 px |
| 06 | Contact + footer | `sections/Contact.tsx` | Per-letter hop on hover, copy-email chip with `aria-live`, spinning "say hello" badge |
| – | Certifications | `sections/Certifications.tsx` | Ink-flood rows (`::before` scaleX). Hidden until data exists. |

Shared pieces:

- `ui/SectionHead.tsx`: numbered tag + bold heading + one Instrument Serif italic word.
- `ui/RevealObserver.tsx`: adds `.is-in` to `.rv` / `.rv-mask` once.
- `lib/hooks.ts`: `useInView`, `useScrollProgress`, `prefersReducedMotion`.
- `lib/scroll.tsx`: Lenis, `scrollToTarget`, scroll lock.

## Rebuilding the hero video

Requires ffmpeg/ffprobe on `PATH`, Python 3 and numpy (`pip install numpy`).

```bash
python scripts/build-hero-assets.py path/to/intro.mp4
# optional: --crop W:H:X:Y   --whiten 0.98   --photo portrait.jpg   --font some.ttf
```

What it does:

1. **Crop.** Detects the person (dark or saturated pixels against the light backdrop) across 8 frames. It crops head to toe at 4:5, centred on the head, and scales to 768×960. The generator watermark in the bottom-right corner falls outside the crop. For this video: `crop=566:708:329:12`.
2. **Whiten.** Applies `colorlevels=rimax=…:gimax=…:bimax=…`. The spec value is 0.98, but this video's backdrop is a vignetted light gray, so the script measures the darkest backdrop pixels and uses that level (**0.90** here). The backdrop becomes pure white and multiplies away into the paper colour. Override with `--whiten`.
3. **Seamless loop.** Uses the first ≤10 s (here 8 s). The picture is `body = [0.5 s … end]`, then the last 0.5 s **xfade** into the first 0.5 s. The audio gets the identical cut, cross-faded sample-accurately in numpy (equal-power), not `acrossfade`. Nothing is retimed, so lips stay in sync. Output length is 7.5 s and repeats with no jump or click.
4. **Export.**
   - `public/hero/hero.webm`: VP9 CRF 36 + Opus 80k, listed first.
   - `public/hero/hero.mp4`: H.264 yuv420p CRF 24 `-preset slow` + AAC 96k, `+faststart`.
   - `public/hero/poster.webp`: the first frame, used as the video poster and an LCP preload.
5. **Stills.**
   - `public/portrait-bust.webp`: 480×600 head-to-shirt crop from the sharpest frame (Laplacian variance), or from `--photo`.
   - `public/og.jpg`: 1200×630.

## Design tokens

| Token | Value |
| --- | --- |
| `--paper` | `#f4f2ee` (page background, also `themeColor`) |
| `--card` | `#ffffff` |
| `--ink` | `#0d0d0d` |
| `--ink-2` | `#3a3a3a` |
| `--mute` | `#6b6964` |
| `--faint` | `#a9a6a0` |
| `--line` | `rgba(13,13,13,.1)` |
| `--soft` | `#e9e6e0` |
| `--ease` | `cubic-bezier(.16,1,.3,1)` |
| `--gutter` | `clamp(18px,4vw,64px)` |

`--mute` is a step darker than the brief's `#77756f`, which measured 4.1:1 on paper. The new value passes WCAG AA at 4.5:1+ for small text. Everything is white, black or gray; only real brand logos keep their colours, plus a soft tint glow behind them.

CSS organisation:

- Component CSS lives in a `<style>` inside each component.
- Shared classes (`.wrap`, `.section`, `.btn`, `.card`, `.chip`, `.tag`, `.rv`, `.rv-mask`) are in `@layer components`.
- Resets are in `@layer base`, so Tailwind utilities always win.

## Accessibility and motion

- Semantic sections with `aria-labelledby`, one `h1`, and h2/h3 in order. There's a skip link and visible `:focus-visible` rings.
- `prefers-reduced-motion` disables:
  - Lenis smooth scrolling
  - the pendulum loop
  - autoplay (the ▶ button still plays with sound)
  - CSS animations and transitions
  - count-ups (final values show immediately)
- Text equivalents for visuals:
  - the video has an `aria-label`
  - the portrait has alt text
  - logos are decorative next to printed names
  - big counters are `aria-hidden`, with the full value in screen-reader text
  - mini-UIs are captioned "Illustrative UI, not a screenshot"
- The ID card flips via an overlay `<button>` (`aria-pressed`): Enter/Space on keyboard, tap on touch, hover with a mouse.

## Performance notes

- Offscreen sections use `content-visibility: auto`. Each section is its own `<Suspense>` boundary, so hydration is split into interruptible tasks.
- Decorative animations are transform/opacity only. The mini-UI animations pause while their panel is closed, and mini-UIs mount on first open.
- CSS is inlined (`experimental.inlineCss`). Only the italic face of Instrument Serif ships, since every serif accent is italic. All fonts use `font-display: swap`. `optional` measured faster, but showed fallback fonts on a fresh first visit.
- Lighthouse on this dev machine (production build, benchmark index ≈1170):
  - desktop: Performance 100, Accessibility 100, Best Practices 100, SEO 100
  - mobile (simulated slow 4G + 4× CPU): Performance **84–94** between runs; Accessibility, Best Practices and SEO 100. On this machine even a blank Next.js page scores 91 on mobile.

## Credits and licences

- **Brand logos** in `public/logos/`. They are trademarks of their owners and are used only to identify the technologies.
  - [Devicon](https://devicon.dev) "original" SVGs, MIT (`public/logos/LICENSE-devicon.txt`): JavaScript, Python, Java, React, Tailwind CSS, Next.js, Node.js, Express, Socket.IO, MongoDB, MySQL, AWS, Nginx, Git, Postman, Jenkins.
  - [Simple Icons](https://simpleicons.org) paths in their official brand colour, CC0 1.0 (`public/logos/LICENSE-simple-icons.md`): Claude, Google Gemini, LangChain, JSON Web Tokens, PM2, bunny.net, LeetCode.
- **Concept icons** (Web Speech API, REST APIs, FAISS, RAG, prompt engineering, DSA, SQL and the achievement icons) are custom line icons in `ui/TechLogo.tsx`.
- **Fonts**, all SIL Open Font License 1.1, latin subsets from Fontsource:
  - Inter Tight (variable)
  - Instrument Serif (italic)
  - JetBrains Mono (variable)
