# M09 · 协作：子 Agent 如何恢复、限深度和递归取消

## Hook
研究与实现要并行，我先查 foreground、background、结果注回和递归取消。

## Evidence anchors
- opencode-subagent-001: packages/opencode/src/agent/subagent-permissions.ts:4-26 · 子 Agent 是独立持久 session，可恢复、限深度并继承关键 deny
  - 子任务有自己的聊天记录，不是父对话里的一段临时函数；父亲的禁区会传下去，默认也不能无限生孩子。
- opencode-subagent-002: packages/opencode/src/tool/task.ts:24-62 · 子 Agent 支持 foreground/background、结果自动注回和递归取消
  - 前台像打电话等对方答完，后台像发工单继续做别的；工单结束会主动回报，父任务取消时孩子也停。

## Takeaway
上下文隔离、恢复和权限边界都较完整。
