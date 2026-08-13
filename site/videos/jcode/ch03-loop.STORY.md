# M03 · 主循环：断流如何撤销再重播

## Hook
同事说断流就丢半截状态，我沿 turn_loops 看工具配对修复、快照和完整 replay。

## Evidence anchors
- jcode-loop-002: crates/jcode-app-core/src/agent/turn_loops.rs:17-68 · 循环在每次请求前修复工具配对并重建稳定快照
  - 每次再问模型前先查账：工具有没有开单不回执、旧历史是否已折叠、这一轮工具箱和提示词是否稳定。
- jcode-loop-003: crates/jcode-app-core/src/agent/turn_loops.rs:455-484 · 中途断流先撤销半截状态再完整重播
  - 网络半路断了，不把前半句和前半个工具调用留在账上；先橡皮擦掉，再从头重放。
- jcode-loop-004: crates/jcode-app-core/src/agent/turn_loops.rs:5-15 · 上下文、截断回复和工具后空回复各有独立止损上限
  - 不同故障不共用一个模糊的“最多重试 N 次”：箱子装不下、回答被截断、工具后失语分别计数。

## Takeaway
把异常历史修复、缓存稳定和请求生命周期放在一个明确关口。
