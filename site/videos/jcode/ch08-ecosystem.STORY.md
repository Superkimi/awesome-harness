# M08 · 扩展：MCP、AGENTS、Skills 和动态 memory

## Hook
团队要加 MCP 和 workspace Skill，我先看指令优先级、overlay、cache miss 和 session-owned client。

## Evidence anchors
- jcode-mcp-001: crates/jcode-base/src/mcp/manager.rs:1-59 · MCP 区分共享池与 session-owned client
  - 无状态工具服务像公共电梯，多会话共用；带浏览器状态的服务像独立房间，每个会话一套。
- jcode-mcp-002: crates/jcode-app-core/src/agent/turn_execution.rs:335-393 · MCP schema 晚到只允许一次 cache miss，JSON-RPC 请求按 ID 隔离
  - 先让用户马上说话，不为插件启动卡住；插件工具后来到时只付一次缓存失效成本。多会话共用服务时每张工单都有号码。
- jcode-instructions-001: crates/jcode-base/src/prompt.rs:374-448 · 指令层有稳定优先级：base、AGENTS、overlay、preferred tools、skills、动态 memory
  - 通用规则、用户规则、项目规则、工具偏好、技能和临时记忆各有自己的插槽，不是拼成一团不知谁覆盖谁。
- jcode-instructions-002: crates/jcode-base/src/skill.rs:11-60 · Skills 跨 Jcode/Agents/Claude/Codex 生态并做 per-workspace overlay
  - 它会借用其他 Agent 生态的技能包，但项目私有技能只在当前工作区叠加，不会污染另一个项目。

## Takeaway
降低重复进程与连接成本，同时避免 stateful connector 串会话。
