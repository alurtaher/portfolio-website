// QA pass: screenshots at 1440×900 and 390×844, horizontal-overflow check,
// hero video pause/resume, achievements pin + count-up, console errors.
//   npm run build && npm run start   (in one terminal)
//   node tests/qa.mjs [baseUrl]
import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";

const BASE = process.argv[2] ?? "http://localhost:3000";
const OUT = "screenshots";
mkdirSync(OUT, { recursive: true });

const VIEWPORTS = [
  { name: "desktop", width: 1440, height: 900, mobile: false },
  { name: "mobile", width: 390, height: 844, mobile: true },
];
const SECTIONS = ["hero", "about", "skills", "work", "experience", "achievements", "contact"];

const browser = await chromium.launch({ args: ["--autoplay-policy=no-user-gesture-required"] });
let failures = 0;
const fail = (m) => {
  failures++;
  console.log("  ✗", m);
};
const ok = (m) => console.log("  ✓", m);

for (const vp of VIEWPORTS) {
  console.log(`\n${vp.name} ${vp.width}×${vp.height}`);
  const ctx = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    isMobile: vp.mobile,
    hasTouch: vp.mobile,
    deviceScaleFactor: 1,
  });
  const page = await ctx.newPage();
  const errors = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push(String(e)));

  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.waitForTimeout(1800);

  const overflow = async (where) => {
    const r = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, iw: window.innerWidth }));
    if (r.sw > r.iw) fail(`horizontal overflow at ${where}: scrollWidth ${r.sw} > innerWidth ${r.iw}`);
    return r;
  };

  await overflow("load");
  await page.screenshot({ path: `${OUT}/${vp.name}-01-hero.png` });

  const heroState = () =>
    page.evaluate(() => {
      const v = document.querySelector(".hero-video");
      return { paused: v.paused, t: v.currentTime, ready: v.readyState };
    });
  const h0 = await heroState();
  h0.paused ? fail("hero video not playing on load") : ok(`hero video playing (t=${h0.t.toFixed(2)}s)`);

  for (const [i, id] of SECTIONS.entries()) {
    if (id === "hero") continue;
    await page.evaluate((id) => {
      const el = document.getElementById(id);
      window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY);
    }, id);
    await page.waitForTimeout(1400);
    await overflow(`#${id}`);
    await page.screenshot({ path: `${OUT}/${vp.name}-${String(i + 1).padStart(2, "0")}-${id}.png` });

    if (id === "about") {
      const h = await heroState();
      h.paused ? ok("hero video paused after scrolling past hero") : fail("hero video still playing past hero");
    }
    if (id === "achievements") {
      // move into the pinned travel
      const before = await page.evaluate(() => getComputedStyle(document.querySelector(".ach-track")).transform);
      await page.evaluate(() => {
        const s = document.getElementById("achievements");
        window.scrollTo(0, s.offsetTop + (s.offsetHeight - innerHeight) * 0.55);
      });
      await page.waitForTimeout(1800);
      const after = await page.evaluate(() => ({
        tf: getComputedStyle(document.querySelector(".ach-track")).transform,
        pinned: Math.round(document.querySelector(".ach-pin").getBoundingClientRect().top),
        nums: [...document.querySelectorAll("[data-count]")].map((n) => n.textContent),
      }));
      before !== after.tf && after.pinned === 0
        ? ok(`achievements pinned + track moved (${after.tf})`)
        : fail(`achievements not scrolling horizontally (${before} → ${after.tf}, pin top ${after.pinned})`);
      after.nums.some((n) => Number(n) > 0) ? ok(`counters: ${after.nums.join(", ")}`) : fail("no counter counted up");
      await overflow("achievements mid-travel");
      await page.screenshot({ path: `${OUT}/${vp.name}-${String(i + 1).padStart(2, "0")}-${id}-mid.png` });
    }
  }

  // back to hero → resumes
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(1200);
  const h2 = await heroState();
  h2.paused ? fail("hero video did not resume on return") : ok("hero video resumed on return");

  // sound button toggles ▶ / ❚❚
  const label0 = await page.getAttribute(".hero-sound", "aria-label");
  await page.click(".hero-sound");
  await page.waitForTimeout(300);
  const label1 = await page.getAttribute(".hero-sound", "aria-label");
  label0 !== label1 ? ok(`sound button toggles ("${label0}" → "${label1}")`) : fail("sound button label unchanged");

  // ID card flips via keyboard
  await page.evaluate(() => document.getElementById("about").scrollIntoView());
  await page.waitForTimeout(600);
  await page.focus(".idc-btn");
  await page.keyboard.press("Enter");
  await page.waitForTimeout(1100);
  const flipped = await page.getAttribute(".idc-btn", "aria-pressed");
  flipped === "true" ? ok("ID card flips with Enter") : fail("ID card did not flip with Enter");
  await page.screenshot({ path: `${OUT}/${vp.name}-02-about-flipped.png` });
  if (vp.mobile) {
    await page.tap(".idc-btn", { force: true });
    await page.waitForTimeout(400);
    const f2 = await page.getAttribute(".idc-btn", "aria-pressed");
    f2 === "false" ? ok("ID card flips back on tap") : fail("tap did not flip ID card");

    // mobile menu
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.click(".nav-menu-btn");
    await page.waitForTimeout(1000);
    await page.screenshot({ path: `${OUT}/${vp.name}-00-menu.png` });
    await page.keyboard.press("Escape");
    await page.waitForTimeout(600);
    const open = await page.evaluate(() => document.getElementById("mobile-menu").classList.contains("is-open"));
    open ? fail("Esc did not close the menu") : ok("mobile menu opens and closes with Esc");
  }

  errors.length ? errors.forEach((e) => fail(`console: ${e.slice(0, 200)}`)) : ok("no console errors");
  await ctx.close();
}

await browser.close();
console.log(failures ? `\n${failures} problem(s)` : "\nall checks passed");
process.exit(failures ? 1 : 0);
