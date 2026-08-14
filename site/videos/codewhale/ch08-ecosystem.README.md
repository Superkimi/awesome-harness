# M08 · 扩展：MCP、Skills、插件 trust 与 strict hook

- Project: Legacy CodeWhale
- Fixed source commit: cfc2f2b13c070e900ee10dbeffb07028d3beaebd
- Evidence ledger: data/legacy/evidence/codewhale/evidence.json
- Episode: ch08-ecosystem
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - crates/tui/src/mcp.rs:1-37 · MCP 连接器覆盖 stdio、Streamable HTTP、SSE 和 OAuth，并有连接池
  - crates/tui/src/mcp.rs:57-90 · MCP secrets 不进入错误文本，远端响应和 body 也有边界
  - crates/tui/src/mcp.rs:641-695 · reviewed plugin 的 MCP 在 launch、origin 和 catalog 暴露前都要复核 authority
  - crates/tui/src/skills/mod.rs:131-224 · Skills 同时兼容生态目录与 CodeWhale owned roots，支持 explicit-only 和 locale 描述
  - crates/tui/src/plugins/registry.rs:123-169 · 插件 trust 和 enable 分离，内容/能力 hash 变化会自动失信
  - crates/tui/src/hooks/config.rs:656-697 · Hook 事件覆盖 turn/tool/subagent，ToolCallBefore 失败可按 strict gate fail-closed
