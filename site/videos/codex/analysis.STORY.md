# OpenAI Codex · 技术分析总览

## Hook
评审问我：这个大型 Rust Harness 怎么把 turn、工具、沙箱、子 Agent 和持久化一起管住？我沿固定证据拆。

## Evidence anchors
- codex-loop-001: codex-rs/core/src/session/turn.rs:153-274 · 每个 turn 由多个 step 组成，step 内共享一次不可漂移的上下文快照
  - 一轮任务可以问模型很多次，但每一次“想一想并行动”的小步都先拍一张现场快照，避免工具清单和提示词在同一步里前后不一致。
- codex-tools-001: codex-rs/core/src/tools/registry.rs:48-149 · 工具有统一 typed runtime 契约，hooks、观测和流式参数 diff 都是一级能力
  - 每个新工具不只是写一个 execute 函数，还要说明如何取消、怎么记日志、钩子看什么、参数流到一半时如何展示。
- codex-permission-001: codex-rs/protocol/src/protocol.rs:890-932 · 审批策略把“何时问”与“允许做什么”分成两条轴
  - 一条轴决定要不要敲门，另一条轴决定进门后活动范围；“不用问”不等于“拥有整台机器”。
- codex-agent-001: codex-rs/core/src/agent/control.rs:70-111 · 多 Agent 是共享控制面的线程树，不是主循环里的递归函数
  - 每个子 Agent 都有自己的会话账本，但兄弟们共用一张组织架构表、并发配额和总预算。
- codex-persistence-001: codex-rs/rollout/src/recorder.rs:93-171 · 会话采用 JSONL rollout 作为事件事实源，后台 writer 支持 persist、flush 与失败记忆
  - 先把每一步写成可重放流水账，后台书记员负责落盘；书记员一旦坏掉，后续调用会记得这次故障而不是假装成功。

## Takeaway
配置热更新只能在安全边界生效，换来 prompt cache 和工具调用的确定性。
