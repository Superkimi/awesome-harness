# M06 · 上下文：0.5 到 0.9 的多级压缩管道

- Project: Legacy DeepSeek-Reasonix
- Fixed source commit: 9aaf8d381a214cd2cb6df774d3b207a646ddd651
- Evidence ledger: data/legacy/evidence/deepseek-reasonix/evidence.json
- Episode: ch06-context
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - internal/agent/compact.go:19-36 · 上下文维护是 0.5/0.6/0.8/0.9 多级管道
  - internal/agent/compact.go:49-80 · 摘要保留用户事实、最近尾部并归档完整旧历史
  - internal/memory/memory.go:12-53 · 项目指令与记忆在启动时组成稳定 system prefix，编辑延迟到下一 session
