#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const legacyRoot = path.join(root, "data/legacy");
const evidenceRoot = path.join(legacyRoot, "evidence");
const inventory = JSON.parse(fs.readFileSync(path.join(legacyRoot, "inventory.json"), "utf8"));
const oldSourcesRoot = "/Users/qujianglong/Desktop/Agent/sources";

const names = {
  goose: "Goose",
  aider: "Aider",
  "grok-build": "Grok Build",
  openinterpreter: "Open Interpreter",
  "little-coder": "Little Coder",
  MonkeyCode: "MonkeyCode",
  opencode: "OpenCode",
  "oh-my-pi": "Oh My Pi",
  "claude-code": "Claude Code（复原）",
  pi: "Pi",
  codex: "OpenAI Codex",
  "gemini-cli": "Gemini CLI",
  jcode: "JCode",
  "kimi-cli": "Kimi CLI",
  "deepseek-reasonix": "DeepSeek-Reasonix",
  codewhale: "CodeWhale",
  "prime-agent": "Prime Agent",
  deepagents: "DeepAgents"
};
const sourceDirs = { monkeycode: "MonkeyCode", MonkeyCode: "MonkeyCode" };
const chapterDimensions = {
  overview: /entry|architecture|runtime_loop|harness-routing|backend-runtime/i,
  architecture: /architecture|entry|backend-runtime|middleware/i,
  loop: /runtime_loop|architecture-loop|entry-session-loop|harness-routing/i,
  model: /provider|model/i,
  tools: /tools|editing|tool-dispatch/i,
  context: /context/i,
  security: /permissions|sandbox|security|trust/i,
  ecosystem: /extensions|mcp|skills|plugins|connectors/i,
  collaboration: /collaboration|subagents|swarm/i,
  evidence: /tests|observability|persistence|maturity/i
};

function snapshotCitation(repoSlug, citation, fallbackText) {
  const sourceDir = path.join(oldSourcesRoot, sourceDirs[repoSlug] || repoSlug);
  const sourceFile = path.join(sourceDir, citation.path);
  let snippet = citation.excerpt || fallbackText || "";
  if (fs.existsSync(sourceFile)) {
    const lines = fs.readFileSync(sourceFile, "utf8").split(/\r?\n/);
    const start = Math.max(1, citation.startLine);
    const end = Math.min(lines.length, citation.endLine);
    snippet = lines.slice(start - 1, Math.min(end, start + 29)).map((line, index) => `${String(start + index).padStart(5, " ")}  ${line}`).join("\n");
  }
  return { path: citation.path, start: citation.startLine, end: citation.endLine, snippet };
}

function pickFinding(findings, pattern, used) {
  const match = findings.find((finding) => pattern.test(finding.dimension) && !used.has(finding.id));
  if (match) used.add(match.id);
  return match || findings.find((finding) => !used.has(finding.id)) || findings[0];
}

const projects = [];
for (const repo of inventory.repositories.filter((item) => item.status === "ready")) {
  const evidencePath = path.join(evidenceRoot, repo.slug, "evidence.json");
  if (!fs.existsSync(evidencePath)) continue;
  const ledger = JSON.parse(fs.readFileSync(evidencePath, "utf8"));
  const findings = Array.isArray(ledger.findings) ? ledger.findings : [];
  if (!findings.length) continue;
  const slug = repo.slug === "MonkeyCode" ? "monkeycode" : repo.slug;
  const name = names[repo.slug] || repo.slug;
  const used = new Set();
  const anchors = Object.entries(chapterDimensions).map(([chapter, pattern]) => {
    const finding = pickFinding(findings, pattern, used);
    const citation = finding.citations?.[0] || { path: "README.md", startLine: 1, endLine: 1, excerpt: finding.fact };
    return [chapter, citation.path, { ...snapshotCitation(repo.slug, citation, finding.fact), findingId: finding.id, title: finding.title }];
  });
  const first = findings[0];
  const covered = (ledger.coverage || []).filter((item) => item.status === "verified").length;
  const partial = (ledger.coverage || []).filter((item) => item.status !== "verified").map((item) => item.notes).filter(Boolean);
  const languages = (repo.languages || []).slice(0, 3).map((item) => item.language).join(" / ") || "Source-backed implementation";
  const strengthsZh = findings.slice(0, 3).map((finding) => finding.plainLanguage || finding.fact).filter(Boolean);
  while (strengthsZh.length < 3) strengthsZh.push("源码账本给出了固定文件与行号证据");
  const limitsZh = partial.slice(0, 2);
  while (limitsZh.length < 3) limitsZh.push("当前页面复用既有源码账本；迁移到自研前仍需做部署级验证");
  projects.push({
    slug,
    name,
    repo: repo.fullName,
    branch: repo.branch || "detached",
    commit: repo.head,
    date: repo.commitDate,
    language: languages,
    kind: "Refreshed source-backed audit ledger",
    legacy: true,
    zh: {
      thesis: `${name} 已重新拉取到 ${repo.head.slice(0, 12)}；既有源码账本覆盖 ${covered} 个 Harness 维度，本次重新抓取源码摘录并把事实排成单页分析和十章教程，不把 README 当作实现证据。`,
      strengths: strengthsZh,
      limits: limitsZh,
      lesson: first.plainLanguage || first.fact || "从输入、状态、工具副作用、回执和恢复入口读源码。"
    },
    en: {
      thesis: `${name} was refreshed to commit ${repo.head.slice(0, 12)}. The prior source ledger covers ${covered} Harness dimensions; this build re-captures source excerpts and reshapes the facts into a single analysis page and ten standalone chapters instead of treating README claims as implementation evidence.`,
      strengths: ["Pinned source findings expose the control loop", "Context, tools, and policy are separated into reviewable dimensions", "Each chapter keeps a file and line-range trail"],
      limits: ["Finding semantics are migrated from the prior ledger and should be re-audited when behavior changed", "Deployment-level behavior still needs a fresh run", "The refreshed commit does not imply every historical finding was re-proven by a full test run"],
      lesson: "Read the implementation as input, state, tool effect, receipt, and recovery—not as a feature list."
    },
    anchors
  });
}

const output = `// Generated from data/legacy/inventory.json and data/legacy/evidence/*/evidence.json.\nexport const legacyProjects = ${JSON.stringify(projects, null, 2)};\n`;
fs.writeFileSync(path.join(root, "data/legacy-projects.mjs"), output);
console.log(JSON.stringify({ projects: projects.length, output: "data/legacy-projects.mjs" }));
