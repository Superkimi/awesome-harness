# M10 · 证据：用量、遥测和失败边界

## Hook
评审问平台是不是可审计，我用模型流旁路、task/user/VM 归因和 OTLP allowlist 回答。

## Evidence anchors
- monkey-observe-001: backend/biz/llmproxy/proxy.go:246-264 · 模型流被旁路解析，用量归因到 task/user/VM
  - 回答照常流给 Agent，同时平台在旁边读水表，不必让每个 CLI 各写一套计费代码。
- monkey-observe-002: backend/pkg/telemetry/telemetry.go:29-65 · 遥测采用 OTLP，但输出前做严格 allowlist 消毒
  - 它不是把请求体、URL 和异常详情整包发给观测平台，而是先过一遍“只准这些字段出门”的白名单。
- monkey-lifecycle-002: backend/pkg/lifecycle/taskhook.go:104-123 · Taskflow Create 失败被记录但吞掉，任务可能滞留 processing
  - 工单已经盖了“处理中”，但真正开工失败后只记了一条日志，状态机可能还以为工作在继续。

## Takeaway
统一代理是跨 Harness 成本观测的高价值控制点。
