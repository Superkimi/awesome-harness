#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { projects, chapterDefs } from "../data/projects.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const site = path.join(root, "site");
const failures = [];
const assert = (condition, message) => { if (!condition) failures.push(message); };

const htmlFiles = [];
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (dir === site && entry.name === "legacy") continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.name.endsWith(".html")) htmlFiles.push(full);
  }
}
walk(site);

assert(fs.existsSync(path.join(site, "index.html")), "missing site/index.html");
assert(fs.existsSync(path.join(site, "zh/index.html")), "missing site/zh/index.html");
assert(fs.existsSync(path.join(site, "en/index.html")), "missing site/en/index.html");
assert(htmlFiles.length === projects.length * 2 * (1 + 1 + chapterDefs.length + 3) + 3, `expected ${projects.length * 2 * (1 + 1 + chapterDefs.length + 3) + 3} html files, found ${htmlFiles.length}`);

const versions = JSON.parse(fs.readFileSync(path.join(site, "data/versions.json"), "utf8"));
const videos = JSON.parse(fs.readFileSync(path.join(site, "data/videos.json"), "utf8"));
const legacyInventory = JSON.parse(fs.readFileSync(path.join(root, "data/legacy/inventory.json"), "utf8"));
const legacyBySlug = new Map(legacyInventory.repositories.map((repo) => [repo.slug === "MonkeyCode" ? "monkeycode" : repo.slug, repo]));
assert(videos.entries?.length === projects.length * (1 + chapterDefs.length), `expected ${projects.length * (1 + chapterDefs.length)} video entries, found ${videos.entries?.length ?? 0}`);
for (const project of projects) {
  const version = versions.projects?.[project.slug];
  assert(version?.commit === project.commit, `${project.slug}: version ledger commit mismatch`);
  if (project.legacy) {
    const legacy = legacyBySlug.get(project.slug);
    assert(legacy?.head === project.commit, `${project.slug}: refreshed legacy inventory commit mismatch`);
  }
  for (const lang of ["zh", "en"]) {
    const base = path.join(site, "projects", project.slug, lang);
    assert(fs.existsSync(path.join(base, "analysis.html")), `${project.slug}/${lang}: missing analysis`);
    assert(fs.existsSync(path.join(base, "tutorial/index.html")), `${project.slug}/${lang}: missing tutorial index`);
    for (const chapter of chapterDefs) {
      assert(fs.existsSync(path.join(base, "tutorial", `ch${chapter.number}-${chapter.id}.html`)), `${project.slug}/${lang}: missing chapter ${chapter.id}`);
    }
    for (const type of ["architecture", "sequence", "capability"]) {
      assert(fs.existsSync(path.join(base, "diagrams", `${type}.html`)), `${project.slug}/${lang}: missing ${type} diagram`);
    }
  }
}

for (const file of htmlFiles) {
  const html = fs.readFileSync(file, "utf8");
  assert(!html.includes("source file not found"), `${path.relative(root, file)} contains a missing source citation`);
  if (file.includes(`${path.sep}projects${path.sep}`) && !file.includes(`${path.sep}diagrams${path.sep}`)) {
    assert(html.includes("github.com/"), `${path.relative(root, file)} has no pinned source link`);
  }
  for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const target = match[1].split("#")[0].split("?")[0];
    if (!target || target.startsWith("http:") || target.startsWith("https:") || target.startsWith("mailto:") || target.startsWith("data:") || target.startsWith("javascript:") || target.startsWith("#")) continue;
    const resolved = path.resolve(path.dirname(file), target);
    const candidate = fs.existsSync(resolved) ? resolved : fs.existsSync(path.join(resolved, "index.html")) ? path.join(resolved, "index.html") : null;
    if (candidate === null && (target.endsWith(".mp4") || target.endsWith(".srt"))) continue;
    assert(candidate !== null, `${path.relative(root, file)} -> broken local link ${target}`);
  }
}

if (failures.length) {
  console.error(failures.map((failure) => `FAIL ${failure}`).join("\n"));
  process.exit(1);
}
console.log(JSON.stringify({ htmlFiles: htmlFiles.length, projects: projects.length, languages: 2, chaptersPerProject: chapterDefs.length, videoEntries: videos.entries.length, localLinks: "ok", sourceAnchors: "ok" }));
