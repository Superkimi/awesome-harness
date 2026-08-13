# M08 · 子 Agent：能力收窄才能安全并行

## Hook
研究和实现想并行，但子 Agent 不能无限递归；我沿 spawn 和计划模式看限制。

## Evidence anchors
- little-subagent-001: .pi/extensions/subagent/index.ts:12-20 · 子 Agent 是独立 little-coder 进程，父上下文只收短报告
  - 子任务的搜索过程不会把父模型记忆塞满，父亲只看一页简报。
- little-subagent-002: .pi/extensions/subagent/spawn.ts:25-44 · 子 Agent 工具能力收窄且禁止递归 dispatch
  - 孩子能查资料但不能改仓库，也不能再生孙子；本地单 GPU 默认串行，避免所谓并行反而拖慢。
- little-plan-001: .pi/extensions/plan-mode/index.ts:15-35 · Plan Mode 本身就是一条多 Agent 工作流
  - 它不是让一个模型说一句“我先计划”，而是先派侦察、再问人、最后写方案。

## Takeaway
这是上下文隔离型协作，不是共享黑板式多 Agent。
