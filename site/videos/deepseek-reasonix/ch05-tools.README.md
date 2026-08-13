# M05 · 工具：parse、policy、prepare、finish 四阶段

- Project: Legacy DeepSeek-Reasonix
- Fixed source commit: 9aaf8d381a214cd2cb6df774d3b207a646ddd651
- Evidence ledger: data/legacy/evidence/deepseek-reasonix/evidence.json
- Episode: ch05-tools
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - internal/agent/execute_one.go:20-80 · 每个工具调用固定经过 parse→policy→prepare→finish 四阶段
  - internal/agent/execute_one.go:153-269 · use_capability 代理会先解析真实 MCP 目标，再重新做 Plan 与安全判断
  - internal/agent/execute_one.go:272-312 · Delivery 模式把验收标准变成 host-enforced tool policy
  - internal/agent/execute_one.go:552-654 · 执行结果会同时写证据账本、hooks 和恢复观测
