# Awesome Harness

An independently maintained bilingual atlas of open-source Agent Harness projects. The current release contains 8 source snapshots plus 18 projects refreshed to their current remote branch HEAD. Legacy projects retain the previous finding ledger structure, but source excerpts, commits, line ranges, and links were regenerated; the pages distinguish “source refreshed” from “historical finding still requiring semantic re-review.” Every project includes:

- Chinese and English single-page technical analysis
- Ten standalone beginner tutorial chapters
- Clickable architecture, sequence, and capability maps
- Per-chapter source maps with six real local files and pinned passages
- Per-project implementation dossier for entrypoints, manifests, plugins/MCP, tests, and commands
- A 21-concept source audit covering logs, approvals, projections, jobs, transactions, queues, parallelism, and more
- Pinned commits, line ranges, and GitHub links
- Slots for the technical-analysis and chapter video releases
- Preserved long-form prior-finding audits under site/legacy/reports/, alongside the common ten-chapter entrypoint

Site entry: site/en/index.html. Version ledger: site/data/versions.json.

sources/ is local audit input and is intentionally not committed. To reproduce source excerpts, run node scripts/fetch-sources.mjs; it checks out the commits recorded in data/projects.mjs. Then run node scripts/generate-site.mjs and node scripts/validate-site.mjs.

Note: Diagram Design is a diagram-generation Skill/Harness, not an executable agent runtime. The matrix compares it as a harness specimen without claiming it is an execution sandbox. data/legacy/ contains historical findings plus the current source version ledger; run npm run refresh-legacy to refresh the legacy repositories and their code excerpts.

> Generate pages with: node scripts/generate-site.mjs
