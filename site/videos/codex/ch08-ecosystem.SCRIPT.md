1. 团队要接 MCP 和项目规则，我先看目录版本、分层指令和初始上下文预算。
2. 这一章不猜作者意图，只沿固定版本的运行时代码、协议和测试看事实。
3. 固定版本证据：codex-rs/codex-mcp/src/connection_manager.rs:66-117 · MCP 是带复用、认证、required gate 和 catalog revision 的运行时；codex-rs/codex-mcp/src/connection_manager/tool_catalog.rs:34-55 · 模型只能看到显式可见且能绑定到同一目录版本的 MCP 工具；codex-rs/core/src/agents_md.rs:1-16 · AGENTS.md 从项目根向 cwd 分层合并，局部 override 优先且有总字节预算。
4. 事实一：它不是每轮临时扫一遍外接工具，而是维护一套有版本、有健康状态、有认证身份的连接池。
5. 源码含义：工具清单可稳定捕获到 step snapshot，连接变化不会悄悄污染正在执行的一步。
6. 事实二：展示给模型的工具名和真正执行它的连接必须来自同一版目录，不能拿新版菜单去点旧版厨房。
7. 数据流：用户消息 → turn/step 快照 → Provider/工具 → 权限与沙箱 → rollout/SQLite 交付。
8. 小白动作：先把任务拆成状态快照、动作、审批和回放四格，再决定并发方式。
9. 第二个动作：把模型可见工具、真实执行器和审计事件分别记录，不要混成一张列表。
10. 局限提醒：审计连接复用、OAuth、required server、工具过滤、catalog revision、elicitation 和超时。
11. 这一章的结论：工具清单可稳定捕获到 step snapshot，连接变化不会悄悄污染正在执行的一步。
12. 下一章继续沿固定提交的源码锚点，回答一个真实工作问题。

Fixed commit: 902bd9e06b3ecb32cbf7f8e64cd23b956be3e7fe
