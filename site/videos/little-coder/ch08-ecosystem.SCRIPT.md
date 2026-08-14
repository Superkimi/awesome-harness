1. 研究和实现想并行，但子 Agent 不能无限递归；我沿 spawn 和计划模式看限制。
2. 这一章不猜作者意图，只沿固定版本的运行时代码、扩展和测试看事实。
3. 固定版本证据：.pi/extensions/subagent/index.ts:12-20 · 子 Agent 是独立 little-coder 进程，父上下文只收短报告；.pi/extensions/subagent/spawn.ts:25-44 · 子 Agent 工具能力收窄且禁止递归 dispatch；.pi/extensions/plan-mode/index.ts:15-35 · Plan Mode 本身就是一条多 Agent 工作流。
4. 事实一：子任务的搜索过程不会把父模型记忆塞满，父亲只看一页简报。
5. 源码含义：这是上下文隔离型协作，不是共享黑板式多 Agent。
6. 事实二：孩子能查资料但不能改仓库，也不能再生孙子；本地单 GPU 默认串行，避免所谓并行反而拖慢。
7. 数据流：用户目标 → pi/扩展 → 上下文与工具约束 → 子 Agent 或文件动作 → session evidence。
8. 小白动作：先给任务设一个边界，再列输入、动作、检查和交付四格。
9. 第二个动作：遇到长任务先压缩输入，再给工具和子 Agent 设能力上限。
10. 局限提醒：已审计独立子进程、工具约束、结果截断、并发、超时与 plan/deep-research 编排。
11. 这一章的结论：这是上下文隔离型协作，不是共享黑板式多 Agent。
12. 下一章继续沿固定提交的源码锚点，回答一个真实工作问题。

Fixed commit: 0b7234031aabe56163e345792ce7a6ea05af321a
