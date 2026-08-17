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
assert(htmlFiles.length === projects.length * 2 * (1 + 1 + chapterDefs.length + 5) + 3, `expected ${projects.length * 2 * (1 + 1 + chapterDefs.length + 5) + 3} html files, found ${htmlFiles.length}`);

const versions = JSON.parse(fs.readFileSync(path.join(site, "data/versions.json"), "utf8"));
const legacyInventory = JSON.parse(fs.readFileSync(path.join(root, "data/legacy/inventory.json"), "utf8"));
const legacyBySlug = new Map(legacyInventory.repositories.map((repo) => [repo.slug === "MonkeyCode" ? "monkeycode" : repo.slug, repo]));
assert(!fs.existsSync(path.join(site, "videos")), "video assets must not be deployed with the text tutorial");
assert(!fs.existsSync(path.join(site, "data", "videos.json")), "video catalog must not be deployed with the text tutorial");
assert(!fs.existsSync(path.join(site, "legacy", "reports")), "historical long-report modules must not be deployed");
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
    for (const type of ["architecture", "sequence", "capability", "loop", "commands"]) {
      assert(fs.existsSync(path.join(base, "diagrams", `${type}.html`)), `${project.slug}/${lang}: missing ${type} diagram`);
    }
    const analysis = fs.readFileSync(path.join(base, "analysis.html"), "utf8");
    assert(analysis.includes("report-hero-v2"), `${project.slug}/${lang}: analysis did not use the detailed report shell`);
    assert((analysis.match(/class="finding-card/g) || []).length >= 1, `${project.slug}/${lang}: analysis has no source finding cards`);
    assert((analysis.match(/class="diagram-figure/g) || []).length === 5, `${project.slug}/${lang}: analysis does not embed five diagram figures`);
    assert(analysis.includes("implementation-inventory"), `${project.slug}/${lang}: analysis has no source implementation inventory`);
    assert(analysis.includes("concept-audit"), `${project.slug}/${lang}: analysis has no requested-concept audit`);
    assert(analysis.includes("command-execution"), `${project.slug}/${lang}: analysis has no command execution dossier`);
    const commandMatch = analysis.match(/class="command-execution command-coverage"[^>]*data-confirmed-commands="(\d+)"[^>]*data-source-options="(\d+)"/);
    assert(commandMatch, `${project.slug}/${lang}: command coverage ledger is missing`);
    if (commandMatch) {
      const commandSection = analysis.slice(analysis.indexOf('class="command-execution command-coverage"'));
      const cardCount = (commandSection.match(/class="command-card"/g) || []).length;
      const expectedCards = Number(commandMatch[1]) || 1; // zero-confirmation projects render one explicit “not located” card
      assert(cardCount === expectedCards, `${project.slug}/${lang}: command ledger says ${commandMatch[1]} but rendered ${cardCount} cards`);
      assert(cardCount >= 1, `${project.slug}/${lang}: command dossier has no cards`);
      const sourceLabels = [...commandSection.matchAll(/<small>[^<]*·[^<]*·\s*([^:<]+(?:\/[^:<]+)*\.[a-z0-9]+):\d+/gi)].map((match) => match[1]);
      assert(!sourceLabels.some((sourcePath) => /(?:\/tests?\/|_tests?\.|\.test\.|\/fixtures?\/|\/examples?\/|\.bundle\/|\.(?:mp4|srt))$/i.test(sourcePath)), `${project.slug}/${lang}: command dossier includes test/fixture/media source paths`);
      assert((commandSection.match(/class="command-mini-flow"/g) || []).length === cardCount, `${project.slug}/${lang}: a command card is missing its mini execution flow`);
      assert((commandSection.match(/href="https:\/\/github\.com\//g) || []).length >= cardCount, `${project.slug}/${lang}: a command card is missing a pinned GitHub source link`);
    }
    for (const type of ["architecture", "sequence", "capability", "loop", "commands"]) {
      const diagram = fs.readFileSync(path.join(base, "diagrams", `${type}.html`), "utf8");
      assert(diagram.includes("ARCHIFY-READY") || diagram.includes("archify-guided-views-data"), `${project.slug}/${lang}/${type}: diagram is missing Archify handoff marker`);
      if (diagram.includes("data-archify-wrapper")) {
        const legacyType = type === "capability" ? "architecture" : type;
        const canonical = path.join(site, "legacy", "diagrams", `${project.slug}-${legacyType}.html`);
        assert(fs.existsSync(canonical), `${project.slug}/${lang}/${type}: Archify wrapper target is missing`);
        if (fs.existsSync(canonical)) {
          const canonicalHtml = fs.readFileSync(canonical, "utf8");
          assert((canonicalHtml.match(/data-node-id="/g) || []).length >= 8, `${project.slug}/${lang}/${type}: canonical Archify map has too few nodes`);
        }
      } else {
        assert((diagram.match(/<g id="node-/g) || []).length >= 10, `${project.slug}/${lang}/${type}: source-backed map has too few authored nodes`);
        assert((diagram.match(/data-edge-from=/g) || []).length >= 8, `${project.slug}/${lang}/${type}: source-backed map has too few handoffs`);
      }
      if (type === "commands") assert(diagram.includes("archify-command-data") && diagram.includes("command-select"), `${project.slug}/${lang}/commands: command selector is missing`);
    }
    const firstChapter = fs.readFileSync(path.join(base, "tutorial", `ch${chapterDefs[0].number}-${chapterDefs[0].id}.html`), "utf8");
    assert(firstChapter.includes("Evidence board") || firstChapter.includes("本章证据板"), `${project.slug}/${lang}: chapter is not evidence-led`);
    for (const chapter of chapterDefs) {
      const chapterHtml = fs.readFileSync(path.join(base, "tutorial", `ch${chapter.number}-${chapter.id}.html`), "utf8");
      assert(chapterHtml.includes("source-reading-map"), `${project.slug}/${lang}/${chapter.id}: chapter has no source reading map`);
      assert(chapterHtml.includes("mechanism-panel"), `${project.slug}/${lang}/${chapter.id}: chapter has no execution-semantics panel`);
      assert((chapterHtml.match(/class="diagram-frame/g) || []).length === 1, `${project.slug}/${lang}/${chapter.id}: chapter must embed exactly one diagram`);
      assert(!chapterHtml.includes("小白练习") && !chapterHtml.includes("Exercise: do more than repeat") && !chapterHtml.includes("class=\"exercise\""), `${project.slug}/${lang}/${chapter.id}: beginner exercise module must be removed`);
      if (chapter.id === "commands") assert(chapterHtml.includes("command-execution") && chapterHtml.includes("command-card"), `${project.slug}/${lang}/commands: command chapter has no per-command source cards`);
    }
  }
}

for (const file of htmlFiles) {
  const html = fs.readFileSync(file, "utf8");
  assert(!html.includes("source file not found"), `${path.relative(root, file)} contains a missing source citation`);
  assert(!html.includes("旧版长报告") && !html.includes("Historical reference") && !html.includes("prior long report") && !html.includes("LEGACY SOURCE AUDIT"), `${path.relative(root, file)} contains a historical-report module`);
  assert(!html.includes("video-panel") && !html.includes("chapter-video") && !html.includes("VIDEO + SUBTITLES"), `${path.relative(root, file)} contains a video UI reference`);
  assert(!/(?:href|src)="[^"]+\.(?:mp4|srt)(?:[?#"]|$)/i.test(html), `${path.relative(root, file)} contains a video asset link`);
  if (file.includes(`${path.sep}projects${path.sep}`) && !file.includes(`${path.sep}diagrams${path.sep}`)) {
    assert(html.includes("github.com/"), `${path.relative(root, file)} has no pinned source link`);
  }
  for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const target = match[1].split("#")[0].split("?")[0];
    if (!target || target.startsWith("http:") || target.startsWith("https:") || target.startsWith("mailto:") || target.startsWith("data:") || target.startsWith("javascript:") || target.startsWith("#")) continue;
    if (target.includes("dataset.") || target.includes(".replace(") || target.includes("+n.")) continue;
    const resolved = path.resolve(path.dirname(file), target);
    const candidate = fs.existsSync(resolved) ? resolved : fs.existsSync(path.join(resolved, "index.html")) ? path.join(resolved, "index.html") : null;
    assert(candidate !== null, `${path.relative(root, file)} -> broken local link ${target}`);
  }
}

if (failures.length) {
  console.error(failures.map((failure) => `FAIL ${failure}`).join("\n"));
  process.exit(1);
}
console.log(JSON.stringify({ htmlFiles: htmlFiles.length, projects: projects.length, languages: 2, chaptersPerProject: chapterDefs.length, videoAssets: 0, localLinks: "ok", sourceAnchors: "ok" }));
