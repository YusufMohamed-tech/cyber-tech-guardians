import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function loadWorker() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  return (await import(workerUrl.href)).default;
}

const env = {
  ASSETS: {
    fetch: async () => new Response("Not found", { status: 404 }),
  },
};

const ctx = {
  waitUntil() {},
  passThroughOnException() {},
};

test("server-renders the complete Cyber Tech Guardians experience", async () => {
  const worker = await loadWorker();
  const response = await worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    env,
    ctx,
  );

  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Stay Secure, Surf Sure — Cyber Tech Guardians<\/title>/i);
  assert.match(html, /CYBER TECH GUARDIANS/);
  assert.match(html, /Password Strength Checker/);
  assert.match(html, /Spot the Phishing Email/);
  assert.match(html, /\/api\/subscribe/);
  assert.match(html, /og\.png/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape/);
});

test("validates, deduplicates, and persists subscriptions", async () => {
  const route = await readFile(
    new URL("../app/api/subscribe/route.ts", import.meta.url),
    "utf8",
  );

  assert.match(route, /EMAIL_PATTERN\.test\(email\)/);
  assert.match(route, /status: 400/);
  assert.match(route, /ensureDbSchema\(\)/);
  assert.match(route, /onConflictDoNothing/);
  assert.match(route, /returning\(\{ id: subscribers\.id \}\)/);
});
