#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { projects, chapterDefs, dimensionNotes } from "../data/projects.mjs";
import { videoEntries } from "../data/videos.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourceRoot = path.join(root, "sources");
const siteRoot = path.join(root, "site");
const sourceInfo = new Map(projects.map((project) => [project.slug, project]));
const videoCatalog = videoEntries(projects, chapterDefs).map((entry) => ({
  ...entry,
  status: fs.existsSync(path.join(siteRoot, entry.mp4)) && fs.existsSync(path.join(siteRoot, entry.srt)) ? "published" : entry.status
}));
const videoById = new Map(videoCatalog.map((entry) => [entry.id, entry]));

function mkdir(file) { fs.mkdirSync(path.dirname(file), { recursive: true }); }
function write(file, content) { mkdir(file); fs.writeFileSync(file, content); }
function esc(value) {
  return String(value ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");
}
function unescape(value) { return String(value ?? "").replaceAll("&amp;", "&").replaceAll("&lt;", "<").replaceAll("&gt;", ">").replaceAll("&quot;", '"').replaceAll("&#39;", "'"); }
function repoPath(project, relative) { return path.join(sourceRoot, project.slug, relative); }
function sourceUrl(project, relative, start, end) { return `https://github.com/${project.repo}/blob/${project.commit}/${relative}#L${start}-L${end}`; }
function rel(from, to) { return path.relative(path.dirname(from), to).replaceAll(path.sep, "/") || "index.html"; }
function langName(lang) { return lang === "zh" ? "中文" : "English"; }
function text(project, lang, key) { return project[lang]?.[key] || project.zh[key] || ""; }

function findCitation(project, anchorKey) {
  const anchor = project.anchors.find((item) => item[0] === anchorKey) || project.anchors[0];
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
    return `<article class="dimension-card"><div class="dimension-index">${String(index + 1).padStart(2, "0")}</div><div><h3>${esc(dimension[lang])}</h3><p>${esc(notes[dimension.id] || text(project, lang, "lesson"))}</p><a href="${esc(sourceUrl(project, citation.path, citation.start, citation.end))}" target="_blank" rel="noreferrer">${esc(citation.path)} · L${citation.start}–${citation.end} ↗</a></div></article>`;
  }).join("");
}

function videoPanel(project, lang, entries, file, compact = false) {
  const label = lang === "zh" ? "视频与字幕" : "VIDEO + SUBTITLES";
  const title = lang === "zh" ? "把这次源码阅读做成可复习的短视频" : "Turn the source reading into a reviewable short video";
  const items = entries.map((entry) => `<article class="video-item"><div><span>${entry.kind === "analysis" ? (lang === "zh" ? "总览" : "ANALYSIS") : `M${entry.id.match(/ch(\d+)/)?.[1] || ""}`}</span><b>${esc(entry.title)}</b></div><div class="video-links"><a href="${esc(rel(file, path.join(siteRoot, entry.mp4)))}" data-video-status="${entry.status}">${entry.status === "published" ? "MP4" : (lang === "zh" ? "待发布 MP4" : "MP4 pending")}</a><a href="${esc(rel(file, path.join(siteRoot, entry.srt)))}" data-video-status="${entry.status}">SRT</a><em>${esc(entry.sourceCommit.slice(0, 12))}</em></div></article>`).join("");
  return `<section class="prose video-panel${compact ? " compact" : ""}"><div class="section-head"><span>${label}</span><h2>${title}</h2></div><p>${lang === "zh" ? "视频只承诺页面和源码中能证明的事实；脚本、画面、SRT 与成片会在同一个视频目录中按版本留痕。" : "The videos promise only what the page and source can prove; script, frames, SRT, and MP4 stay versioned together."}</p><div class="video-list">${items}</div></section>`;
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
    ? { architecture: ["入口 / UI", "控制面", "模型与消息", "工具 / MCP", "状态与证据"], sequence: ["用户", "Session", "Model", "Tool", "Journal"], capability: ["循环", "上下文", "安全", "扩展", "协作"] }
    : { architecture: ["Entry / UI", "Control plane", "Model / messages", "Tools / MCP", "State / evidence"], sequence: ["User", "Session", "Model", "Tool", "Journal"], capability: ["Loop", "Context", "Security", "Extensions", "Collaboration"] };
  const nodes = labels[type];
  const width = type === "sequence" ? 980 : 900;
  const nodeMarkup = nodes.map((label, i) => {
    const x = type === "sequence" ? 45 + i * 190 : 70 + (i % 3) * 275;
    const y = type === "sequence" ? 100 : 92 + Math.floor(i / 3) * 150;
    return `<g class="diagram-node" data-node="${i}"><rect x="${x}" y="${y}" width="190" height="70" rx="5"/><text x="${x + 95}" y="${y + 32}" text-anchor="middle">${esc(label)}</text><text class="node-sub" x="${x + 95}" y="${y + 51}" text-anchor="middle">${esc(project.commit.slice(0, 8))}</text></g>`;
  }).join("");
  const lines = nodes.slice(0, -1).map((_, i) => {
    if (type === "sequence") return `<path d="M ${235 + i * 190} 135 H ${235 + i * 190 + 135}" marker-end="url(#arrow)"/>`;
    const x1 = 165 + (i % 3) * 275; const y1 = 127 + Math.floor(i / 3) * 150; const x2 = 345 + ((i + 1) % 3) * 275; const y2 = 127 + Math.floor((i + 1) / 3) * 150;
    return `<path d="M${x1} ${y1} C${x1 + 60} ${y1}, ${x2 - 60} ${y2}, ${x2} ${y2}" marker-end="url(#arrow)"/>`;
  }).join("");
  const title = lang === "zh" ? `${project.name} · ${type === "architecture" ? "架构图" : type === "sequence" ? "时序图" : "能力图"}` : `${project.name} · ${type}`;
  return `<!doctype html><html lang="${lang === "zh" ? "zh-CN" : "en"}><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)}</title><style>body{margin:0;background:#f5f4ed;color:#2d3142;font:14px system-ui,sans-serif;padding:28px}h1{font:400 36px Georgia,serif}svg{width:100%;min-width:780px;display:block}rect{fill:#fff;stroke:#2d3142;stroke-width:1.2}path{fill:none;stroke:#4f5d75;stroke-width:1.4}.diagram-node{cursor:pointer}.diagram-node:hover rect,.diagram-node.is-focus rect{fill:#f5ded3;stroke:#eb6c36}.diagram-node text{font-weight:600}.node-sub{font:10px monospace;fill:#4f5d75;font-weight:400!important}.legend{font:11px monospace;letter-spacing:.08em;color:#4f5d75}</style></head><body><p class="legend">${esc(type.toUpperCase())} · SOURCE ${esc(project.commit.slice(0, 12))}</p><h1>${esc(title)}</h1><svg viewBox="0 0 ${width} 420" role="img" aria-label="${esc(title)}"><defs><marker id="arrow" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto"><polygon points="0 0,8 3,0 6" fill="#4f5d75"/></marker></defs><rect width="100%" height="100%" fill="#f5f4ed" stroke="none"/>${lines}${nodeMarkup}</svg><p class="legend">${lang === "zh" ? "点击节点突出显示；图中标签对应报告与章节中的源码证据。" : "Click a node to focus it; labels map to the source evidence used by the report and chapters."}</p><script>document.querySelectorAll('.diagram-node').forEach(n=>n.addEventListener('click',()=>{document.querySelectorAll('.diagram-node').forEach(x=>x.classList.remove('is-focus'));n.classList.add('is-focus')}));</script></body></html>`;
}

function analysis(project, lang) {
  const file = path.join(siteRoot, "projects", project.slug, lang, "analysis.html");
  const cards = chapterDefs.map((chapter, index) => {
    const citation = findCitation(project, chapterAnchor[chapter.id]);
    return `<article class="analysis-card"><span>M${chapter.number}</span><h3>${esc(chapter.title[lang])}</h3><p>${esc(text(project, lang, "lesson"))}</p><a href="${esc(rel(file, path.join(siteRoot, "projects", project.slug, lang, "tutorial", `ch${chapter.number}-${chapter.id}.html`)))}">${lang === "zh" ? "进入本章" : "Open chapter"} →</a><small>${esc(citation.path)}:${citation.start}–${citation.end}</small></article>`;
  }).join("");
  const evidence = chapterDefs.map((chapter) => evidenceCard(project, lang, chapter, findCitation(project, chapterAnchor[chapter.id]), Number(chapter.number))).join("");
  const analysisVideo = videoById.get(`${project.slug}-analysis`);
  const courseVideos = videoCatalog.filter((entry) => entry.project === project.slug && entry.kind === "chapter");
  const videoBlock = videoPanel(project, lang, [analysisVideo, ...courseVideos], file);
  const body = `<section class="hero"><p class="eyebrow">TECHNICAL ANALYSIS · ${esc(project.branch)} · ${esc(project.commit.slice(0, 12))}</p><div class="hero-grid"><div><h1>${esc(project.name)}<br><em>${lang === "zh" ? "从源码看 Harness" : "Harness, from source"}</em></h1><p class="lede">${esc(text(project, lang, "thesis"))}</p><div class="badges"><span>${esc(project.language)}</span><span>${esc(project.kind)}</span><span>${esc(project.date.slice(0, 10))}</span></div></div><aside class="version-card"><b>${lang === "zh" ? "源码版本" : "SOURCE VERSION"}</b><code>${esc(project.commit)}</code><a href="https://github.com/${esc(project.repo)}/tree/${esc(project.commit)}" target="_blank" rel="noreferrer">${lang === "zh" ? "打开固定提交" : "Open pinned commit"} ↗</a><small>${esc(project.repo)} · ${esc(project.branch)}</small></aside></div></section><section class="prose"><div class="section-head"><span>01 · ${lang === "zh" ? "结论先行" : "THESIS"}</span><h2>${lang === "zh" ? "先用一句话抓住它的控制面" : "One sentence for the control plane"}</h2></div><p>${esc(text(project, lang, "thesis"))}</p><div class="pros-cons"><div><h3>${lang === "zh" ? "优势" : "Strengths"}</h3><ul>${project[lang].strengths.map(x => `<li>${esc(x)}</li>`).join("")}</ul></div><div><h3>${lang === "zh" ? "边界" : "Limits"}</h3><ul>${project[lang].limits.map(x => `<li>${esc(x)}</li>`).join("")}</ul></div></div></section>${videoBlock}<section class="prose dimensions"><div class="section-head"><span>02 · ${lang === "zh" ? "11 个 Harness 维度" : "11 HARNESS DIMENSIONS"}</span><h2>${lang === "zh" ? "从架构一路读到恢复，而不是只看功能清单" : "Read from architecture to recovery, not just a feature list"}</h2></div><p>${lang === "zh" ? "每张卡都给出源码落点与白话解读；页面下方再贴出完整摘录，方便从事实、推断和迁移建议三层复核。" : "Each card gives a source anchor and plain-language reading; the full excerpts below let you review facts, inferences, and migration advice separately."}</p><div class="dimension-grid">${dimensionCards(project, lang, file)}</div></section><section class="prose"><div class="section-head"><span>03 · ${lang === "zh" ? "图谱" : "MAPS"}</span><h2>${lang === "zh" ? "架构、时序、能力三张图" : "Architecture, sequence, and capability maps"}</h2></div><div class="diagram-grid"><a href="${esc(rel(file, path.join(siteRoot, "projects", project.slug, lang, "diagrams", "architecture.html")))}"><b>${lang === "zh" ? "架构图" : "Architecture"}</b><span>${lang === "zh" ? "入口 → 控制面 → 执行 → 状态" : "Entry → control → execution → state"}</span></a><a href="${esc(rel(file, path.join(siteRoot, "projects", project.slug, lang, "diagrams", "sequence.html")))}"><b>${lang === "zh" ? "时序图" : "Sequence"}</b><span>${lang === "zh" ? "一次请求如何经过各层" : "One request across layers"}</span></a><a href="${esc(rel(file, path.join(siteRoot, "projects", project.slug, lang, "diagrams", "capability.html")))}"><b>${lang === "zh" ? "能力图" : "Capability"}</b><span>${lang === "zh" ? "可用能力与风险边界" : "Capabilities and risk boundaries"}</span></a></div></section><section class="prose"><div class="section-head"><span>04 · ${lang === "zh" ? "课程目录" : "COURSE"}</span><h2>${lang === "zh" ? "一页分析之后，进入十章小白教程" : "After analysis, enter the ten-chapter beginner course"}</h2></div><div class="analysis-grid">${cards}</div></section><section class="prose evidence-section"><div class="section-head"><span>05 · ${lang === "zh" ? "源码证据" : "SOURCE EVIDENCE"}</span><h2>${lang === "zh" ? "每一章都回到固定提交" : "Every chapter returns to the pinned commit"}</h2></div><p>${lang === "zh" ? "下面的摘录来自本地拉取的最新提交；路径、行号、版本和 GitHub 链接都保留，方便你从页面继续追调用链。" : "These excerpts come from the locally cloned latest commit. Paths, line ranges, version, and GitHub links remain available for replay."}</p><div class="evidence-stack">${evidence}</div></section><footer class="site-footer"><span>${esc(project.repo)} · ${esc(project.commit)}</span><a href="${esc(rel(file, path.join(siteRoot, "index.html")))}">${lang === "zh" ? "回到总览" : "Back to atlas"} →</a></footer>`;
  return pageShell({ title: `${project.name} · ${lang === "zh" ? "技术分析" : "Technical analysis"}`, description: text(project, lang, "thesis"), lang, project, current: "analysis", body });
}

function chapterPage(project, lang, chapter, index) {
  const file = path.join(siteRoot, "projects", project.slug, lang, "tutorial", `ch${chapter.number}-${chapter.id}.html`);
  const citation = findCitation(project, chapterAnchor[chapter.id]);
  const next = chapterDefs[index + 1];
  const prev = chapterDefs[index - 1];
  const sourceLinkRelative = sourceUrl(project, citation.path, citation.start, citation.end);
  const diagramName = index % 3 === 0 ? "architecture" : index % 3 === 1 ? "sequence" : "capability";
  const diagramFile = path.join(siteRoot, "projects", project.slug, lang, "diagrams", `${diagramName}.html`);
  const chapterVideo = videoById.get(`${project.slug}-ch${chapter.number}-${chapter.id}`);
  const videoBlock = videoPanel(project, lang, [chapterVideo], file, true);
  const exercise = lang === "zh"
    ? `打开上面的源码摘录，先遮住“白话解释”，回答三个问题：谁创建了状态？谁能改变它？失败时有没有明确回执或恢复入口？最后点击 GitHub 行号核对你的判断。`
    : `Hide the plain-language explanation and answer three questions from the excerpt: who creates the state, who can change it, and what receipt or recovery path exists on failure? Then verify your answer at the GitHub line link.`;
  const body = `<section class="chapter-hero"><p class="eyebrow">M${chapter.number} · ${esc(project.name)} · ${esc(project.commit.slice(0, 12))}</p><h1>${esc(chapter.title[lang])}</h1><p class="lede">${esc(chapter.question[lang])}</p><div class="chapter-meta"><span>${lang === "zh" ? `第 ${index + 1} / ${chapterDefs.length} 章` : `Chapter ${index + 1} / ${chapterDefs.length}`}</span><span>${esc(project.language)}</span><span>${esc(project.branch)}</span></div></section>${videoBlock}<section class="lesson prose"><div class="lesson-route"><span>${lang === "zh" ? "本章路线" : "ROUTE"}</span><b>${lang === "zh" ? "问题" : "Question"}</b><i>→</i><b>${lang === "zh" ? "比喻" : "Analogy"}</b><i>→</i><b>${lang === "zh" ? "源码" : "Source"}</b><i>→</i><b>${lang === "zh" ? "练习" : "Exercise"}</b></div><div class="callout"><b>${lang === "zh" ? "先用一个生活比喻" : "Start with a concrete analogy"}</b><p>${esc(analogies[lang][chapter.id])}</p></div><h2>${lang === "zh" ? "先回答本章问题" : "Answer the chapter question first"}</h2><p>${esc(chapter.question[lang])} ${esc(text(project, lang, "lesson"))}</p><h2>${lang === "zh" ? "再看这段源码" : "Now read the source"}</h2><div class="source-card"><div><span>${esc(citation.path)} · L${citation.start}–${citation.end}</span><a href="${esc(sourceLinkRelative)}" target="_blank" rel="noreferrer">${lang === "zh" ? "打开固定提交" : "Open pinned commit"} ↗</a></div><pre><code>${esc(citation.snippet)}</code></pre></div><h2>${lang === "zh" ? "翻译成小白能懂的话" : "Translate it into plain language"}</h2><p>${esc(lang === "zh" ? `这段代码不是“顺便做了点事”，它在本章控制面上承担一个明确职责。阅读时先找输入、状态变化、外部副作用和错误出口，再把它放回 ${project.name} 的完整任务链。` : `This code is not incidental. It owns a specific control-plane responsibility. Look for inputs, state changes, external effects, and error exits, then place it back into ${project.name}'s task chain.`)}</p><div class="flow-strip"><span>${lang === "zh" ? "输入" : "Input"}</span><i>→</i><span>${lang === "zh" ? "规则 / 状态" : "Rules / state"}</span><i>→</i><span>${lang === "zh" ? "动作" : "Action"}</span><i>→</i><span>${lang === "zh" ? "回执" : "Receipt"}</span></div><h2>${lang === "zh" ? "把它放进图里" : "Place it on the map"}</h2><iframe class="diagram-frame" src="${esc(rel(file, diagramFile))}" title="${esc(project.name)} ${esc(diagramName)}" loading="lazy"></iframe><h2>${lang === "zh" ? "小练习：不要只会复述" : "Exercise: do more than repeat"}</h2><div class="exercise"><p>${esc(exercise)}</p><details><summary>${lang === "zh" ? "查看提示" : "Show hint"}</summary><p>${esc(lang === "zh" ? `提示：如果源码里只有 prompt 或 UI 文案，没有状态、权限或执行代码，不要把它写成强保证。` : `Hint: if the excerpt only contains prompt or UI copy and no state, permission, or execution code, do not describe it as a hard guarantee.`)}</p></details></div></section><footer class="chapter-footer"><a href="${prev ? esc(`ch${prev.number}-${prev.id}.html`) : esc("index.html")}">← ${prev ? esc(prev.title[lang]) : lang === "zh" ? "课程目录" : "Course index"}</a><a href="${next ? esc(`ch${next.number}-${next.id}.html`) : esc("index.html")}">${next ? esc(next.title[lang]) : lang === "zh" ? "回到课程目录" : "Course index"} →</a></footer>`;
  return pageShell({ title: `${project.name} · M${chapter.number} · ${chapter.title[lang]}`, description: chapter.question[lang], lang, project, current: `ch${chapter.number}-${chapter.id}`, body });
}

function tutorialIndex(project, lang) {
  const file = path.join(siteRoot, "projects", project.slug, lang, "tutorial", "index.html");
  const cards = chapterDefs.map((chapter) => { const video = videoById.get(`${project.slug}-ch${chapter.number}-${chapter.id}`); return `<a class="chapter-card" href="ch${chapter.number}-${chapter.id}.html"><span>M${chapter.number}</span><div><h3>${esc(chapter.title[lang])}</h3><p>${esc(chapter.question[lang])}</p><small>${lang === "zh" ? "进入本章" : "Open chapter"} →</small><small class="chapter-video"><span>${lang === "zh" ? "章节视频" : "Video"}</span> ${video.status === "published" ? "MP4" : (lang === "zh" ? "待发布" : "pending")}</small></div></a>`; }).join("");
  const body = `<section class="course-hero"><p class="eyebrow">${esc(project.name)} · ${lang === "zh" ? "小白源码教程" : "BEGINNER SOURCE COURSE"}</p><h1>${lang === "zh" ? "从第一张地图读到最后一个证据" : "From the first map to the last receipt"}</h1><p class="lede">${esc(text(project, lang, "thesis"))}</p><div class="version-line"><span>${esc(project.repo)}</span><code>${esc(project.branch)} @ ${esc(project.commit)}</code><a href="https://github.com/${esc(project.repo)}/tree/${esc(project.commit)}" target="_blank" rel="noreferrer">${lang === "zh" ? "打开固定源码" : "Open pinned source"} ↗</a><a href="../analysis.html">${lang === "zh" ? "先看单页技术分析" : "Read the single-page analysis"} ↗</a></div></section><section class="prose course-intro"><div class="section-head"><span>COURSE CONTRACT</span><h2>${lang === "zh" ? "每章都按同一套阅读动作" : "Every chapter follows the same reading moves"}</h2></div><p>${lang === "zh" ? "先提出一个普通人会问的问题，再给生活比喻，然后展示固定提交的真实代码、架构/时序/能力图和一个练习。你可以把章节当作独立页面读，也可以用左侧目录连续学习。" : "Start with a beginner's question, use a concrete analogy, inspect a real code range from the pinned commit, view an architecture/sequence/capability map, and finish with an exercise. Each chapter stands alone or forms a continuous course."}</p><div class="course-stats"><b>10</b><span>${lang === "zh" ? "独立章节" : "chapters"}</span><b>${esc(project.commit.slice(0, 8))}</b><span>${lang === "zh" ? "固定源码" : "pinned source"}</span></div></section><section class="chapter-list prose"><div class="section-head"><span>01—10</span><h2>${lang === "zh" ? "章节目录" : "Chapter index"}</h2></div><div class="chapter-grid">${cards}</div></section><footer class="site-footer"><a href="../analysis.html">← ${lang === "zh" ? "技术分析单页" : "Technical analysis"}</a><a href="${esc(rel(file, path.join(siteRoot, "index.html")))}">${lang === "zh" ? "回到总览" : "Back to atlas"} →</a></footer>`;
  return pageShell({ title: `${project.name} · ${lang === "zh" ? "小白教程目录" : "Beginner course"}`, description: text(project, lang, "thesis"), lang, project, current: null, body });
}

function indexPage(lang) {
  const file = path.join(siteRoot, `${lang}/index.html`);
  const cards = projects.map((p, i) => `<article class="atlas-card"><div class="atlas-num">${String(i + 1).padStart(2, "0")}</div><div><p class="eyebrow">${esc(p.kind)}</p><h2>${esc(p.name)}</h2><p>${esc(text(p, lang, "thesis"))}</p><div class="atlas-actions"><a href="../projects/${p.slug}/${lang}/analysis.html">${lang === "zh" ? "技术分析" : "Analysis"} ↗</a><a href="../projects/${p.slug}/${lang}/tutorial/index.html">${lang === "zh" ? "小白教程" : "Tutorial"} ↗</a><span>${esc(p.commit.slice(0, 12))}</span></div></div></article>`).join("");
  const matrix = projects.map((p) => `<tr><th>${esc(p.name)}<small>${esc(p.language)}</small></th><td>${esc(p[lang].strengths[0])}</td><td>${esc(p[lang].strengths[1])}</td><td>${esc(p[lang].limits[0])}</td><td>${esc(p.branch)}<br><code>${esc(p.commit.slice(0, 12))}</code></td></tr>`).join("");
  const body = `<section class="atlas-hero"><p class="eyebrow">OPEN-SOURCE AGENT HARNESS ATLAS · ${lang === "zh" ? "独立重建版" : "INDEPENDENT REBUILD"}</p><h1>${lang === "zh" ? "7 个开源 Harness，<em>逐层读懂</em>" : "7 open harnesses,<br><em>read layer by layer</em>"}</h1><p class="lede">${lang === "zh" ? "每个项目都有单页技术分析、10 章小白教程、固定提交源码链接、架构/时序/能力图和视频入口。所有结论从最新拉取的源码开始，而不是从 README 猜出来。" : "Every project has a single-page analysis, a ten-chapter beginner course, pinned-source links, architecture/sequence/capability maps, and video hooks. Claims start from freshly cloned source, not README guesses."}</p><div class="atlas-metrics"><span><b>7</b>${lang === "zh" ? "项目" : "projects"}</span><span><b>70</b>${lang === "zh" ? "章节 / 语言" : "chapters / language"}</span><span><b>21</b>${lang === "zh" ? "交互图" : "interactive maps"}</span><span><b>${lang === "zh" ? "HEAD" : "HEAD"}</b>${lang === "zh" ? "版本锁定" : "pinned"}</span></div></section><section class="prose atlas-intro"><div class="section-head"><span>METHOD</span><h2>${lang === "zh" ? "先看版本，再看调用链" : "Version first, call chain second"}</h2></div><p>${lang === "zh" ? "每次项目更新都可能改变功能，所以本合集把 branch、commit、提交时间和 GitHub 行号写在页面上。教程中的“它支持什么”必须能回到文件和行号；“适合我们怎么借鉴”则单独标成迁移判断。" : "Every update can change behavior, so each page records branch, commit, date, and GitHub line ranges. “What it supports” must return to a file and line; “how to borrow the idea” is kept as a separate migration judgment."}</p></section><section class="atlas-list prose"><div class="section-head"><span>01 · PROJECTS</span><h2>${lang === "zh" ? "7 条实现路线" : "Seven implementation paths"}</h2></div>${cards}</section><section class="matrix prose"><div class="section-head"><span>02 · MATRIX</span><h2>${lang === "zh" ? "优势与边界横向对照" : "Strengths and boundaries"}</h2></div><div class="matrix-wrap" tabindex="0"><table><thead><tr><th>${lang === "zh" ? "项目" : "Project"}</th><th>${lang === "zh" ? "优势 1" : "Strength 1"}</th><th>${lang === "zh" ? "优势 2" : "Strength 2"}</th><th>${lang === "zh" ? "主要边界" : "Main boundary"}</th><th>${lang === "zh" ? "版本" : "Version"}</th></tr></thead><tbody>${matrix}</tbody></table></div></section><footer class="site-footer"><span>Superkimi/awesome-harness · ${lang === "zh" ? "独立项目" : "independent project"}</span><a href="${lang === "zh" ? "../en/index.html" : "../zh/index.html"}">${lang === "zh" ? "English version →" : "中文版 →"}</a></footer>`;
  return pageShell({ title: lang === "zh" ? "Awesome Harness · 开源 Agent Harness 教程合集" : "Awesome Harness · Open-source agent harness atlas", description: lang === "zh" ? "7 个开源 Agent Harness 的双语技术分析与章节教程" : "Bilingual technical analyses and chapter courses for seven open-source agent harnesses", lang, body, atlasPage: true });
}

const css = `:root{--paper:#f5f1e6;--paper2:#ebe3d1;--ink:#18385f;--ink2:#2e587e;--text:#2e2d28;--muted:#777264;--line:#c6b99f;--red:#a54a35;--gold:#a98236;--shadow:0 14px 38px rgba(47,39,24,.12);--rail:258px}*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;color:var(--text);background:var(--paper);font-family:"Songti SC","STSong","Noto Serif CJK SC",Georgia,serif;line-height:1.8;background-image:radial-gradient(rgba(25,57,95,.045) .7px,transparent .7px),linear-gradient(100deg,rgba(255,255,255,.22),transparent 48%,rgba(166,132,70,.035));background-size:8px 8px,100% 100%}a{color:var(--ink);text-decoration:none}.reading-progress{position:fixed;top:0;left:0;height:3px;width:0;background:var(--red);z-index:99}.site-top{height:58px;position:sticky;top:0;z-index:50;display:flex;align-items:center;gap:20px;padding:0 26px;background:rgba(245,241,230,.93);backdrop-filter:blur(12px);border-bottom:1px solid var(--line)}.brand{font:700 14px/1 "SFMono-Regular",monospace;letter-spacing:.08em;color:var(--ink)}.brand em{font-style:normal;color:var(--red)}.crumb{font:10px "SFMono-Regular",monospace;color:var(--muted)}.site-top nav{margin-left:auto;display:flex;gap:16px;align-items:center}.site-top nav a{font:10px "SFMono-Regular",monospace;color:var(--muted)}.site-top nav a:hover{color:var(--ink)}.menu-button{display:none;border:0;background:none;color:var(--ink);font-size:22px}.layout{display:flex;min-height:calc(100vh - 58px)}.side-nav{position:fixed;top:58px;bottom:0;left:0;width:var(--rail);padding:25px 17px;background:rgba(235,227,209,.94);border-right:1px solid var(--line);overflow:auto;z-index:30}.side-nav>a{display:grid;grid-template-columns:35px 1fr;gap:6px;padding:7px 9px;border-radius:4px;color:#58554c;font-size:11px;line-height:1.35}.side-nav>a span{color:#9a8c74;font:9px "SFMono-Regular",monospace}.side-nav>a:hover,.side-nav>a.active{background:var(--ink);color:var(--paper)}.side-nav>a.active span{color:#d9c68e}.side-label{margin:18px 8px 8px;color:var(--red);font:9px "SFMono-Regular",monospace;letter-spacing:.12em}.side-project{border-bottom:1px solid var(--line);padding:0 8px 15px}.side-project strong{display:block;color:var(--ink);font:22px Georgia,serif}.side-project small{display:block;margin-top:4px;color:var(--muted);font-size:10px}.side-foot{margin-top:22px;padding:14px 8px;color:#8b7c64;font:9px/1.5 "SFMono-Regular",monospace;letter-spacing:.08em}main{width:calc(100% - var(--rail));margin-left:var(--rail);min-width:0}.hero,.atlas-hero,.chapter-hero,.course-hero{padding:78px clamp(24px,7vw,120px) 70px;min-height:560px;border-bottom:1px solid var(--ink);position:relative;overflow:hidden}.hero:after,.atlas-hero:after,.chapter-hero:after,.course-hero:after{content:"";position:absolute;width:520px;height:520px;border:1px solid rgba(25,57,95,.16);border-radius:50%;right:-220px;bottom:-320px;box-shadow:0 0 0 58px rgba(25,57,95,.025),0 0 0 116px rgba(25,57,95,.02)}.hero>* ,.atlas-hero>* ,.chapter-hero>* ,.course-hero>*{position:relative;z-index:1}.eyebrow,.section-head>span,.lesson-route>span{font:10px "SFMono-Regular",monospace;letter-spacing:.13em;color:var(--red)}.hero-grid{display:grid;grid-template-columns:minmax(0,1.3fr) minmax(300px,.7fr);gap:60px;align-items:center;margin-top:42px}.hero h1,.atlas-hero h1,.chapter-hero h1,.course-hero h1{margin:10px 0 24px;color:var(--ink);font:400 clamp(53px,7.5vw,104px)/.94 Georgia,serif;letter-spacing:-.055em}.hero h1 em,.atlas-hero h1 em{color:var(--red);font-style:normal}.lede{max-width:900px;font-size:20px;color:#4d4b43}.badges,.chapter-meta{display:flex;flex-wrap:wrap;gap:8px;margin-top:27px}.badges span,.chapter-meta span,.version-line span,.version-line code{padding:6px 10px;border:1px solid #9e927b;border-radius:20px;color:#615b4e;font:10px "SFMono-Regular",monospace}.version-card{padding:24px;border:1px solid var(--ink);background:rgba(246,241,227,.62);box-shadow:var(--shadow)}.version-card b{display:block;color:var(--red);font:10px "SFMono-Regular",monospace}.version-card code{display:block;margin:16px 0;overflow-wrap:anywhere;color:var(--ink);font:11px "SFMono-Regular",monospace}.version-card a{display:block;border-top:1px solid var(--line);padding-top:12px;font:10px "SFMono-Regular",monospace}.version-card small{display:block;margin-top:12px;color:var(--muted);font:10px "SFMono-Regular",monospace}.prose{padding:74px clamp(24px,7vw,120px);border-bottom:1px solid var(--line);max-width:1600px;margin:0 auto}.section-head{margin-bottom:24px}.section-head h2{margin:12px 0 0;color:var(--ink);font:400 clamp(31px,4.3vw,58px)/1.1 Georgia,serif;letter-spacing:-.03em}.prose>p{max-width:950px;font-size:17px}.pros-cons{display:grid;grid-template-columns:1fr 1fr;gap:28px;margin-top:35px}.pros-cons>div{border-top:2px solid var(--ink);padding-top:14px}.pros-cons h3{color:var(--ink);font-size:19px}.pros-cons li{margin:6px 0;font-size:14px}.diagram-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}.diagram-grid a{display:block;border:1px solid var(--line);padding:23px;background:rgba(246,241,227,.5)}.diagram-grid b{display:block;color:var(--ink);font-size:20px}.diagram-grid span{display:block;margin-top:8px;color:var(--muted);font-size:13px}.analysis-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:13px}.analysis-card{border:1px solid var(--line);padding:20px;background:rgba(246,241,227,.48)}.analysis-card>span,.atlas-num{color:var(--red);font:12px "SFMono-Regular",monospace}.analysis-card h3{margin:7px 0;color:var(--ink);font-size:21px}.analysis-card p{font-size:13px;color:var(--muted)}.analysis-card a{display:inline-block;margin-top:8px;color:var(--red);font:10px "SFMono-Regular",monospace}.analysis-card small{display:block;margin-top:12px;color:var(--muted);font:9px "SFMono-Regular",monospace}.evidence-stack{display:grid;gap:20px}.evidence-card,.source-card{border:1px solid var(--ink);background:#172e47;color:#ede5d4;box-shadow:var(--shadow)}.evidence-head,.source-card>div{display:flex;gap:15px;justify-content:space-between;padding:10px 13px;border-bottom:1px solid #536a7c;font:9px "SFMono-Regular",monospace}.evidence-card a,.source-card a{color:#c4d1d8}.evidence-card pre,.source-card pre{margin:0;padding:15px;max-height:440px;overflow:auto;font:10px/1.55 "SFMono-Regular",monospace}.evidence-card p{margin:0;padding:12px 15px;color:#c4d1d8;font-size:12px}.site-footer,.chapter-footer{display:flex;justify-content:space-between;gap:18px;padding:28px clamp(24px,7vw,120px) 42px;background:var(--ink);color:var(--paper)}.site-footer a,.chapter-footer a{color:var(--paper);font-size:12px}.site-footer span{font:9px "SFMono-Regular",monospace;color:#b8c4cc}.atlas-hero,.course-hero{min-height:610px}.atlas-metrics,.course-stats{display:flex;max-width:900px;border:1px solid var(--ink);margin-top:36px}.atlas-metrics span,.course-stats span,.course-stats b{padding:14px 18px;border-right:1px solid var(--ink);font:10px "SFMono-Regular",monospace;color:var(--muted)}.atlas-metrics span:last-child,.course-stats span:last-child{border-right:0}.atlas-metrics b,.course-stats b{display:block;color:var(--ink);font:32px Georgia,serif}.atlas-list{display:grid;gap:0}.atlas-card{display:grid;grid-template-columns:70px 1fr;gap:20px;border-top:1px solid var(--ink);padding:30px 0}.atlas-card h2{margin:4px 0 9px;color:var(--ink);font:400 34px Georgia,serif}.atlas-card>div:last-child>p{max-width:850px;color:var(--muted);font-size:15px}.atlas-actions{display:flex;flex-wrap:wrap;gap:17px;align-items:center;margin-top:14px}.atlas-actions a{font:10px "SFMono-Regular",monospace;color:var(--red)}.atlas-actions span{color:var(--muted);font:9px "SFMono-Regular",monospace}.matrix-wrap{overflow:auto;border:1px solid var(--ink);box-shadow:var(--shadow)}.matrix table{border-collapse:collapse;width:1450px;table-layout:fixed;font-size:12px;background:rgba(246,241,227,.42)}.matrix th,.matrix td{padding:14px;border-right:1px solid var(--line);border-bottom:1px solid var(--line);vertical-align:top;text-align:left}.matrix thead th{position:sticky;top:0;z-index:2;background:var(--ink);color:var(--paper);font:10px "SFMono-Regular",monospace}.matrix tbody th{color:var(--ink);font-size:16px}.matrix tbody th small{display:block;margin-top:5px;color:var(--muted);font:9px "SFMono-Regular",monospace}.matrix code,.version-line code{font-size:9px}.course-intro{background:rgba(226,216,193,.3)}.course-intro p{max-width:900px}.chapter-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:12px}.chapter-card{display:grid;grid-template-columns:54px 1fr;gap:14px;border:1px solid var(--line);padding:18px;background:rgba(246,241,227,.48)}.chapter-card>span{color:var(--red);font:22px Georgia,serif}.chapter-card h3{margin:0;color:var(--ink);font-size:18px}.chapter-card p{margin:7px 0;color:var(--muted);font-size:13px}.chapter-card small{color:var(--red);font:9px "SFMono-Regular",monospace}.version-line{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin-top:30px}.version-line a{font:10px "SFMono-Regular",monospace;color:var(--red)}.lesson-route{display:flex;flex-wrap:wrap;gap:10px;align-items:center;margin-bottom:30px;color:var(--muted);font:10px "SFMono-Regular",monospace}.lesson-route b{padding:5px 8px;border:1px solid var(--line);font-weight:400}.lesson-route i{color:var(--red);font-style:normal}.callout{max-width:900px;padding:18px 20px;border-left:3px solid var(--gold);background:rgba(235,227,209,.55)}.callout b{color:var(--ink);font-size:13px}.callout p{margin:6px 0 0;font-size:17px}.lesson h2{margin:45px 0 15px;color:var(--ink);font:400 clamp(26px,3.2vw,44px)/1.15 Georgia,serif}.source-card pre{max-height:520px}.flow-strip{display:flex;flex-wrap:wrap;gap:10px;align-items:center;margin:25px 0}.flow-strip span{padding:9px 12px;border:1px solid var(--ink);background:rgba(246,241,227,.58);color:var(--ink);font:11px "SFMono-Regular",monospace}.flow-strip i{color:var(--red);font-style:normal}.diagram-frame{width:100%;height:520px;border:1px solid var(--ink);background:#f5f4ed}.exercise{border-top:2px solid var(--ink);padding:16px 4px}.exercise details{margin-top:16px;border-top:1px solid var(--line);padding-top:10px}.exercise summary{cursor:pointer;color:var(--red);font:10px "SFMono-Regular",monospace}@media(max-width:1050px){:root{--rail:210px}.hero-grid{grid-template-columns:1fr}.diagram-grid,.pros-cons{grid-template-columns:1fr}.analysis-grid{grid-template-columns:1fr}}@media(max-width:760px){:root{--rail:0}.site-top{padding:0 14px}.menu-button{display:block}.crumb{display:none}.site-top nav a:nth-child(1),.site-top nav a:nth-child(2){display:none}.side-nav{transform:translateX(-105%);width:285px;transition:transform .25s ease}.side-nav.open{transform:translateX(0)}main{width:100%;margin-left:0}.hero,.atlas-hero,.chapter-hero,.course-hero,.prose{padding:48px 18px}.hero h1,.atlas-hero h1,.chapter-hero h1,.course-hero h1{font-size:54px}.lede{font-size:17px}.atlas-metrics,.course-stats{display:grid;grid-template-columns:repeat(2,1fr)}.atlas-metrics span:nth-child(2),.atlas-metrics span:nth-child(4),.course-stats span:nth-child(2){border-right:0}.atlas-card{grid-template-columns:48px 1fr}.chapter-grid{grid-template-columns:1fr}.site-footer,.chapter-footer{display:block}.site-footer a,.chapter-footer a{display:inline-block;margin-top:15px}.diagram-frame{height:470px}.version-line{align-items:flex-start;flex-direction:column}}@media(prefers-reduced-motion:reduce){*{scroll-behavior:auto!important;transition:none!important}}`;

const supplementalCss = `.dimensions{background:rgba(226,216,193,.26)}.dimension-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.dimension-card{display:grid;grid-template-columns:44px 1fr;gap:14px;border:1px solid var(--line);padding:18px;background:rgba(246,241,227,.58)}.dimension-index{color:var(--red);font:22px Georgia,serif}.dimension-card h3{margin:0;color:var(--ink);font-size:18px}.dimension-card p{margin:8px 0;color:var(--muted);font-size:13px}.dimension-card a{font:9px "SFMono-Regular",monospace;color:var(--red)}.matrix-wrap{overflow-x:auto;overflow-y:visible}.matrix table{min-width:1450px}.matrix thead th{white-space:nowrap}.video-panel{background:rgba(24,56,95,.055)}.video-panel.compact{padding-top:34px;padding-bottom:34px}.video-list{display:grid;gap:8px}.video-item{display:flex;justify-content:space-between;align-items:center;gap:18px;border-top:1px solid var(--line);padding:12px 0}.video-item>div:first-child{display:grid;gap:3px}.video-item span,.video-item em,.video-links{font:9px "SFMono-Regular",monospace;color:var(--muted)}.video-item b{color:var(--ink);font-size:14px;font-weight:600}.video-links{display:flex;gap:10px;align-items:center;white-space:nowrap}.video-links a{color:var(--red)}.video-links em{font-style:normal}.chapter-video{display:inline-block;margin-left:12px;color:var(--muted)!important}.chapter-video span{color:var(--red)!important}h1,h2,h3,p{overflow-wrap:anywhere}@media(max-width:1050px){.dimension-grid{grid-template-columns:1fr}}@media(max-width:760px){.video-item{display:block}.video-links{margin-top:8px}}`;

const js = `const bar=document.getElementById('reading-progress');const update=()=>{const max=document.documentElement.scrollHeight-innerHeight;bar&&(bar.style.width=(max?scrollY/max*100:0)+'%')};addEventListener('scroll',update,{passive:true});addEventListener('load',update);update();document.querySelector('[data-menu]')?.addEventListener('click',()=>document.querySelector('[data-side]')?.classList.toggle('open'));`;

write(path.join(siteRoot, "assets/harness.css"), css + supplementalCss);
write(path.join(siteRoot, "assets/harness.js"), js);
write(path.join(siteRoot, "zh/index.html"), indexPage("zh"));
write(path.join(siteRoot, "en/index.html"), indexPage("en"));
write(path.join(siteRoot, "index.html"), `<!doctype html><meta http-equiv="refresh" content="0; url=zh/index.html"><a href="zh/index.html">Awesome Harness</a>`);

for (const project of projects) {
  for (const lang of ["zh", "en"]) {
    const projectRoot = path.join(siteRoot, "projects", project.slug, lang);
    write(path.join(projectRoot, "analysis.html"), analysis(project, lang));
    write(path.join(projectRoot, "tutorial/index.html"), tutorialIndex(project, lang));
    for (const [index, chapterDef] of chapterDefs.entries()) write(path.join(projectRoot, "tutorial", `ch${chapterDef.number}-${chapterDef.id}.html`), chapterPage(project, lang, chapterDef, index));
    for (const type of ["architecture", "sequence", "capability"]) write(path.join(projectRoot, "diagrams", `${type}.html`), diagram(project, lang, type));
  }
}

const versions = Object.fromEntries(projects.map((p) => [p.slug, { name: p.name, repo: p.repo, branch: p.branch, commit: p.commit, date: p.date, source: `sources/${p.slug}` }]));
write(path.join(siteRoot, "data/versions.json"), `${JSON.stringify({ generatedAt: new Date().toISOString(), projects: versions }, null, 2)}\n`);
write(path.join(siteRoot, "data/videos.json"), `${JSON.stringify({ generatedAt: new Date().toISOString(), entries: videoCatalog }, null, 2)}\n`);
write(path.join(root, "README.zh.md"), [
  "# Awesome Harness",
  "",
  `独立维护的开源 Agent Harness 教程合集。当前锁定 ${projects.length} 个最新源码提交，每个项目提供：`,
  "",
  "- 中文/English 单页技术分析",
  "- 10 章独立小白教程页面",
  "- 架构图、时序图、能力图（可点击节点）",
  "- 固定 commit、源码行号和 GitHub 跳转",
  "- 技术分析视频与章节视频的发布位",
  "",
  "站点入口：site/zh/index.html。版本账本：site/data/versions.json。",
  "",
  "sources/ 是本地审计输入，不提交到仓库；需要复现源码摘录时先运行 node scripts/fetch-sources.mjs，它会按 data/projects.mjs 中的 commit checkout。然后运行 node scripts/generate-site.mjs，最后运行 node scripts/validate-site.mjs。",
  "",
  "注意：Diagram Design 是一个图形生成 Skill/Harness，不是可执行 Agent runtime；报告会把它放在同一横向矩阵里，但不会把它冒充成沙箱执行器。",
  "",
  "> 生成页面：node scripts/generate-site.mjs",
  ""
].join("\n"));
write(path.join(root, "README.en.md"), [
  "# Awesome Harness",
  "",
  `An independently maintained bilingual atlas of open-source Agent Harness projects. The current snapshot pins ${projects.length} freshly cloned repositories. Every project includes:`,
  "",
  "- Chinese and English single-page technical analysis",
  "- Ten standalone beginner tutorial chapters",
  "- Clickable architecture, sequence, and capability maps",
  "- Pinned commits, line ranges, and GitHub links",
  "- Slots for the technical-analysis and chapter video releases",
  "",
  "Site entry: site/en/index.html. Version ledger: site/data/versions.json.",
  "",
  "sources/ is local audit input and is intentionally not committed. To reproduce source excerpts, run node scripts/fetch-sources.mjs; it checks out the commits recorded in data/projects.mjs. Then run node scripts/generate-site.mjs and node scripts/validate-site.mjs.",
  "",
  "Note: Diagram Design is a diagram-generation Skill/Harness, not an executable agent runtime. The matrix compares it as a harness specimen without claiming it is an execution sandbox.",
  "",
  "> Generate pages with: node scripts/generate-site.mjs",
  ""
].join("\n"));
console.log(JSON.stringify({ projects: projects.length, languages: 2, chaptersPerProject: chapterDefs.length, pages: projects.length * 2 * (1 + 1 + chapterDefs.length + 3) + 3 }));
