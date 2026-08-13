1. 评审问平台是不是可审计，我用模型流旁路、task/user/VM 归因和 OTLP allowlist 回答。
2. 这一章不猜作者意图，只沿固定版本的运行时代码、契约和测试看事实。
3. 固定版本证据：backend/biz/llmproxy/proxy.go:246-264 · 模型流被旁路解析，用量归因到 task/user/VM；backend/pkg/telemetry/telemetry.go:29-65 · 遥测采用 OTLP，但输出前做严格 allowlist 消毒；backend/pkg/lifecycle/taskhook.go:104-123 · Taskflow Create 失败被记录但吞掉，任务可能滞留 processing。
4. 事实一：回答照常流给 Agent，同时平台在旁边读水表，不必让每个 CLI 各写一套计费代码。
5. 源码含义：统一代理是跨 Harness 成本观测的高价值控制点。
6. 事实二：它不是把请求体、URL 和异常详情整包发给观测平台，而是先过一遍“只准这些字段出门”的白名单。
7. 数据流：任务 → DB/VM/Redis → CLI 或 LLM proxy → MCP/权限 → 流、审计和交付。
8. 小白动作：先把任务状态拆成创建、启动、运行、失败、回收五个节点。
9. 第二个动作：把平台边界和 CLI 内层能力分开，记录谁负责权限、压缩和恢复。
10. 局限提醒：已审计 WebSocket replay、Loki/ClickHouse 轮次、usage、OTLP 与字段消毒。
11. 这一章的结论：统一代理是跨 Harness 成本观测的高价值控制点。
12. 下一章继续沿固定提交的源码锚点，回答一个真实工作问题。

Fixed commit: fcc5320b15a10dfec4d5891ce44d9d1470e10c2b
