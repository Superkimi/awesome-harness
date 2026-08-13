# M08 · 扩展：MCP、插件与 Skill 三条链

## Hook
团队要接 MCP 和 Skill，我先看连接协议、复合插件和元数据按需装载。

## Evidence anchors
- claude-code-mcp-001: src/services/mcp/client.ts:596-678 · MCP 是完整连接层：stdio、SSE、Streamable HTTP、WebSocket 和 claude.ai proxy
  - 它不是只会启动本地 MCP 子进程，也能连长连接、HTTP、WebSocket 和平台代理；线断了会丢掉旧工具清单重新握手。
- claude-code-mcp-002: src/services/mcp/client.ts:210-229 · MCP 具备描述限长、请求超时与企业 allow/deny 管理
  - 连接握手不会无限等，过长的工具说明不会把上下文吃光；但真正工具执行默认几乎不设上限，长任务友好、失控任务风险也更大。
- claude-code-plugin-001: src/utils/plugins/pluginLoader.ts:1-29 · 插件是复合扩展包，不只是 prompt 文件
  - 一个插件能同时带命令、技能、子 Agent 和钩子，接近应用包而不是单张提示词。
- claude-code-skill-001: src/skills/loadSkillsDir.ts:78-108 · Skill 采用元数据先行、内容按需装载，并支持路径条件激活
  - 模型先看技能目录卡片，真正要用时才翻整本手册；碰到特定文件类型还能自动把相关手册加入工具箱。

## Takeaway
连接器成熟度高，但 transport 分支很多，安全策略和生命周期测试成本显著。
