# M08 · 扩展：Hook、插件、MCP 与 Skills

## Hook
团队要接 MCP 和 Skill，我先看 wire subscription、审批子进程、富媒体预算和 slash 映射。

## Evidence anchors
- kimi-hooks-001: src/kimi_cli/hooks/engine.py:65-91 · Hook 同时支持本地命令与客户端 wire subscription
  - 组织可以在模型动作前后插入自己的门卫/审计脚本，也可以让 IDE 客户端参与判断。
- kimi-plugin-001: src/kimi_cli/plugin/tool.py:37-130 · 插件工具是经审批的本地子进程，可获得新鲜 Host 凭证
  - 插件本质是本机程序，不是受限脚本；它能按配置拿到主机凭证，所以安装来源和权限同样重要。
- kimi-mcp-001: src/kimi_cli/soul/agent.py:467-485 · MCP 延迟启动、逐服务器状态化，并对富媒体共享 100K 字符预算
  - 远程工具不必拖慢 CLI 启动，但真正开始工作前会等它们连好；一个巨型网页 DOM 或截图不能把上下文塞爆。
- kimi-skills-001: src/kimi_cli/config.py:242-259 · Skills 跨 kimi/claude/codex 目录合并，并映射为 slash/flow 命令
  - 技能不是把全文常驻提示词，而是先给目录卡片，需要时再读；同一套 CLI 还能复用其他 Agent 生态的技能目录。

## Takeaway
扩展面完整；engine、命令错误与超时通常 fail-open，只有成功返回 block/exit 2 才阻止。
