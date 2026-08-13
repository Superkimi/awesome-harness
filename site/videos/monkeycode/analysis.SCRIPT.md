1. 老板问我：这个平台怎么同时托住多种 CLI、VM、权限和用量？我不讲产品口号，直接按任务控制平面拆。
2. 这一章不猜作者意图，只沿固定版本的运行时代码、契约和测试看事实。
3. 固定版本证据：backend/pkg/taskflow/types.go:554-587 · 它是多 CLI 的任务控制平面，不是第四套 Agent loop；backend/biz/task/usecase/task.go:556-617 · 任务创建拆成数据库预登记、VM 创建、Redis 交接、运行态启动；backend/pkg/taskflow/types.go:72-92 · 隔离边界主要依赖仓库外 VM，Codex 内层 sandbox 明确关闭。
4. 事实一：MonkeyCode 更像机场塔台：它决定哪架飞机、在哪个跑道、带什么配置起飞，但不会替 Codex 或 Claude 亲自驾驶。
5. 源码含义：比较 Harness 时，应把平台编排能力与各 CLI 内核能力拆开计分。
6. 事实二：先把工单和工作间登记好，再等工作间真的上线，最后才把任务交给里面的 Agent。
7. 数据流：任务 → DB/VM/Redis → CLI 或 LLM proxy → MCP/权限 → 流、审计和交付。
8. 小白动作：先把任务状态拆成创建、启动、运行、失败、回收五个节点。
9. 第二个动作：把平台边界和 CLI 内层能力分开，记录谁负责权限、压缩和恢复。
10. 局限提醒：确认 MonkeyCode 编排 Codex/Claude/OpenCode，内层 Agent loop 由所选 CLI 提供。
11. 这一章的结论：比较 Harness 时，应把平台编排能力与各 CLI 内核能力拆开计分。
12. 下一章继续沿固定提交的源码锚点，回答一个真实工作问题。

Fixed commit: fcc5320b15a10dfec4d5891ce44d9d1470e10c2b
