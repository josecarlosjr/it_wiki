import assert from "node:assert/strict";
import test from "node:test";
import fs from "node:fs";

test("enciclopédia contém artigos do básico ao especialista", () => {
  const wiki = fs.readFileSync("content/wiki.ts", "utf8");
  assert.match(wiki, /title: "Kubernetes"/);
  assert.match(wiki, /title: "Amazon Web Services"/);
  assert.match(wiki, /title: "Sistemas distribuídos"/);
  assert.match(wiki, /level: "Fundamentos"/);
  assert.match(wiki, /level: "Especialista"/);
});

test("índice da wiki não apresenta conteúdo bloqueado", () => {
  const index = fs.readFileSync("app/wiki/page.tsx", "utf8");
  assert.match(index, /Todos os assuntos, sem bloqueios/);
  assert.doesNotMatch(index, /Planejado/);
});

test("aplicação possui healthcheck no Nginx", () => {
  const config = fs.readFileSync("nginx.conf", "utf8");
  assert.match(config, /location = \/healthz/);
});
