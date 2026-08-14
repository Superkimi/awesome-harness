# M03 · 主循环：取消、steer 和子 Agent 结果如何注入

## Hook
同事说中途只能等模型停下，我沿 turn loop 看取消、steer、工具预算和结果注入。

## Evidence anchors
- codewhale-provider-001: crates/tui/src/core/engine/turn_loop.rs:364-412 · 单轮流式循环有取消、steer、工具预算和子 Agent 结果注入
  - 模型还在思考时，用户可以插话；子 Agent 做完的结果会在下一次请求前被父 Agent 看见；工具调用总数和流断线重试都有单轮账本。
- codewhale-provider-002: crates/tui/src/core/engine/turn_loop.rs:620-687 · prefix cache 不是口号，而是每次请求前的可诊断一致性检查
  - 工具排序、描述或系统提示一变，CodeWhale 会知道 DeepSeek 的 KV 前缀可能失效，而不是把缓存 miss 当成模型随机变慢。

## Takeaway
Steer、cancel 和 child completion 都应在 provider request boundary 注入，才能避免“已取消但又发了一次请求”。
