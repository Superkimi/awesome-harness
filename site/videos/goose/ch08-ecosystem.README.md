# M08 · 扩展：MCP、Skills 和 Hooks 怎样接进来

- Project: Legacy Goose
- Fixed source commit: 11deb564d09db782a17878af7cfafd299d9fa461
- Evidence ledger: data/legacy/evidence/goose/evidence.json
- Episode: ch08-ecosystem
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - crates/goose/src/agents/extension_manager.rs:1271-1342 · MCP 工具被统一命名空间化、缓存和动态刷新
  - crates/goose/src/agents/extension_manager.rs:612-730 · 远端 MCP 支持 HTTP、OAuth 和交互通知
  - crates/goose/src/agents/extension_manager.rs:322-346 · MCP UI 元数据采用“先剥离、再可信补写”
  - crates/goose/src/skills/mod.rs:313-341 · Skills 采用渐进加载和多生态目录兼容
  - crates/goose/src/hooks/mod.rs:64-95 · 插件 Hooks 覆盖工具、文件、Shell、会话和停止事件
