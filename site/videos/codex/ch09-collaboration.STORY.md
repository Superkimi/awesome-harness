# M09 · 协作：共享控制面的线程树

## Hook
研究与实现要并行，我先看 fork 历史、消息入队和驻留/执行 limiter 如何分开。

## Evidence anchors
- codex-agent-001: codex-rs/core/src/agent/control.rs:70-111 · 多 Agent 是共享控制面的线程树，不是主循环里的递归函数
  - 每个子 Agent 都有自己的会话账本，但兄弟们共用一张组织架构表、并发配额和总预算。
- codex-agent-002: codex-rs/core/src/tools/handlers/multi_agents_v2/spawn.rs:39-165 · fork 可选全历史、最近 N 轮或空白；消息可只入队也可触发 turn
  - 派工时可把整本案卷、最近几页或一张白纸交给下属；便签可以只塞进邮箱，也可以按门铃让他立即处理。
- codex-agent-003: codex-rs/core/src/config/mod.rs:1547-1560 · 驻留上限与同时执行上限分离，V2 子 Agent 才受执行 limiter
  - 可以让许多子会话留在通讯录里，但只有有限几个同时开工；已经在干活的人收到补充便签不会再算一个工位。

## Takeaway
隔离了对话状态，同时能做全树限流、恢复和协作观测。
