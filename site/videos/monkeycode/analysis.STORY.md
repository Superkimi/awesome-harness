# MonkeyCode · 技术分析总览

## Hook
老板问我：这个平台怎么同时托住多种 CLI、VM、权限和用量？我不讲产品口号，直接按任务控制平面拆。

## Evidence anchors
- monkey-architecture-001: backend/pkg/taskflow/types.go:554-587 · 它是多 CLI 的任务控制平面，不是第四套 Agent loop
  - MonkeyCode 更像机场塔台：它决定哪架飞机、在哪个跑道、带什么配置起飞，但不会替 Codex 或 Claude 亲自驾驶。
- monkey-lifecycle-001: backend/biz/task/usecase/task.go:556-617 · 任务创建拆成数据库预登记、VM 创建、Redis 交接、运行态启动
  - 先把工单和工作间登记好，再等工作间真的上线，最后才把任务交给里面的 Agent。
- monkey-sandbox-001: backend/pkg/taskflow/types.go:72-92 · 隔离边界主要依赖仓库外 VM，Codex 内层 sandbox 明确关闭
  - Codex 在房间里面拿的是万能钥匙；安全取决于这个“房间”到底是不是一间真正隔离的 VM，而造房间的代码不在本仓库。
- monkey-provider-002: backend/biz/llmproxy/proxy.go:28-34 · 代理只放行三种 LLM 协议，并阻止任务偷换模型
  - 这不是任意 HTTP 隧道；票上写的是哪个模型，就只能点那个模型。
- monkey-observe-001: backend/biz/llmproxy/proxy.go:246-264 · 模型流被旁路解析，用量归因到 task/user/VM
  - 回答照常流给 Agent，同时平台在旁边读水表，不必让每个 CLI 各写一套计费代码。

## Takeaway
比较 Harness 时，应把平台编排能力与各 CLI 内核能力拆开计分。
