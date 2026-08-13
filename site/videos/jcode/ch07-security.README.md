# M07 · 安全：双层 gate 与危险命令拒绝

- Project: Legacy JCode
- Fixed source commit: 71fa60c4dc875ebdaf089e6e84b29cbd61cbb478f
- Evidence ledger: data/legacy/evidence/jcode/evidence.json
- Episode: ch07-security
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - crates/jcode-app-core/src/tool/mod.rs:543-601 · 工具边界由 session allow/disable 与外部 pre_tool gate 双层控制
  - crates/jcode-app-core/src/tool/bash_destructive_gate.rs:1-39 · Bash 有确定性危险命令 gate，灾难目标直接拒绝
  - crates/jcode-app-core/src/tool/bash.rs:724-760 · 默认执行环境不是 OS 级沙箱
