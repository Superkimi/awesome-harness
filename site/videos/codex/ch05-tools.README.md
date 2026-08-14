# M05 · 工具：typed runtime 与并行排他锁

- Project: Legacy OpenAI Codex
- Fixed source commit: 902bd9e06b3ecb32cbf7f8e64cd23b956be3e7fe
- Evidence ledger: data/legacy/evidence/codex/evidence.json
- Episode: ch05-tools
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - codex-rs/core/src/tools/registry.rs:48-149 · 工具有统一 typed runtime 契约，hooks、观测和流式参数 diff 都是一级能力
  - codex-rs/core/src/tools/parallel.rs:74-145 · 并发工具用读写锁实现“并行组 + 全局排他工具”
  - codex-rs/core/src/tools/spec_plan_tests.rs:637-708 · 工具暴露与分发分离，兼容旧 shell 又不污染模型可见清单
