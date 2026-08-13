# Awesome Harness

An independently maintained bilingual atlas of open-source Agent Harness projects. The current release contains seven freshly cloned source snapshots plus 18 legacy projects migrated from the previous source ledger. Both groups record branch, commit, and line-level citations; legacy pages are explicitly not presented as the latest 2026-08 HEAD. Every project includes:

- Chinese and English single-page technical analysis
- Ten standalone beginner tutorial chapters
- Clickable architecture, sequence, and capability maps
- Pinned commits, line ranges, and GitHub links
- Slots for the technical-analysis and chapter video releases
- Preserved long-form legacy audits under site/legacy/reports/, alongside the common ten-chapter entrypoint

Site entry: site/en/index.html. Version ledger: site/data/versions.json.

sources/ is local audit input and is intentionally not committed. To reproduce source excerpts, run node scripts/fetch-sources.mjs; it checks out the commits recorded in data/projects.mjs. Then run node scripts/generate-site.mjs and node scripts/validate-site.mjs.

Note: Diagram Design is a diagram-generation Skill/Harness, not an executable agent runtime. The matrix compares it as a harness specimen without claiming it is an execution sandbox. data/legacy/ contains the prior audit evidence and version ledger; refresh those eighteen repositories before claiming a same-date HEAD snapshot.

> Generate pages with: node scripts/generate-site.mjs
