# M04 · 模型代理：临时密钥怎样不暴露上游

- Project: Legacy MonkeyCode
- Fixed source commit: fcc5320b15a10dfec4d5891ce44d9d1470e10c2b
- Evidence ledger: data/legacy/evidence/monkeycode/evidence.json
- Episode: ch04-model
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - backend/biz/task/usecase/task.go:585-590 · LLM proxy 用 VM 绑定临时密钥隐藏真实上游凭据
  - backend/biz/llmproxy/proxy.go:28-34 · 代理只放行三种 LLM 协议，并阻止任务偷换模型
