# M05 · 工具：模型看到的名字不等于内部执行器

- Project: Legacy Open Interpreter
- Fixed source commit: 984acc698cd038885ecb0b82721402b01e11a5ad
- Evidence ledger: data/legacy/evidence/openinterpreter/evidence.json
- Episode: ch05-tools
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - codex-rs/core/src/tools/spec_plan.rs:240-268 · 模型可见工具与内部可分发 runtime 分离
  - codex-rs/core/src/tools/handlers/harness_aliases.rs:102-254 · Harness aliases 将十余套工具名收敛到共享执行器
  - codex-rs/core/src/tools/handlers/harness_aliases.rs:1749-1821 · Harness 写文件也进入统一 FileChange lifecycle
