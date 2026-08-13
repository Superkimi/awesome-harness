1. 任务很长时我想知道谁负责记忆；我把模型窗口、异步摘要和内层 compaction 分开。
2. 这一章不猜作者意图，只沿固定版本的运行时代码、契约和测试看事实。
3. 固定版本证据：backend/biz/task/usecase/task.go:788-792 · 平台知道模型窗口上限，但不管理内层 compaction；backend/biz/task/service/tasksummary.go:32-92 · 任务摘要是异步 UI 元数据，不是 Agent 记忆回写。
4. 事实一：平台知道油箱标称多大，却不看里面还剩多少油；何时压缩历史由 OpenCode/Codex/Claude 自己决定。
5. 源码含义：跨 runtime 的长任务可靠性会随各 CLI 内核不同而波动。
6. 事实二：它会给长对话写一段“给人看的剧情简介”，但这段简介不会自动塞回 Agent 的脑子里。
7. 数据流：任务 → DB/VM/Redis → CLI 或 LLM proxy → MCP/权限 → 流、审计和交付。
8. 小白动作：先把任务状态拆成创建、启动、运行、失败、回收五个节点。
9. 第二个动作：把平台边界和 CLI 内层能力分开，记录谁负责权限、压缩和恢复。
10. 局限提醒：平台保存轮次日志并生成 UI 摘要；内层 context/compaction 由所选 CLI 负责。
11. 这一章的结论：跨 runtime 的长任务可靠性会随各 CLI 内核不同而波动。
12. 下一章继续沿固定提交的源码锚点，回答一个真实工作问题。

Fixed commit: fcc5320b15a10dfec4d5891ce44d9d1470e10c2b
