# M04 · Provider：thinking 与 reasoning replay 是协议分支

- Project: Legacy DeepSeek-Reasonix
- Fixed source commit: 9aaf8d381a214cd2cb6df774d3b207a646ddd651
- Evidence ledger: data/legacy/evidence/deepseek-reasonix/evidence.json
- Episode: ch04-model
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - internal/provider/provider.go:40-75 · Provider 消息对象把模型内容与本地显示元数据分开
  - internal/provider/provider.go:179-192 · 发请求前会修复 tool-call 配对和被截断的 JSON
  - internal/provider/openai/openai.go:279-316 · DeepSeek thinking 与工具调用 reasoning replay 是显式协议分支
