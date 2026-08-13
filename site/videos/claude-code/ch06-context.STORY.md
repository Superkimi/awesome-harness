# M06 · 上下文：snip、autocompact 和熔断阶梯

## Hook
长任务快超窗，我先看工具瘦身、预留输出预算、reactive compact 和连续失败保护。

## Evidence anchors
- claude-code-context-001: src/services/compact/snipCompact.ts:60-147 · 上下文不是单层摘要，而是 snip、工具结果瘦身、session memory 与 autocompact 的阶梯
  - 先精准剪掉明确不要的旧段，再清空大块工具输出，最后才用模型写摘要；不同手术刀处理不同类型的肥胖。
- claude-code-context-002: src/services/compact/autoCompact.ts:28-93 · 压缩为输出预留预算，并有连续失败熔断
  - 不会把车厢塞满到回答没座位；整理行李连续失败三次后先停手，不再每回合烧一次模型调用。
- claude-code-context-004: src/query.ts:1352-1450 · 超长请求有 reactive compact 与循环保护
  - 真的撞到窗口上限时，会倒车、重新打包再试；同一次事故不会无限重复。

## Takeaway
比单一“全历史总结”更保真，但分层状态、缓存标记和 resume 重建复杂。
