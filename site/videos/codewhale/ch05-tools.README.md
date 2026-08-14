# M05 · 工具：能力、审批、只读和资源一张 ToolSpec

- Project: Legacy CodeWhale
- Fixed source commit: cfc2f2b13c070e900ee10dbeffb07028d3beaebd
- Evidence ledger: data/legacy/evidence/codewhale/evidence.json
- Episode: ch05-tools
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - crates/tui/src/tools/spec.rs:1158-1217 · ToolSpec 把能力、审批、只读、并行和资源声明放到同一输入特化接口
  - crates/tui/src/tools/registry.rs:91-99 · Registry 执行前会重新施加 machine authority，并提供只读事实投影
  - crates/tui/src/core/engine/tool_execution.rs:230-287 · 并行工具只允许 read-only、Auto approval 且声明 supports_parallel
  - crates/tui/src/core/engine/tool_execution.rs:353-406 · 工具执行有 heartbeat、读写锁、交互终端 RAII 和结构化结束日志
