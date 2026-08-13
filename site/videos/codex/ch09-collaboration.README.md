# M09 · 协作：共享控制面的线程树

- Project: Legacy OpenAI Codex
- Fixed source commit: 902bd9e06b3ecb32cbf7f8e64cd23b956be3e7fe
- Evidence ledger: data/legacy/evidence/codex/evidence.json
- Episode: ch09-collaboration
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - codex-rs/core/src/agent/control.rs:70-111 · 多 Agent 是共享控制面的线程树，不是主循环里的递归函数
  - codex-rs/core/src/tools/handlers/multi_agents_v2/spawn.rs:39-165 · fork 可选全历史、最近 N 轮或空白；消息可只入队也可触发 turn
  - codex-rs/core/src/config/mod.rs:1547-1560 · 驻留上限与同时执行上限分离，V2 子 Agent 才受执行 limiter
