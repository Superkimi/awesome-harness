# CodeWhale · 技术分析总览

- Project: Legacy CodeWhale
- Fixed source commit: cfc2f2b13c070e900ee10dbeffb07028d3beaebd
- Evidence ledger: data/legacy/evidence/codewhale/evidence.json
- Episode: analysis
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - crates/tui/src/core/mod.rs:1-15 · Core 把 UI 与 AI 交互拆成事件驱动的控制面
  - crates/tui/src/core/engine.rs:221-298 · EngineConfig 是把能力、预算和权限拧在一起的运行时总闸
  - crates/tui/src/tools/spec.rs:1158-1217 · ToolSpec 把能力、审批、只读、并行和资源声明放到同一输入特化接口
  - crates/execpolicy/src/lib.rs:10-32 · ExecPolicy 是 Builtin/Agent/User 三层规则，deny 优先且支持 arity-aware shell 判断
  - crates/tui/src/tools/subagent/mod.rs:1-11 · agent 是模型可见的创建面，coordination tools 复用同一 mailbox/checkpoint machinery
  - crates/tui/src/session_manager.rs:26-40 · Session 保存是原子写，恢复会校验 schema 并修复 tool history
