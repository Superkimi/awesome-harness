# M06 · 上下文：Copy-on-Write 历史如何自救

- Project: Legacy OpenAI Codex
- Fixed source commit: 902bd9e06b3ecb32cbf7f8e64cd23b956be3e7fe
- Evidence ledger: data/legacy/evidence/codex/evidence.json
- Episode: ch06-context
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - codex-rs/core/src/context_manager/history.rs:38-60 · 历史是带版本号的 Copy-on-Write 账本，不是随手拼接的消息数组
  - codex-rs/core/src/context_manager/history.rs:189-248 · 上下文裁剪同时维护工具调用配对并计算多模态成本
  - codex-rs/core/src/compact.rs:240-318 · 本地压缩会自救：压缩请求自身超限时逐项删旧记录再重试
