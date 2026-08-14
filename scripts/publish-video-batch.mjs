#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const [slug, sourceRoot, commit] = process.argv.slice(2);
if (!slug || !sourceRoot || !commit) {
  console.error("usage: publish-video-batch.mjs <slug> <engineering-root> <commit>");
  process.exit(2);
}

const repo = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const destination = path.join(repo, "site", "videos", slug);
fs.mkdirSync(destination, { recursive: true });
const publishOnly = process.env.PUBLISH_ONLY === "1";
const episodes = ["analysis", "ch01-overview", "ch02-architecture", "ch03-loop", "ch04-model", "ch05-tools", "ch06-context", "ch07-security", "ch08-ecosystem", "ch09-collaboration", "ch10-evidence"];
const copy = (from, to) => fs.copyFileSync(from, to);
const runJson = (cwd, args) => execFileSync(args[0], args.slice(1), { cwd, encoding: "utf8" });
const node = "/Users/qujianglong/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node";
const cli = "/Users/qujianglong/.npm/_npx/702923228c2ce1e6/node_modules/hyperframes/dist/cli.js";

for (const episode of episodes) {
  const src = path.join(sourceRoot, episode);
  const key = episode;
  for (const ext of ["DESIGN.md", "STORY.md", "SCRIPT.md", "README.md"]) {
    copy(path.join(src, ext), path.join(destination, `${key}.${ext}`));
  }
  copy(path.join(src, "QA.md"), path.join(destination, `${key}.QA.md`));
  copy(path.join(src, "renders", `${key}.srt`), path.join(destination, `${key}.srt`));
  copy(path.join(src, "renders", `${key}.mp4`), path.join(destination, `${key}.mp4`));
  if (!publishOnly) {
    const lint = runJson(src, [node, cli, "lint", "--json"]);
    const check = runJson(src, [node, cli, "check", "--json"]);
    fs.writeFileSync(path.join(destination, `${key}.lint.json`), `${lint}\n`);
    fs.writeFileSync(path.join(destination, `${key}.check.json`), `${check}\n`);
  }
  const ffprobe = execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration:stream=width,height,r_frame_rate,codec_name", "-of", "json", path.join(destination, `${key}.mp4`)], { encoding: "utf8" });
  fs.writeFileSync(path.join(destination, `${key}.ffprobe.json`), `${ffprobe}\n`);
  const qaPath = path.join(destination, `${key}.QA.md`);
  let qa = fs.readFileSync(qaPath, "utf8");
  qa = qa.replace(/- Fixed commit:.*\n/, `- Fixed commit: ${commit}\n`)
    .replace(/- Status:.*\n?/, "- Status: PUBLISHED.\n");
  if (!qa.includes("Status: PUBLISHED")) qa += "\n- Status: PUBLISHED.\n";
  fs.writeFileSync(qaPath, qa);
}

const catalogPath = path.join(repo, "site", "data", "videos.json");
const catalog = JSON.parse(fs.readFileSync(catalogPath, "utf8"));
for (const entry of catalog.entries) {
  if (entry.project !== slug) continue;
  const key = entry.kind === "analysis" ? "analysis" : `ch${String(entry.id.match(/ch(\d+)/)?.[1] ?? "").padStart(2, "0")}-${entry.chapter}`;
  if (fs.existsSync(path.join(destination, `${key}.mp4`)) && fs.existsSync(path.join(destination, `${key}.srt`))) {
    entry.status = "published";
    entry.sourceCommit = commit;
  }
}
catalog.generatedAt = new Date().toISOString();
fs.writeFileSync(catalogPath, `${JSON.stringify(catalog, null, 2)}\n`);
console.log(JSON.stringify({ slug, episodes, published: catalog.entries.filter((entry) => entry.project === slug && entry.status === "published").length }));
