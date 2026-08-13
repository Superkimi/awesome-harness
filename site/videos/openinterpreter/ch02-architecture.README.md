# M02 · 架构：Provider、Wire API、Harness 三层分开

- Project: Legacy Open Interpreter
- Fixed source commit: 984acc698cd038885ecb0b82721402b01e11a5ad
- Evidence ledger: data/legacy/evidence/openinterpreter/evidence.json
- Episode: ch02-architecture
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - codex-rs/app-server-protocol/src/protocol/v2/interpreter.rs:8-44 · Provider、Wire API、Harness 是三层独立选择
  - codex-rs/core/src/harness/routing.rs:5-151 · 路由矩阵在代码里硬校验，不兼容组合直接报错
  - codex-rs/core/src/harness/request.rs:1-8 · 请求仿真的单一入口统一处理前置与后置整形
