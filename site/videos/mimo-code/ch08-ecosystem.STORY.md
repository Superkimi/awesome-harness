# M08 · 扩展：MCP、Skill、插件如何接入

## Hook
老板要把 Skill 接进 Compose，我先确认插件入口和扩展边界。

## Source proof
- packages/plugin/src/index.ts · plugin|extension

## Lesson
插件是可注入能力，但必须经过清晰的 extension 入口。
