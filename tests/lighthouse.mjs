// Lighthouse via a Playwright-launched Chromium (works where chrome-launcher can't spawn).
//   node tests/lighthouse.mjs [url]     (needs: npm i --no-save lighthouse@12)
import { chromium } from "@playwright/test";
import lighthouse from "lighthouse";
import { writeFileSync } from "node:fs";

const url = process.argv[2] ?? "http://localhost:3000";
const port = 9233;
const browser = await chromium.launch({ args: [`--remote-debugging-port=${port}`] });
for (const formFactor of ["mobile", "desktop"]) {
  const desktop = formFactor === "desktop";
  const { lhr } = await lighthouse(
    url,
    { port, output: "json", logLevel: "error", onlyCategories: ["performance", "accessibility", "best-practices", "seo"] },
    {
      extends: "lighthouse:default",
      settings: desktop
        ? { formFactor: "desktop", screenEmulation: { mobile: false, width: 1440, height: 900, deviceScaleFactor: 1, disabled: false }, throttling: { rttMs: 40, throughputKbps: 10240, cpuSlowdownMultiplier: 1 } }
        : { formFactor: "mobile" },
    },
  );
  if (process.env.LH_DUMP) writeFileSync(`${process.env.LH_DUMP}-${formFactor}.json`, JSON.stringify(lhr));
  console.log(`\n${formFactor}`, lhr.runtimeError ? JSON.stringify(lhr.runtimeError) : "", (lhr.runWarnings || []).join(" | "));
  for (const [k, v] of Object.entries(lhr.categories)) console.log(`  ${k.padEnd(16)} ${Math.round(v.score * 100)}`);
  for (const a of ["first-contentful-paint", "largest-contentful-paint", "total-blocking-time", "cumulative-layout-shift"])
    console.log(`  ${a.padEnd(26)} ${lhr.audits[a].displayValue}`);
  for (const a of Object.values(lhr.audits))
    if (a.score !== null && a.score < 0.9 && ["binary", "metricSavings", "numeric"].includes(a.scoreDisplayMode))
      console.log(`  ! ${a.id}: ${a.title}${a.displayValue ? ` (${a.displayValue})` : ""}`);
}
await browser.close();
