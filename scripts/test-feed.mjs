// Integration test for GET /api/public/feed. Usage: BASE_URL=http://localhost:3000 node scripts/test-feed.mjs
import assert from "node:assert/strict";

const base = process.env.BASE_URL || "http://localhost:3000";
let failed = 0;
const check = (name, fn) => {
  try {
    fn();
    console.log("ok  ", name);
  } catch (e) {
    failed++;
    console.log("FAIL", name, "-", e.message);
  }
};

const res = await fetch(`${base}/api/public/feed`);
const raw = await res.text();
const feed = JSON.parse(raw);

check("200 JSON", () => assert.equal(res.status, 200));
check("cache headers", () => assert.match(res.headers.get("cache-control") ?? "", /s-maxage=3600.*stale-while-revalidate=86400/));
check("CORS * for GET", () => assert.equal(res.headers.get("access-control-allow-origin"), "*"));
check("top-level keys", () => assert.deepEqual(Object.keys(feed).sort(), ["featured", "generatedAt", "heatmap", "latest", "profile", "stats"]));
check("generatedAt is ISO", () => assert.ok(!isNaN(Date.parse(feed.generatedAt))));
check("profile shape", () => {
  assert.equal(feed.profile.name, "Chetan Gadhiya");
  assert.equal(typeof feed.profile.openToWork, "boolean");
  assert.match(feed.profile.resumeUrl, /\/resume$/);
});
check("stats are numbers", () => {
  for (const k of ["githubContributions365", "leetcodeSolved", "leetcodeEasy", "leetcodeMedium", "leetcodeHard", "leetcodeStreak", "mediumPosts"])
    assert.equal(typeof feed.stats[k], "number", k);
});
check("heatmap: 365 gap-free ascending days", () => {
  assert.equal(feed.heatmap.length, 365);
  for (let i = 1; i < 365; i++) assert.ok(feed.heatmap[i].date > feed.heatmap[i - 1].date);
  assert.ok(feed.heatmap.every((d) => ["github", "leetcode", "medium", "posts"].every((k) => Number.isInteger(d[k]))));
});
check("latest: <=12, newest first, valid types", () => {
  assert.ok(feed.latest.length <= 12);
  for (let i = 1; i < feed.latest.length; i++) assert.ok(feed.latest[i - 1].date >= feed.latest[i].date);
  assert.ok(feed.latest.every((x) => ["medium", "linkedin", "x", "github"].includes(x.type) && x.url.startsWith("http") && x.title));
});
check("featured: 4 projects with repo + stack", () => {
  assert.equal(feed.featured.length, 4);
  assert.ok(feed.featured.every((f) => f.repo.includes("/") && f.stack.length > 0 && f.oneLiner));
});
check("no private data (email, phone, tokens)", () => {
  assert.ok(!/@gmail\.com|mailto:|ghp_|service_role|\b\d{10}\b/.test(raw), "found sensitive-looking text");
});

const opt = await fetch(`${base}/api/public/feed`, { method: "OPTIONS" });
check("OPTIONS 204", () => assert.equal(opt.status, 204));

console.log(failed ? `\n${failed} failed` : "\nall passed");
process.exit(failed ? 1 : 0);
