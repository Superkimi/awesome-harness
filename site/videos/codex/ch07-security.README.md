# M07 · 安全：何时问人与允许做什么是两条轴

- Project: Legacy OpenAI Codex
- Fixed source commit: 902bd9e06b3ecb32cbf7f8e64cd23b956be3e7fe
- Evidence ledger: data/legacy/evidence/codex/evidence.json
- Episode: ch07-security
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - codex-rs/protocol/src/protocol.rs:890-932 · 审批策略把“何时问”与“允许做什么”分成两条轴
  - codex-rs/core/src/session/mod.rs:2295-2376 · 审批缺失默认中止，且可授予一次、本会话或规则/网络修订
  - codex-rs/sandboxing/src/manager.rs:34-73 · 沙箱按平台变换真实进程：macOS Seatbelt、Linux seccomp/bwrap/landlock、Windows restricted token
  - codex-rs/core/src/config/permissions.rs:203-213 · 自定义 permission profile 默认从受限文件系统和受限网络开始
