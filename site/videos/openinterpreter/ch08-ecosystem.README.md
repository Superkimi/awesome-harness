# M08 · 扩展：MCP、Apps、Skills 和 Hooks 如何进入 step

- Project: Legacy Open Interpreter
- Fixed source commit: 984acc698cd038885ecb0b82721402b01e11a5ad
- Evidence ledger: data/legacy/evidence/openinterpreter/evidence.json
- Episode: ch08-ecosystem
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - codex-rs/core/src/session/turn.rs:546-650 · MCP、Apps、Plugins、Extensions 都在 step 工具计划中受快照控制
  - codex-rs/core/src/agents_md.rs:1-49 · AGENTS.md 从项目根到 cwd 合并，局部 override 优先且有总预算
  - codex-rs/core/src/harness/session_skills.rs:1-65 · Skills developer block 不允许被 Harness 转换悄悄丢掉
  - codex-rs/hooks/src/types.rs:1-152 · Hooks 覆盖会话、输入、权限、工具、压缩、停止和子 Agent 生命周期
