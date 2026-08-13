# M06 · 上下文：压缩要尊重 Harness 和真实成本

- Project: Legacy Open Interpreter
- Fixed source commit: 984acc698cd038885ecb0b82721402b01e11a5ad
- Evidence ledger: data/legacy/evidence/openinterpreter/evidence.json
- Episode: ch06-context
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - codex-rs/core/src/context_manager/history.rs:40-186 · 历史管理维护调用配对、多模态能力和可见 token 成本
  - codex-rs/core/src/compact.rs:299-389 · 压缩是 Harness-aware 的，而不是统一摘要模板
