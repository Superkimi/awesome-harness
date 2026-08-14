# M03 · 主循环：每轮先检查再锁定工具

## Hook
同事说模型输出什么就执行什么，我沿 sendMessageStream 看上下文、溢出、IDE 配对和 loop detection。

## Evidence anchors
- gemini-loop-002: packages/core/src/core/client.ts:614-715 · 每轮先做上下文、溢出、IDE 配对和 loop 检测，再锁定模型与工具
  - 开口前先整理历史、确认装得下、保证工具回执不被编辑器消息插队，然后才选本轮模型和工具箱。
- gemini-loop-003: packages/core/src/core/client.ts:744-763 · 循环检测能先恢复一次，再判定硬循环
  - 第一次怀疑绕圈会给模型一次纠偏机会，第二次还绕就停。

## Takeaway
上下文与模型选择顺序清楚，工具描述可随模型变化且同一 sequence 保持模型粘性。
