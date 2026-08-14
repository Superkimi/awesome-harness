# M01 · 总览：它管的是任务控制平面

## Hook
同事把 MonkeyCode 当成第四套 Agent 内核，我先确认它真正负责的是创建、隔离、代理和回放。

## Evidence anchors
- monkey-architecture-001: backend/pkg/taskflow/types.go:554-587 · 它是多 CLI 的任务控制平面，不是第四套 Agent loop
  - MonkeyCode 更像机场塔台：它决定哪架飞机、在哪个跑道、带什么配置起飞，但不会替 Codex 或 Claude 亲自驾驶。
- monkey-lifecycle-001: backend/biz/task/usecase/task.go:556-617 · 任务创建拆成数据库预登记、VM 创建、Redis 交接、运行态启动
  - 先把工单和工作间登记好，再等工作间真的上线，最后才把任务交给里面的 Agent。

## Takeaway
比较 Harness 时，应把平台编排能力与各 CLI 内核能力拆开计分。
