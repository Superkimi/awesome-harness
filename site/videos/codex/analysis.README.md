# OpenAI Codex · 技术分析总览

- Project: Legacy OpenAI Codex
- Fixed source commit: 902bd9e06b3ecb32cbf7f8e64cd23b956be3e7fe
- Evidence ledger: data/legacy/evidence/codex/evidence.json
- Episode: analysis
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - codex-rs/core/src/session/turn.rs:153-274 · 每个 turn 由多个 step 组成，step 内共享一次不可漂移的上下文快照
  - codex-rs/core/src/tools/registry.rs:48-149 · 工具有统一 typed runtime 契约，hooks、观测和流式参数 diff 都是一级能力
  - codex-rs/protocol/src/protocol.rs:890-932 · 审批策略把“何时问”与“允许做什么”分成两条轴
  - codex-rs/core/src/agent/control.rs:70-111 · 多 Agent 是共享控制面的线程树，不是主循环里的递归函数
  - codex-rs/rollout/src/recorder.rs:93-171 · 会话采用 JSONL rollout 作为事件事实源，后台 writer 支持 persist、flush 与失败记忆
