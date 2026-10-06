// Records a 4x-throttled mobile load trace and prints what the long tasks spend time on.
//   node tests/trace-longtasks.mjs [url]
import { chromium } from "@playwright/test";

const url = process.argv[2] ?? "http://localhost:3000";
const browser = await chromium.launch({ args: ["--autoplay-policy=no-user-gesture-required"] });
const ctx = await browser.newContext({ viewport: { width: 412, height: 823 }, isMobile: true, hasTouch: true });
const page = await ctx.newPage();
const cdp = await ctx.newCDPSession(page);
await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });

const events = [];
cdp.on("Tracing.dataCollected", (e) => events.push(...e.value));
const done = new Promise((r) => cdp.once("Tracing.tracingComplete", r));
await cdp.send("Tracing.start", {
  categories: "devtools.timeline,disabled-by-default-devtools.timeline,v8.execute,blink.user_timing",
  transferMode: "ReportEvents",
});
await page.goto(url, { waitUntil: "load" });
await page.waitForTimeout(6000);
await cdp.send("Tracing.end");
await done;

const main = events.filter((e) => e.name === "RunTask" && e.dur > 50000).sort((a, b) => b.dur - a.dur);
const t0 = events.find((e) => e.name === "navigationStart")?.ts ?? main[0]?.ts ?? 0;
for (const task of main.slice(0, 6)) {
  const inside = events.filter(
    (e) => e.tid === task.tid && e.ts >= task.ts && e.ts + (e.dur || 0) <= task.ts + task.dur && e.dur && e !== task,
  );
  const by = {};
  for (const e of inside) {
    const key = e.name + (e.args?.data?.url ? ` ${e.args.data.url.split("/").pop().slice(0, 30)}` : "") + (e.args?.data?.functionName ? ` ${e.args.data.functionName}` : "");
    by[key] = (by[key] || 0) + e.dur;
  }
  console.log(`\ntask @${((task.ts - t0) / 1000).toFixed(0)}ms  ${(task.dur / 1000).toFixed(0)}ms`);
  Object.entries(by)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 9)
    .forEach(([k, v]) => console.log(`   ${(v / 1000).toFixed(0).padStart(6)}ms  ${k}`));
}
await browser.close();
