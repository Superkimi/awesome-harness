# M02 · 架构：消息流水线怎样接工具和 Provider

## Hook
架构评审只剩十分钟，我得讲清 query、Provider 分流和工具池各自负责什么。

## Evidence anchors
- claude-code-loop-001: src/query.ts:460-666 · 主 Harness 是一个持续循环的消息变换与工具执行流水线
  - 每一轮不是“问一次模型就结束”，而是先整理行李、调用模型、执行动作、把结果记账，再决定继续还是停。
- claude-code-provider-001: src/services/api/claude.ts:1282-1338 · 共享预处理之后按 Provider 分流，Anthropic 仍是最深的主路径
  - 先把所有方言共有的消息账本整理好，再交给各家的翻译器；Anthropic 方言拥有最完整的缓存、thinking 和 beta 功能。
- claude-code-tools-001: src/tools.ts:378-420 · 工具池合并内建与 MCP，并为 prompt cache 做确定性排序
  - 工具箱每轮不能乱序，否则模型缓存会失效；外接工具也不能偷偷覆盖同名的原厂扳手。

## Takeaway
上下文、工具、权限和恢复都在同一编排循环交汇，修改其中任何一步都可能影响缓存与 transcript 一致性。
