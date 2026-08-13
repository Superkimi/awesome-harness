# Awesome Harness

An independently maintained bilingual atlas of open-source Agent Harness projects. The current snapshot pins 7 freshly cloned repositories. Every project includes:

- Chinese and English single-page technical analysis
- Ten standalone beginner tutorial chapters
- Clickable architecture, sequence, and capability maps
- Pinned commits, line ranges, and GitHub links
- Slots for the technical-analysis and chapter video releases

Site entry: site/en/index.html. Version ledger: site/data/versions.json.

sources/ is local audit input and is intentionally not committed. To reproduce source excerpts, run node scripts/fetch-sources.mjs; it checks out the commits recorded in data/projects.mjs. Then run node scripts/generate-site.mjs and node scripts/validate-site.mjs.

Note: Diagram Design is a diagram-generation Skill/Harness, not an executable agent runtime. The matrix compares it as a harness specimen without claiming it is an execution sandbox.

> Generate pages with: node scripts/generate-site.mjs
