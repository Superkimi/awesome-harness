# M06 · 上下文：平台知道窗口但不替 Agent 压缩

## Hook
任务很长时我想知道谁负责记忆；我把模型窗口、异步摘要和内层 compaction 分开。

## Evidence anchors
- monkey-context-001: backend/biz/task/usecase/task.go:788-792 · 平台知道模型窗口上限，但不管理内层 compaction
  - 平台知道油箱标称多大，却不看里面还剩多少油；何时压缩历史由 OpenCode/Codex/Claude 自己决定。
- monkey-context-002: backend/biz/task/service/tasksummary.go:32-92 · 任务摘要是异步 UI 元数据，不是 Agent 记忆回写
  - 它会给长对话写一段“给人看的剧情简介”，但这段简介不会自动塞回 Agent 的脑子里。

## Takeaway
跨 runtime 的长任务可靠性会随各 CLI 内核不同而波动。
