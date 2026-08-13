# DeepSeek-Reasonix · 技术分析总览

- Project: Legacy DeepSeek-Reasonix
- Fixed source commit: 9aaf8d381a214cd2cb6df774d3b207a646ddd651
- Evidence ledger: data/legacy/evidence/deepseek-reasonix/evidence.json
- Episode: analysis
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - internal/boot/boot.go:1-8 · Boot 是唯一装配根，所有前端共享同一套 Harness
  - internal/provider/openai/openai.go:279-316 · DeepSeek thinking 与工具调用 reasoning replay 是显式协议分支
  - internal/agent/execute_one.go:20-80 · 每个工具调用固定经过 parse→policy→prepare→finish 四阶段
  - internal/sandbox/sandbox.go:1-14 · Bash 沙箱是独立于 permission 的 OS enforcement 层
  - internal/evidence/evidence.go:348-373 · Evidence Ledger 把交付验收从文本变成可检查事实
