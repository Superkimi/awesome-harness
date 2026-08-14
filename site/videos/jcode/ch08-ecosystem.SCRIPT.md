1. 团队要加 MCP 和 workspace Skill，我先看指令优先级、overlay、cache miss 和 session-owned client。
2. 这一章不猜作者意图，只沿固定版本的运行时代码、契约和测试看事实。
3. 固定版本证据：crates/jcode-base/src/mcp/manager.rs:1-59 · MCP 区分共享池与 session-owned client；crates/jcode-app-core/src/agent/turn_execution.rs:335-393 · MCP schema 晚到只允许一次 cache miss，JSON-RPC 请求按 ID 隔离；crates/jcode-base/src/prompt.rs:374-448 · 指令层有稳定优先级：base、AGENTS、overlay、preferred tools、skills、动态 memory。
4. 事实一：无状态工具服务像公共电梯，多会话共用；带浏览器状态的服务像独立房间，每个会话一套。
5. 源码含义：降低重复进程与连接成本，同时避免 stateful connector 串会话。
6. 事实二：先让用户马上说话，不为插件启动卡住；插件工具后来到时只付一次缓存失效成本。多会话共用服务时每张工单都有号码。
7. 数据流：用户 turn → snapshot/journal → Provider/工具 → context/permission → session、swarm 和指标。
8. 小白动作：先给每轮任务写入状态，再把输入、工具、恢复和交付拆成四个检查点。
9. 第二个动作：把串行、batch、重试、压缩和协作预算分别记账，不要只记总耗时。
10. 局限提醒：shared pool/per-session client、stdio JSON-RPC、schema late registration、按需连接。
11. 这一章的结论：降低重复进程与连接成本，同时避免 stateful connector 串会话。
12. 下一章继续沿固定提交的源码锚点，回答一个真实工作问题。

Fixed commit: 71fa60c4dc875ebdaf089e6e84b29cbd61cbb478f
