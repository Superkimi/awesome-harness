# Awesome Harness

An independently maintained bilingual atlas of open-source Agent Harness projects. The current release contains 26 fixed source snapshots. Every page is generated from locally cloned source, tests, and event contracts:

- Chinese and English single-page technical analysis
- Eleven standalone source-reading chapters, including command execution
- Clickable architecture, sequence, capability, loop, and command maps
- Per-chapter source maps with six real local files and pinned passages
- Per-project implementation dossier for entrypoints, manifests, plugins/MCP, tests, and commands
- A 21-concept source audit covering logs, approvals, projections, jobs, transactions, queues, parallelism, and more
- Pinned commits, line ranges, and GitHub links
- This repository ships only text tutorials, source evidence, and interactive maps; video releases live in the separate video repository

Site entry: site/en/index.html. Version ledger: site/data/versions.json.

sources/ is local audit input and is intentionally not committed. To reproduce source excerpts, run node scripts/fetch-sources.mjs; it checks out the commits recorded in data/projects.mjs. Then run node scripts/generate-site.mjs and node scripts/validate-site.mjs.

Note: Diagram Design is a diagram-generation Skill/Harness, not an executable agent runtime. The matrix compares it as a harness specimen without claiming it is an execution sandbox.

> Generate pages with: node scripts/generate-site.mjs
