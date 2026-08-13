# M06 · 上下文：预算、cut point 和一次恢复重试

## Hook
长任务快超窗，我先看输出预算、tool result cut point 和 overflow 后的恢复边界。

## Evidence anchors
- pi-context-001: packages/coding-agent/src/core/compaction/compaction.ts:190-237 · 压缩阈值给输出预留固定预算，并尽量使用真实 usage
  - 不会等输入把窗口完全塞满；先给回答留座位。能拿到模型账单就用真实 token，拿不到才用字符粗算。
- pi-context-002: packages/coding-agent/src/core/compaction/compaction.ts:345-460 · cut point 不切 tool result，并支持拆分超长 turn
  - 工具调用和结果不会被拦腰拆散；最近一个超长回合也不必全丢或全留，前半段概括、后半段保真。
- pi-context-003: packages/coding-agent/src/core/agent-session.ts:1783-1924 · overflow 最多压缩后自动重试一次，扩展可取消或替换摘要
  - 记忆爆仓会整理再试一次，不会反复总结到死；插件也能接管公司自己的摘要策略。

## Takeaway
比单纯按消息数量可靠，但固定 16k 对不同模型/任务可调性很重要。
