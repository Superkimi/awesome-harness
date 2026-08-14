# M01 · 总览：带检查点的多步状态机

## Hook
老板让我跑一条长任务，我先确认 Kimi CLI 为什么每轮都要留 checkpoint 和恢复入口。

## Evidence anchors
- kimi-loop-001: src/kimi_cli/soul/kimisoul.py:659-742 · 每轮是带检查点的多步状态机，不是单次聊天请求
  - 一次用户输入可能触发多次“模型思考—调工具—看结果—再思考”，每一步前都留存档点。
- kimi-context-001: src/kimi_cli/soul/context.py:20-65 · 上下文是可增量恢复的 JSONL 事件账本
  - 每条对话、存档点和 token 仪表读数都单独写一行；尾部坏一行不会让整场会话报废。

## Takeaway
长任务可恢复、可插话，也需要严格的步数上限和副作用治理。
