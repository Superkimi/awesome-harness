1. 研究要 batch、async，还要让兄弟 Agent 实时协作；我沿 Task 合同看递归、预算和 hub。
2. 这一章不猜作者意图，只沿固定版本的运行时代码、契约和测试看事实。
3. 固定版本证据：packages/coding-agent/src/task/index.ts:1-53 · Task 是内建多 Agent 调度器，支持 batch、async 与结构化 yield；packages/coding-agent/src/config/settings-schema.ts:4505-4614 · 递归、并发、预算、闲置 park 与冷恢复都有硬合同；packages/coding-agent/src/task/index.ts:412-429 · 兄弟 Agent 可用 hub 实时协作，不只回传父节点。
4. 事实一：主 Agent 可以一次发一组有共同背景的任务，每个工人独立选角色和输出合同；结果不是随便一段聊天，而是显式交付。
5. 源码含义：比 subprocess 示例级子 Agent 更接近真正控制平面。
6. 事实二：工人不会无限生工人，也能在闲置时卸载、之后按原权限复活；恢复时不凭猜测重建能力。
7. 数据流：用户消息 → Agent loop/Session → Provider/工具 → compaction/Task → 账本与观测。
8. 小白动作：先把长任务拆成主循环、上下文、工具、协作和观测五格。
9. 第二个动作：为并发、预算、审批和恢复都写一个可见的终态，不要只看“运行中”。
10. 局限提醒：已审计 batch/async/typed yield、递归、预算、park/revive、hub 和工作区隔离。
11. 这一章的结论：比 subprocess 示例级子 Agent 更接近真正控制平面。
12. 下一章继续沿固定提交的源码锚点，回答一个真实工作问题。

Fixed commit: a53e4e790d3939a08708bf0d3c912d0763237a2d
