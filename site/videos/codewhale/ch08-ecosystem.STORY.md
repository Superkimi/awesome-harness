# M08 · 扩展：MCP、Skills、插件 trust 与 strict hook

## Hook
团队要接远端 MCP 和插件，我先看 secrets 边界、reviewed authority、hash 失信和 fail-closed hook。

## Evidence anchors
- codewhale-mcp-001: crates/tui/src/mcp.rs:1-37 · MCP 连接器覆盖 stdio、Streamable HTTP、SSE 和 OAuth，并有连接池
  - MCP 在这里不是一个 HTTP helper，而是有连接生命周期、能力发现、超时和认证的子系统；不同 server 的连接可以复用。
- codewhale-mcp-002: crates/tui/src/mcp.rs:57-90 · MCP secrets 不进入错误文本，远端响应和 body 也有边界
  - API key 可以来自环境而不是 mcp.json；服务端返回一个超大 chunk 或把密码塞进 URL，也不会原样写进日志或无限吃内存。
- codewhale-mcp-003: crates/tui/src/mcp.rs:641-695 · reviewed plugin 的 MCP 在 launch、origin 和 catalog 暴露前都要复核 authority
  - 插件被信任后文件仍可能变化，CodeWhale 不会只相信旧 receipt；真正启动和把能力展示给模型前还会再验。
- codewhale-extension-001: crates/tui/src/skills/mod.rs:131-224 · Skills 同时兼容生态目录与 CodeWhale owned roots，支持 explicit-only 和 locale 描述
  - 它能读取 `.agents`、Claude、OpenCode、Cursor 等兼容 Skills，也能只读自己的 `.codewhale/skills`；技能可以不出现在模型菜单里，只有用户点名才加载。
- codewhale-extension-002: crates/tui/src/plugins/registry.rs:123-169 · 插件 trust 和 enable 分离，内容/能力 hash 变化会自动失信
  - 看过插件不等于立即打开插件；信任是审核记录，启用是另一个明确动作。插件内容或能力变了，旧审核不能继续生效。
- codewhale-extension-003: crates/tui/src/hooks/config.rs:656-697 · Hook 事件覆盖 turn/tool/subagent，ToolCallBefore 失败可按 strict gate fail-closed
  - Hook 不只是“执行一个脚本”：它能在工具落地前改参数、要求审批或阻止调用；Hook executor 崩掉时，严格 gate 不会被当成允许。

## Takeaway
连接器层要把 transport、auth、discovery、timeout 和 pool 分开，避免某个网络协议细节侵入 Agent loop。
