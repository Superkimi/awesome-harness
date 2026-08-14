# M08 · 扩展：MCP catalog-first 与 metadata-first Skills

## Hook
团队要加项目 MCP 和 Skill，我先看无 secret 授权、惰性连接、索引和封闭写入路径。

## Evidence anchors
- reasonix-mcp-001: internal/plugin/plugin.go:1-7 · MCP 以统一 JSON-RPC 适配 stdio、Streamable HTTP 和 legacy SSE
  - 外部工具可以是本地进程，也可以是远程 HTTP/SSE，但 Agent 看到的都是同一个 Tool；连接、超时、取消和响应大小在连接层处理。
- reasonix-mcp-002: internal/plugin/security.go:17-66 · MCP 项目服务器先做无 secret 的身份授权，再做 live safety 对账
  - 换了 MCP 二进制、目标地址或工具安全标记，不会因为旧 schema cache 还在就直接执行；同时默认插件是受信任 host 进程，不能误以为它自动继承 Agent shell 沙箱。
- reasonix-mcp-003: internal/plugin/plugin.go:243-279 · MCP 启动是 catalog-first、cache-aware、可惰性连接的
  - 开一个项目不会立刻 fork 二十个 npm MCP 进程；先用缓存把工具菜单画出来，真正用到时再连，坏一个插件也不必让整场会话起不来。
- reasonix-instruction-001: internal/skill/index.go:10-28 · Skills 采用 metadata-first 索引，正文按需加载
  - 模型开机只拿一张“有哪些 playbook”的目录，不把所有长说明书塞进 prompt；真正需要时才读正文，重研究工作可以放到隔离子 Agent。
- reasonix-instruction-002: internal/memory/memory.go:12-24 · Memory 写入有封闭路径集合，背景事实与高权指令分开
  - 记忆里的“上次事实”不会自动压过当前用户指令；Agent 也不能借 memory tool 任意写到磁盘上任何路径。

## Takeaway
连接器治理应是独立 runtime 层，不能让每个工具自己实现 JSON-RPC、超时和取消。
