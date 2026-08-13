1. 任务创建失败后页面还在转圈，我沿 Taskflow hook 查它如何记录失败又可能吞掉错误。
2. 这一章不猜作者意图，只沿固定版本的运行时代码、契约和测试看事实。
3. 固定版本证据：backend/pkg/lifecycle/taskhook.go:104-123 · Taskflow Create 失败被记录但吞掉，任务可能滞留 processing。
4. 事实一：工单已经盖了“处理中”，但真正开工失败后只记了一条日志，状态机可能还以为工作在继续。
5. 源码含义：应把 Create 错误返回给生命周期管理器，并为 processing-without-session 增加 watchdog。
6. 事实二：工单已经盖了“处理中”，但真正开工失败后只记了一条日志，状态机可能还以为工作在继续。
7. 数据流：任务 → DB/VM/Redis → CLI 或 LLM proxy → MCP/权限 → 流、审计和交付。
8. 小白动作：先把任务状态拆成创建、启动、运行、失败、回收五个节点。
9. 第二个动作：把平台边界和 CLI 内层能力分开，记录谁负责权限、压缩和恢复。
10. 局限提醒：确认 MonkeyCode 编排 Codex/Claude/OpenCode，内层 Agent loop 由所选 CLI 提供。
11. 这一章的结论：应把 Create 错误返回给生命周期管理器，并为 processing-without-session 增加 watchdog。
12. 下一章继续沿固定提交的源码锚点，回答一个真实工作问题。

Fixed commit: fcc5320b15a10dfec4d5891ce44d9d1470e10c2b
