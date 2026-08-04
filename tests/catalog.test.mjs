import assert from "node:assert/strict";
import test from "node:test";
import fs from "node:fs";

test("catálogo contém a trilha Kubernetes", () => {
  const catalog = fs.readFileSync("content/catalog.ts", "utf8");
  assert.match(catalog, /title: "Kubernetes"/);
});

test("aplicação possui healthcheck no Nginx", () => {
  const config = fs.readFileSync("nginx.conf", "utf8");
  assert.match(config, /location = \/healthz/);
});
