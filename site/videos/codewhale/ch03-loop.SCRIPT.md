1. 同事说中途只能等模型停下，我沿 turn loop 看取消、steer、工具预算和结果注入。
2. 这一章不猜作者意图，只沿固定版本的运行时代码、契约和测试看事实。
3. 固定版本证据：crates/tui/src/core/engine/turn_loop.rs:364-412 · 单轮流式循环有取消、steer、工具预算和子 Agent 结果注入；crates/tui/src/core/engine/turn_loop.rs:620-687 · prefix cache 不是口号，而是每次请求前的可诊断一致性检查。
4. 事实一：模型还在思考时，用户可以插话；子 Agent 做完的结果会在下一次请求前被父 Agent 看见；工具调用总数和流断线重试都有单轮账本。
5. 源码含义：Steer、cancel 和 child completion 都应在 provider request boundary 注入，才能避免“已取消但又发了一次请求”。
6. 事实二：工具排序、描述或系统提示一变，CodeWhale 会知道 DeepSeek 的 KV 前缀可能失效，而不是把缓存 miss 当成模型随机变慢。
7. 数据流：Core/EngineConfig → turn freeze → ToolSpec/MCP → policy/sandbox → session/checkpoint/receipt。
8. 小白动作：先把任务拆成能力、预算、审批、执行和证据五格。
9. 第二个动作：为并行、心跳、取消、恢复和用量归属各留一个明确状态。
10. 局限提醒：turn 流式循环、steer、流重试、工具调用预算、reasoning/prefix 稳定检查与请求快照。
11. 这一章的结论：Steer、cancel 和 child completion 都应在 provider request boundary 注入，才能避免“已取消但又发了一次请求”。
12. 下一章继续沿固定提交的源码锚点，回答一个真实工作问题。

Fixed commit: cfc2f2b13c070e900ee10dbeffb07028d3beaebd
