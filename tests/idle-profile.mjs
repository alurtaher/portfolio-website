// Counts style recalcs / layouts / script time while the page sits idle at the top.
//   node tests/idle-profile.mjs [url]
import { chromium } from "@playwright/test";

const url = process.argv[2] ?? "http://localhost:3000";
const browser = await chromium.launch({ args: ["--autoplay-policy=no-user-gesture-required"] });
const page = await browser.newPage({ viewport: { width: 412, height: 823 }, isMobile: true, hasTouch: true });
const cdp = await page.context().newCDPSession(page);
await cdp.send("Performance.enable");
await page.goto(url, { waitUntil: "networkidle" });
await page.waitForTimeout(3000);

const metrics = async () =>
  Object.fromEntries((await cdp.send("Performance.getMetrics")).metrics.map((m) => [m.name, m.value]));
const keys = ["RecalcStyleCount", "LayoutCount", "RecalcStyleDuration", "LayoutDuration", "ScriptDuration", "TaskDuration"];

const sample = async (label) => {
  const a = await metrics();
  await page.waitForTimeout(2000);
  const b = await metrics();
  console.log(label.padEnd(28), keys.map((k) => `${k.replace("Duration", "ms").replace("Count", "#")}=${(k.includes("Duration") ? (b[k] - a[k]) * 1000 : b[k] - a[k]).toFixed(0)}`).join("  "));
};

await sample("idle (all on)");
const disable = async (label, css, js) => {
  await page.evaluate(([css, js]) => {
    const s = document.createElement("style");
    s.textContent = css;
    document.head.appendChild(s);
    if (js) new Function(js)();
  }, [css, js]);
  await sample(label);
};
await disable("+ video paused", "", "document.querySelector('.hero-video').pause()");
await disable("+ css animations off", "*,*::before,*::after{animation:none!important}");
await browser.close();
