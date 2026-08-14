# M06 · 上下文：16384 预算、20000 尾部与 checkpoint

## Hook
长任务快超窗，我先看 token 预算、完整 tool turn 和可恢复摘要怎样组合。

## Evidence anchors
- prime-context-001: packages/coding-agent/src/core/compaction/compaction.ts:122-132 · 默认压缩预留 16384 token，尾部保留 20000 token
  - 它不会等到 provider 报 context overflow 才处理，而是提前留出一块回答空间，再保留最近工作集。
- prime-context-002: packages/coding-agent/src/core/compaction/compaction.ts:138-147 · Token 估算融合 provider usage 与 trailing message 估算
  - 刚从模型拿到真实 token 账单就用真实数，刚塞进来的工具结果还没账单就先用保守估算，不会因为只看旧 usage 而漏算最新输入。
- prime-context-003: packages/coding-agent/src/core/compaction/compaction.ts:303-339 · Cut point 避开孤立 tool result，保留完整 tool turn
  - 压缩不会只删掉工具调用上半段或回执下半段，避免下一轮看到一张没有出处的工具结果。
- prime-context-004: packages/coding-agent/src/core/compaction/compaction.ts:465-496 · 摘要提示词固定为可恢复的结构化 checkpoint
  - 摘要不是一句“我们做了很多事”，而是下一任模型可以按清单接手的交接卡。

## Takeaway
自研应把 reserve/keep 做成可见配置并在模型切换时重新计算，不要硬编码单一窗口。
