#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { projects, chapterDefs, dimensionNotes } from "../data/projects.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourceRoot = path.join(root, "sources");
const historicalSourceRoot = path.resolve(root, "..", "sources");
const siteRoot = path.join(root, "site");
const sourceInfo = new Map(projects.map((project) => [project.slug, project]));
const evidenceRoot = path.join(root, "data", "legacy", "evidence");
const evidenceLedgers = new Map();
for (const project of projects) {
  const candidates = [
    ...(project.slug === "deepseek-harness" ? [path.join(root, "data", "deepseek-harness-evidence.json")] : []),
    path.join(evidenceRoot, project.slug, "evidence.json"),
    path.join(evidenceRoot, project.slug === "monkeycode" ? "MonkeyCode" : project.slug, "evidence.json"),
  ];
  const ledgerFile = candidates.find((candidate) => fs.existsSync(candidate));
  if (ledgerFile) evidenceLedgers.set(project.slug, JSON.parse(fs.readFileSync(ledgerFile, "utf8")));
}
// Video releases live in a separate repository. Keep this source-reading site
// deliberately text-and-diagram-only, and remove any stale local video pack
// left by older builds before writing the new static output.
const staleVideoDir = path.join(siteRoot, "videos");
const staleVideoCatalog = path.join(siteRoot, "data", "videos.json");
if (fs.existsSync(staleVideoDir)) fs.rmSync(staleVideoDir, { recursive: true, force: true });
if (fs.existsSync(staleVideoCatalog)) fs.rmSync(staleVideoCatalog, { force: true });

function mkdir(file) { fs.mkdirSync(path.dirname(file), { recursive: true }); }
function write(file, content) { mkdir(file); fs.writeFileSync(file, content); }
function esc(value) {
  return String(value ?? "").replace(/[ \t]+(?=\n|$)/g, "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");
}
function unescape(value) { return String(value ?? "").replaceAll("&amp;", "&").replaceAll("&lt;", "<").replaceAll("&gt;", ">").replaceAll("&quot;", '"').replaceAll("&#39;", "'"); }
function sourceRepo(project) {
  const aliases = project.slug === "monkeycode" ? ["MonkeyCode", "monkeycode"] : [project.slug];
  const candidates = aliases.flatMap((slug) => [path.join(sourceRoot, slug), path.join(historicalSourceRoot, slug)]);
  return candidates.find((candidate) => fs.existsSync(path.join(candidate, ".git"))) || candidates[0];
}
function repoPath(project, relative) { return path.join(sourceRepo(project), relative); }
const sourceContentCache = new Map();
const sourceFileListCache = new Map();
const conceptIndexCache = new Map();
const chapterSearchTerms = {
  overview: ["main", "cli", "agent", "session", "run", "start", "command"],
  architecture: ["runtime", "agent", "session", "router", "service", "main", "kernel"],
  loop: ["loop", "turn", "step", "run", "stream", "while", "iterate", "continue"],
  model: ["provider", "model", "message", "stream", "response", "completion", "llm"],
  tools: ["tool", "function", "command", "executor", "registry", "dispatch", "operation"],
  context: ["context", "memory", "compact", "token", "history", "prompt", "retrieval", "summary"],
  security: ["permission", "approval", "sandbox", "policy", "allow", "deny", "trust", "isolate"],
  ecosystem: ["plugin", "mcp", "skill", "hook", "extension", "connector", "register"],
  collaboration: ["subagent", "sub-agent", "agent", "job", "task", "worker", "parallel", "queue"],
  evidence: ["log", "trace", "event", "checkpoint", "retry", "replay", "persist", "store", "recover"]
};
const conceptDefs = [
  { id: "entry", zh: "entry / 入口", en: "entry / entrypoint", patterns: [/\bmain\b/i, /\bcli\b/i, /entry(point)?/i], noteZh: "谁把用户输入变成一次可运行的 session。", noteEn: "Who turns user input into a runnable session." },
  { id: "register", zh: "register / 注册", en: "register / registration", patterns: [/register/i, /registry/i, /add_tool/i, /register_tool/i], noteZh: "能力、插件或路由如何被装配。", noteEn: "How capabilities, plugins, or routes are assembled." },
  { id: "session", zh: "session / 会话", en: "session / session", patterns: [/session/i, /conversation/i], noteZh: "会话身份、历史和生命周期。", noteEn: "Session identity, history, and lifecycle." },
  { id: "log", zh: "session log / 日志", en: "session log / logging", patterns: [/\blog\b/i, /trac(e|ing)/i, /telemetry/i, /observation/i], noteZh: "运行轨迹如何被记录和回放。", noteEn: "How runtime traces are recorded and replayed." },
  { id: "plugin", zh: "plugins / 插件", en: "plugins / plugins", patterns: [/plugin/i, /extension/i, /hook/i], noteZh: "外接能力的发现、加载和卸载。", noteEn: "Discovery, loading, and removal of extensions." },
  { id: "approval", zh: "approval / 审批", en: "approval / approval", patterns: [/approval/i, /approve/i, /permission/i, /consent/i], noteZh: "副作用执行前谁能拦截。", noteEn: "Who can intercept side effects before execution." },
  { id: "workflow", zh: "workflow / 工作流", en: "workflow / workflow", patterns: [/workflow/i, /pipeline/i, /orchestrat/i, /state.?machine/i], noteZh: "多个步骤和门禁如何组成流程。", noteEn: "How steps and gates form a workflow." },
  { id: "ui", zh: "UI / 交互", en: "UI / interaction", patterns: [/\bui\b/i, /desktop/i, /electron/i, /tui/i, /frontend/i, /render/i], noteZh: "用户界面和运行时状态的边界。", noteEn: "The boundary between UI and runtime state." },
  { id: "projection", zh: "projection / 投影", en: "projection / projection", patterns: [/projection/i, /projected/i, /view.?model/i, /snapshot/i, /selector/i], noteZh: "内部事件如何变成模型或 UI 可见状态。", noteEn: "How internal events become model- or UI-visible state." },
  { id: "job", zh: "jobs / 作业", en: "jobs / jobs", patterns: [/\bjob\b/i, /worker/i, /background/i, /task/i], noteZh: "异步任务、取消和完成状态。", noteEn: "Async work, cancellation, and completion state." },
  { id: "subagent", zh: "subagent / 子 Agent", en: "sub-agent / sub-agent", patterns: [/sub.?agent/i, /child.?agent/i, /delegat/i, /workforce/i], noteZh: "子会话、深度和交付物。", noteEn: "Child sessions, depth, and deliverables." },
  { id: "operation", zh: "operation / 操作", en: "operation / operation", patterns: [/operation/i, /execute/i, /dispatch/i, /invoke/i], noteZh: "一次动作的输入、执行和结果。", noteEn: "Inputs, execution, and result for one action." },
  { id: "transaction", zh: "transaction / 事务", en: "transaction / transaction", patterns: [/transaction/i, /commit/i, /rollback/i, /atomic/i, /idempot/i], noteZh: "副作用如何提交、回滚和保证幂等。", noteEn: "How effects commit, roll back, and stay idempotent." },
  { id: "effect", zh: "effect / 副作用", en: "effect / effect", patterns: [/effect/i, /side.?effect/i, /mutat/i, /write_file/i, /spawn/i], noteZh: "真正改变外部世界的调用。", noteEn: "Calls that actually change the outside world." },
  { id: "tool", zh: "tools / 工具", en: "tools / tools", patterns: [/\btool\b/i, /function.?call/i, /tool.?call/i, /builtin/i], noteZh: "工具 schema、参数和回执。", noteEn: "Tool schemas, arguments, and receipts." },
  { id: "recovery", zh: "recovery / 恢复", en: "recovery / recovery", patterns: [/recover/i, /retry/i, /resume/i, /checkpoint/i, /compact/i, /fallback/i], noteZh: "失败后怎么继续，而不是只看 happy path。", noteEn: "How work continues after failure." },
  { id: "queue", zh: "queues / 队列", en: "queues / queues", patterns: [/queue/i, /channel/i, /inbox/i, /buffer/i, /backpressure/i], noteZh: "事件和工具如何排队、限流和取消。", noteEn: "How events/tools queue, throttle, and cancel." },
  { id: "parallel", zh: "parallelism / 并行", en: "parallelism / parallelism", patterns: [/parallel/i, /concurr/i, /Promise\.all/i, /join_all/i, /gather/i], noteZh: "哪些步骤并行，哪些步骤必须串行。", noteEn: "Which steps run in parallel and which stay serial." },
  { id: "branch", zh: "branches / 分支", en: "branches / branches", patterns: [/branch/i, /conditional/i, /match\s*\{/i, /switch\s*\(/i, /if\s+/i], noteZh: "继续、停止、重试和人工接管的条件。", noteEn: "Conditions for continue, stop, retry, or human takeover." },
  { id: "commands", zh: "commands / 指令", en: "commands / commands", patterns: [/Command::new/i, /subcommand/i, /add_argument/i, /\.command\(/i, /registerCommand/i, /--[a-z][a-z0-9-]+/i], noteZh: "用户可以触发的命令面；需回到源码逐条核对。", noteEn: "User-triggerable command surface; verify each one in source." },
  { id: "builtin", zh: "built-ins / 内置工具", en: "built-ins / built-ins", patterns: [/builtin/i, /built.?in/i, /shell/i, /filesystem/i, /terminal/i], noteZh: "随 Agent 默认装配的能力。", noteEn: "Capabilities assembled by default." }
];
const ignoredSourceDirs = new Set([".git", "node_modules", "target", "dist", "build", "coverage", ".venv", "venv", "__pycache__", ".next", ".turbo", "vendor"]);
function sourceFiles(project) {
  const repo = sourceRepo(project);
  const key = repo;
  if (sourceFileListCache.has(key)) return sourceFileListCache.get(key);
  const files = [];
  const walk = (dir) => {
    if (!fs.existsSync(dir)) return;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.isDirectory() && ignoredSourceDirs.has(entry.name)) continue;
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.isFile()) {
        const relative = path.relative(repo, full).replaceAll(path.sep, "/");
        const ext = path.extname(entry.name).toLowerCase();
        if (!relative.startsWith(".git/") && ![".png", ".jpg", ".jpeg", ".gif", ".webp", ".mp4", ".mov", ".avi", ".mkv", ".m4a", ".mp3", ".wav", ".flac", ".srt", ".vtt", ".zip", ".lock"].includes(ext)) {
          try {
            const stat = fs.statSync(full);
            if (stat.size <= 220000) files.push({ relative, size: stat.size, ext });
          } catch (_) {}
        }
      }
    }
  };
  walk(repo);
  sourceFileListCache.set(key, files);
  return files;
}
function conceptIndex(project) {
  const repo = sourceRepo(project);
  if (conceptIndexCache.has(repo)) return conceptIndexCache.get(repo);
  const hits = new Map(conceptDefs.map((concept) => [concept.id, []]));
  for (const file of sourceFiles(project)) {
    if (/readme|docs?\//i.test(file.relative)) continue;
    let content = "";
    try { content = fs.readFileSync(path.join(repo, file.relative), "utf8"); } catch (_) { continue; }
    if (!content) continue;
    for (const concept of conceptDefs) {
      let count = 0; let firstLine = 1;
      for (const pattern of concept.patterns) {
        const match = content.match(pattern);
        if (match) {
          count += (content.match(new RegExp(pattern.source, pattern.flags.includes("g") ? pattern.flags : `${pattern.flags}g`)) || []).length;
          const position = content.search(pattern);
          if (position >= 0) firstLine = content.slice(0, position).split(/\r?\n/).length;
        }
      }
      if (count) hits.get(concept.id).push({ path: file.relative, count, line: firstLine, size: file.size });
    }
  }
  for (const [id, list] of hits) list.sort((a, b) => b.count - a.count || a.path.localeCompare(b.path));
  conceptIndexCache.set(repo, hits);
  return hits;
}
function conceptAudit(project, lang) {
  const index = conceptIndex(project);
  const rows = conceptDefs.map((concept) => {
    const hits = index.get(concept.id) || [];
    const status = hits.length >= 3 ? (lang === "zh" ? "已定位" : "LOCATED") : hits.length ? (lang === "zh" ? "单点命中" : "SINGLE HIT") : (lang === "zh" ? "未定位" : "NOT LOCATED");
    const files = hits.slice(0, 3).map((hit) => `<a href="${esc(sourceUrlAtCommit(project, hit.path, hit.line, Math.min(hit.line + 24, hit.line + 24), project.commit))}" target="_blank" rel="noreferrer">${esc(hit.path)}:${hit.line}</a>`).join("<br>");
    return `<tr><th scope="row"><b>${esc(concept[lang])}</b><small>${esc(concept[lang === "zh" ? "noteZh" : "noteEn"])}</small></th><td><span class="concept-status concept-${hits.length ? "found" : "missing"}">${status}</span><small>${hits.length} ${lang === "zh" ? "个文件 / " : "files / "}${hits.reduce((sum, hit) => sum + hit.count, 0)} ${lang === "zh" ? "次命中" : "matches"}</small></td><td>${files || `<em>${lang === "zh" ? "当前快照未定位；不要从 README 推断支持。" : "Not located in this snapshot; do not infer support from README."}</em>`}</td></tr>`;
  }).join("");
  return `<section class="concept-audit"><div class="concept-audit-head"><span>${lang === "zh" ? "概念审计 · 源码命中而非功能清单" : "CONCEPT AUDIT · SOURCE HITS, NOT FEATURE CLAIMS"}</span><b>${conceptDefs.length} ${lang === "zh" ? "个概念" : "concepts"}</b></div><p>${lang === "zh" ? "把你关心的 entry、session log、plugins、approval、projection、jobs、subagent、operation、transaction、effect、tools、recovery、queues、parallelism、branches、commands 和 built-ins 分开核对。‘未定位’是当前本地快照没有足够代码证据，不等于项目绝对没有该能力。" : "The requested concepts are checked separately: entry, session log, plugins, approval, projection, jobs, sub-agents, operations, transactions, effects, tools, recovery, queues, parallelism, branches, commands, and built-ins. ‘Not located’ means this snapshot lacks enough code evidence; it does not prove the capability never exists."}</p><div class="concept-audit-wrap"><table><thead><tr><th>${lang === "zh" ? "概念" : "Concept"}</th><th>${lang === "zh" ? "证据强度" : "Evidence"}</th><th>${lang === "zh" ? "源码落点" : "Source locations"}</th></tr></thead><tbody>${rows}</tbody></table></div></section>`;
}
function sourceReadingMap(project, lang, chapter) {
  const terms = chapterSearchTerms[chapter.id] || chapterSearchTerms.overview;
  const files = sourceFiles(project);
  const ranked = files.map((file) => {
    const lower = file.relative.toLowerCase();
    let score = 0;
    for (const term of terms) if (lower.includes(term)) score += 5;
    const basename = path.basename(file.relative).toLowerCase();
    for (const term of terms) if (basename.includes(term)) score += 4;
    if (/test|spec|fixture|benchmark/.test(lower)) score += 1;
    if (/readme|docs?\//.test(lower)) score -= 3;
    return { ...file, score };
  }).filter((file) => file.score > 0).sort((a, b) => b.score - a.score || a.relative.localeCompare(b.relative));
  const selected = (ranked.length ? ranked : files).slice(0, 6);
  const commit = project.commit;
  const rows = selected.map((file, index) => {
    const full = path.join(sourceRepo(project), file.relative);
    let lines = [];
    try { lines = fs.readFileSync(full, "utf8").split(/\r?\n/); } catch (_) {}
    const term = terms.find((needle) => lines.some((line) => line.toLowerCase().includes(needle))) || terms[0];
    let hit = lines.findIndex((line) => line.toLowerCase().includes(term));
    if (hit < 0) hit = 0;
    const start = Math.max(1, hit + 1);
    const end = Math.min(lines.length || start, start + 15);
    const snippet = sourceSnippet(project, commit, file.relative, start, end, 18) || `// ${file.relative}`;
    const role = lang === "zh"
      ? `${index + 1}. 与“${chapter.title.zh}”直接相关的源码入口；先看这一段的输入、状态和返回值。`
      : `${index + 1}. A source entry related to “${chapter.title.en}”; start with its inputs, state, and return value.`;
    return `<article class="source-reading-card"><header><span>${String(index + 1).padStart(2, "0")}</span><div><b>${esc(file.relative)}</b><small>${file.size} bytes · ${esc(file.ext || "source")}</small></div><a href="${esc(sourceUrlAtCommit(project, file.relative, start, end, commit))}" target="_blank" rel="noreferrer">L${start}–${end} ↗</a></header><p>${esc(role)}</p><pre><code>${esc(snippet)}</code></pre></article>`;
  }).join("");
  return `<section class="source-reading-map"><div class="source-reading-head"><span>${lang === "zh" ? "源码目录 → 命中段落" : "SOURCE MAP → MATCHED PASSAGES"}</span><b>${selected.length} ${lang === "zh" ? "个真实文件" : "real files"}</b></div><p>${lang === "zh" ? "这不是 README 文件清单：生成器在本地仓库中按本章关键词定位真实文件，并从固定提交抽取带行号的短段。点击每个路径可以继续沿调用者、类型和测试追踪。" : "This is not a README inventory: the generator ranks real local-repository files by chapter terms, then extracts numbered passages from the pinned commit. Follow each path into callers, types, and tests."}</p><div class="source-reading-grid">${rows}</div></section>`;
}
function implementationInventory(project, lang) {
  const files = sourceFiles(project);
  const by = (pattern) => files.filter((file) => pattern.test(file.relative.toLowerCase())).slice(0, 12);
  const manifests = by(/(^|\/)(package\.json|pyproject\.toml|cargo\.toml|go\.mod|build\.gradle|mix\.exs|composer\.json|project\.toml|deno\.json|flake\.nix)$/);
  const entries = by(/(^|\/)(main|index|cli|server|app|run|command|entry|bootstrap)[^/]*\.(rs|ts|tsx|js|mjs|py|go|java|kt|ex|rb|sh)$/);
  const extensionFiles = by(/(plugin|mcp|skill|hook|extension|connector|adapter|provider)/);
  const testFiles = by(/(^|\/)(test|tests|spec|__tests__|fixtures|bench)/);
  const commands = [];
  for (const file of [...manifests, ...entries, ...extensionFiles]) {
    try {
      const content = fs.readFileSync(path.join(sourceRepo(project), file.relative), "utf8");
      for (const match of content.matchAll(/(?:Command::new|subcommand|add_argument|add_subparsers|\.command\(|registerCommand|register_command|--[a-z][a-z0-9-]+)/g)) {
        const token = match[0].replace(/.*(--)/, "--").slice(0, 48);
        if (!commands.includes(token)) commands.push(token);
        if (commands.length >= 16) break;
      }
    } catch (_) {}
  }
  const card = (label, list, note) => `<article class="inventory-card"><span>${esc(label)}</span><p>${esc(note)}</p><ul>${(list.length ? list : [{ relative: lang === "zh" ? "未在快照中命中；需从项目入口继续追踪" : "No hit in snapshot; continue from the entrypoint" }]).map((item) => { const isCommand = item.relative.startsWith("--") || item.relative === "subcommand" || item.relative === "Command::new"; const isFallback = item.relative.includes("未在") || item.relative.startsWith("No hit"); const labelMarkup = isCommand ? `<code>${esc(item.relative)}</code>` : `<a href="${isFallback ? "#" : esc(sourceUrlAtCommit(project, item.relative, 1, 24, project.commit))}" target="_blank" rel="noreferrer">${esc(item.relative)}</a>`; return `<li>${labelMarkup}${item.size ? `<small>${item.size} bytes</small>` : ""}</li>`; }).join("")}</ul></article>`;
  const commandList = commands.map((command) => ({ relative: command }));
  return `<section class="implementation-inventory"><div class="inventory-head"><span>${lang === "zh" ? "源码面板 · 实现面" : "SOURCE DOSSIER · IMPLEMENTATION SURFACE"}</span><b>${files.length} ${lang === "zh" ? "个可读文件" : "readable files"}</b></div><p>${lang === "zh" ? "这里把“入口、注册、扩展、测试和指令线索”从本地快照中单独列出；它不是根据 README 猜的功能清单。文件路径和提交行号仍然是最终证据。" : "This panel separates entrypoints, registration, extensions, tests, and command clues from the local snapshot; it is not a README-derived feature list. File paths and pinned lines remain the final evidence."}</p><div class="inventory-grid">${card(lang === "zh" ? "清单 / 构建入口" : "Manifests / build", manifests, lang === "zh" ? "依赖、脚本、workspace 或编译边界。" : "Dependencies, scripts, workspace, or build boundaries.")}${card(lang === "zh" ? "入口 / Session / UI" : "Entrypoints / session / UI", entries, lang === "zh" ? "主进程、CLI、服务或桌面入口候选。" : "Main process, CLI, service, or desktop entry candidates.")}${card(lang === "zh" ? "Plugins / MCP / Tools" : "Plugins / MCP / tools", extensionFiles, lang === "zh" ? "能力注册和外部连接器的真实文件面。" : "Actual files behind capability registration and connectors.")}${card(lang === "zh" ? "Tests / Bench / Fixtures" : "Tests / bench / fixtures", testFiles, lang === "zh" ? "用于验证状态、回执和失败边界的测试面。" : "Test surface for state, receipts, and failure boundaries.")}${card(lang === "zh" ? "指令 / 参数线索" : "Commands / argument clues", commandList, lang === "zh" ? "从代码中的命令构造器和参数声明提取的线索，需点击源码复核。" : "Clues extracted from command builders and argument declarations; verify in source.")}</div></section>`;
}
function sourceSnippet(project, commit, relative, start, end, maxLines = 72) {
  const repo = sourceRepo(project);
  const file = path.join(repo, relative);
  const cacheKey = `${repo}\0${commit || "WORKTREE"}\0${relative}`;
  let content = sourceContentCache.get(cacheKey) || "";
  if (!content && !sourceContentCache.has(cacheKey) && fs.existsSync(path.join(repo, ".git")) && commit) {
    const shown = spawnSync("git", ["-C", repo, "show", `${commit}:${relative}`], { encoding: "utf8" });
    if (shown.status === 0) content = shown.stdout;
  }
  if (!content && !sourceContentCache.has(cacheKey) && fs.existsSync(file)) content = fs.readFileSync(file, "utf8");
  sourceContentCache.set(cacheKey, content);
  if (!content) return "";
  const lines = content.split(/\r?\n/);
  const safeStart = Math.max(1, Number(start) || 1);
  const safeEnd = Math.min(lines.length, Math.max(safeStart, Number(end) || safeStart) + maxLines - 1);
  return lines.slice(safeStart - 1, safeEnd).map((line, index) => `${String(safeStart + index).padStart(5, " ")}  ${line}`).join("\n");
}
function sourceUrl(project, relative, start, end) { return `https://github.com/${project.repo}/blob/${project.commit}/${relative}#L${start}-L${end}`; }
function rel(from, to) { return path.relative(path.dirname(from), to).replaceAll(path.sep, "/") || "index.html"; }
function langName(lang) { return lang === "zh" ? "中文" : "English"; }
function text(project, lang, key) { return project[lang]?.[key] || project.zh[key] || ""; }

function findCitation(project, anchorKey) {
  const legacyAlias = { architecture: "architecture", loop: "loop", model: "model", tools: "tools", context: "context", security: "security", ecosystem: "ecosystem", collaboration: "collaboration", state: "evidence", engineering: "evidence" };
  const anchor = project.anchors.find((item) => item[0] === anchorKey)
    || project.anchors.find((item) => item[0] === legacyAlias[anchorKey])
    || project.anchors[0];
  if (anchor?.[2] && typeof anchor[2] === "object") {
    return {
      path: anchor[2].path,
      start: anchor[2].start,
      end: anchor[2].end,
      snippet: anchor[2].snippet,
      missing: false,
      findingId: anchor[2].findingId,
      findingTitle: anchor[2].title
    };
  }
  const relative = anchor?.[1] || "README.md";
  const pattern = anchor?.[2] || "";
  const file = repoPath(project, relative);
  if (!fs.existsSync(file)) return { path: relative, start: 1, end: 24, snippet: `// source file not found in snapshot: ${relative}`, missing: true };
  const lines = fs.readFileSync(file, "utf8").split(/\r?\n/);
  const patterns = pattern.split("|").filter(Boolean);
  let hit = lines.findIndex((line) => patterns.some((needle) => line.toLowerCase().includes(needle.toLowerCase())));
  if (hit < 0) hit = 0;
  const start = Math.max(1, hit + 1 - 7);
  const end = Math.min(lines.length, hit + 1 + 22);
  const snippet = lines.slice(start - 1, end).map((line, index) => `${String(start + index).padStart(5, " ")}  ${line}`).join("\n");
  return { path: relative, start, end, snippet, missing: false };
}

const findingDimensionAliases = {
  "entry-session-loop": "loop",
  "architecture-loop": "architecture",
  "runtime_loop": "loop",
  "harness-routing": "architecture",
  "backend-runtime": "architecture",
  "provider-streaming": "modelContext",
  "provider-streaming-retry": "modelContext",
  "providers-streaming": "modelContext",
  "providers-dialects": "modelContext",
  "context": "modelContext",
  "context-repomap": "modelContext",
  "context-compaction": "modelContext",
  "context-compaction-memory": "modelContext",
  "tools-editing": "tools",
  "tools-execution": "tools",
  "tools-editing-execution": "tools",
  "tools-scheduler": "tools",
  "tool-dispatch": "tools",
  "permissions-security": "security",
  "permissions-sandbox": "security",
  "policy-sandbox": "security",
  "security-sandbox": "security",
  "execution-sandbox": "execution",
  "execution-sandbox-permission": "execution",
  "trust-secrets": "security",
  "extensions-mcp": "connectors",
  "mcp-connectors": "connectors",
  "connectors": "connectors",
  "mcp-plugins-hooks": "connectors",
  "mcp-extensions-hooks": "connectors",
  "mcp-extensions-skills-memory-hooks": "connectors",
  "instructions-prompts": "instructions",
  "instructions-skills": "instructions",
  "instructions-skills-hooks": "instructions",
  "instructions-skills-extensions": "instructions",
  "instructions-skills-plugins": "instructions",
  "instructions-skills-plugins-hooks": "instructions",
  "instructions-plugins-skills": "instructions",
  "skills-plugins-hooks": "instructions",
  "tools-connectors-plugins": "connectors",
  "subagents-collaboration": "collaboration",
  "collaboration-subagents": "collaboration",
  "collaboration-swarm": "collaboration",
  "observability-persistence": "observability",
  "state": "observability",
  "persistence-observability": "observability",
  "persistence-observability-maturity": "observability",
  "session-observability": "observability",
  "sessions-observability": "observability",
  "persistence-recovery": "recovery",
  "tests-evals-maturity": "recovery",
  "tests-benchmarks-maturity": "recovery",
  "maturity-license": "recovery",
  "identity-maturity": "recovery",
  "provenance-maturity": "recovery",
  "middleware-architecture": "architecture"
};

const chapterFindingPatterns = {
  overview: /architecture|loop/i,
  architecture: /^architecture$/i,
  loop: /^loop$/i,
  model: /modelContext/i,
  tools: /^tools$/i,
  context: /modelContext|context/i,
  security: /security|execution/i,
  ecosystem: /connectors|instructions/i,
  collaboration: /^collaboration$/i,
  evidence: /observability|recovery/i
};

function fieldText(value, lang, fallback = "") {
  if (value && typeof value === "object") return value[lang] || value.zh || value.en || fallback;
  return typeof value === "string" ? value : fallback;
}

function sourceUrlAtCommit(project, relative, start, end, commit = project.commit) {
  return `https://github.com/${project.repo}/blob/${commit}/${relative}#L${start}-L${end}`;
}

function currentCitation(project, dimension) {
  const definition = dimensionDefs.find((item) => item.id === dimension);
  return findCitation(project, definition?.anchor || "architecture");
}

function projectFindings(project, lang) {
  const ledger = evidenceLedgers.get(project.slug);
  if (ledger?.findings?.length) {
    return ledger.findings.map((finding, index) => {
      const citation = finding.citations?.[0] || {};
      const dimension = findingDimensionAliases[finding.dimension] || finding.dimension || "architecture";
      const historicalCommit = ledger.snapshot?.commit || project.commit;
      const historicalSnippet = sourceSnippet(project, historicalCommit, citation.path, citation.startLine, citation.endLine) || citation.excerpt || currentCitation(project, dimension).snippet;
      const currentPath = citation.path || currentCitation(project, dimension).path;
      const currentStart = citation.startLine || currentCitation(project, dimension).start;
      const currentEnd = citation.endLine || currentCitation(project, dimension).end;
      const currentSnippet = sourceSnippet(project, project.commit, currentPath, currentStart, currentEnd);
      return {
        id: finding.id || `${project.slug}-finding-${index + 1}`,
        dimension,
        evidenceLevel: finding.evidenceLevel || "L1",
        claimType: finding.claimType || "fact",
        title: fieldText(finding.title, lang, finding.title || `Finding ${index + 1}`),
        fact: fieldText(finding.fact, lang, text(project, lang, "lesson")),
        plain: fieldText(finding.plainLanguage, lang, text(project, lang, "lesson")),
        implication: fieldText(finding.implication, lang, text(project, lang, "lesson")),
        caveats: finding.caveats || [],
        citation: {
          path: citation.path || currentCitation(project, dimension).path,
          start: citation.startLine || currentCitation(project, dimension).start,
          end: citation.endLine || currentCitation(project, dimension).end,
          snippet: historicalSnippet,
          currentSnippet,
          currentPath,
          currentStart,
          currentEnd,
          commit: historicalCommit,
          current: currentCitation(project, dimension),
        },
      };
    });
  }
  return dimensionDefs.map((dimension, index) => {
    const citation = currentCitation(project, dimension.id);
    const note = dimensionNotes[project.slug]?.[lang]?.[dimension.id] || text(project, lang, "lesson");
    return {
      id: `${project.slug}-${dimension.id}-${index + 1}`,
      dimension: dimension.id,
      evidenceLevel: "L1",
      claimType: "fact",
      title: dimension[lang],
      fact: note,
      plain: analogies[lang][chapterAnchor[dimension.id] ? (chapterAnchor[dimension.id] === "model" ? "model" : chapterAnchor[dimension.id]) : "overview"] || note,
      implication: lang === "zh" ? "把这条实现放回完整任务链，检查输入、状态、副作用、回执和恢复出口。" : "Place this implementation back into the task chain and inspect input, state, effects, receipts, and recovery exits.",
      caveats: [],
      citation: { ...citation, snippet: sourceSnippet(project, project.commit, citation.path, citation.start, citation.end) || citation.snippet, currentSnippet: sourceSnippet(project, project.commit, citation.path, citation.start, citation.end) || citation.snippet, commit: project.commit, current: citation },
    };
  });
}

function findingsForChapter(project, lang, chapter) {
  const all = projectFindings(project, lang);
  const pattern = chapterFindingPatterns[chapter.id] || /./;
  const matches = all.filter((finding) => pattern.test(finding.dimension));
  const selected = matches.length ? matches : all.slice(0, 3);
  return selected.slice(0, 8);
}

function lineReadingGuide(project, lang, finding) {
  const citation = finding.citation || {};
  const start = Number(citation.start) || 1;
  const end = Math.max(start, Number(citation.end) || start);
  const mid = Math.max(start, Math.floor((start + end) / 2));
  const labels = lang === "zh"
    ? [[`${start}–${Math.max(start, mid - 1)}`, "入口、配置和状态初始化", "先确认谁拿到输入、读取了哪些配置、创建了哪些状态。"], [`${mid}–${end}`, "分支、副作用和回执", "再追踪条件分支、外部调用、事件写入和失败出口；不要只看函数名。"], ["after", "回到调用者", "最后沿着调用者和下一条事件继续读，确认这段代码的结果如何被消费。"]]
    : [[`${start}–${Math.max(start, mid - 1)}`, "Inputs, configuration, and state", "Identify who owns the input, which configuration is read, and which state is created."], [`${mid}–${end}`, "Branches, effects, and receipts", "Trace conditions, external calls, event writes, and failure exits instead of reading only names."], ["after", "Return to the caller", "Follow the caller and the next event to see how this code's result is consumed."]];
  return `<div class="line-guide"><span>${lang === "zh" ? "逐段阅读提示" : "LINE-BY-LINE READING"}</span><ol>${labels.map(([range, title, copy]) => `<li><code>${esc(range)}</code><div><b>${esc(title)}</b><p>${esc(copy)}</p></div></li>`).join("")}</ol></div>`;
}
function lineByLineTable(lang, snippet) {
  const rows = String(snippet || "").split(/\r?\n/).map((line) => {
    const match = line.match(/^\s*(\d+)\s{2}(.*)$/);
    return match ? { number: match[1], code: match[2] } : null;
  }).filter(Boolean).slice(0, 28);
  if (!rows.length) return "";
  const labels = lang === "zh"
    ? { input: ["输入", "接收参数、事件或配置"], state: ["状态", "创建或修改 session、context、队列等状态"], branch: ["分支", "决定继续、停止、重试或走哪条路径"], effect: ["副作用", "调用模型、工具、文件、网络或进程"], return: ["回执", "把结果、错误或下一步交回调用者"], flow: ["流转", "组合、转换或把值传给下一层"] }
    : { input: ["INPUT", "Receives arguments, events, or configuration"], state: ["STATE", "Creates or mutates session/context/queue state"], branch: ["BRANCH", "Chooses continue, stop, retry, or another path"], effect: ["EFFECT", "Calls model, tools, files, network, or processes"], return: ["RECEIPT", "Returns a result, error, or next step"], flow: ["FLOW", "Composes, transforms, or hands a value downstream"] };
  const classify = (code) => {
    const line = code.toLowerCase();
    if (/\b(return|yield|break|continue)\b/.test(line)) return "return";
    if (/\b(if|else|match|switch|case|for|while|catch|try)\b/.test(line) || /=>\s*\{/.test(line)) return "branch";
    if (/\b(await|spawn|exec|execute|dispatch|invoke|fetch|send|write|createprocess|tool_call|function_call)\b/.test(line) || /\b(fs|shell|terminal|http|subprocess)\b/.test(line)) return "effect";
    if (/\b(state|session|context|history|queue|buffer|store|memory|push|insert|update|set[A-Z_]|mutable|mut\b)\b/.test(line)) return "state";
    if (/\b(arg|args|input|event|config|option|param|message|request|payload|env)\b/.test(line) || /^\s*(const|let|var)\b/.test(code)) return "input";
    return "flow";
  };
  const markup = rows.map(({ number, code }) => { const kind = classify(code); const [title, copy] = labels[kind]; return `<tr><td>${esc(number)}</td><th><span class="line-kind-${kind}">${esc(title)}</span></th><td><code>${esc(code)}</code></td><td>${esc(copy)}</td></tr>`; }).join("");
  return `<details class="line-by-line"><summary>${lang === "zh" ? `展开 ${rows.length} 行逐行翻译` : `Expand ${rows.length} line annotations`}</summary><div class="line-by-line-scroll"><table><thead><tr><th>${lang === "zh" ? "行" : "Line"}</th><th>${lang === "zh" ? "角色" : "Role"}</th><th>${lang === "zh" ? "源码" : "Source"}</th><th>${lang === "zh" ? "白话动作" : "Plain-language action"}</th></tr></thead><tbody>${markup}</tbody></table></div></details>`;
}

function findingCard(project, lang, finding, index, compact = false) {
  const citation = finding.citation;
  const pathLabel = `${citation.path}:${citation.start}–${citation.end}`;
  const ledgerCommit = citation.commit && citation.commit !== project.commit;
  const currentPath = citation.currentPath || citation.current?.path || citation.path;
  const currentStart = citation.currentStart || citation.current?.start || citation.start;
  const currentEnd = citation.currentEnd || citation.current?.end || citation.end;
  const title = `${String(index + 1).padStart(2, "0")} · ${finding.title}`;
  const caveats = finding.caveats?.length ? `<div class="finding-caveat"><span>${lang === "zh" ? "边界 / 风险" : "CAVEAT / RISK"}</span><ul>${finding.caveats.map((item) => `<li>${esc(fieldText(item, lang, item))}</li>`).join("")}</ul></div>` : "";
  const historical = ledgerCommit
    ? `<small class="finding-source-note">${lang === "zh" ? "叙述来自历史证据账本" : "Narrative from historical evidence ledger"} · ${esc(citation.commit.slice(0, 12))} · <a href="${esc(sourceUrlAtCommit(project, citation.path, citation.start, citation.end, citation.commit))}" target="_blank" rel="noreferrer">${lang === "zh" ? "打开账本提交" : "open ledger commit"} ↗</a></small>`
    : "";
  const currentLink = (currentPath !== citation.path || currentStart !== citation.start || currentEnd !== citation.end)
    ? `<small class="finding-source-note">${lang === "zh" ? "当前刷新提交对照" : "Current refreshed snapshot"} · <a href="${esc(sourceUrlAtCommit(project, currentPath, currentStart, currentEnd))}" target="_blank" rel="noreferrer">${esc(currentPath)}:${currentStart}–${currentEnd} ↗</a></small>`
    : "";
  const currentCode = citation.currentSnippet && citation.currentSnippet !== citation.snippet
    ? `<details class="current-source"><summary>${lang === "zh" ? "展开当前刷新提交的同路径代码" : "Show the same path from the refreshed commit"}</summary><div class="finding-code-head"><span>${esc(currentPath)} · ${esc(project.commit.slice(0, 12))}</span><a href="${esc(sourceUrlAtCommit(project, currentPath, currentStart, currentEnd, project.commit))}" target="_blank" rel="noreferrer">${lang === "zh" ? "当前源码" : "CURRENT"} ↗</a></div><pre><code>${esc(citation.currentSnippet)}</code></pre></details>`
    : "";
  return `<article class="finding-card${compact ? " compact" : ""}" id="${esc(finding.id)}" data-finding-dimension="${esc(finding.dimension)}"><header><span class="finding-index">${String(index + 1).padStart(2, "0")}</span><div><div class="finding-meta"><b>${esc(finding.evidenceLevel)}</b><span>${esc(finding.claimType)}</span><span>${esc(finding.dimension)}</span></div><h3>${esc(title)}</h3></div></header><div class="finding-grid"><div class="finding-copy"><section><span>${lang === "zh" ? "源码事实" : "SOURCE FACT"}</span><p>${esc(finding.fact)}</p></section><section><span>${lang === "zh" ? "白话解释" : "PLAIN LANGUAGE"}</span><p>${esc(finding.plain)}</p></section><section class="finding-impact"><span>${lang === "zh" ? "对自研 Harness 的含义" : "IMPLICATION"}</span><p>${esc(finding.implication)}</p></section>${lineReadingGuide(project, lang, finding)}${caveats}${historical}${currentLink}</div><div class="finding-code"><div class="finding-code-head"><span>${esc(pathLabel)}</span><a href="${esc(sourceUrlAtCommit(project, citation.path, citation.start, citation.end, citation.commit || project.commit))}" target="_blank" rel="noreferrer">${lang === "zh" ? "固定提交" : "PINNED"} ↗</a></div><pre><code>${esc(citation.snippet)}</code></pre>${lineByLineTable(lang, citation.snippet)}${currentCode}</div></div></article>`;
}

const chapterAnchor = { overview: "architecture", architecture: "architecture", loop: "loop", model: "model", tools: "tools", context: "context", security: "security", ecosystem: "ecosystem", collaboration: "collaboration", evidence: "engineering" };
const dimensionDefs = [
  { id: "architecture", anchor: "architecture", zh: "架构与所有权", en: "Architecture & ownership" },
  { id: "loop", anchor: "loop", zh: "控制循环", en: "Control loop" },
  { id: "modelContext", anchor: "model", zh: "模型与上下文", en: "Model & context" },
  { id: "execution", anchor: "security", zh: "执行环境与沙箱", en: "Execution & sandbox" },
  { id: "tools", anchor: "tools", zh: "工具注册与执行", en: "Tool registration & execution" },
  { id: "connectors", anchor: "ecosystem", zh: "连接器、插件与 MCP", en: "Connectors, plugins & MCP" },
  { id: "security", anchor: "security", zh: "安全、审批与权限", en: "Security, approval & permissions" },
  { id: "observability", anchor: "state", zh: "观测、日志与回放", en: "Observability & replay" },
  { id: "collaboration", anchor: "collaboration", zh: "协作与子 Agent", en: "Collaboration & sub-agents" },
  { id: "instructions", anchor: "ecosystem", zh: "全部指令与扩展面", en: "Instructions & extension surface" },
  { id: "recovery", anchor: "engineering", zh: "恢复、测试与取舍", en: "Recovery, tests & trade-offs" }
];
const analogies = {
  zh: {
    overview: "把项目想成一间工作室：我们先找入口、工位、工具柜和交付台，不急着背 API 名称。",
    architecture: "像看一栋楼的管线图：入口、控制室、执行层和档案室各有职责，连线告诉你谁把什么交给谁。",
    loop: "像快递员看回执：拿到任务、写一张行动单、执行、把回执放回桌面，再决定是否继续。",
    model: "模型像电话另一端的同事；Harness 必须把一段段流式声音拼成有序的消息和动作。",
    tools: "工具像机场跑道：模型拿到登机牌还不够，注册、权限、参数、执行和回执要逐关通过。",
    context: "上下文像一张会整理的工作台：眼前材料放桌上，旧材料进档案盒，关键索引要能重新找回。",
    security: "审批像门卫问预约，权限像门禁卡，沙箱像指定房间；它们不是同一件事。",
    ecosystem: "插件和 MCP 像外接设备：说明书、设备、电源和网络都要分开登记，不能插上就默认可信。",
    collaboration: "真正协作像派工单：要有负责的人、边界、预算、取消方式和可验收的交付物。",
    evidence: "源码审计像验桥：图纸是声明，测试是承重，恢复演练才说明断电后能不能回来。"
  },
  en: {
    overview: "Treat the project as a workshop: find the entrypoint, workbench, toolbox, and delivery desk before memorizing APIs.",
    architecture: "Like tracing a building's pipes: entry, control, execution, and records each have a job, and edges show handoff.",
    loop: "Like a courier reading receipts: accept work, write an action, execute, return the receipt, then decide whether to continue.",
    model: "The model is a colleague on the phone; the harness turns streaming fragments into ordered messages and actions.",
    tools: "Tools are runways: a model ticket is not enough—registration, policy, arguments, execution, and receipts must pass gates.",
    context: "Context is a workbench that tidies itself: current material stays visible, old material is archived, and indexes remain recoverable.",
    security: "Approval is a guard checking a booking, permissions are an access card, and a sandbox is a designated room.",
    ecosystem: "Plugins and MCP are external devices: docs, device, power, and network must be registered separately.",
    collaboration: "Real collaboration is a work order with an owner, boundary, budget, cancellation, and verifiable artifact.",
    evidence: "Source review is bridge inspection: a diagram is a claim, tests are load checks, and recovery drills prove the return path."
  }
};

function evidenceCard(project, lang, chapter, citation, index) {
  const title = lang === "zh" ? `源码证据 ${String(index).padStart(2, "0")}` : `Source evidence ${String(index).padStart(2, "0")}`;
  const pathLabel = `${citation.path}:${citation.start}-${citation.end}`;
  const fact = lang === "zh"
    ? `固定提交 ${project.commit.slice(0, 12)} 在 ${citation.path} 的这段代码直接对应本章问题；先看原文，再看白话解释，不把 README 的功能描述当成实现证据。`
    : `In fixed commit ${project.commit.slice(0, 12)}, this range in ${citation.path} directly answers the chapter question. Read the code before treating README claims as implementation evidence.`;
  return `<article class="evidence-card"><div class="evidence-head"><span>${esc(title)}</span><a href="${esc(sourceUrl(project, citation.path, citation.start, citation.end))}" target="_blank" rel="noreferrer">${esc(pathLabel)} ↗</a></div><pre><code>${esc(citation.snippet)}</code></pre><p>${esc(fact)}</p></article>`;
}

function dimensionCards(project, lang, file) {
  const notes = dimensionNotes[project.slug]?.[lang] || {};
  return dimensionDefs.map((dimension, index) => {
    const citation = findCitation(project, dimension.anchor);
    const findings = projectFindings(project, lang).filter((finding) => finding.dimension === dimension.id);
    const note = notes[dimension.id] || findings[0]?.fact || text(project, lang, "lesson");
    return `<article class="dimension-card"><div class="dimension-index">${String(index + 1).padStart(2, "0")}</div><div><h3>${esc(dimension[lang])}</h3><p>${esc(note)}</p><a href="${esc(sourceUrl(project, citation.path, citation.start, citation.end))}" target="_blank" rel="noreferrer">${esc(citation.path)} · L${citation.start}–${citation.end} ↗</a><small class="dimension-count">${findings.length || 1} ${lang === "zh" ? "条 finding" : "findings"}</small></div></article>`;
  }).join("");
}

function pageShell({ title, description, lang, project, current, body, rootPage = false, atlasPage = false }) {
  const prefix = rootPage ? "" : atlasPage ? "../" : current === "analysis" ? "../../../" : "../../../../";
  const languageHref = (targetLang) => {
    if (!project) return atlasPage ? (targetLang === lang ? "index.html" : `../${targetLang}/index.html`) : `${targetLang}/index.html`;
    if (current === "analysis") return `../${targetLang}/analysis.html`;
    if (current === null) return targetLang === lang ? "index.html" : `../../${targetLang}/tutorial/index.html`;
    return targetLang === lang ? `${current}.html` : `../../${targetLang}/tutorial/${current}.html`;
  };
  const zhHref = languageHref("zh");
  const enHref = languageHref("en");
  const homeHref = project ? `${prefix}${lang}/index.html` : "index.html";
  const reportHref = project ? (current === "analysis" ? "analysis.html" : "../analysis.html") : homeHref;
  const tutorialHref = project ? (current === "analysis" ? "tutorial/index.html" : "index.html") : homeHref;
  if (project?.legacy && current === "analysis") {
    const legacyHref = `${prefix}legacy/reports/${project.slug}.html`;
    body = `<section class="prose legacy-note"><div class="section-head"><span>LEGACY SOURCE AUDIT</span><h2>${lang === "zh" ? "迁移前的长报告仍然保留" : "The prior long-form audit is preserved"}</h2></div><p>${lang === "zh" ? "这个项目来自上一轮源码审计账本。新页面已经按统一模板拆成十章；下面的链接保留原审计中的完整 coverage、调用链、风险判断和源码引用，方便逐段复核。" : "This project comes from the previous source-audit ledger. The new site now splits it into ten common chapters; the link preserves the earlier coverage, call chain, risks, and source citations for review."}</p><a class="legacy-report-link" href="${legacyHref}">${lang === "zh" ? "打开完整中文长报告 ↗" : "Open the full Chinese audit ↗"}</a></section>${body}`;
  }
  return `<!doctype html><html lang="${lang === "zh" ? "zh-CN" : "en"}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="${esc(description)}"><title>${esc(title)}</title><link rel="stylesheet" href="${prefix}assets/harness.css"></head><body><div class="reading-progress" id="reading-progress"></div><header class="site-top"><button class="menu-button" data-menu>☰</button><a class="brand" href="${homeHref}">AWESOME <em>HARNESS</em></a><span class="crumb">${esc(project ? `${project.name} · ${langName(lang)}` : "Open-source agent harness atlas")}</span><nav><a href="${homeHref}">${lang === "zh" ? "总览" : "Overview"}</a>${project ? `<a href="${reportHref}">${lang === "zh" ? "技术分析" : "Analysis"}</a><a href="${tutorialHref}">${lang === "zh" ? "小白教程" : "Tutorial"}</a>` : ""}<a href="${zhHref}">中</a><a href="${enHref}">EN</a></nav></header><div class="layout"><aside class="side-nav" data-side>${project ? projectNav(project, lang, current) : atlasNav(lang)}</aside><main>${body}</main></div><script src="${prefix}assets/harness.js"></script></body></html>`;
}

function atlasNav(lang) {
  return `<div class="side-label">${lang === "zh" ? "项目目录" : "PROJECT ATLAS"}</div>${projects.map((p, i) => `<a href="../projects/${p.slug}/${lang}/analysis.html"><span>${String(i + 1).padStart(2, "0")}</span>${esc(p.name)}</a>`).join("")}<div class="side-foot">SOURCE-LOCKED<br>COMMIT PINNED</div>`;
}

function projectNav(project, lang, current) {
  const inTutorial = current !== "analysis";
  const analysisHref = inTutorial ? "../analysis.html" : "analysis.html";
  const chapterPrefix = inTutorial ? "" : "tutorial/";
  return `<div class="side-project"><strong>${esc(project.name)}</strong><small>${esc(project.kind)}</small></div><a class="${current === "analysis" ? "active" : ""}" href="${analysisHref}">${lang === "zh" ? "技术分析单页" : "Technical analysis"}</a><div class="side-label">${lang === "zh" ? "章节课程" : "CHAPTERS"}</div>${chapterDefs.map((c) => `<a class="${current === `ch${c.number}-${c.id}` ? "active" : ""}" href="${chapterPrefix}ch${c.number}-${c.id}.html"><span>M${c.number}</span>${esc(c.title[lang])}</a>`).join("")}<div class="side-foot">${esc(project.branch)}<br>${esc(project.commit.slice(0, 12))}</div>`;
}

function diagram(project, lang, type) {
  const labels = lang === "zh"
    ? { architecture: ["入口 / UI", "控制面", "模型与上下文", "工具 / MCP", "状态与恢复"], sequence: ["用户", "Session", "模型", "工具", "日志"], capability: ["循环", "上下文", "安全", "扩展", "协作"] }
    : { architecture: ["Entry / UI", "Control plane", "Model / context", "Tools / MCP", "State / recovery"], sequence: ["User", "Session", "Model", "Tool", "Journal"], capability: ["Loop", "Context", "Security", "Extensions", "Collaboration"] };
  const nodes = labels[type];
  const dimensionIds = type === "architecture"
    ? ["architecture", "loop", "modelContext", "tools", "recovery"]
    : type === "sequence"
      ? ["loop", "modelContext", "tools", "observability", "recovery"]
      : ["loop", "modelContext", "security", "connectors", "collaboration"];
  const width = type === "sequence" ? 980 : 900;
  const nodeMarkup = nodes.map((label, i) => {
    const x = type === "sequence" ? 45 + i * 190 : 70 + (i % 3) * 275;
    const y = type === "sequence" ? 100 : 92 + Math.floor(i / 3) * 150;
    const note = dimensionNotes[project.slug]?.[lang]?.[dimensionIds[i]] || "";
    const definition = dimensionDefs.find((dimension) => dimension.id === dimensionIds[i]);
    const citation = findCitation(project, definition?.anchor || "architecture");
    return `<g class="diagram-node" data-node="${i}"><title>${esc(`${label}: ${note}`)}</title><rect x="${x}" y="${y}" width="190" height="70" rx="5"/><text x="${x + 95}" y="${y + 32}" text-anchor="middle">${esc(label)}</text><text class="node-sub" x="${x + 95}" y="${y + 51}" text-anchor="middle">${esc(citation.path.split("/").pop())}:${citation.start}</text></g>`;
  }).join("");
  const lines = nodes.slice(0, -1).map((_, i) => {
    if (type === "sequence") return `<path d="M ${235 + i * 190} 135 H ${235 + i * 190 + 135}" marker-end="url(#arrow)"/>`;
    const x1 = 165 + (i % 3) * 275; const y1 = 127 + Math.floor(i / 3) * 150; const x2 = 345 + ((i + 1) % 3) * 275; const y2 = 127 + Math.floor((i + 1) / 3) * 150;
    return `<path d="M${x1} ${y1} C${x1 + 60} ${y1}, ${x2 - 60} ${y2}, ${x2} ${y2}" marker-end="url(#arrow)"/>`;
  }).join("");
  const title = lang === "zh" ? `${project.name} · ${type === "architecture" ? "架构图" : type === "sequence" ? "时序图" : "能力图"}` : `${project.name} · ${type}`;
  return `<!doctype html><html lang="${lang === "zh" ? "zh-CN" : "en"}><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)}</title><style>body{margin:0;background:#f5f4ed;color:#2d3142;font:14px system-ui,sans-serif;padding:28px}h1{font:400 36px Georgia,serif}svg{width:100%;min-width:780px;display:block}rect{fill:#fff;stroke:#2d3142;stroke-width:1.2}path{fill:none;stroke:#4f5d75;stroke-width:1.4}.diagram-node{cursor:pointer}.diagram-node:hover rect,.diagram-node.is-focus rect{fill:#f5ded3;stroke:#eb6c36}.diagram-node text{font-weight:600}.node-sub{font:10px monospace;fill:#4f5d75;font-weight:400!important}.legend{font:11px monospace;letter-spacing:.08em;color:#4f5d75}</style></head><body><p class="legend">${esc(type.toUpperCase())} · SOURCE ${esc(project.commit.slice(0, 12))}</p><h1>${esc(title)}</h1><svg viewBox="0 0 ${width} 420" role="img" aria-label="${esc(title)}"><defs><marker id="arrow" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto"><polygon points="0 0,8 3,0 6" fill="#4f5d75"/></marker></defs><rect width="100%" height="100%" fill="#f5f4ed" stroke="none"/>${lines}${nodeMarkup}</svg><p class="legend">${lang === "zh" ? "点击节点突出显示；图中标签对应报告与章节中的源码证据。" : "Click a node to focus it; labels map to the source evidence used by the report and chapters."}</p><script>document.querySelectorAll('.diagram-node').forEach(n=>n.addEventListener('click',()=>{document.querySelectorAll('.diagram-node').forEach(x=>x.classList.remove('is-focus'));n.classList.add('is-focus')}));</script></body></html>`;
}

function richDiagram(project, lang, type) {
  const title = lang === "zh"
    ? `${project.name} · ${type === "architecture" ? "分层架构与所有权图" : type === "sequence" ? "单轮执行时序与回写图" : "能力、风险与证据图"}`
    : `${project.name} · ${type === "architecture" ? "Layered architecture" : type === "sequence" ? "Turn sequence" : "Capability and evidence"}`;
  const findings = projectFindings(project, lang);
  const byDimension = new Map(findings.map((finding) => [finding.dimension, finding]));
  const pick = (dimension, label) => ({ label, finding: byDimension.get(dimension) || findings.find((item) => item.dimension === dimension) || findings[0] });
  const architecture = [
    pick("architecture", lang === "zh" ? "入口 / Profile" : "Entry / profile"), pick("instructions", lang === "zh" ? "Prompt / 指令" : "Prompt / instructions"),
    pick("loop", lang === "zh" ? "Agent Loop" : "Agent loop"), pick("modelContext", lang === "zh" ? "LLM / Context" : "LLM / context"),
    pick("tools", lang === "zh" ? "Tool Registry" : "Tool registry"), pick("execution", lang === "zh" ? "Sandbox / Shell" : "Sandbox / shell"),
    pick("connectors", lang === "zh" ? "MCP / Plugins" : "MCP / plugins"), pick("collaboration", lang === "zh" ? "Sub-agent" : "Sub-agent"),
    pick("observability", lang === "zh" ? "Session Log" : "Session log"), pick("recovery", lang === "zh" ? "Compaction / Recovery" : "Compaction / recovery"),
  ];
  const sequence = [
    pick("loop", lang === "zh" ? "1. claim inbox" : "1. claim inbox"), pick("instructions", lang === "zh" ? "2. assemble prompt" : "2. assemble prompt"),
    pick("modelContext", lang === "zh" ? "3. stream LLM" : "3. stream LLM"), pick("tools", lang === "zh" ? "4. schedule tools" : "4. schedule tools"),
    pick("execution", lang === "zh" ? "5. enforce policy" : "5. enforce policy"), pick("observability", lang === "zh" ? "6. append events" : "6. append events"),
    pick("recovery", lang === "zh" ? "7. retry / compact" : "7. retry / compact"),
  ];
  const capability = [
    pick("modelContext", lang === "zh" ? "模型协议" : "Model protocol"), pick("tools", lang === "zh" ? "工具执行" : "Tool execution"),
    pick("execution", lang === "zh" ? "隔离环境" : "Isolation"), pick("security", lang === "zh" ? "审批权限" : "Approval"),
    pick("connectors", lang === "zh" ? "MCP / Skills" : "MCP / Skills"), pick("collaboration", lang === "zh" ? "子 Agent" : "Sub-agents"),
    pick("observability", lang === "zh" ? "回放观测" : "Replay"), pick("recovery", lang === "zh" ? "恢复边界" : "Recovery"),
  ];
  const nodes = type === "architecture" ? architecture : type === "sequence" ? sequence : capability;
  const width = type === "sequence" ? 1500 : 1280;
  const height = type === "architecture" ? 820 : type === "sequence" ? 690 : 760;
  const nodeW = type === "sequence" ? 190 : 230;
  const nodeH = 96;
  const positions = nodes.map((_, index) => {
    if (type === "sequence") return { x: 55 + index * 205, y: 240 };
    return { x: type === "architecture" ? 55 + (index % 4) * 305 : 100 + (index % 4) * 295, y: (type === "architecture" ? 120 : 110) + Math.floor(index / 4) * 190 };
  });
  const nodeMarkup = nodes.map((node, index) => {
    const pos = positions[index]; const finding = node.finding || {}; const citation = finding.citation || currentCitation(project, finding.dimension || "architecture");
    const summary = (finding.plain || finding.fact || "").slice(0, 86);
    return `<g class="diagram-node" data-label="${esc(`${node.label} ${summary}`)}" data-detail="${esc(finding.fact || summary)}" data-source="${esc(`${citation.path}:${citation.start}–${citation.end}`)}" data-href="${esc(sourceUrlAtCommit(project, citation.path, citation.start, citation.end, citation.commit || project.commit))}"><rect x="${pos.x}" y="${pos.y}" width="${nodeW}" height="${nodeH}" rx="9"/><text class="node-title" x="${pos.x + nodeW / 2}" y="${pos.y + 31}" text-anchor="middle">${esc(node.label)}</text><text class="node-sub" x="${pos.x + nodeW / 2}" y="${pos.y + 54}" text-anchor="middle">${esc(citation.path.split("/").pop())}:${citation.start}</text><text class="node-note" x="${pos.x + nodeW / 2}" y="${pos.y + 77}" text-anchor="middle">${esc(summary.slice(0, 32))}</text></g>`;
  }).join("");
  const edgePairs = type === "sequence" ? nodes.slice(0, -1).map((_, index) => [index, index + 1]) : type === "architecture" ? [[0, 2], [0, 1], [1, 2], [2, 3], [2, 4], [3, 8], [4, 5], [4, 6], [5, 8], [6, 4], [7, 2], [8, 9]] : [[0, 1], [0, 4], [1, 2], [1, 6], [2, 3], [3, 6], [4, 5], [5, 6], [6, 7]];
  const edges = edgePairs.map(([from, to], index) => {
    const a = positions[from]; const b = positions[to]; const x1 = a.x + nodeW; const y1 = a.y + nodeH / 2; const x2 = b.x; const y2 = b.y + nodeH / 2; const mid = (x1 + x2) / 2;
    const label = type === "sequence" ? ["claim", "assemble", "stream", "dispatch", "enforce", "append"][index] || "continue" : "handoff";
    return `<path class="diagram-edge" d="M${x1} ${y1} C${mid} ${y1}, ${mid} ${y2}, ${x2} ${y2}" marker-end="url(#arrow)"/><text class="edge-label" x="${mid}" y="${(y1 + y2) / 2 - 8}" text-anchor="middle">${esc(label)}</text>`;
  }).join("");
  return `<!doctype html><html lang="${lang === "zh" ? "zh-CN" : "en"}" data-theme="dark"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)}</title><style>:root{--bg:#07111f;--panel:#0d1b2d;--grid:#1c334e;--line:#6283a2;--text:#eff7ff;--muted:#a3b8c9;--accent:#54e0bf;--hot:#f5b45d}html[data-theme="light"]{--bg:#f3efe3;--panel:#faf7ef;--grid:#d4c8b0;--line:#42698d;--text:#18385f;--muted:#6e6b60;--accent:#087f69;--hot:#a54a35}*{box-sizing:border-box}body{margin:0;padding:22px;background:var(--bg);color:var(--text);font:13px/1.6 system-ui,sans-serif;background-image:linear-gradient(var(--grid) 1px,transparent 1px),linear-gradient(90deg,var(--grid) 1px,transparent 1px);background-size:32px 32px}header{display:flex;gap:12px;align-items:center;flex-wrap:wrap;border-bottom:1px solid var(--line);padding-bottom:14px}h1{margin:0;font:400 32px Georgia,serif;letter-spacing:-.03em;color:var(--text)}.meta{font:10px monospace;color:var(--muted);letter-spacing:.08em}.toolbar{display:flex;gap:6px;align-items:center;margin-left:auto}.toolbar button,.toolbar input{border:1px solid var(--line);background:var(--panel);color:var(--text);padding:7px 9px;font:10px monospace}.toolbar input{width:180px}.canvas{margin-top:16px;border:1px solid var(--line);background:rgba(5,13,25,.28);overflow:auto;min-height:520px}.canvas svg{display:block;width:100%;min-width:${width}px;height:auto}.lane{fill:var(--panel);stroke:var(--line);stroke-width:1;opacity:.6}.diagram-edge{fill:none;stroke:var(--line);stroke-width:2;stroke-dasharray:7 6;animation:flow 2.5s linear infinite}.edge-label{fill:var(--muted);font:10px monospace}.diagram-node{cursor:pointer}.diagram-node rect{fill:var(--panel);stroke:var(--accent);stroke-width:1.7;filter:drop-shadow(0 8px 12px rgba(0,0,0,.2))}.diagram-node:hover rect,.diagram-node.is-focus rect{fill:color-mix(in srgb,var(--accent) 18%,var(--panel));stroke:var(--hot);stroke-width:2.5}.node-title{fill:var(--text);font-weight:700;font-size:14px}.node-sub{fill:var(--accent);font:10px monospace}.node-note{fill:var(--muted);font:10px system-ui}.legend{display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap;margin-top:12px;color:var(--muted);font:10px monospace}.detail{margin-top:14px;border:1px solid var(--line);padding:12px;background:var(--panel);min-height:65px}.detail b{color:var(--accent)}.detail a{color:var(--hot)}@keyframes flow{to{stroke-dashoffset:-52px}}@media(prefers-reduced-motion:reduce){.diagram-edge{animation:none}}@media(max-width:720px){body{padding:12px}h1{font-size:25px}.toolbar{margin-left:0}.toolbar input{width:140px}}</style></head><body><header><div><div class="meta">${esc(type.toUpperCase())} · SOURCE ${esc(project.commit.slice(0, 12))} · ARCHIFY-READY</div><h1>${esc(title)}</h1></div><div class="toolbar"><input id="search" type="search" placeholder="${lang === "zh" ? "筛选节点" : "Filter nodes"}"><button data-zoom="in">＋</button><button data-zoom="out">−</button><button data-reset>RESET</button><button data-theme>☼</button></div></header><div class="canvas"><svg id="map" viewBox="0 0 ${width} ${height}" role="img" aria-label="${esc(title)}"><defs><marker id="arrow" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path d="M0,0 L9,3.5 L0,7 z" fill="var(--accent)"/></marker></defs><rect class="lane" x="22" y="26" width="${width - 44}" height="${height - 52}" rx="16"/>${type === "sequence" ? `<text class="edge-label" x="42" y="80">${lang === "zh" ? "一条用户请求在多个可拦截边界之间流动" : "One request crosses multiple interceptable boundaries"}</text>` : ""}${edges}${nodeMarkup}</svg></div><div class="detail" id="detail"><b>${lang === "zh" ? "点击任意节点查看源码事实" : "Click a node for the source fact"}</b></div><div class="legend"><span>${lang === "zh" ? "虚线 = 控制/事件 handoff；绿色 = 可替换 seam；橙色 = 当前选中证据" : "Dashed = control/event handoff; green = replaceable seam; orange = selected evidence"}</span><a id="source-link" href="https://github.com/${esc(project.repo)}/tree/${esc(project.commit)}" target="_blank" rel="noreferrer">${lang === "zh" ? "打开固定源码" : "Open pinned source"} ↗</a></div><script>const root=document.documentElement,map=document.getElementById('map'),nodes=[...document.querySelectorAll('.diagram-node')],detail=document.getElementById('detail'),link=document.getElementById('source-link');let base='0 0 ${width} ${height}',scale=1;function focus(n){nodes.forEach(x=>x.classList.remove('is-focus'));n?.classList.add('is-focus');if(n){detail.innerHTML='<b>'+n.dataset.label+'</b><br>'+n.dataset.detail+'<br><a href="'+n.dataset.href+'" target="_blank" rel="noreferrer">'+n.dataset.source+' ↗</a>';link.href=n.dataset.href}}nodes.forEach(n=>n.addEventListener('click',()=>focus(n)));document.getElementById('search').addEventListener('input',e=>{const q=e.target.value.toLowerCase();nodes.forEach(n=>n.style.opacity=!q||n.dataset.label.toLowerCase().includes(q)?'1':'.16')});document.querySelector('[data-zoom="in"]').addEventListener('click',()=>{scale=Math.max(.7,scale-.1);map.setAttribute('viewBox','0 0 '+${width}*scale+' '+${height}*scale)});document.querySelector('[data-zoom="out"]').addEventListener('click',()=>{scale=Math.min(1.8,scale+.1);map.setAttribute('viewBox','0 0 '+${width}*scale+' '+${height}*scale)});document.querySelector('[data-reset]').addEventListener('click',()=>{scale=1;map.setAttribute('viewBox',base);focus(null)});document.querySelector('[data-theme]').addEventListener('click',()=>root.dataset.theme=root.dataset.theme==='dark'?'light':'dark');</script></body></html>`;
}

// The first generation of this atlas used a small bespoke SVG viewer.  The
// older Goose reports already contain the complete Archify reader: guided
// views, evidence beacons, node detail panels, presets, keyboard navigation,
// export, and a light-first theme.  Keep that reader as the canonical shell
// and only author the project-specific SVG/data payload here.  This prevents
// every report from growing a subtly different, fragile diagram runtime.
function archifyEvidence(project, lang) {
  const findings = projectFindings(project, lang);
  const aliases = {
    architecture: "entry", loop: "loop", modelContext: "provider", tools: "tools",
    execution: "security", security: "security", connectors: "extensions",
    instructions: "extensions", observability: "store", recovery: "store",
    collaboration: "agents"
  };
  const nodes = {};
  for (const finding of findings) {
    const id = aliases[finding.dimension] || finding.dimension;
    if (!id || !finding.citation) continue;
    nodes[id] ||= [];
    if (nodes[id].length >= 3) continue;
    const citation = finding.citation;
    nodes[id].push({
      path: citation.path,
      line: citation.start,
      endLine: citation.end,
      label: finding.title,
      href: sourceUrlAtCommit(project, citation.path, citation.start, citation.end, citation.commit || project.commit)
    });
  }
  return {
    schemaVersion: 1,
    verified: true,
    repository: { url: `https://github.com/${project.repo}`, revision: project.commit, shortRevision: project.commit.slice(0, 7) },
    referenceCount: Object.values(nodes).reduce((sum, refs) => sum + refs.length, 0),
    nodes
  };
}

function archifySvg(project, lang, type) {
  const findings = projectFindings(project, lang);
  const byDimension = new Map(findings.map((finding) => [finding.dimension, finding]));
  const findingDimension = { session: "architecture", policy: "security", sandbox: "execution", commands: "instructions", effect: "execution", decision: "recovery", recovery: "recovery", artifact: "observability" };
  const pick = (dimension) => byDimension.get(dimension) || byDimension.get(findingDimension[dimension]) || findings.find((item) => item.dimension === dimension) || findings[0] || { citation: currentCitation(project, "architecture") };
  const nodeKind = { entry: "frontend", session: "database", loop: "backend", context: "database", provider: "cloud", tools: "backend", security: "security", policy: "security", sandbox: "security", extensions: "external", commands: "external", store: "database", agents: "messagebus", user: "frontend", model: "cloud", effect: "backend", decision: "security", recovery: "database", artifact: "database" };
  const architectureNodes = [
    ["entry", lang === "zh" ? "入口 / UI" : "Entry / UI", lang === "zh" ? "CLI、Desktop、API" : "CLI, desktop, API", 70, 110, "architecture"],
    ["session", lang === "zh" ? "Session / Profile" : "Session / profile", lang === "zh" ? "身份、配置、工作区" : "Identity, config, workspace", 350, 110, "architecture"],
    ["context", lang === "zh" ? "Context Pack" : "Context pack", lang === "zh" ? "检索、压缩、预算" : "Retrieval, compaction, budget", 630, 110, "modelContext"],
    ["extensions", lang === "zh" ? "MCP / Plugins" : "MCP / plugins", lang === "zh" ? "连接器、skills、指令" : "Connectors, skills, instructions", 1190, 110, "connectors"],
    ["loop", lang === "zh" ? "Agent Loop" : "Agent loop", lang === "zh" ? "step / turn / cancel" : "step / turn / cancel", 70, 360, "loop"],
    ["provider", lang === "zh" ? "模型 / Provider" : "Model / provider", lang === "zh" ? "流式响应与 tool call" : "Streaming and tool calls", 350, 360, "modelContext"],
    ["tools", lang === "zh" ? "Tool Registry" : "Tool registry", lang === "zh" ? "schema、队列、调度" : "Schema, queue, dispatch", 630, 360, "tools"],
    ["policy", lang === "zh" ? "Approval / Policy" : "Approval / policy", lang === "zh" ? "审批、权限、门禁" : "Approval, permission, gates", 910, 360, "security"],
    ["sandbox", lang === "zh" ? "Sandbox / Effect" : "Sandbox / effect", lang === "zh" ? "shell、workspace、副作用" : "Shell, workspace, side effects", 1190, 360, "execution"],
    ["store", lang === "zh" ? "Session / Trace" : "Session / trace", lang === "zh" ? "日志、事件、投影" : "Logs, events, projections", 350, 610, "observability"],
    ["agents", lang === "zh" ? "Sub-agent / Jobs" : "Sub-agent / jobs", lang === "zh" ? "委派、并行、队列" : "Delegation, parallel, queues", 630, 610, "collaboration"],
    ["recovery", lang === "zh" ? "Recovery / Checkpoint" : "Recovery / checkpoint", lang === "zh" ? "重试、压缩、回滚" : "Retry, compact, rollback", 910, 610, "recovery"],
    ["artifact", lang === "zh" ? "Artifacts / Diff" : "Artifacts / diff", lang === "zh" ? "交付物、测试、回写" : "Deliverables, tests, writeback", 1190, 610, "observability"]
  ];
  const sequenceNodes = [
    ["user", lang === "zh" ? "User" : "User", lang === "zh" ? "提交目标" : "Submit goal", 80, 100, "architecture"],
    ["entry", lang === "zh" ? "Entry" : "Entry", lang === "zh" ? "建 session / profile" : "Create session / profile", 380, 100, "architecture"],
    ["session", lang === "zh" ? "Session" : "Session", lang === "zh" ? "载入配置与工作区" : "Load config and workspace", 680, 100, "architecture"],
    ["context", lang === "zh" ? "Context" : "Context", lang === "zh" ? "检索、压缩、预算" : "Retrieve, compact, budget", 980, 100, "modelContext"],
    ["model", lang === "zh" ? "模型" : "Model", lang === "zh" ? "流式生成下一步" : "Stream next step", 980, 350, "modelContext"],
    ["policy", lang === "zh" ? "权限 / 审批" : "Policy / approval", lang === "zh" ? "检查副作用" : "Check side effects", 680, 350, "security"],
    ["tools", lang === "zh" ? "工具" : "Tools", lang === "zh" ? "调度并回传结果" : "Dispatch and return", 380, 350, "tools"],
    ["effect", lang === "zh" ? "Effect" : "Effect", lang === "zh" ? "shell、文件、网络" : "Shell, files, network", 80, 350, "execution"],
    ["store", lang === "zh" ? "日志 / 投影" : "Log / projection", lang === "zh" ? "追加事件与状态" : "Append events and state", 80, 600, "observability"],
    ["decision", lang === "zh" ? "分支 / 门禁" : "Branch / gate", lang === "zh" ? "继续、重试、人工接管" : "Continue, retry, handoff", 380, 600, "recovery"],
    ["recovery", lang === "zh" ? "恢复" : "Recovery", lang === "zh" ? "checkpoint、compact、rollback" : "Checkpoint, compact, rollback", 680, 600, "recovery"],
    ["artifact", lang === "zh" ? "交付物" : "Artifact", lang === "zh" ? "diff、测试、回写" : "Diff, tests, writeback", 980, 600, "observability"]
  ];
  const capabilityNodes = [
    ["entry", lang === "zh" ? "入口" : "Entry", lang === "zh" ? "CLI / API / UI" : "CLI / API / UI", 80, 110, "architecture"],
    ["loop", lang === "zh" ? "循环" : "Loop", lang === "zh" ? "step / turn / cancel" : "step / turn / cancel", 380, 110, "loop"],
    ["provider", lang === "zh" ? "模型" : "Model", lang === "zh" ? "上下文与流式协议" : "Context and streaming", 680, 110, "modelContext"],
    ["tools", lang === "zh" ? "工具" : "Tools", lang === "zh" ? "注册、队列、并行" : "Registry, queue, parallel", 980, 110, "tools"],
    ["security", lang === "zh" ? "安全" : "Security", lang === "zh" ? "审批、权限、门禁" : "Approval, permission, gates", 80, 360, "security"],
    ["sandbox", lang === "zh" ? "沙箱" : "Sandbox", lang === "zh" ? "工作区、shell、副作用" : "Workspace, shell, effects", 380, 360, "execution"],
    ["extensions", lang === "zh" ? "扩展" : "Extensions", lang === "zh" ? "MCP、插件、skills" : "MCP, plugins, skills", 680, 360, "connectors"],
    ["commands", lang === "zh" ? "指令" : "Commands", lang === "zh" ? "slash、CLI、workflow" : "Slash, CLI, workflow", 980, 360, "instructions"],
    ["context", lang === "zh" ? "上下文" : "Context", lang === "zh" ? "记忆、检索、压缩" : "Memory, retrieval, compaction", 80, 610, "modelContext"],
    ["store", lang === "zh" ? "观测" : "Observability", lang === "zh" ? "session log / replay" : "Session log / replay", 380, 610, "observability"],
    ["agents", lang === "zh" ? "协作" : "Collaboration", lang === "zh" ? "子 Agent / jobs" : "Sub-agents / jobs", 680, 610, "collaboration"],
    ["recovery", lang === "zh" ? "恢复" : "Recovery", lang === "zh" ? "重试、回滚、人工接管" : "Retry, rollback, handoff", 980, 610, "recovery"]
  ];
  const authored = type === "sequence" ? sequenceNodes : type === "capability" ? capabilityNodes : architectureNodes;
  const width = type === "sequence" ? 1320 : 1480;
  const height = 820;
  const nodes = authored.map(([id, label, sublabel, x, y, dimension]) => {
    const finding = pick(dimension);
    const citation = finding.citation || currentCitation(project, dimension);
    const kind = nodeKind[id] || "backend";
    const detail = (finding.fact || finding.plain || dimensionNotes[project.slug]?.[lang]?.[dimension] || sublabel || "").slice(0, 240);
    const aria = `${label}, ${sublabel}, ${citation.path}:${citation.start}`;
    return `<g id="node-${esc(id)}" data-node-id="${esc(id)}" data-node-label="${esc(label)}" tabindex="0" role="button" aria-label="${esc(aria)}" aria-pressed="false" data-node-kind="${esc(kind)}" data-node-sublabel="${esc(sublabel)}" data-node-context="${esc(dimension)}"><title>${esc(`${label} · ${sublabel}`)}</title><rect x="${x}" y="${y}" width="190" height="64" rx="6" class="c-mask"/><rect x="${x}" y="${y}" width="190" height="64" rx="6" class="c-${esc(kind)}" stroke-width="1.5"/><text data-detail-anchor x="${x + 95}" y="${y + 28}" class="t-primary" font-size="11" font-weight="600" text-anchor="middle">${esc(label)}</text><text data-detail="${esc(detail)}" x="${x + 95}" y="${y + 46}" class="t-muted" font-size="9" text-anchor="middle">${esc(sublabel)}</text></g>`;
  }).join("");
  const edgePairs = type === "sequence"
    ? [["user", "entry", "goal"], ["entry", "session", "create"], ["session", "context", "load"], ["context", "model", "prompt"], ["model", "policy", "call"], ["policy", "tools", "allow"], ["tools", "effect", "invoke"], ["effect", "store", "receipt"], ["store", "decision", "branch"], ["decision", "recovery", "retry"], ["recovery", "artifact", "deliver"]]
    : type === "architecture"
      ? [["entry", "session", "input"], ["session", "context", "prepare"], ["context", "loop", "route"], ["loop", "provider", "sample"], ["provider", "tools", "call"], ["tools", "policy", "gate"], ["policy", "sandbox", "allow"], ["sandbox", "store", "receipt"], ["store", "recovery", "resume"], ["recovery", "loop", "continue"], ["tools", "agents", "delegate"], ["agents", "artifact", "handoff"], ["store", "artifact", "publish"], ["extensions", "provider", "extend"]]
      : [["entry", "loop", "core"], ["loop", "provider", "sample"], ["provider", "tools", "call"], ["tools", "security", "gate"], ["security", "sandbox", "isolate"], ["extensions", "commands", "register"], ["commands", "loop", "trigger"], ["context", "store", "remember"], ["store", "agents", "delegate"], ["agents", "recovery", "resume"], ["recovery", "loop", "continue"]];
  const positionById = new Map(authored.map(([id, , , x, y]) => [id, { x, y }]));
  const edges = edgePairs.map(([from, to, label], index) => {
    const a = positionById.get(from); const b = positionById.get(to); if (!a || !b) return "";
    const x1 = a.x + 190; const y1 = a.y + 32; const x2 = b.x; const y2 = b.y + 32;
    const cls = index === 0 || index === 1 ? "a-emphasis" : index === 5 ? "a-security" : "a-dashed";
    const marker = cls === "a-emphasis" ? "arrowhead-emphasis" : cls === "a-security" ? "arrowhead-security" : "arrowhead-dashed";
    const points = `${x1},${y1};${x2},${y2}`;
    const d = x1 <= x2 ? `M ${x1} ${y1} L ${x2} ${y2}` : `M ${x1} ${y1} C ${x1 + 70} ${y1}, ${x2 - 70} ${y2}, ${x2} ${y2}`;
    return `<path data-edge-from="${esc(from)}" data-edge-to="${esc(to)}" data-edge-label="${esc(label)}" data-edge-key="${index}" data-edge-id="${esc(`${from}-${to}`)}" data-composition-points="${points}" d="${d}" class="${cls}" stroke-width="1.8" marker-end="url(#${marker})"><title>${esc(label)}</title></path>`;
  }).join("");
  const bandLabels = type === "sequence"
    ? `<text x="80" y="62" class="t-muted" font-size="11">${esc(lang === "zh" ? "01 准备 → 02 执行 → 03 回写 / 恢复" : "01 prepare → 02 execute → 03 receipt / recovery")}</text>`
    : `<text x="70" y="78" class="t-muted" font-size="11">${esc(lang === "zh" ? (type === "architecture" ? "入口与上下文" : "核心能力") : (type === "architecture" ? "ENTRY & CONTEXT" : "CORE CAPABILITIES"))}</text><text x="70" y="328" class="t-muted" font-size="11">${esc(lang === "zh" ? (type === "architecture" ? "控制循环与副作用" : "GOVERNANCE & EFFECTS") : (type === "architecture" ? "CONTROL LOOP & EFFECTS" : "GOVERNANCE & EFFECTS"))}</text><text x="70" y="578" class="t-muted" font-size="11">${esc(lang === "zh" ? (type === "architecture" ? "状态、协作与交付" : "STATE & COLLABORATION") : (type === "architecture" ? "STATE, COLLABORATION & DELIVERY" : "STATE & COLLABORATION"))}</text>`;
  return `<svg viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="archify-diagram-title archify-diagram-description" data-preset="editorial" data-quality-profile="showcase"><title id="archify-diagram-title">${esc(project.name)}</title><desc id="archify-diagram-description">${esc(lang === "zh" ? "基于固定提交的源码证据图" : "Source evidence map from a pinned commit")}</desc><defs><marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto"><polygon points="0 0, 10 3.5, 0 7" class="m-default"/></marker><marker id="arrowhead-emphasis" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto"><polygon points="0 0, 10 3.5, 0 7" class="m-emphasis"/></marker><marker id="arrowhead-security" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto"><polygon points="0 0, 10 3.5, 0 7" class="m-security"/></marker><marker id="arrowhead-dashed" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto"><polygon points="0 0, 10 3.5, 0 7" class="m-dashed"/></marker><pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" class="c-grid" stroke-width="0.5"/></pattern></defs><rect width="100%" height="100%" fill="url(#grid)"/>${bandLabels}${edges}${nodes}</svg>`;
}

function archifyViews(project, lang, type) {
  const zh = lang === "zh";
  if (type === "sequence") return [
    { id: "prepare", label: zh ? "准备上下文" : "Prepare context", focus: ["user", "entry", "session", "context"], note: zh ? "入口创建会话，工作区和上下文预算随后进入主循环。" : "Entry creates the session; workspace and context budget feed the loop." },
    { id: "sample", label: zh ? "模型与工具" : "Model and tools", focus: ["loop", "model", "policy", "tools", "effect"], note: zh ? "采样、审批与真实副作用发生在同一条链上。" : "Sampling, approval, and side effects share one chain." },
    { id: "persist", label: zh ? "持久化与续跑" : "Persist and resume", focus: ["store", "decision", "recovery", "artifact"], note: zh ? "结果落账后再决定继续、重试、回滚或交付。" : "After the receipt is written, continue, retry, roll back, or deliver." }
  ];
  if (type === "capability") return [
    { id: "core", label: zh ? "核心闭环" : "Core loop", focus: ["entry", "loop", "provider", "tools"], note: zh ? "先看任务如何流过主循环、模型和工具。" : "Start with the task crossing loop, model, and tools." },
    { id: "governance", label: zh ? "治理边界" : "Governance", focus: ["security", "sandbox", "tools", "store"], note: zh ? "能力、策略、隔离和审计是四个不同层次。" : "Capability, policy, isolation, and audit are separate layers." },
    { id: "scale", label: zh ? "扩展与协作" : "Extensions and collaboration", focus: ["extensions", "commands", "agents", "recovery"], note: zh ? "连接器、指令、子 Agent 与恢复机制决定可扩展性。" : "Connectors, commands, sub-agents, and recovery define extensibility." }
  ];
  return [
    { id: "main-path", label: zh ? "主执行路径" : "Main execution path", focus: ["entry", "session", "context", "loop", "provider", "tools", "store", "artifact"], note: zh ? "从入口、会话、上下文一路到模型、工具、持久化与交付。" : "From entry, session, and context to model, tools, persistence, and delivery." },
    { id: "governance", label: zh ? "治理边界" : "Governance boundary", focus: ["loop", "tools", "policy", "sandbox", "store", "recovery"], note: zh ? "审批、隔离、执行、回执与恢复如何闭环。" : "How approval, isolation, execution, receipts, and recovery close the loop." },
    { id: "ecosystem", label: zh ? "扩展与协作" : "Extensions and collaboration", focus: ["extensions", "agents", "commands", "context", "loop"], note: zh ? "上下文、连接器、指令与子 Agent 如何接入主循环。" : "How context, connectors, commands, and sub-agents plug into the loop." }
  ];
}

function archifyDiagram(project, lang, type) {
  const legacyType = type === "capability" ? "architecture" : type;
  const legacyFile = path.join(siteRoot, "legacy", "diagrams", `${project.slug}-${legacyType}.html`);
  const normalizeTheme = (html) => html
    .replace(/(<html\b[^>]*data-theme=")dark("[^>]*>)/, '$1light$2')
    .replace(/window\.matchMedia\('\(prefers-color-scheme: light\)'\)\.matches \? 'light' : 'dark'/g, "true ? 'light' : 'dark'");
  // Keep one canonical copy of each reviewed legacy Archify artifact.  The
  // project-local URL is a tiny light-first wrapper, so iframes and direct
  // links still land on the full guided reader without duplicating ~600 KB of
  // inline CSS/JS for every language and diagram slot.
  if (project.legacy && fs.existsSync(legacyFile)) {
    const target = `../../../../legacy/diagrams/${project.slug}-${legacyType}.html?theme=light`;
    const title = `${project.name} · ${legacyType}`;
    return `<!doctype html><html lang="${lang === "zh" ? "zh-CN" : "en"}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="refresh" content="0;url=${target}"><title>${esc(title)}</title></head><body data-archify-wrapper="true"><p>ARCHIFY-READY · ${esc(title)}</p><p><a href="${target}">Open the full guided Archify map ↗</a></p></body></html>`;
  }
  const templateFile = path.join(siteRoot, "legacy", "diagrams", `goose-${legacyType}.html`);
  if (!fs.existsSync(templateFile)) return richDiagram(project, lang, type);
  let html = fs.readFileSync(templateFile, "utf8");
  const title = lang === "zh"
    ? `${project.name} · ${type === "architecture" ? "Harness 架构" : type === "sequence" ? "单轮技术链路" : "能力与风险边界"}`
    : `${project.name} · ${type === "architecture" ? "Harness architecture" : type === "sequence" ? "Turn sequence" : "Capability and boundaries"}`;
  html = html.replace(/<h1>[^<]*<\/h1>/, `<h1>${esc(title)}</h1>`).replace(/<p class="subtitle">[^<]*<\/p>/, `<p class="subtitle">${esc(lang === "zh" ? `基于固定提交 ${project.commit.slice(0, 8)} 的源码证据图` : `Source evidence map from pinned commit ${project.commit.slice(0, 8)}`)}</p>`);
  html = html.replace(/(<script id="archify-guided-views-data"[^>]*>)[\s\S]*?(<\/script>)/, `$1${JSON.stringify(archifyViews(project, lang, type))}$2`);
  const evidence = `<script id="archify-source-evidence-data" type="application/json">${JSON.stringify(archifyEvidence(project, lang))}</script>`;
  if (html.includes("id=\"archify-source-evidence-data\"")) html = html.replace(/<script id="archify-source-evidence-data"[^>]*>[\s\S]*?<\/script>/, evidence);
  else html = html.replace(/(<script id="archify-guided-views-data"[^>]*>[\s\S]*?<\/script>)/, `$1\n    ${evidence}`);
  const diagramStart = html.indexOf('<div class="diagram-container"');
  const svgStart = html.indexOf("<svg ", diagramStart);
  const svgEnd = html.indexOf("</svg>", svgStart) + 6;
  if (diagramStart >= 0 && svgStart >= 0 && svgEnd > svgStart) html = `${html.slice(0, svgStart)}${archifySvg(project, lang, type)}${html.slice(svgEnd)}`;
  html = html.replace(/<title>Goose · [^<]*<\/title>/, `<title>${esc(title)}</title>`)
    .replace(/(<title id="archify-diagram-title">)[\s\S]*?(<\/title>)/, `$1${esc(title)}$2`)
    .replace(/(<desc id="archify-diagram-description">)[\s\S]*?(<\/desc>)/, `$1${esc(lang === "zh" ? "固定提交源码证据图" : "Pinned source evidence map")}$2`)
    .replace(/<html lang="[^"]*"/, `<html lang="${lang === "zh" ? "zh-CN" : "en"}"`);
  return normalizeTheme(html);
}

function analysis(project, lang) {
  const file = path.join(siteRoot, "projects", project.slug, lang, "analysis.html");
  const cards = chapterDefs.map((chapter, index) => {
    const citation = findCitation(project, chapterAnchor[chapter.id]);
    return `<article class="analysis-card"><span>M${chapter.number}</span><h3>${esc(chapter.title[lang])}</h3><p>${esc(text(project, lang, "lesson"))}</p><a href="${esc(rel(file, path.join(siteRoot, "projects", project.slug, lang, "tutorial", `ch${chapter.number}-${chapter.id}.html`)))}">${lang === "zh" ? "进入本章" : "Open chapter"} →</a><small>${esc(citation.path)}:${citation.start}–${citation.end}</small></article>`;
  }).join("");
  const evidence = chapterDefs.map((chapter) => evidenceCard(project, lang, chapter, findCitation(project, chapterAnchor[chapter.id]), Number(chapter.number))).join("");
  const body = `<section class="hero"><p class="eyebrow">TECHNICAL ANALYSIS · ${esc(project.branch)} · ${esc(project.commit.slice(0, 12))}</p><div class="hero-grid"><div><h1>${esc(project.name)}<br><em>${lang === "zh" ? "从源码看 Harness" : "Harness, from source"}</em></h1><p class="lede">${esc(text(project, lang, "thesis"))}</p><div class="badges"><span>${esc(project.language)}</span><span>${esc(project.kind)}</span><span>${esc(project.date.slice(0, 10))}</span></div></div><aside class="version-card"><b>${lang === "zh" ? "源码版本" : "SOURCE VERSION"}</b><code>${esc(project.commit)}</code><a href="https://github.com/${esc(project.repo)}/tree/${esc(project.commit)}" target="_blank" rel="noreferrer">${lang === "zh" ? "打开固定提交" : "Open pinned commit"} ↗</a><small>${esc(project.repo)} · ${esc(project.branch)}</small></aside></div></section><section class="prose"><div class="section-head"><span>01 · ${lang === "zh" ? "结论先行" : "THESIS"}</span><h2>${lang === "zh" ? "先用一句话抓住它的控制面" : "One sentence for the control plane"}</h2></div><p>${esc(text(project, lang, "thesis"))}</p><div class="pros-cons"><div><h3>${lang === "zh" ? "优势" : "Strengths"}</h3><ul>${project[lang].strengths.map(x => `<li>${esc(x)}</li>`).join("")}</ul></div><div><h3>${lang === "zh" ? "边界" : "Limits"}</h3><ul>${project[lang].limits.map(x => `<li>${esc(x)}</li>`).join("")}</ul></div></div></section><section class="prose dimensions"><div class="section-head"><span>02 · ${lang === "zh" ? "11 个 Harness 维度" : "11 HARNESS DIMENSIONS"}</span><h2>${lang === "zh" ? "从架构一路读到恢复，而不是只看功能清单" : "Read from architecture to recovery, not just a feature list"}</h2></div><p>${lang === "zh" ? "每张卡都给出源码落点与白话解读；页面下方再贴出完整摘录，方便从事实、推断和迁移建议三层复核。" : "Each card gives a source anchor and plain-language reading; the full excerpts below let you review facts, inferences, and migration advice separately."}</p><div class="dimension-grid">${dimensionCards(project, lang, file)}</div></section><section class="prose"><div class="section-head"><span>03 · ${lang === "zh" ? "图谱" : "MAPS"}</span><h2>${lang === "zh" ? "架构、时序、能力三张图" : "Architecture, sequence, and capability maps"}</h2></div><div class="diagram-grid"><a href="${esc(rel(file, path.join(siteRoot, "projects", project.slug, lang, "diagrams", "architecture.html")))}"><b>${lang === "zh" ? "架构图" : "Architecture"}</b><span>${lang === "zh" ? "入口 → 控制面 → 执行 → 状态" : "Entry → control → execution → state"}</span></a><a href="${esc(rel(file, path.join(siteRoot, "projects", project.slug, lang, "diagrams", "sequence.html")))}"><b>${lang === "zh" ? "时序图" : "Sequence"}</b><span>${lang === "zh" ? "一次请求如何经过各层" : "One request across layers"}</span></a><a href="${esc(rel(file, path.join(siteRoot, "projects", project.slug, lang, "diagrams", "capability.html")))}"><b>${lang === "zh" ? "能力图" : "Capability"}</b><span>${lang === "zh" ? "可用能力与风险边界" : "Capabilities and risk boundaries"}</span></a></div></section><section class="prose"><div class="section-head"><span>04 · ${lang === "zh" ? "课程目录" : "COURSE"}</span><h2>${lang === "zh" ? "一页分析之后，进入十章小白教程" : "After analysis, enter the ten-chapter beginner course"}</h2></div><div class="analysis-grid">${cards}</div></section><section class="prose evidence-section"><div class="section-head"><span>05 · ${lang === "zh" ? "源码证据" : "SOURCE EVIDENCE"}</span><h2>${lang === "zh" ? "每一章都回到固定提交" : "Every chapter returns to the pinned commit"}</h2></div><p>${lang === "zh" ? "下面的摘录来自本地拉取的最新提交；路径、行号、版本和 GitHub 链接都保留，方便你从页面继续追调用链。" : "These excerpts come from the locally cloned latest commit. Paths, line ranges, version, and GitHub links remain available for replay."}</p><div class="evidence-stack">${evidence}</div></section><footer class="site-footer"><span>${esc(project.repo)} · ${esc(project.commit)}</span><a href="${esc(rel(file, path.join(siteRoot, "index.html")))}">${lang === "zh" ? "回到总览" : "Back to atlas"} →</a></footer>`;
  return pageShell({ title: `${project.name} · ${lang === "zh" ? "技术分析" : "Technical analysis"}`, description: text(project, lang, "thesis"), lang, project, current: "analysis", body });
}

function richAnalysis(project, lang) {
  const file = path.join(siteRoot, "projects", project.slug, lang, "analysis.html");
  const findings = projectFindings(project, lang);
  const ledger = evidenceLedgers.get(project.slug);
  const citations = new Set(findings.map((finding) => `${finding.citation.path}:${finding.citation.start}`));
  const coverage = ledger?.coverage || dimensionDefs.map((dimension) => ({ dimension: dimension.id, status: "verified", evidenceLevels: ["L1"] }));
  const coverageRows = coverage.map((row) => {
    const name = dimensionDefs.find((dimension) => dimension.id === (findingDimensionAliases[row.dimension] || row.dimension))?.[lang] || row.dimension;
    return `<div class="coverage-row"><span>${esc(name)}</span><b class="status-${esc(row.status)}">${esc(row.status)}</b><em>${esc((row.evidenceLevels || ["L1"]).join(" / "))}</em><p>${esc(row.notes || (lang === "zh" ? "已绑定固定提交源码锚点；点击下方 finding 逐条复核。" : "Pinned source anchors are attached; review the findings below."))}</p></div>`;
  }).join("");
  const findingSections = dimensionDefs.map((dimension, dimensionIndex) => {
    const subset = findings.filter((finding) => finding.dimension === dimension.id);
    if (!subset.length) return "";
    return `<section class="evidence-chapter" id="dim-${esc(dimension.id)}"><div class="chapter-rule"><span>${String(dimensionIndex + 1).padStart(2, "0")}</span></div><div class="chapter-kicker">DIMENSION · ${esc(dimension.id.toUpperCase())}</div><h2>${esc(dimension[lang])}</h2><p class="chapter-deck">${subset.length} ${lang === "zh" ? "条可定位结论；每条按事实 → 白话 → 工程影响 → 源码摘录展开。" : "located findings; each moves from fact to plain language, engineering impact, and source excerpt."}</p>${subset.map((finding, index) => findingCard(project, lang, finding, index)).join("")}</section>`;
  }).join("");
  const chapterCards = chapterDefs.map((chapter, index) => {
    const subset = findingsForChapter(project, lang, chapter);
    const citation = subset[0]?.citation || currentCitation(project, chapterAnchor[chapter.id]);
    return `<article class="analysis-card"><span>M${chapter.number}</span><h3>${esc(chapter.title[lang])}</h3><p>${esc(subset[0]?.plain || text(project, lang, "lesson"))}</p><a href="${esc(rel(file, path.join(siteRoot, "projects", project.slug, lang, "tutorial", `ch${chapter.number}-${chapter.id}.html`)))}">${lang === "zh" ? "进入本章" : "Open chapter"} →</a><small>${esc(citation.path)}:${citation.start}–${citation.end} · ${subset.length} ${lang === "zh" ? "条证据" : "evidence items"}</small></article>`;
  }).join("");
  const diagramRoot = path.join(siteRoot, "projects", project.slug, lang, "diagrams");
  const diagrams = [
    ["architecture", lang === "zh" ? "分层架构与所有权" : "Layered architecture", lang === "zh" ? "入口、插件树、主循环、工具和状态事实源" : "Entry, plugin tree, loop, tools, and durable facts"],
    ["sequence", lang === "zh" ? "单轮执行时序" : "Turn sequence", lang === "zh" ? "从 inbox 到模型、工具、回写与恢复" : "Inbox to model, tools, receipts, and recovery"],
    ["capability", lang === "zh" ? "能力与风险边界" : "Capability and risk map", lang === "zh" ? "哪些是能力、哪些是策略、哪些是隔离" : "Capability, policy, and enforcement layers"],
  ].map(([type, title, description], mapIndex) => `<figure class="diagram-figure map-figure map-${type}" data-map-index="${mapIndex + 1}"><figcaption><span>FIGURE ${String(mapIndex + 1).padStart(2, "0")} · ${esc(type.toUpperCase())}</span><b>${esc(title)}</b><a href="${esc(rel(file, path.join(diagramRoot, `${type}.html`)))}">${lang === "zh" ? "打开交互图" : "Open interactive map"} ↗</a></figcaption><p>${esc(description)}</p><iframe src="${esc(rel(file, path.join(diagramRoot, `${type}.html`)))}" title="${esc(title)}" loading="lazy"></iframe></figure>`).join("");
  const legacyReference = project.legacy ? `<section class="prose reference-note"><div class="section-head"><span>HISTORICAL REFERENCE</span><h2>${lang === "zh" ? "旧版长报告与 Archify 图仍可逐页复核" : "The prior long report and Archify maps remain available"}</h2></div><p>${lang === "zh" ? "本页把旧版 finding 账本重新拆成可导航章节，同时保留旧版的完整报告和交互图作为历史参照。历史 finding 的提交号会在每条卡片中显式标注，避免把旧证据冒充当前 HEAD。" : "This page reshapes the prior finding ledger into navigable chapters while preserving the old full report and interactive maps. Historical commit ids are shown on each card so old evidence is not mistaken for the current HEAD."}</p><a class="legacy-report-link" href="${esc(rel(file, path.join(siteRoot, "legacy", "reports", `${project.slug}.html`)))}">${lang === "zh" ? "打开旧版完整报告" : "Open historical full report"} ↗</a></section>` : "";
  const body = `${legacyReference}<section class="report-hero-v2"><div class="hero-topline"><span>CODING AGENT HARNESS · SOURCE AUDIT</span><span>${esc(project.commit.slice(0, 12))}</span></div><div class="hero-grid"><div><div class="hero-index">${esc(project.name.slice(0, 2).toUpperCase())}</div><h1>${esc(project.name)}<br><em>${lang === "zh" ? "从源码看 Harness" : "Harness, from source"}</em></h1><p class="hero-thesis">${esc(text(project, lang, "thesis"))}</p><div class="hero-tags"><span>${esc(project.language)}</span><span>${esc(project.kind)}</span><span>${esc(project.branch)}</span></div></div><aside class="snapshot-card"><dl><div><dt>Repository</dt><dd>${esc(project.repo)}</dd></div><div><dt>Commit</dt><dd><code>${esc(project.commit)}</code></dd></div><div><dt>Findings</dt><dd>${findings.length}</dd></div><div><dt>Citations</dt><dd>${citations.size}</dd></div><div><dt>Coverage</dt><dd>${coverage.length} ${lang === "zh" ? "维度" : "dimensions"}</dd></div></dl></aside></div><div class="hero-actions"><a href="${esc(`https://github.com/${project.repo}/tree/${project.commit}`)}" target="_blank" rel="noreferrer">${lang === "zh" ? "固定源码快照" : "Pinned source snapshot"} ↗</a><a href="${esc(rel(file, path.join(siteRoot, "projects", project.slug, lang, "tutorial", "index.html")))}">${lang === "zh" ? "进入章节教程" : "Enter chapter course"} →</a><a href="${esc(rel(file, path.join(siteRoot, `${lang}/index.html`)))}#matrix">${lang === "zh" ? "查看总览矩阵" : "View matrix"}</a></div></section><section class="chapter executive-v2"><div class="chapter-kicker">EXECUTIVE READING</div><h2>${lang === "zh" ? "先给结论，再进入源码" : "Thesis before source"}</h2><div class="executive-grid"><div class="thesis-card"><span>${lang === "zh" ? "核心机制" : "CONTROL LOOP"}</span><p>${esc(text(project, lang, "lesson"))}</p></div><div class="thesis-card"><span>${lang === "zh" ? "证据规模" : "EVIDENCE"}</span><p>${findings.length} ${lang === "zh" ? "条 finding / " : "findings / "}${citations.size} ${lang === "zh" ? "处引用" : "citations"}</p></div><div class="thesis-card risk-tone"><span>${lang === "zh" ? "主要边界" : "BOUNDARY"}</span><p>${esc(project[lang].limits[0] || "Review the limitation cards below.")}</p></div><div class="thesis-card"><span>${lang === "zh" ? "适用建设" : "BUILDING FIT"}</span><p>${esc(project[lang].strengths[0] || text(project, lang, "lesson"))}</p></div></div><div class="pros-cons"><div><h3>${lang === "zh" ? "值得借鉴" : "BORROW"}</h3><ul>${project[lang].strengths.map((item) => `<li>${esc(item)}</li>`).join("")}</ul></div><div><h3>${lang === "zh" ? "需要警惕" : "WATCH"}</h3><ul>${project[lang].limits.map((item) => `<li>${esc(item)}</li>`).join("")}</ul></div><div><h3>${lang === "zh" ? "阅读方式" : "READING MODE"}</h3><ul><li>${lang === "zh" ? "先看固定提交，再看调用链" : "Pin the commit before tracing the call chain"}</li><li>${lang === "zh" ? "事实、推断、风险分栏" : "Separate facts, inferences, and risks"}</li><li>${lang === "zh" ? "每条 finding 可回到源码" : "Every finding returns to code"}</li></ul></div></div></section><section class="chapter methodology"><div class="chapter-kicker">00 · METHOD</div><h2>${lang === "zh" ? "研究口径：不是 README 摘要" : "Method: not a README summary"}</h2><div class="method-grid"><div><span>README POLICY</span><p>${lang === "zh" ? "README 只定位入口和产品命名；实现结论必须回到运行时代码、契约或测试。" : "README locates entrypoints and naming; implementation claims return to runtime code, contracts, or tests."}</p></div><div><span>FACT POLICY</span><p>${lang === "zh" ? "L1 运行代码优先，L2 类型/事件契约补足，L3/L4 交叉验证，L5 推断单独标记。" : "L1 runtime code leads; L2 contracts and L3/L4 evidence cross-check; L5 inferences stay explicit."}</p></div><div><span>SNAPSHOT</span><p>${esc(project.repo)} @ ${esc(project.commit)} · ${findings.length} findings · ${citations.size} citations</p></div></div></section><section class="chapter diagrams-v2"><div class="chapter-kicker">01 · TECHNICAL MAPS</div><h2>${lang === "zh" ? "三张逐张展开的源码证据图" : "Three source-backed maps, one at a time"}</h2><p class="chapter-deck">${lang === "zh" ? "每张图独占一段，节点来自 finding 的源码路径；点击节点可查看事实、固定提交和行号，搜索、缩放、主题切换均在图内完成。" : "Each map gets its own full-width panel. Nodes are derived from finding source paths; click a node for its fact, pinned commit, and line range."}</p><div class="diagram-stack">${diagrams}</div></section><section class="chapter coverage-v2"><div class="chapter-kicker">02 · COVERAGE MAP</div><h2>${lang === "zh" ? "覆盖维度与证据等级" : "Coverage and evidence levels"}</h2><div class="coverage-table">${coverageRows}</div></section><section class="chapter course-v2"><div class="chapter-kicker">03 · COURSE ROUTE</div><h2>${lang === "zh" ? "十章教程不是摘要，而是源码阅读路线" : "Ten chapters are a source-reading route, not summaries"}</h2><p class="chapter-deck">${lang === "zh" ? "每章会从本项目的多个 finding 中挑出证据，先讲问题，再给比喻，然后把实现、边界、图谱和练习串起来。" : "Each chapter selects multiple project findings, then connects the question, analogy, implementation, boundary, map, and exercise."}</p><div class="analysis-grid">${chapterCards}</div></section>${findingSections}<footer class="report-footer"><span>${esc(project.repo)} · ${esc(project.commit)}</span><nav><a href="${esc(rel(file, path.join(siteRoot, `${lang}/index.html`)))}">${lang === "zh" ? "回到总览" : "Back to atlas"}</a><a href="${esc(rel(file, path.join(siteRoot, "projects", project.slug, lang, "tutorial", "index.html")))}">${lang === "zh" ? "进入教程" : "Course"}</a></nav></footer>`;
  const enrichedBody = body.replace('<section class="chapter diagrams-v2">', `${implementationInventory(project, lang)}${conceptAudit(project, lang)}<section class="chapter diagrams-v2">`);
  return pageShell({ title: `${project.name} · ${lang === "zh" ? "深度源码分析" : "Deep source analysis"}`, description: text(project, lang, "thesis"), lang, project, current: "analysis", body: enrichedBody });
}

function chapterPage(project, lang, chapter, index) {
  const file = path.join(siteRoot, "projects", project.slug, lang, "tutorial", `ch${chapter.number}-${chapter.id}.html`);
  const citation = findCitation(project, chapterAnchor[chapter.id]);
  const next = chapterDefs[index + 1];
  const prev = chapterDefs[index - 1];
  const sourceLinkRelative = sourceUrl(project, citation.path, citation.start, citation.end);
  const diagramName = index % 3 === 0 ? "architecture" : index % 3 === 1 ? "sequence" : "capability";
  const diagramFile = path.join(siteRoot, "projects", project.slug, lang, "diagrams", `${diagramName}.html`);
  const exercise = lang === "zh"
    ? `打开上面的源码摘录，先遮住“白话解释”，回答三个问题：谁创建了状态？谁能改变它？失败时有没有明确回执或恢复入口？最后点击 GitHub 行号核对你的判断。`
    : `Hide the plain-language explanation and answer three questions from the excerpt: who creates the state, who can change it, and what receipt or recovery path exists on failure? Then verify your answer at the GitHub line link.`;
  const body = `<section class="chapter-hero"><p class="eyebrow">M${chapter.number} · ${esc(project.name)} · ${esc(project.commit.slice(0, 12))}</p><h1>${esc(chapter.title[lang])}</h1><p class="lede">${esc(chapter.question[lang])}</p><div class="chapter-meta"><span>${lang === "zh" ? `第 ${index + 1} / ${chapterDefs.length} 章` : `Chapter ${index + 1} / ${chapterDefs.length}`}</span><span>${esc(project.language)}</span><span>${esc(project.branch)}</span></div></section><section class="lesson prose"><div class="lesson-route"><span>${lang === "zh" ? "本章路线" : "ROUTE"}</span><b>${lang === "zh" ? "问题" : "Question"}</b><i>→</i><b>${lang === "zh" ? "比喻" : "Analogy"}</b><i>→</i><b>${lang === "zh" ? "源码" : "Source"}</b><i>→</i><b>${lang === "zh" ? "练习" : "Exercise"}</b></div><div class="callout"><b>${lang === "zh" ? "先用一个生活比喻" : "Start with a concrete analogy"}</b><p>${esc(analogies[lang][chapter.id])}</p></div><h2>${lang === "zh" ? "先回答本章问题" : "Answer the chapter question first"}</h2><p>${esc(chapter.question[lang])} ${esc(text(project, lang, "lesson"))}</p><h2>${lang === "zh" ? "再看这段源码" : "Now read the source"}</h2><div class="source-card"><div><span>${esc(citation.path)} · L${citation.start}–${citation.end}</span><a href="${esc(sourceLinkRelative)}" target="_blank" rel="noreferrer">${lang === "zh" ? "打开固定提交" : "Open pinned commit"} ↗</a></div><pre><code>${esc(citation.snippet)}</code></pre></div><h2>${lang === "zh" ? "翻译成小白能懂的话" : "Translate it into plain language"}</h2><p>${esc(lang === "zh" ? `这段代码不是“顺便做了点事”，它在本章控制面上承担一个明确职责。阅读时先找输入、状态变化、外部副作用和错误出口，再把它放回 ${project.name} 的完整任务链。` : `This code is not incidental. It owns a specific control-plane responsibility. Look for inputs, state changes, external effects, and error exits, then place it back into ${project.name}'s task chain.`)}</p><div class="flow-strip"><span>${lang === "zh" ? "输入" : "Input"}</span><i>→</i><span>${lang === "zh" ? "规则 / 状态" : "Rules / state"}</span><i>→</i><span>${lang === "zh" ? "动作" : "Action"}</span><i>→</i><span>${lang === "zh" ? "回执" : "Receipt"}</span></div><h2>${lang === "zh" ? "把它放进图里" : "Place it on the map"}</h2><iframe class="diagram-frame" src="${esc(rel(file, diagramFile))}" title="${esc(project.name)} ${esc(diagramName)}" loading="lazy"></iframe><h2>${lang === "zh" ? "小练习：不要只会复述" : "Exercise: do more than repeat"}</h2><div class="exercise"><p>${esc(exercise)}</p><details><summary>${lang === "zh" ? "查看提示" : "Show hint"}</summary><p>${esc(lang === "zh" ? `提示：如果源码里只有 prompt 或 UI 文案，没有状态、权限或执行代码，不要把它写成强保证。` : `Hint: if the excerpt only contains prompt or UI copy and no state, permission, or execution code, do not describe it as a hard guarantee.`)}</p></details></div></section><footer class="chapter-footer"><a href="${prev ? esc(`ch${prev.number}-${prev.id}.html`) : esc("index.html")}">← ${prev ? esc(prev.title[lang]) : lang === "zh" ? "课程目录" : "Course index"}</a><a href="${next ? esc(`ch${next.number}-${next.id}.html`) : esc("index.html")}">${next ? esc(next.title[lang]) : lang === "zh" ? "回到课程目录" : "Course index"} →</a></footer>`;
  return pageShell({ title: `${project.name} · M${chapter.number} · ${chapter.title[lang]}`, description: chapter.question[lang], lang, project, current: `ch${chapter.number}-${chapter.id}`, body });
}

function chapterDeepDive(project, lang, chapter, findings) {
  const labels = lang === "zh"
    ? [["ENTRY", "入口 / 注册", "先定位谁创建这次运行、注册了哪些能力，以及输入怎样进入状态。"], ["STATE", "状态 / 投影", "再找会话、上下文、队列或 projection 的所有权；状态不是 UI 文案。"], ["EFFECT", "操作 / 事务", "把模型输出、工具执行、权限检查和外部副作用拆开，确认有没有回执。"], ["RECOVERY", "失败 / 恢复", "最后追踪重试、压缩、取消、回滚、持久化或人工接管出口。"]]
    : [["ENTRY", "Entry / registration", "Locate who creates the run, registers capabilities, and turns input into state."], ["STATE", "State / projection", "Find ownership of sessions, context, queues, or projections; UI copy is not state."], ["EFFECT", "Operation / transaction", "Separate model output, tool effects, policy checks, and receipts."], ["RECOVERY", "Failure / recovery", "Trace retry, compaction, cancellation, rollback, persistence, or human takeover."]];
  const cards = labels.map(([kicker, title, copy], index) => {
    const finding = findings[index] || findings[findings.length - 1];
    const citation = finding?.citation;
    return `<article class="mechanism-card"><span>${kicker}</span><h3>${title}</h3><p>${esc(copy)}</p><blockquote>${esc(finding?.fact || finding?.plain || text(project, lang, "lesson"))}</blockquote>${citation ? `<a href="${esc(sourceUrlAtCommit(project, citation.path, citation.start, citation.end, citation.commit || project.commit))}" target="_blank" rel="noreferrer">${esc(citation.path)}:${citation.start}–${citation.end} ↗</a>` : ""}</article>`;
  }).join("");
  return `<section class="mechanism-panel"><div class="mechanism-kicker">${esc(chapter.id.toUpperCase())} · ${lang === "zh" ? "四个实现问题" : "FOUR IMPLEMENTATION QUESTIONS"}</div><div class="mechanism-grid">${cards}</div></section>`;
}

function richChapterPage(project, lang, chapter, index) {
  const file = path.join(siteRoot, "projects", project.slug, lang, "tutorial", `ch${chapter.number}-${chapter.id}.html`);
  const next = chapterDefs[index + 1];
  const prev = chapterDefs[index - 1];
  const findings = findingsForChapter(project, lang, chapter);
  const diagramName = index % 3 === 0 ? "architecture" : index % 3 === 1 ? "sequence" : "capability";
  const diagramFile = path.join(siteRoot, "projects", project.slug, lang, "diagrams", `${diagramName}.html`);
  const evidenceBoard = findings.map((finding, findingIndex) => findingCard(project, lang, finding, findingIndex, true)).join("");
  const exercise = lang === "zh"
    ? "把本章 finding 卡片遮住白话解释，只看源码：谁创建状态？谁能改变状态？副作用在哪里发生？失败时写入了什么回执？最后点开行号链接，确认你的回答没有超出固定提交。"
    : "Hide the plain-language blocks and read only the code: who creates state, who can mutate it, where do side effects occur, and what receipt is written on failure? Verify the answer against the pinned line link.";
  const body = `<section class="chapter-hero"><p class="eyebrow">M${chapter.number} · ${esc(project.name)} · ${esc(project.commit.slice(0, 12))}</p><h1>${esc(chapter.title[lang])}</h1><p class="lede">${esc(chapter.question[lang])}</p><div class="chapter-meta"><span>${lang === "zh" ? `第 ${index + 1} / ${chapterDefs.length} 章` : `Chapter ${index + 1} / ${chapterDefs.length}`}</span><span>${findings.length} ${lang === "zh" ? "条源码 finding" : "source findings"}</span><span>${esc(project.branch)}</span></div></section><section class="lesson prose"><div class="lesson-route"><span>${lang === "zh" ? "本章路线" : "ROUTE"}</span><b>${lang === "zh" ? "问题" : "Question"}</b><i>→</i><b>${lang === "zh" ? "比喻" : "Analogy"}</b><i>→</i><b>${lang === "zh" ? "多条源码证据" : "Evidence board"}</b><i>→</i><b>${lang === "zh" ? "四问" : "Four questions"}</b><i>→</i><b>${lang === "zh" ? "源码目录" : "Source map"}</b><i>→</i><b>${lang === "zh" ? "交互图" : "Map"}</b><i>→</i><b>${lang === "zh" ? "练习" : "Exercise"}</b></div><div class="callout"><b>${lang === "zh" ? "先用一个生活比喻" : "Start with a concrete analogy"}</b><p>${esc(analogies[lang][chapter.id])}</p></div><h2>${lang === "zh" ? "先回答本章问题" : "Answer the chapter question first"}</h2><p>${esc(chapter.question[lang])} ${esc(text(project, lang, "lesson"))}</p><h2>${lang === "zh" ? `本章证据板：${findings.length} 条 finding` : `Evidence board: ${findings.length} findings`}</h2><p>${lang === "zh" ? "不要把一段代码当成整个系统；下面每张卡分别说明事实、白话、工程影响、边界和可点击的固定源码。" : "Do not treat one code block as the whole system. Each card separates fact, plain language, engineering impact, caveat, and a clickable pinned source."}</p><div class="finding-stack">${evidenceBoard}</div><h2>${lang === "zh" ? "四问：从代码追到执行语义" : "Four questions: from code to execution semantics"}</h2>${chapterDeepDive(project, lang, chapter, findings)}<h2>${lang === "zh" ? "本章源码地图：不要只读一个文件" : "Source map: do not stop at one file"}</h2>${sourceReadingMap(project, lang, chapter)}<h2>${lang === "zh" ? "把证据放回全链路" : "Place the evidence on the full chain"}</h2><div class="flow-strip"><span>${lang === "zh" ? "输入 / 事件" : "Input / event"}</span><i>→</i><span>${lang === "zh" ? "规则 / 状态" : "Rules / state"}</span><i>→</i><span>${lang === "zh" ? "模型 / 工具" : "Model / tool"}</span><i>→</i><span>${lang === "zh" ? "回执 / 持久化" : "Receipt / persistence"}</span><i>→</i><span>${lang === "zh" ? "恢复 / 下一步" : "Recovery / next"}</span></div><iframe class="diagram-frame diagram-frame-rich" src="${esc(rel(file, diagramFile))}" title="${esc(project.name)} ${esc(diagramName)}" loading="lazy"></iframe><h2>${lang === "zh" ? "小白练习：不要只会复述" : "Exercise: do more than repeat"}</h2><div class="exercise"><p>${esc(exercise)}</p><details><summary>${lang === "zh" ? "查看提示" : "Show hint"}</summary><ul><li>${lang === "zh" ? "先找输入和状态，不要先找函数名。" : "Find inputs and state before function names."}</li><li>${lang === "zh" ? "把 policy / approval / sandbox 分开写。" : "Keep policy, approval, and sandbox separate."}</li><li>${lang === "zh" ? "如果引用来自历史账本，记得查看卡片里的历史 commit 标识。" : "If a claim comes from a historical ledger, check the historical commit marker on the card."}</li></ul></details></div></section><footer class="chapter-footer"><a href="${prev ? esc(`ch${prev.number}-${prev.id}.html`) : esc("index.html")}">← ${prev ? esc(prev.title[lang]) : lang === "zh" ? "课程目录" : "Course index"}</a><a href="${next ? esc(`ch${next.number}-${next.id}.html`) : esc("index.html")}">${next ? esc(next.title[lang]) : lang === "zh" ? "回到课程目录" : "Course index"} →</a></footer>`;
  return pageShell({ title: `${project.name} · M${chapter.number} · ${chapter.title[lang]}`, description: chapter.question[lang], lang, project, current: `ch${chapter.number}-${chapter.id}`, body });
}

function tutorialIndex(project, lang) {
  const file = path.join(siteRoot, "projects", project.slug, lang, "tutorial", "index.html");
  const cards = chapterDefs.map((chapter) => `<a class="chapter-card" href="ch${chapter.number}-${chapter.id}.html"><span>M${chapter.number}</span><div><h3>${esc(chapter.title[lang])}</h3><p>${esc(chapter.question[lang])}</p><small>${lang === "zh" ? "进入本章" : "Open chapter"} →</small></div></a>`).join("");
  const body = `<section class="course-hero"><p class="eyebrow">${esc(project.name)} · ${lang === "zh" ? "小白源码教程" : "BEGINNER SOURCE COURSE"}</p><h1>${lang === "zh" ? "从第一张地图读到最后一个证据" : "From the first map to the last receipt"}</h1><p class="lede">${esc(text(project, lang, "thesis"))}</p><div class="version-line"><span>${esc(project.repo)}</span><code>${esc(project.branch)} @ ${esc(project.commit)}</code><a href="https://github.com/${esc(project.repo)}/tree/${esc(project.commit)}" target="_blank" rel="noreferrer">${lang === "zh" ? "打开固定源码" : "Open pinned source"} ↗</a><a href="../analysis.html">${lang === "zh" ? "先看单页技术分析" : "Read the single-page analysis"} ↗</a></div></section><section class="prose course-intro"><div class="section-head"><span>COURSE CONTRACT</span><h2>${lang === "zh" ? "每章都按同一套阅读动作" : "Every chapter follows the same reading moves"}</h2></div><p>${lang === "zh" ? "先提出一个普通人会问的问题，再给生活比喻，然后展示固定提交的真实代码、架构/时序/能力图和一个练习。你可以把章节当作独立页面读，也可以用左侧目录连续学习。" : "Start with a beginner's question, use a concrete analogy, inspect a real code range from the pinned commit, view an architecture/sequence/capability map, and finish with an exercise. Each chapter stands alone or forms a continuous course."}</p><div class="course-stats"><b>10</b><span>${lang === "zh" ? "独立章节" : "chapters"}</span><b>${esc(project.commit.slice(0, 8))}</b><span>${lang === "zh" ? "固定源码" : "pinned source"}</span></div></section><section class="chapter-list prose"><div class="section-head"><span>01—10</span><h2>${lang === "zh" ? "章节目录" : "Chapter index"}</h2></div><div class="chapter-grid">${cards}</div></section><footer class="site-footer"><a href="../analysis.html">← ${lang === "zh" ? "技术分析单页" : "Technical analysis"}</a><a href="${esc(rel(file, path.join(siteRoot, "index.html")))}">${lang === "zh" ? "回到总览" : "Back to atlas"} →</a></footer>`;
  return pageShell({ title: `${project.name} · ${lang === "zh" ? "小白教程目录" : "Beginner course"}`, description: text(project, lang, "thesis"), lang, project, current: null, body });
}

function matrixDimensionText(project, lang, dimension, fallback) {
  const finding = projectFindings(project, lang).find((item) => item.dimension === dimension);
  return finding?.plain || finding?.fact || dimensionNotes[project.slug]?.[lang]?.[dimension] || fallback;
}

const scenarioDefs = [
  { id: "local-secure", zh: "本地优先 / 安全编码", en: "Local-first secure coding", hintZh: "优先看真实沙箱、权限边界、审批与恢复", hintEn: "Prioritise real sandboxing, permission boundaries, approval, and recovery", dims: ["execution", "security", "recovery"], words: ["sandbox", "permission", "local", "desktop", "approval"] },
  { id: "enterprise-mcp", zh: "企业 MCP / 插件平台", en: "Enterprise MCP / plugin platform", hintZh: "需要连接器生命周期、配置治理和可审计扩展", hintEn: "Need connector lifecycle, configuration governance, and auditable extensions", dims: ["connectors", "instructions", "security"], words: ["mcp", "plugin", "connector", "oauth", "skill"] },
  { id: "long-repo", zh: "长仓库 / 长上下文迁移", en: "Long-repo / long-context migration", hintZh: "看检索、压缩、预算、快照和重建性", hintEn: "Look for retrieval, compaction, budgets, snapshots, and reconstruction", dims: ["modelContext", "observability", "recovery"], words: ["context", "memory", "compact", "repo", "retrieval", "token"] },
  { id: "ci-release", zh: "Headless CI / 发布流水线", en: "Headless CI / release pipeline", hintZh: "看队列、幂等、trace、失败回执和无人值守入口", hintEn: "Look for queues, idempotence, traces, failure receipts, and headless entry", dims: ["loop", "observability", "execution"], words: ["ci", "headless", "job", "queue", "trace", "workflow"] },
  { id: "multi-agent", zh: "多 Agent / 并行协作", en: "Multi-agent / parallel collaboration", hintZh: "看子会话、深度、预算、取消、合并和交付物", hintEn: "Look for child sessions, depth, budgets, cancellation, merge, and artifacts", dims: ["collaboration", "loop", "observability"], words: ["agent", "workforce", "sub-agent", "parallel", "swarm", "task"] },
  { id: "ui-desktop", zh: "桌面 UI / 可视化工作台", en: "Desktop UI / visual workbench", hintZh: "看 UI 状态投影、会话路由、浏览器边界和可观测性", hintEn: "Look for UI projections, session routing, browser boundaries, and observability", dims: ["architecture", "connectors", "observability"], words: ["desktop", "electron", "ui", "browser", "workspace"] },
  { id: "minimal-core", zh: "轻量 CLI / 个人开发", en: "Minimal CLI / individual developer", hintZh: "看入口简单度、工具注册成本和可替换模型层", hintEn: "Look for entry simplicity, tool registration cost, and replaceable model seams", dims: ["architecture", "loop", "tools"], words: ["cli", "terminal", "simple", "minimal", "pair"] }
];

function scenarioScore(project, lang, scenario) {
  const findings = projectFindings(project, lang);
  const dims = new Set(findings.map((finding) => finding.dimension));
  const blob = `${project.kind} ${project[lang]?.thesis || ""} ${(project[lang]?.strengths || []).join(" ")} ${(project[lang]?.limits || []).join(" ")}`.toLowerCase();
  let score = 2.35;
  for (const dimension of scenario.dims) if (dims.has(dimension)) score += 0.42;
  for (const word of scenario.words) if (blob.includes(word.toLowerCase())) score += 0.22;
  if (scenario.id === "local-secure" && /sandbox|permission|approval|landlock|seatbelt/.test(blob)) score += 0.55;
  if (scenario.id === "multi-agent" && /sub.?agent|workforce|swarm|parallel|delegat/.test(blob)) score += 0.6;
  if (scenario.id === "ui-desktop" && /desktop|electron|browser|workspace|ui/.test(blob)) score += 0.6;
  if (scenario.id === "long-repo" && /context|memory|compact|retrieval|repo|token/.test(blob)) score += 0.55;
  if (scenario.id === "ci-release" && /ci|headless|job|queue|workflow|trace/.test(blob)) score += 0.52;
  if (scenario.id === "enterprise-mcp" && /mcp|plugin|connector|oauth|skill/.test(blob)) score += 0.5;
  const penalty = (project[lang]?.limits || []).join(" ").toLowerCase();
  if (scenario.id === "local-secure" && /no sandbox|depends on environment|not.*sandbox|安全边界.*配置/.test(penalty)) score -= 0.45;
  if (scenario.id === "multi-agent" && /single|没有.*子|not.*multi|单 agent/.test(penalty)) score -= 0.3;
  if (scenario.id === "ci-release" && /desktop only|ui only|人工/.test(penalty)) score -= 0.3;
  return Math.max(1, Math.min(5, Math.round(score * 10) / 10));
}

function scenarioComparison(projectsForPage, lang) {
  const score = (project, scenario) => scenarioScore(project, lang, scenario);
  const rows = scenarioDefs.map((scenario) => {
    const ranked = projectsForPage.map((project) => ({ project, value: score(project, scenario) })).sort((a, b) => b.value - a.value || a.project.name.localeCompare(b.project.name));
    const cells = ranked.length ? projectsForPage.map((project) => {
      const value = score(project, scenario);
      const level = Math.max(1, Math.min(5, Math.round(value)));
      return `<td class="score-${level}" title="${esc(`${project.name}: ${value}/5`)}"><span>${value.toFixed(1)}</span></td>`;
    }).join("") : "";
    const winners = ranked.slice(0, 3).map(({ project, value }, index) => `<li><b>${index + 1}</b><a href="../projects/${project.slug}/${lang}/analysis.html">${esc(project.name)}</a><span>${value.toFixed(1)} / 5</span></li>`).join("");
    return { scenario, ranked, cells, winners };
  });
  const head = projectsForPage.map((project) => `<th scope="col"><span>${esc(project.name)}</span></th>`).join("");
  const heatmap = rows.map(({ scenario, cells }) => `<tr><th scope="row"><b>${esc(scenario[lang])}</b><small>${esc(scenario[lang === "zh" ? "hintZh" : "hintEn"])}</small></th>${cells}</tr>`).join("");
  const bars = rows.map(({ scenario, winners }) => `<article class="scenario-card"><header><span>${esc(scenario.id.toUpperCase())}</span><h3>${esc(scenario[lang])}</h3><p>${esc(scenario[lang === "zh" ? "hintZh" : "hintEn"])}</p></header><ol>${winners}</ol></article>`).join("");
  const legend = lang === "zh" ? "评分是源码证据覆盖、项目定位、优劣势文本与可复核 finding 的启发式合成，不是跑分；先用它筛选路线，再进入项目页看行号。" : "Scores are a heuristic synthesis of evidence coverage, project positioning, strengths, limits, and findings—not a benchmark. Use them to narrow a route, then inspect line-level evidence.";
  return `<section class="prose scenario-panel" id="scenarios"><div class="section-head"><span>02 · SCENARIO EVALUATION</span><h2>${lang === "zh" ? "不要问谁最好：先问哪条路线适合你的场景" : "Do not ask which is best; ask which route fits the scene"}</h2><p class="atlas-matrix-intro">${esc(legend)}</p></div><div class="scenario-legend"><span class="score-1">1 · 弱</span><span class="score-2">2 · 有限</span><span class="score-3">3 · 可用</span><span class="score-4">4 · 强</span><span class="score-5">5 · 重点候选</span></div><div class="scenario-wrap" tabindex="0"><table class="scenario-table"><thead><tr><th scope="col">${lang === "zh" ? "场景 / Agent" : "Scenario / Agent"}</th>${head}</tr></thead><tbody>${heatmap}</tbody></table></div><div class="scenario-cards">${bars}</div></section>`;
}

function indexPageDetailed(lang) {
  const projectCount = projects.length;
  const chapterCount = projects.length * chapterDefs.length;
  const mapCount = projects.length * 3;
  const cards = projects.map((p, i) => {
    const count = projectFindings(p, lang).length;
    return "<article class=\"atlas-card\"><div class=\"atlas-num\">" + String(i + 1).padStart(2, "0") + "</div><div><p class=\"eyebrow\">" + esc(p.kind) + "</p><h2>" + esc(p.name) + "</h2><p>" + esc(text(p, lang, "thesis")) + "</p><div class=\"atlas-actions\"><a href=\"../projects/" + p.slug + "/" + lang + "/analysis.html\">" + (lang === "zh" ? "技术分析" : "Analysis") + " ↗</a><a href=\"../projects/" + p.slug + "/" + lang + "/tutorial/index.html\">" + (lang === "zh" ? "小白教程" : "Tutorial") + " ↗</a><span>" + count + " findings · " + esc(p.commit.slice(0, 12)) + "</span></div></div></article>";
  }).join("");
  const fallback = lang === "zh" ? "该维度的源码 finding 已在项目单页展开。" : "The project page expands this dimension with source findings.";
  const matrix = projects.map((p) => {
    const value = (dimension) => matrixDimensionText(p, lang, dimension, fallback);
    return "<tr><th scope=\"row\"><a href=\"../projects/" + p.slug + "/" + lang + "/analysis.html\">" + esc(p.name) + "</a><small>" + esc(p.kind) + " · " + esc(p.language) + "</small></th><td>" + esc(value("loop")) + "</td><td>" + esc(value("modelContext")) + "</td><td>" + esc(value("tools")) + "</td><td>" + esc(value("execution")) + "</td><td>" + esc(value("security")) + "</td><td>" + esc(value("connectors")) + "</td><td>" + esc(value("collaboration")) + "</td><td>" + esc(value("observability")) + "</td><td><strong>" + esc(p[lang].strengths[0]) + "</strong><br>" + esc(p[lang].strengths[1]) + "</td><td>" + esc(p[lang].limits[0]) + "<br>" + esc(p[lang].limits[1] || "") + "</td><td>" + esc(p.branch) + "<br><code>" + esc(p.commit.slice(0, 12)) + "</code><br><small>" + esc(p.date.slice(0, 10)) + "</small></td></tr>";
  }).join("");
  const synthesis = lang === "zh" ? [
    ["01 · LOOP", "循环决定上限", "真正拉开差距的不是工具数量，而是 turn/step、取消、重试、回执和下一步决策有没有成为显式状态机。"],
    ["02 · CONTEXT", "上下文是工作台，不是 prompt 字符串", "成熟实现会把检索、压缩、预算、快照、持久化和可重建性拆开；上下文越长，越需要事实源和淘汰策略。"],
    ["03 · BOUNDARY", "能力、策略、隔离必须分栏", "MCP/插件是能力入口，approval/permission 是策略，sandbox/runner 才是执行隔离；把三者混在一起会制造虚假的安全感。"],
    ["04 · EVIDENCE", "版本锁定决定结论能否复核", "每个单页都带 branch、commit、日期、文件和行号；历史账本与当前刷新源码分开标识，不把旧 finding 冒充 HEAD。"],
    ["05 · COLLAB", "子 Agent 要有交付物和预算", "委派不是多开几个模型，而是独立 session、深度上限、取消、汇报、合并与失败语义。"],
    ["06 · RECOVERY", "恢复路径比 happy path 更能说明工程成熟度", "事件日志、checkpoint、replay、幂等、压缩和回放测试决定系统断电、超时或工具失败后能不能接着做。"]
  ] : [
    ["01 · LOOP", "The loop sets the ceiling", "The differentiator is not tool count but explicit turn/step state, cancellation, retries, receipts, and next-step decisions."],
    ["02 · CONTEXT", "Context is a workbench, not a string", "Mature systems separate retrieval, compaction, budgets, snapshots, persistence, and reconstructability."],
    ["03 · BOUNDARY", "Capability, policy, and isolation are different", "MCP/plugins expose capability, approval/permission is policy, and sandbox/runner is enforcement."],
    ["04 · EVIDENCE", "Pinned versions make claims replayable", "Every page records branch, commit, date, file, and line; historical ledgers are never presented as current HEAD."],
    ["05 · COLLAB", "Sub-agents need an artifact and a budget", "Delegation requires an independent session, depth limit, cancellation, reporting, merge, and failure semantics."],
    ["06 · RECOVERY", "Recovery reveals engineering maturity", "Logs, checkpoints, replay, idempotence, compaction, and failure tests define whether work can continue after interruption."]
  ];
  const synthesisMarkup = synthesis.map(([key, heading, copy]) => "<article class=\"synthesis-card\"><span>" + esc(key) + "</span><h3>" + esc(heading) + "</h3><p>" + esc(copy) + "</p></article>").join("");
  const blueprintData = lang === "zh" ? [
    ["01", "入口 / 目标", "先确认任务、范围与验收口径"], ["02", "ContextPack", "检索、排序、压缩并固定预算"], ["03", "执行胶囊", "worktree、browser、CI 与凭据隔离"], ["04", "Gate + Trace", "审批、审计、回放和失败出口"], ["05", "协作交付", "子 Agent 只交付可验证 artifact"], ["06", "知识回写", "FAQ、postmortem 与 reuse signals"]
  ] : [
    ["01", "Entry / goal", "Confirm task, scope, and acceptance"], ["02", "ContextPack", "Retrieve, rank, compact, budget"], ["03", "Execution capsule", "Isolate worktree, browser, CI, secrets"], ["04", "Gate + trace", "Approval, audit, replay, failure exits"], ["05", "Collaborative artifact", "Sub-agents return verifiable work"], ["06", "Knowledge writeback", "FAQ, postmortem, reuse signals"]
  ];
  const blueprint = blueprintData.map(([number, heading, copy]) => "<div class=\"blueprint-step\"><span>" + number + "</span><b>" + esc(heading) + "</b><p>" + esc(copy) + "</p></div>").join("");
  const scenarioSection = scenarioComparison(projects, lang);
  const heroCopy = lang === "zh" ? "每个项目都有单页技术分析、10 章小白教程、固定提交源码链接、架构/时序/能力图和源码证据板。所有结论从可定位的源码或明确标注日期的 finding 账本开始，而不是从 README 猜出来。" : "Every project has a single-page analysis, a ten-chapter beginner course, pinned-source links, architecture/sequence/capability maps, and a source evidence board. Claims start from locatable code or an explicitly dated finding ledger, not README guesses.";
  const hero = "<section class=\"atlas-hero\"><p class=\"eyebrow\">OPEN-SOURCE AGENT HARNESS ATLAS · " + (lang === "zh" ? "独立重建版" : "INDEPENDENT REBUILD") + "</p><h1>" + (lang === "zh" ? projectCount + " 个开源 Harness，<em>逐层读懂</em>" : projectCount + " open harnesses,<br><em>read layer by layer</em>") + "</h1><p class=\"lede\">" + heroCopy + "</p><div class=\"atlas-metrics\"><span><b>" + projectCount + "</b>" + (lang === "zh" ? "项目" : "projects") + "</span><span><b>" + chapterCount + "</b>" + (lang === "zh" ? "章节 / 语言" : "chapters / language") + "</span><span><b>" + mapCount + "</b>" + (lang === "zh" ? "交互图" : "interactive maps") + "</span><span><b>HEAD</b>" + (lang === "zh" ? "版本锁定" : "pinned") + "</span></div></section>";
  const method = "<section class=\"prose atlas-intro\"><div class=\"section-head\"><span>METHOD</span><h2>" + (lang === "zh" ? "先看版本，再看调用链" : "Version first, call chain second") + "</h2></div><p>" + (lang === "zh" ? "每次项目更新都可能改变功能，所以本合集把 branch、commit、提交时间和 GitHub 行号写在页面上。教程中的‘它支持什么’必须能回到文件和行号；‘适合我们怎么借鉴’则单独标成迁移判断。横向矩阵用于定位路线，单项目报告用于逐条复核源码。" : "Every update can change behavior, so each page records branch, commit, date, and line ranges. What it supports must return to a file and line; how to borrow it is kept as a separate migration judgment. The matrix locates a route; the project report replays the code.") + "</p></section>";
  const synthesisSection = "<section class=\"prose\"><div class=\"section-head\"><span>00 · SYNTHESIS</span><h2>" + (lang === "zh" ? "先给建设 Harness 的六条共同规律" : "Six cross-project laws for building a harness") + "</h2></div><div class=\"matrix-synthesis\">" + synthesisMarkup + "</div></section>";
  const blueprintSection = "<section class=\"prose\"><div class=\"section-head\"><span>01 · BLUEPRINT</span><h2>" + (lang === "zh" ? "建议自研的需求交付闭环" : "A buildable delivery loop") + "</h2></div><p class=\"atlas-matrix-intro\">" + (lang === "zh" ? "把每个 Agent 放回一条完整交付链：入口不是终点，工具调用不是交付，知识回写才让下一轮变得更快。" : "Place every agent in a complete delivery chain: entry is not the finish, tool calls are not delivery, and knowledge writeback is what makes the next run faster.") + "</p><div class=\"blueprint\">" + blueprint + "</div></section>";
  const projectSection = "<section class=\"atlas-list prose\"><div class=\"section-head\"><span>02 · PROJECTS</span><h2>" + (lang === "zh" ? projectCount + " 条实现路线" : projectCount + " implementation paths") + "</h2></div>" + cards + "</section>";
  const matrixHeaders = lang === "zh" ? ["Agent / 类型", "主循环", "上下文", "工具执行", "执行环境", "安全与沙箱", "连接器 / 插件", "协作 / 子 Agent", "观测 / 持久化", "优势", "劣势 / 边界", "版本 / Commit"] : ["Agent / type", "Main loop", "Context", "Tool execution", "Execution", "Security / sandbox", "Connectors / plugins", "Collab / sub-agents", "Observability / persistence", "Strengths", "Limits", "Version / commit"];
  const matrixHeaderMarkup = matrixHeaders.map((heading) => "<th scope=\"col\">" + heading + "</th>").join("");
  const matrixSection = "<section class=\"matrix prose\" id=\"matrix\"><div class=\"section-head\"><span>03 · IMPLEMENTATION MATRIX</span><h2>" + (lang === "zh" ? "十四种以上实现路径，逐维对照" : "Implementation paths, dimension by dimension") + "</h2><p class=\"atlas-matrix-intro\">" + (lang === "zh" ? "横向滚动查看。每个单元格是该项目对应维度的源码 finding 压缩摘要；点击 Agent 名称进入带固定提交、源码摘录和交互图的完整报告。" : "Scroll horizontally. Each cell compresses a source finding for that dimension; click the agent name for the full report with pinned excerpts and interactive maps.") + "</p></div><div class=\"matrix-wrap\" tabindex=\"0\" aria-label=\"" + (lang === "zh" ? "可横向滚动的实现对照表" : "Horizontally scrollable implementation matrix") + "\"><table class=\"comparison-matrix\"><thead><tr>" + matrixHeaderMarkup + "</tr></thead><tbody>" + matrix + "</tbody></table></div></section>";
  const footer = "<footer class=\"site-footer\"><span>Superkimi/awesome-harness · " + (lang === "zh" ? "独立项目" : "independent project") + "</span><a href=\"" + (lang === "zh" ? "../en/index.html" : "../zh/index.html") + "\">" + (lang === "zh" ? "English version →" : "中文版 →") + "</a></footer>";
  return pageShell({ title: lang === "zh" ? "Awesome Harness · 开源 Agent Harness 教程合集" : "Awesome Harness · Open-source agent harness atlas", description: lang === "zh" ? projectCount + " 个开源 Agent Harness 的双语技术分析与章节教程" : "Bilingual technical analyses and chapter courses for " + projectCount + " open-source agent harnesses", lang, body: hero + method + synthesisSection + blueprintSection + scenarioSection + projectSection + matrixSection + footer, atlasPage: true });
}

function indexPage(lang) {
  const file = path.join(siteRoot, `${lang}/index.html`);
  const projectCount = projects.length;
  const chapterCount = projects.length * chapterDefs.length;
  const mapCount = projects.length * 3;
  const cards = projects.map((p, i) => `<article class="atlas-card"><div class="atlas-num">${String(i + 1).padStart(2, "0")}</div><div><p class="eyebrow">${esc(p.kind)}</p><h2>${esc(p.name)}</h2><p>${esc(text(p, lang, "thesis"))}</p><div class="atlas-actions"><a href="../projects/${p.slug}/${lang}/analysis.html">${lang === "zh" ? "技术分析" : "Analysis"} ↗</a><a href="../projects/${p.slug}/${lang}/tutorial/index.html">${lang === "zh" ? "小白教程" : "Tutorial"} ↗</a><span>${esc(p.commit.slice(0, 12))}</span></div></div></article>`).join("");
  const matrix = projects.map((p) => `<tr><th>${esc(p.name)}<small>${esc(p.language)}</small></th><td>${esc(p[lang].strengths[0])}</td><td>${esc(p[lang].strengths[1])}</td><td>${esc(p[lang].limits[0])}</td><td>${esc(p.branch)}<br><code>${esc(p.commit.slice(0, 12))}</code></td></tr>`).join("");
  const body = `<section class="atlas-hero"><p class="eyebrow">OPEN-SOURCE AGENT HARNESS ATLAS · ${lang === "zh" ? "独立重建版" : "INDEPENDENT REBUILD"}</p><h1>${lang === "zh" ? `${projectCount} 个开源 Harness，<em>逐层读懂</em>` : `${projectCount} open harnesses,<br><em>read layer by layer</em>`}</h1><p class="lede">${lang === "zh" ? "每个项目都有单页技术分析、10 章小白教程、固定提交源码链接、架构/时序/能力图。所有结论从最新拉取的源码开始，而不是从 README 猜出来。" : "Every project has a single-page analysis, a ten-chapter beginner course, pinned-source links, architecture/sequence/capability maps. Claims start from freshly cloned source or a pinned audit ledger, not README guesses."}</p><div class="atlas-metrics"><span><b>${projectCount}</b>${lang === "zh" ? "项目" : "projects"}</span><span><b>${chapterCount}</b>${lang === "zh" ? "章节 / 语言" : "chapters / language"}</span><span><b>${mapCount}</b>${lang === "zh" ? "交互图" : "interactive maps"}</span><span><b>${lang === "zh" ? "HEAD" : "HEAD"}</b>${lang === "zh" ? "版本锁定" : "pinned"}</span></div></section><section class="prose atlas-intro"><div class="section-head"><span>METHOD</span><h2>${lang === "zh" ? "先看版本，再看调用链" : "Version first, call chain second"}</h2></div><p>${lang === "zh" ? "每次项目更新都可能改变功能，所以本合集把 branch、commit、提交时间和 GitHub 行号写在页面上。教程中的“它支持什么”必须能回到文件和行号；“适合我们怎么借鉴”则单独标成迁移判断。" : "Every update can change behavior, so each page records branch, commit, date, and GitHub line ranges. “What it supports” must return to a file and line; “how to borrow the idea” is kept as a separate migration judgment."}</p></section><section class="atlas-list prose"><div class="section-head"><span>01 · PROJECTS</span><h2>${lang === "zh" ? `${projectCount} 条实现路线` : `${projectCount} implementation paths`}</h2></div>${cards}</section><section class="matrix prose"><div class="section-head"><span>02 · MATRIX</span><h2>${lang === "zh" ? "优势与边界横向对照" : "Strengths and boundaries"}</h2></div><div class="matrix-wrap" tabindex="0"><table><thead><tr><th>${lang === "zh" ? "项目" : "Project"}</th><th>${lang === "zh" ? "优势 1" : "Strength 1"}</th><th>${lang === "zh" ? "优势 2" : "Strength 2"}</th><th>${lang === "zh" ? "主要边界" : "Main boundary"}</th><th>${lang === "zh" ? "版本" : "Version"}</th></tr></thead><tbody>${matrix}</tbody></table></div></section><footer class="site-footer"><span>Superkimi/awesome-harness · ${lang === "zh" ? "独立项目" : "independent project"}</span><a href="${lang === "zh" ? "../en/index.html" : "../zh/index.html"}">${lang === "zh" ? "English version →" : "中文版 →"}</a></footer>`;
  return pageShell({ title: lang === "zh" ? "Awesome Harness · 开源 Agent Harness 教程合集" : "Awesome Harness · Open-source agent harness atlas", description: lang === "zh" ? `${projectCount} 个开源 Agent Harness 的双语技术分析与章节教程` : `Bilingual technical analyses and chapter courses for ${projectCount} open-source agent harnesses`, lang, body, atlasPage: true });
}

const css = `:root{--paper:#f5f1e6;--paper2:#ebe3d1;--ink:#18385f;--ink2:#2e587e;--text:#2e2d28;--muted:#777264;--line:#c6b99f;--red:#a54a35;--gold:#a98236;--shadow:0 14px 38px rgba(47,39,24,.12);--rail:258px}*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;color:var(--text);background:var(--paper);font-family:"Songti SC","STSong","Noto Serif CJK SC",Georgia,serif;line-height:1.8;background-image:radial-gradient(rgba(25,57,95,.045) .7px,transparent .7px),linear-gradient(100deg,rgba(255,255,255,.22),transparent 48%,rgba(166,132,70,.035));background-size:8px 8px,100% 100%}a{color:var(--ink);text-decoration:none}.reading-progress{position:fixed;top:0;left:0;height:3px;width:0;background:var(--red);z-index:99}.site-top{height:58px;position:sticky;top:0;z-index:50;display:flex;align-items:center;gap:20px;padding:0 26px;background:rgba(245,241,230,.93);backdrop-filter:blur(12px);border-bottom:1px solid var(--line)}.brand{font:700 14px/1 "SFMono-Regular",monospace;letter-spacing:.08em;color:var(--ink)}.brand em{font-style:normal;color:var(--red)}.crumb{font:10px "SFMono-Regular",monospace;color:var(--muted)}.site-top nav{margin-left:auto;display:flex;gap:16px;align-items:center}.site-top nav a{font:10px "SFMono-Regular",monospace;color:var(--muted)}.site-top nav a:hover{color:var(--ink)}.menu-button{display:none;border:0;background:none;color:var(--ink);font-size:22px}.layout{display:flex;min-height:calc(100vh - 58px)}.side-nav{position:fixed;top:58px;bottom:0;left:0;width:var(--rail);padding:25px 17px;background:rgba(235,227,209,.94);border-right:1px solid var(--line);overflow:auto;z-index:30}.side-nav>a{display:grid;grid-template-columns:35px 1fr;gap:6px;padding:7px 9px;border-radius:4px;color:#58554c;font-size:11px;line-height:1.35}.side-nav>a span{color:#9a8c74;font:9px "SFMono-Regular",monospace}.side-nav>a:hover,.side-nav>a.active{background:var(--ink);color:var(--paper)}.side-nav>a.active span{color:#d9c68e}.side-label{margin:18px 8px 8px;color:var(--red);font:9px "SFMono-Regular",monospace;letter-spacing:.12em}.side-project{border-bottom:1px solid var(--line);padding:0 8px 15px}.side-project strong{display:block;color:var(--ink);font:22px Georgia,serif}.side-project small{display:block;margin-top:4px;color:var(--muted);font-size:10px}.side-foot{margin-top:22px;padding:14px 8px;color:#8b7c64;font:9px/1.5 "SFMono-Regular",monospace;letter-spacing:.08em}main{width:calc(100% - var(--rail));margin-left:var(--rail);min-width:0}.hero,.atlas-hero,.chapter-hero,.course-hero{padding:78px clamp(24px,7vw,120px) 70px;min-height:560px;border-bottom:1px solid var(--ink);position:relative;overflow:hidden}.hero:after,.atlas-hero:after,.chapter-hero:after,.course-hero:after{content:"";position:absolute;width:520px;height:520px;border:1px solid rgba(25,57,95,.16);border-radius:50%;right:-220px;bottom:-320px;box-shadow:0 0 0 58px rgba(25,57,95,.025),0 0 0 116px rgba(25,57,95,.02)}.hero>* ,.atlas-hero>* ,.chapter-hero>* ,.course-hero>*{position:relative;z-index:1}.eyebrow,.section-head>span,.lesson-route>span{font:10px "SFMono-Regular",monospace;letter-spacing:.13em;color:var(--red)}.hero-grid{display:grid;grid-template-columns:minmax(0,1.3fr) minmax(300px,.7fr);gap:60px;align-items:center;margin-top:42px}.hero h1,.atlas-hero h1,.chapter-hero h1,.course-hero h1{margin:10px 0 24px;color:var(--ink);font:400 clamp(53px,7.5vw,104px)/.94 Georgia,serif;letter-spacing:-.055em}.hero h1 em,.atlas-hero h1 em{color:var(--red);font-style:normal}.lede{max-width:900px;font-size:20px;color:#4d4b43}.badges,.chapter-meta{display:flex;flex-wrap:wrap;gap:8px;margin-top:27px}.badges span,.chapter-meta span,.version-line span,.version-line code{padding:6px 10px;border:1px solid #9e927b;border-radius:20px;color:#615b4e;font:10px "SFMono-Regular",monospace}.version-card{padding:24px;border:1px solid var(--ink);background:rgba(246,241,227,.62);box-shadow:var(--shadow)}.version-card b{display:block;color:var(--red);font:10px "SFMono-Regular",monospace}.version-card code{display:block;margin:16px 0;overflow-wrap:anywhere;color:var(--ink);font:11px "SFMono-Regular",monospace}.version-card a{display:block;border-top:1px solid var(--line);padding-top:12px;font:10px "SFMono-Regular",monospace}.version-card small{display:block;margin-top:12px;color:var(--muted);font:10px "SFMono-Regular",monospace}.prose{padding:74px clamp(24px,7vw,120px);border-bottom:1px solid var(--line);max-width:1600px;margin:0 auto}.section-head{margin-bottom:24px}.section-head h2{margin:12px 0 0;color:var(--ink);font:400 clamp(31px,4.3vw,58px)/1.1 Georgia,serif;letter-spacing:-.03em}.prose>p{max-width:950px;font-size:17px}.pros-cons{display:grid;grid-template-columns:1fr 1fr;gap:28px;margin-top:35px}.pros-cons>div{border-top:2px solid var(--ink);padding-top:14px}.pros-cons h3{color:var(--ink);font-size:19px}.pros-cons li{margin:6px 0;font-size:14px}.diagram-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}.diagram-grid a{display:block;border:1px solid var(--line);padding:23px;background:rgba(246,241,227,.5)}.diagram-grid b{display:block;color:var(--ink);font-size:20px}.diagram-grid span{display:block;margin-top:8px;color:var(--muted);font-size:13px}.analysis-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:13px}.analysis-card{border:1px solid var(--line);padding:20px;background:rgba(246,241,227,.48)}.analysis-card>span,.atlas-num{color:var(--red);font:12px "SFMono-Regular",monospace}.analysis-card h3{margin:7px 0;color:var(--ink);font-size:21px}.analysis-card p{font-size:13px;color:var(--muted)}.analysis-card a{display:inline-block;margin-top:8px;color:var(--red);font:10px "SFMono-Regular",monospace}.analysis-card small{display:block;margin-top:12px;color:var(--muted);font:9px "SFMono-Regular",monospace}.evidence-stack{display:grid;gap:20px}.evidence-card,.source-card{border:1px solid var(--ink);background:#172e47;color:#ede5d4;box-shadow:var(--shadow)}.evidence-head,.source-card>div{display:flex;gap:15px;justify-content:space-between;padding:10px 13px;border-bottom:1px solid #536a7c;font:9px "SFMono-Regular",monospace}.evidence-card a,.source-card a{color:#c4d1d8}.evidence-card pre,.source-card pre{margin:0;padding:15px;max-height:440px;overflow:auto;font:10px/1.55 "SFMono-Regular",monospace}.evidence-card p{margin:0;padding:12px 15px;color:#c4d1d8;font-size:12px}.site-footer,.chapter-footer{display:flex;justify-content:space-between;gap:18px;padding:28px clamp(24px,7vw,120px) 42px;background:var(--ink);color:var(--paper)}.site-footer a,.chapter-footer a{color:var(--paper);font-size:12px}.site-footer span{font:9px "SFMono-Regular",monospace;color:#b8c4cc}.atlas-hero,.course-hero{min-height:610px}.atlas-metrics,.course-stats{display:flex;max-width:900px;border:1px solid var(--ink);margin-top:36px}.atlas-metrics span,.course-stats span,.course-stats b{padding:14px 18px;border-right:1px solid var(--ink);font:10px "SFMono-Regular",monospace;color:var(--muted)}.atlas-metrics span:last-child,.course-stats span:last-child{border-right:0}.atlas-metrics b,.course-stats b{display:block;color:var(--ink);font:32px Georgia,serif}.atlas-list{display:grid;gap:0}.atlas-card{display:grid;grid-template-columns:70px 1fr;gap:20px;border-top:1px solid var(--ink);padding:30px 0}.atlas-card h2{margin:4px 0 9px;color:var(--ink);font:400 34px Georgia,serif}.atlas-card>div:last-child>p{max-width:850px;color:var(--muted);font-size:15px}.atlas-actions{display:flex;flex-wrap:wrap;gap:17px;align-items:center;margin-top:14px}.atlas-actions a{font:10px "SFMono-Regular",monospace;color:var(--red)}.atlas-actions span{color:var(--muted);font:9px "SFMono-Regular",monospace}.matrix-wrap{overflow:auto;border:1px solid var(--ink);box-shadow:var(--shadow)}.matrix table{border-collapse:collapse;width:1450px;table-layout:fixed;font-size:12px;background:rgba(246,241,227,.42)}.matrix th,.matrix td{padding:14px;border-right:1px solid var(--line);border-bottom:1px solid var(--line);vertical-align:top;text-align:left}.matrix thead th{position:sticky;top:0;z-index:2;background:var(--ink);color:var(--paper);font:10px "SFMono-Regular",monospace}.matrix tbody th{color:var(--ink);font-size:16px}.matrix tbody th small{display:block;margin-top:5px;color:var(--muted);font:9px "SFMono-Regular",monospace}.matrix code,.version-line code{font-size:9px}.course-intro{background:rgba(226,216,193,.3)}.course-intro p{max-width:900px}.chapter-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:12px}.chapter-card{display:grid;grid-template-columns:54px 1fr;gap:14px;border:1px solid var(--line);padding:18px;background:rgba(246,241,227,.48)}.chapter-card>span{color:var(--red);font:22px Georgia,serif}.chapter-card h3{margin:0;color:var(--ink);font-size:18px}.chapter-card p{margin:7px 0;color:var(--muted);font-size:13px}.chapter-card small{color:var(--red);font:9px "SFMono-Regular",monospace}.version-line{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin-top:30px}.version-line a{font:10px "SFMono-Regular",monospace;color:var(--red)}.lesson-route{display:flex;flex-wrap:wrap;gap:10px;align-items:center;margin-bottom:30px;color:var(--muted);font:10px "SFMono-Regular",monospace}.lesson-route b{padding:5px 8px;border:1px solid var(--line);font-weight:400}.lesson-route i{color:var(--red);font-style:normal}.callout{max-width:900px;padding:18px 20px;border-left:3px solid var(--gold);background:rgba(235,227,209,.55)}.callout b{color:var(--ink);font-size:13px}.callout p{margin:6px 0 0;font-size:17px}.lesson h2{margin:45px 0 15px;color:var(--ink);font:400 clamp(26px,3.2vw,44px)/1.15 Georgia,serif}.source-card pre{max-height:520px}.flow-strip{display:flex;flex-wrap:wrap;gap:10px;align-items:center;margin:25px 0}.flow-strip span{padding:9px 12px;border:1px solid var(--ink);background:rgba(246,241,227,.58);color:var(--ink);font:11px "SFMono-Regular",monospace}.flow-strip i{color:var(--red);font-style:normal}.diagram-frame{width:100%;height:520px;border:1px solid var(--ink);background:#f5f4ed}.exercise{border-top:2px solid var(--ink);padding:16px 4px}.exercise details{margin-top:16px;border-top:1px solid var(--line);padding-top:10px}.exercise summary{cursor:pointer;color:var(--red);font:10px "SFMono-Regular",monospace}@media(max-width:1050px){:root{--rail:210px}.hero-grid{grid-template-columns:1fr}.diagram-grid,.pros-cons{grid-template-columns:1fr}.analysis-grid{grid-template-columns:1fr}}@media(max-width:760px){:root{--rail:0}.site-top{padding:0 14px}.menu-button{display:block}.crumb{display:none}.site-top nav a:nth-child(1),.site-top nav a:nth-child(2){display:none}.side-nav{transform:translateX(-105%);width:285px;transition:transform .25s ease}.side-nav.open{transform:translateX(0)}main{width:100%;margin-left:0}.hero,.atlas-hero,.chapter-hero,.course-hero,.prose{padding:48px 18px}.hero h1,.atlas-hero h1,.chapter-hero h1,.course-hero h1{font-size:54px}.lede{font-size:17px}.atlas-metrics,.course-stats{display:grid;grid-template-columns:repeat(2,1fr)}.atlas-metrics span:nth-child(2),.atlas-metrics span:nth-child(4),.course-stats span:nth-child(2){border-right:0}.atlas-card{grid-template-columns:48px 1fr}.chapter-grid{grid-template-columns:1fr}.site-footer,.chapter-footer{display:block}.site-footer a,.chapter-footer a{display:inline-block;margin-top:15px}.diagram-frame{height:470px}.version-line{align-items:flex-start;flex-direction:column}}@media(prefers-reduced-motion:reduce){*{scroll-behavior:auto!important;transition:none!important}}`;

const supplementalCss = `.dimensions{background:rgba(226,216,193,.26)}.dimension-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.dimension-card{display:grid;grid-template-columns:44px 1fr;gap:14px;border:1px solid var(--line);padding:18px;background:rgba(246,241,227,.58)}.dimension-index{color:var(--red);font:22px Georgia,serif}.dimension-card h3{margin:0;color:var(--ink);font-size:18px}.dimension-card p{margin:8px 0;color:var(--muted);font-size:13px}.dimension-card a{font:9px "SFMono-Regular",monospace;color:var(--red)}.matrix-wrap{overflow-x:auto;overflow-y:visible}.matrix table{min-width:1450px}.matrix thead th{white-space:nowrap}h1,h2,h3,p{overflow-wrap:anywhere}@media(max-width:1050px){.dimension-grid{grid-template-columns:1fr}}`;

const richCss = `.report-hero-v2{padding:58px clamp(24px,7vw,120px) 46px;background:linear-gradient(135deg,rgba(226,216,193,.54),rgba(246,241,227,.2));border-bottom:1px solid var(--ink)}.hero-topline,.chapter-kicker,.finding-meta,.finding-code-head{display:flex;justify-content:space-between;gap:15px;align-items:center;color:var(--red);font:10px "SFMono-Regular",monospace;letter-spacing:.08em}.hero-index{color:var(--red);font:12px "SFMono-Regular",monospace;letter-spacing:.18em}.hero-thesis{max-width:950px;font-size:20px;color:#4d4b43}.hero-tags{display:flex;flex-wrap:wrap;gap:8px;margin-top:24px}.hero-tags span{padding:5px 9px;border:1px solid var(--line);border-radius:2px;color:var(--muted);font:9px "SFMono-Regular",monospace}.snapshot-card{padding:20px;border:1px solid var(--ink);background:rgba(246,241,227,.74);box-shadow:var(--shadow)}.snapshot-card dl{margin:0;display:grid;gap:11px}.snapshot-card dl div{display:grid;gap:2px;border-bottom:1px solid var(--line);padding-bottom:8px}.snapshot-card dt{color:var(--red);font:9px "SFMono-Regular",monospace;text-transform:uppercase}.snapshot-card dd{margin:0;color:var(--ink);font:12px "SFMono-Regular",monospace;overflow-wrap:anywhere}.snapshot-card code{font-size:10px}.hero-actions{display:flex;flex-wrap:wrap;gap:18px;margin-top:30px}.hero-actions a{color:var(--red);font:10px "SFMono-Regular",monospace;border-bottom:1px solid var(--red);padding-bottom:3px}.chapter{padding:62px clamp(24px,7vw,120px);border-bottom:1px solid var(--line);max-width:1600px;margin:0 auto}.chapter h2,.evidence-chapter h2{margin:10px 0 18px;color:var(--ink);font:400 clamp(31px,4.3vw,58px)/1.1 Georgia,serif;letter-spacing:-.035em}.chapter-deck{max-width:920px;color:var(--muted);font-size:16px}.executive-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}.thesis-card{min-height:145px;border:1px solid var(--line);padding:17px;background:rgba(246,241,227,.62)}.thesis-card.risk-tone{border-color:var(--red)}.thesis-card>span{color:var(--red);font:9px "SFMono-Regular",monospace}.thesis-card p{margin:13px 0 0;color:var(--ink);font-size:16px}.method-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}.method-grid>div{border-top:2px solid var(--ink);padding-top:13px}.method-grid span{color:var(--red);font:10px "SFMono-Regular",monospace}.method-grid p{margin:9px 0;color:var(--muted);font-size:13px}.diagram-stack{display:grid;grid-template-columns:1fr;gap:30px}.diagram-figure{margin:0;min-width:0;border:1px solid var(--line);background:rgba(246,241,227,.42);overflow:hidden}.diagram-figure figcaption{display:grid;grid-template-columns:1fr auto;gap:6px;padding:13px 15px;border-bottom:1px solid var(--line)}.diagram-figure figcaption span{grid-column:1/-1;color:var(--red);font:9px "SFMono-Regular",monospace}.diagram-figure figcaption b{color:var(--ink);font:17px Georgia,serif}.diagram-figure figcaption a{color:var(--red);font:9px "SFMono-Regular",monospace}.diagram-figure>p{padding:0 15px;color:var(--muted);font-size:12px;min-height:45px}.diagram-figure iframe{display:block;width:100%;height:720px;border:0;border-top:1px solid var(--line);background:#07111f}.coverage-table{display:grid;gap:0;border-top:1px solid var(--line)}.coverage-row{display:grid;grid-template-columns:minmax(170px,1.1fr) 100px 90px 2.2fr;align-items:center;gap:12px;padding:12px 0;border-bottom:1px solid var(--line)}.coverage-row>span{color:var(--ink);font-weight:600}.coverage-row>b{justify-self:start;padding:2px 7px;border:1px solid var(--line);font:9px "SFMono-Regular",monospace}.coverage-row>em{color:var(--red);font:9px "SFMono-Regular",monospace;font-style:normal}.coverage-row>p{margin:0;color:var(--muted);font-size:12px}.status-verified{color:#087f69}.status-partial,.status-inferred{color:#a98236}.status-missing{color:var(--red)}.evidence-chapter{padding:62px clamp(24px,7vw,120px);border-bottom:1px solid var(--line);max-width:1600px;margin:0 auto}.chapter-rule{display:flex;justify-content:flex-end;border-top:2px solid var(--ink);padding-top:7px}.chapter-rule span{color:var(--red);font:12px monospace}.finding-stack{display:grid;gap:18px}.finding-card{border:1px solid var(--ink);background:rgba(246,241,227,.72);box-shadow:var(--shadow)}.finding-card>header{display:flex;gap:14px;align-items:flex-start;padding:14px 17px;border-bottom:1px solid var(--line)}.finding-index{color:var(--red);font:14px monospace;min-width:27px}.finding-card h3{margin:0;color:var(--ink);font:600 20px/1.3 Georgia,serif}.finding-meta{justify-content:flex-start;flex-wrap:wrap;letter-spacing:0}.finding-meta b,.finding-meta span{font:9px monospace}.finding-meta b{color:#087f69}.finding-meta span{color:var(--muted);border-left:1px solid var(--line);padding-left:7px}.finding-grid{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.02fr)}.finding-copy{padding:17px}.finding-copy section{margin-bottom:13px}.finding-copy section>span,.finding-caveat>span{color:var(--red);font:9px monospace;letter-spacing:.08em}.finding-copy p{margin:5px 0;color:var(--text);font-size:14px}.finding-impact{padding:10px;border-left:2px solid var(--gold);background:rgba(235,227,209,.42)}.finding-caveat{margin-top:10px;padding-top:10px;border-top:1px solid var(--line)}.finding-caveat ul{margin:6px 0;padding-left:17px;color:var(--muted);font-size:12px}.finding-source-note{display:block;margin-top:9px;color:var(--muted);font:9px/1.5 monospace}.finding-source-note a{color:var(--red)}.finding-code{min-width:0;background:#172e47;color:#ede5d4}.finding-code-head{padding:9px 13px;border-bottom:1px solid #536a7c}.finding-code-head span{overflow-wrap:anywhere}.finding-code-head a{color:#c4d1d8;white-space:nowrap}.finding-code pre{margin:0;padding:14px;max-height:370px;overflow:auto;font:10px/1.55 "SFMono-Regular",monospace}.reference-note{background:rgba(226,216,193,.34)}.report-footer{display:flex;justify-content:space-between;gap:20px;padding:28px clamp(24px,7vw,120px) 42px;background:var(--ink);color:var(--paper);font:10px monospace}.report-footer nav{display:flex;gap:17px}.report-footer a{color:var(--paper)}.matrix-synthesis{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}.synthesis-card{border-top:2px solid var(--ink);padding:14px 0}.synthesis-card span{color:var(--red);font:9px monospace}.synthesis-card h3{margin:6px 0;color:var(--ink);font:400 21px Georgia,serif}.synthesis-card p{margin:0;color:var(--muted);font-size:13px}.blueprint{display:grid;grid-template-columns:repeat(6,1fr);gap:0;border:1px solid var(--ink);background:rgba(246,241,227,.5)}.blueprint-step{position:relative;padding:15px 11px;border-right:1px solid var(--line)}.blueprint-step:last-child{border-right:0}.blueprint-step span{display:block;color:var(--red);font:9px monospace}.blueprint-step b{display:block;margin:7px 0;color:var(--ink);font-size:14px}.blueprint-step p{margin:0;color:var(--muted);font-size:11px;line-height:1.5}.atlas-matrix-intro{max-width:980px;color:var(--muted);font-size:15px}@media(max-width:1100px){.executive-grid{grid-template-columns:repeat(2,1fr)}.diagram-stack{grid-template-columns:1fr}.diagram-figure iframe{height:680px}.blueprint{grid-template-columns:repeat(3,1fr)}.blueprint-step:nth-child(3){border-right:0}.blueprint-step:nth-child(-n+3){border-bottom:1px solid var(--line)}}@media(max-width:760px){.report-hero-v2{padding:42px 18px}.chapter,.evidence-chapter{padding:45px 18px}.executive-grid,.method-grid,.finding-grid,.matrix-synthesis{grid-template-columns:1fr}.coverage-row{grid-template-columns:1fr 85px 65px}.coverage-row>p{grid-column:1/-1}.blueprint{grid-template-columns:1fr 1fr}.blueprint-step:nth-child(3){border-right:1px solid var(--line)}.blueprint-step:nth-child(2n){border-right:0}.blueprint-step:nth-child(-n+4){border-bottom:1px solid var(--line)}.diagram-figure iframe{height:560px}.hero-actions{gap:12px}}`;

const legacyCss = `.legacy-note{background:rgba(226,216,193,.34)}.legacy-report-link{display:inline-block;margin-top:12px;padding:10px 14px;border:1px solid var(--ink);color:var(--red);font:10px "SFMono-Regular",monospace}`;
const detailCss = `.line-guide{margin:18px 0 12px;padding-top:14px;border-top:1px solid var(--line)}.line-guide>span{display:block;color:var(--red);font:9px "SFMono-Regular",monospace;letter-spacing:.08em}.line-guide ol{display:grid;gap:8px;margin:9px 0 0;padding:0;list-style:none}.line-guide li{display:grid;grid-template-columns:76px minmax(0,1fr);gap:10px;align-items:start}.line-guide li>code{padding:3px 5px;border:1px solid var(--line);color:var(--red);font:10px "SFMono-Regular",monospace}.line-guide li b{display:block;color:var(--ink);font-size:12px}.line-guide li p{margin:2px 0 0;color:var(--muted);font-size:11px;line-height:1.55}.current-source{margin-top:14px;border:1px solid #536a7c;background:#172e47;color:#ede5d4}.current-source summary{cursor:pointer;padding:9px 13px;color:#c4d1d8;font:9px "SFMono-Regular",monospace}.current-source .finding-code-head{border-top:1px solid #536a7c}.current-source pre{max-height:330px}.finding-card.compact .finding-code pre{max-height:460px}.finding-card.compact .finding-copy{padding-bottom:20px}.scenario-panel{background:rgba(226,216,193,.22)}.scenario-legend{display:flex;flex-wrap:wrap;gap:8px;margin:18px 0;font:10px "SFMono-Regular",monospace}.scenario-legend span{padding:5px 8px;border:1px solid var(--line)}.scenario-wrap{overflow:auto;border:1px solid var(--ink);box-shadow:var(--shadow)}.scenario-table{border-collapse:collapse;min-width:2450px;width:2450px;table-layout:fixed;font-size:11px}.scenario-table th,.scenario-table td{padding:10px;border-right:1px solid var(--line);border-bottom:1px solid var(--line);text-align:center}.scenario-table thead th{position:sticky;top:0;z-index:2;background:var(--ink);color:var(--paper);font:9px "SFMono-Regular",monospace;writing-mode:vertical-rl;transform:rotate(180deg);height:150px;white-space:nowrap}.scenario-table thead th:first-child{left:0;z-index:4;writing-mode:horizontal-tb;transform:none;min-width:230px;width:230px}.scenario-table tbody th{position:sticky;left:0;z-index:3;background:var(--paper2);text-align:left;min-width:230px;width:230px}.scenario-table tbody th b{display:block;color:var(--ink);font-size:13px}.scenario-table tbody th small{display:block;margin-top:3px;color:var(--muted);font:9px/1.4 "SFMono-Regular",monospace}.scenario-table td{width:85px;min-width:85px;height:50px}.scenario-table td span{display:inline-grid;place-items:center;width:34px;height:25px;border:1px solid currentColor;font:10px "SFMono-Regular",monospace}.score-1{color:#a54a35;background:rgba(165,74,53,.08)}.score-2{color:#a98236;background:rgba(169,130,54,.1)}.score-3{color:#6e7d70;background:rgba(110,125,112,.1)}.score-4{color:#087f69;background:rgba(8,127,105,.12)}.score-5{color:#18385f;background:rgba(24,56,95,.15)}.scenario-cards{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin-top:20px}.scenario-card{border:1px solid var(--line);padding:15px;background:rgba(246,241,227,.58)}.scenario-card header>span{color:var(--red);font:9px monospace}.scenario-card h3{margin:5px 0;color:var(--ink);font:400 21px Georgia,serif}.scenario-card p{margin:0;color:var(--muted);font-size:12px}.scenario-card ol{display:grid;gap:7px;margin:14px 0 0;padding:0;list-style:none}.scenario-card li{display:grid;grid-template-columns:22px 1fr auto;gap:8px;align-items:center;border-top:1px solid var(--line);padding-top:7px;font:11px "SFMono-Regular",monospace}.scenario-card li>b{color:var(--red)}.scenario-card li a{color:var(--ink)}.scenario-card li span{color:var(--red)}.diagram-figure iframe,.diagram-frame{background:#f5f1e6}.mechanism-panel{margin:24px 0 8px;padding:18px 0;border-top:2px solid var(--ink)}.mechanism-kicker{color:var(--red);font:9px "SFMono-Regular",monospace;letter-spacing:.1em}.mechanism-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px;margin-top:12px}.mechanism-card{border:1px solid var(--line);padding:13px;background:rgba(246,241,227,.55)}.mechanism-card>span{color:var(--red);font:9px monospace}.mechanism-card h3{margin:6px 0;color:var(--ink);font-size:16px}.mechanism-card p{margin:0;color:var(--muted);font-size:11px;line-height:1.55}.mechanism-card blockquote{margin:11px 0;padding:8px 9px;border-left:2px solid var(--gold);color:var(--text);font-size:12px;line-height:1.55}.mechanism-card a{color:var(--red);font:9px monospace;overflow-wrap:anywhere}@media(max-width:1100px){.mechanism-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:760px){.scenario-cards,.mechanism-grid{grid-template-columns:1fr}.scenario-table{min-width:2200px;width:2200px}.scenario-table thead th:first-child,.scenario-table tbody th{min-width:190px;width:190px}}`;
const sourceMapCss = `.source-reading-map{margin:26px 0 8px;padding:18px 0;border-top:2px solid var(--ink)}.source-reading-head{display:flex;justify-content:space-between;gap:15px;align-items:center;color:var(--red);font:9px "SFMono-Regular",monospace;letter-spacing:.08em}.source-reading-head b{color:var(--ink);font:12px Georgia,serif;letter-spacing:0}.source-reading-map>p{max-width:920px;margin:9px 0 16px;color:var(--muted);font-size:13px}.source-reading-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.source-reading-card{min-width:0;border:1px solid var(--line);background:rgba(246,241,227,.58)}.source-reading-card header{display:grid;grid-template-columns:28px minmax(0,1fr) auto;gap:9px;align-items:start;padding:11px 12px;border-bottom:1px solid var(--line)}.source-reading-card header>span{color:var(--red);font:12px Georgia,serif}.source-reading-card header b{display:block;color:var(--ink);font:11px "SFMono-Regular",monospace;overflow-wrap:anywhere}.source-reading-card header small{display:block;margin-top:3px;color:var(--muted);font:9px monospace}.source-reading-card header a{color:var(--red);font:9px monospace;white-space:nowrap}.source-reading-card>p{margin:10px 12px;color:var(--muted);font-size:11px;line-height:1.5}.source-reading-card pre{margin:0;border-top:1px solid var(--line);background:#172e47;color:#ede5d4;max-height:230px;overflow:auto;padding:11px;font:9px/1.55 "SFMono-Regular",monospace}@media(max-width:760px){.source-reading-grid{grid-template-columns:1fr}}`;
const inventoryCss = `.implementation-inventory{padding:52px clamp(24px,7vw,120px);border-bottom:1px solid var(--line);max-width:1600px;margin:0 auto;background:rgba(226,216,193,.2)}.inventory-head{display:flex;justify-content:space-between;gap:15px;align-items:center;color:var(--red);font:10px "SFMono-Regular",monospace;letter-spacing:.08em}.inventory-head b{color:var(--ink);font:15px Georgia,serif;letter-spacing:0}.implementation-inventory>p{max-width:980px;color:var(--muted);font-size:14px}.inventory-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin-top:18px}.inventory-card{min-width:0;border:1px solid var(--line);background:rgba(246,241,227,.62);padding:13px}.inventory-card>span{color:var(--red);font:9px "SFMono-Regular",monospace;letter-spacing:.08em}.inventory-card>p{margin:7px 0;color:var(--muted);font-size:11px;line-height:1.5}.inventory-card ul{display:grid;gap:6px;margin:0;padding:0;list-style:none}.inventory-card li{display:flex;justify-content:space-between;gap:10px;border-top:1px solid var(--line);padding-top:6px}.inventory-card a,.inventory-card code{color:var(--ink);font:10px/1.4 "SFMono-Regular",monospace;overflow-wrap:anywhere}.inventory-card li small{color:var(--muted);font:9px monospace;white-space:nowrap}@media(max-width:1050px){.inventory-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:760px){.inventory-grid{grid-template-columns:1fr}.implementation-inventory{padding:42px 18px}}`;
const conceptCss = `.concept-audit{padding:52px clamp(24px,7vw,120px);border-bottom:1px solid var(--line);max-width:1600px;margin:0 auto}.concept-audit-head{display:flex;justify-content:space-between;gap:15px;align-items:center;color:var(--red);font:10px "SFMono-Regular",monospace;letter-spacing:.08em}.concept-audit-head b{color:var(--ink);font:15px Georgia,serif;letter-spacing:0}.concept-audit>p{max-width:1050px;color:var(--muted);font-size:14px}.concept-audit-wrap{overflow:auto;border:1px solid var(--ink);box-shadow:var(--shadow)}.concept-audit table{border-collapse:collapse;width:100%;min-width:880px;background:rgba(246,241,227,.45);font-size:12px}.concept-audit th,.concept-audit td{padding:10px 12px;border-right:1px solid var(--line);border-bottom:1px solid var(--line);vertical-align:top;text-align:left}.concept-audit thead th{background:var(--ink);color:var(--paper);font:9px "SFMono-Regular",monospace}.concept-audit tbody th{width:240px;color:var(--ink)}.concept-audit tbody th b{display:block;font-size:13px}.concept-audit tbody th small{display:block;margin-top:3px;color:var(--muted);font:10px/1.45 "SFMono-Regular",monospace}.concept-audit td:nth-child(2){width:150px}.concept-audit td small{display:block;margin-top:5px;color:var(--muted);font:9px monospace}.concept-audit td a{color:var(--red);font:10px/1.5 "SFMono-Regular",monospace;overflow-wrap:anywhere}.concept-audit td em{color:var(--muted);font-size:11px}.concept-status{display:inline-block;padding:3px 6px;border:1px solid currentColor;font:9px "SFMono-Regular",monospace}.concept-found{color:#087f69}.concept-missing{color:var(--red)}@media(max-width:760px){.concept-audit{padding:42px 18px}}`;
const diagramCss = `.diagrams-v2{background:rgba(226,216,193,.12)}.diagram-stack{display:grid;grid-template-columns:1fr;gap:30px}.map-figure{scroll-margin-top:82px;background:rgba(246,241,227,.62);box-shadow:var(--shadow)}.map-figure figcaption{padding:18px 20px;background:rgba(235,227,209,.34)}.map-figure figcaption>b{font-size:25px}.map-figure>p{min-height:0;margin:0;padding:0 20px 18px;max-width:1000px;font-size:14px;line-height:1.65}.map-figure iframe{height:720px;background:#f5f1e6}.map-figure::after{content:"SOURCE-BACKED MAP · CLICK A NODE FOR EVIDENCE";display:block;padding:10px 20px;border-top:1px solid var(--line);color:var(--muted);font:9px "SFMono-Regular",monospace;letter-spacing:.08em}@media(max-width:1100px){.map-figure iframe{height:680px}}@media(max-width:760px){.map-figure iframe{height:560px}.map-figure figcaption>b{font-size:21px}}`;
const lineAnnotCss = `.line-by-line{border-top:1px solid #536a7c}.line-by-line summary{cursor:pointer;padding:9px 13px;color:#c4d1d8;font:9px "SFMono-Regular",monospace}.line-by-line-scroll{max-height:370px;overflow:auto}.line-by-line table{border-collapse:collapse;width:100%;min-width:680px;font:9px/1.45 "SFMono-Regular",monospace}.line-by-line th,.line-by-line td{padding:6px 8px;border-right:1px solid #536a7c;border-bottom:1px solid #536a7c;text-align:left;vertical-align:top}.line-by-line thead th{position:sticky;top:0;background:#0d2238;color:#c4d1d8}.line-by-line tbody td:first-child{width:52px;color:#c4d1d8;text-align:right}.line-by-line tbody th{width:70px}.line-by-line tbody td:nth-child(3){min-width:320px;color:#ede5d4;white-space:pre-wrap}.line-by-line tbody td:nth-child(4){color:#c4d1d8;min-width:210px}.line-kind-input,.line-kind-state,.line-kind-branch,.line-kind-effect,.line-kind-return,.line-kind-flow{display:inline-block;padding:2px 4px;border:1px solid currentColor}.line-kind-input{color:#8fd3c5}.line-kind-state{color:#c2a4f5}.line-kind-branch{color:#f5b45d}.line-kind-effect{color:#ff9580}.line-kind-return{color:#84b8ff}.line-kind-flow{color:#b8c4cc}`;

const js = `const bar=document.getElementById('reading-progress');const update=()=>{const max=document.documentElement.scrollHeight-innerHeight;bar&&(bar.style.width=(max?scrollY/max*100:0)+'%')};addEventListener('scroll',update,{passive:true});addEventListener('load',update);update();document.querySelector('[data-menu]')?.addEventListener('click',()=>document.querySelector('[data-side]')?.classList.toggle('open'));`;

const matrixCss = ".matrix-wrap{position:relative;max-height:78vh;overflow:auto;overscroll-behavior:contain}.comparison-matrix{min-width:2600px!important;width:2600px!important;table-layout:fixed}.comparison-matrix thead{position:sticky;top:0;z-index:5}.comparison-matrix thead th{position:static;min-width:205px}.comparison-matrix thead th:first-child{position:sticky;left:0;z-index:7;min-width:245px}.comparison-matrix tbody th{position:sticky;left:0;z-index:3;min-width:245px;background:var(--paper2);box-shadow:7px 0 0 rgba(24,56,95,.04)}.comparison-matrix tbody th a{color:var(--ink)}.comparison-matrix td{min-width:205px;font-size:12px;line-height:1.55}.comparison-matrix td strong{color:var(--ink)}.comparison-matrix small{display:block;margin-top:5px;color:var(--muted);font:9px \"SFMono-Regular\",monospace}.comparison-matrix code{font:9px \"SFMono-Regular\",monospace}.matrix-wrap:focus{outline:2px solid var(--red);outline-offset:3px}@media(max-width:760px){.matrix-wrap{max-height:70vh}.comparison-matrix{min-width:2450px!important;width:2450px!important}.comparison-matrix thead th,.comparison-matrix tbody th,.comparison-matrix td{min-width:190px}.comparison-matrix thead th:first-child,.comparison-matrix tbody th{min-width:220px}}";
write(path.join(siteRoot, "assets/harness.css"), css + supplementalCss + richCss + matrixCss + legacyCss + detailCss + sourceMapCss + inventoryCss + conceptCss + diagramCss + lineAnnotCss);
write(path.join(siteRoot, "assets/harness.js"), js);
write(path.join(siteRoot, "zh/index.html"), indexPageDetailed("zh"));
write(path.join(siteRoot, "en/index.html"), indexPageDetailed("en"));
write(path.join(siteRoot, "index.html"), `<!doctype html><meta http-equiv="refresh" content="0; url=zh/index.html"><a href="zh/index.html">Awesome Harness</a>`);

for (const project of projects) {
  for (const lang of ["zh", "en"]) {
    const projectRoot = path.join(siteRoot, "projects", project.slug, lang);
    write(path.join(projectRoot, "analysis.html"), richAnalysis(project, lang));
    write(path.join(projectRoot, "tutorial/index.html"), tutorialIndex(project, lang));
    for (const [index, chapterDef] of chapterDefs.entries()) write(path.join(projectRoot, "tutorial", `ch${chapterDef.number}-${chapterDef.id}.html`), richChapterPage(project, lang, chapterDef, index));
    for (const type of ["architecture", "sequence", "capability"]) write(path.join(projectRoot, "diagrams", `${type}.html`), archifyDiagram(project, lang, type));
  }
}

const versions = Object.fromEntries(projects.map((p) => [p.slug, { name: p.name, repo: p.repo, branch: p.branch, commit: p.commit, date: p.date, source: `sources/${p.slug}` }]));
write(path.join(siteRoot, "data/versions.json"), `${JSON.stringify({ generatedAt: new Date().toISOString(), projects: versions }, null, 2)}\n`);
write(path.join(root, "README.zh.md"), [
  "# Awesome Harness",
  "",
  `独立维护的开源 Agent Harness 教程合集。当前包含 ${projects.filter((p) => !p.legacy).length} 个本轮源码快照，以及 ${projects.filter((p) => p.legacy).length} 个已刷新到当前远端分支 HEAD 的项目。legacy 项目沿用了上一轮 finding 账本的审计结构，但源码摘录、commit、行号和链接已重新生成；页面明确区分“重新拉取源码”和“历史 finding 仍需语义复核”。`,
  "",
  "- 中文/English 单页技术分析",
  "- 10 章独立小白教程页面",
  "- 架构图、时序图、能力图（可点击节点）",
  "- 每章源码地图：本地仓库命中的 6 个真实文件与固定提交短段",
  "- 单页实现面清单：入口、manifest、插件/MCP、测试、命令线索",
  "- 21 项概念审计：session log、approval、projection、jobs、transaction、queues、parallelism 等",
  "- 固定 commit、源码行号和 GitHub 跳转",
  "- 本仓库只发布图文教程、源码证据和交互图；视频单独维护在 video 仓库",
  "- 旧 finding 的完整长报告保留在 site/legacy/reports/，新入口统一拆成十章教程",
  "",
  "站点入口：site/zh/index.html。版本账本：site/data/versions.json。",
  "",
  "sources/ 是本地审计输入，不提交到仓库；需要复现源码摘录时先运行 node scripts/fetch-sources.mjs，它会按 data/projects.mjs 中的 commit checkout。然后运行 node scripts/generate-site.mjs，最后运行 node scripts/validate-site.mjs。",
  "",
  "注意：Diagram Design 是一个图形生成 Skill/Harness，不是可执行 Agent runtime；报告会把它放在同一横向矩阵里，但不会把它冒充成沙箱执行器。data/legacy/ 是历史 finding 与当前源码版本账本；运行 npm run refresh-legacy 可重新拉取/刷新 legacy 项目的版本和代码摘录。",
  "",
  "> 生成页面：node scripts/generate-site.mjs",
  ""
].join("\n"));
write(path.join(root, "README.en.md"), [
  "# Awesome Harness",
  "",
  `An independently maintained bilingual atlas of open-source Agent Harness projects. The current release contains ${projects.filter((p) => !p.legacy).length} source snapshots plus ${projects.filter((p) => p.legacy).length} projects refreshed to their current remote branch HEAD. Legacy projects retain the previous finding ledger structure, but source excerpts, commits, line ranges, and links were regenerated; the pages distinguish “source refreshed” from “historical finding still requiring semantic re-review.” Every project includes:`,
  "",
  "- Chinese and English single-page technical analysis",
  "- Ten standalone beginner tutorial chapters",
  "- Clickable architecture, sequence, and capability maps",
  "- Per-chapter source maps with six real local files and pinned passages",
  "- Per-project implementation dossier for entrypoints, manifests, plugins/MCP, tests, and commands",
  "- A 21-concept source audit covering logs, approvals, projections, jobs, transactions, queues, parallelism, and more",
  "- Pinned commits, line ranges, and GitHub links",
  "- This repository ships only text tutorials, source evidence, and interactive maps; video releases live in the separate video repository",
  "- Preserved long-form prior-finding audits under site/legacy/reports/, alongside the common ten-chapter entrypoint",
  "",
  "Site entry: site/en/index.html. Version ledger: site/data/versions.json.",
  "",
  "sources/ is local audit input and is intentionally not committed. To reproduce source excerpts, run node scripts/fetch-sources.mjs; it checks out the commits recorded in data/projects.mjs. Then run node scripts/generate-site.mjs and node scripts/validate-site.mjs.",
  "",
  "Note: Diagram Design is a diagram-generation Skill/Harness, not an executable agent runtime. The matrix compares it as a harness specimen without claiming it is an execution sandbox. data/legacy/ contains historical findings plus the current source version ledger; run npm run refresh-legacy to refresh the legacy repositories and their code excerpts.",
  "",
  "> Generate pages with: node scripts/generate-site.mjs",
  ""
].join("\n"));
console.log(JSON.stringify({ projects: projects.length, languages: 2, chaptersPerProject: chapterDefs.length, pages: projects.length * 2 * (1 + 1 + chapterDefs.length + 3) + 3 }));
