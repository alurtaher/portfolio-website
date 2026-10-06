// A/B load profiling under 4x CPU throttle: total style/layout/script time during
// the first 6 s, with individual features switched off via injected CSS/JS.
//   node tests/load-profile.mjs [url]
import { chromium } from "@playwright/test";

const url = process.argv[2] ?? "http://localhost:3000";
const browser = await chromium.launch({ args: ["--autoplay-policy=no-user-gesture-required"] });

const HIDE = "main>section:not(#hero){display:none!important}";
const VARIANTS = process.env.LAYOUT
  ? {
      baseline: "",
      "no text-wrap balance": "*{text-wrap:wrap!important}",
      "no container query": ".wk-row{container-type:normal!important}",
      "no skills grid": ".sk-body{display:none!important}",
      "no work": "#work{display:none!important}",
      "no achievements": "#achievements{display:none!important}",
      "no about": "#about{display:none!important}",
    }
  : process.env.DEEP
  ? {
      "below-fold hidden": HIDE,
      "+ no nav/menu": HIDE + "nav,#mobile-menu,.nav-progress{display:none!important}",
      "+ system fonts": HIDE + "*{font-family:Arial,sans-serif!important}",
      "+ no hero text": HIDE + ".hero-left,.hero-right,.hero-ghost{display:none!important}",
      "+ no hero media": HIDE + ".hero-media{display:none!important}",
      "+ no footer": HIDE + "footer{display:none!important}",
    }
  : {
      baseline: "",
      "no video": "video{display:none!important}",
      "no animations": "*,*::before,*::after{animation:none!important;transition:none!important}",
      "no backdrop/blend": "*{backdrop-filter:none!important;-webkit-backdrop-filter:none!important;mix-blend-mode:normal!important}",
      "no ghost word": ".hero-ghost{display:none!important}",
      "no cv": ".cv{content-visibility:visible!important}",
      "no below-fold": HIDE,
    };

async function run(name, css) {
  const ctx = await browser.newContext({ viewport: { width: 412, height: 823 }, isMobile: true, hasTouch: true });
  const page = await ctx.newPage();
  const cdp = await ctx.newCDPSession(page);
  await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
  await cdp.send("Performance.enable");
  if (css)
    await page.addInitScript((css) => {
      document.addEventListener("DOMContentLoaded", () => {
        const s = document.createElement("style");
        s.textContent = css;
        document.head.appendChild(s);
      });
    }, css);
  await page.goto(url, { waitUntil: "load" });
  await page.waitForTimeout(6000);
  const m = Object.fromEntries((await cdp.send("Performance.getMetrics")).metrics.map((x) => [x.name, x.value]));
  const ms = (k) => String(Math.round(m[k] * 1000)).padStart(6);
  console.log(
    name.padEnd(20),
    `style ${ms("RecalcStyleDuration")}  layout ${ms("LayoutDuration")}  script ${ms("ScriptDuration")}  task ${ms("TaskDuration")}  recalcs ${m.RecalcStyleCount} layouts ${m.LayoutCount}`,
  );
  await ctx.close();
}

for (const [k, v] of Object.entries(VARIANTS)) await run(k, v);
await browser.close();
