# M09 · 协作：角色白名单与可恢复子 Agent

## Hook
研究和实现要并行，我先看 coder/explore/plan 的工具白名单和前后台恢复。

## Evidence anchors
- kimi-subagent-001: src/kimi_cli/soul/agent.py:411-431 · 内建 coder/explore/plan 用代码级工具白名单切分角色
  - 主 Agent 能雇三种工人：能改代码、只探索、只规划；每种工人拿到的钥匙不同，而且不能继续无限招下级。
- kimi-subagent-002: src/kimi_cli/tools/agent/__init__.py:17-60 · 子 Agent 是可恢复的持久实例，可前台或后台运行
  - 子 Agent 不是一次性函数调用，而是有身份证和独立笔记本的小会话；以后可以继续找同一个人接着做。
- kimi-subagent-003: src/kimi_cli/soul/agent.py:339-369 · 子 Agent 共享审批/任务/通知底座，但拥有独立 soul/context/模型
  - 工人各有自己的对话脑和可选模型，但共用老板的审批台、后台任务台和通知总线。

## Takeaway
避免递归爆炸并缩小权限；explore 的 Shell 只读要求部分依赖 prompt，不是命令级只读 parser。
