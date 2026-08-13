# M03 · 主循环：流式采样和工具 Future 同时推进

## Hook
模型还在采样，工具已经准备；我沿 turn 看新消息如何抢占和恢复。

## Evidence anchors
- codex-loop-002: codex-rs/core/src/session/turn.rs:2034-2168 · 流式采样与工具 Future 同时推进，并可被新消息抢占
  - 模型说到一个完整动作就能开工，不必等整段回答结束；用户中途补充信息时，系统也能在安全位置收住并接新指令。
- codex-loop-003: codex-rs/core/src/session/turn.rs:1176-1273 · 重试预算属于 turn-scoped client session，窗口超限不当作普通网络错误重试
  - 同一轮尽量复用连接和粘性状态；行李箱塞不下不会盲目重拨网络，而是交给压缩逻辑处理。

## Takeaway
响应更快，但对调用顺序、取消、配对和幂等要求很高。
