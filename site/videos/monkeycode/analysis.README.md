# MonkeyCode · 技术分析总览

- Project: Legacy MonkeyCode
- Fixed source commit: fcc5320b15a10dfec4d5891ce44d9d1470e10c2b
- Evidence ledger: data/legacy/evidence/monkeycode/evidence.json
- Episode: analysis
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - backend/pkg/taskflow/types.go:554-587 · 它是多 CLI 的任务控制平面，不是第四套 Agent loop
  - backend/biz/task/usecase/task.go:556-617 · 任务创建拆成数据库预登记、VM 创建、Redis 交接、运行态启动
  - backend/pkg/taskflow/types.go:72-92 · 隔离边界主要依赖仓库外 VM，Codex 内层 sandbox 明确关闭
  - backend/biz/llmproxy/proxy.go:28-34 · 代理只放行三种 LLM 协议，并阻止任务偷换模型
  - backend/biz/llmproxy/proxy.go:246-264 · 模型流被旁路解析，用量归因到 task/user/VM
