# M01 · 总览：create_deep_agent 是图构建器

## Hook
老板让我跑一条长任务，我先确认 DeepAgents 为什么不是一个巨大 Agent 类。

## Evidence anchors
- deep-arch-001: libs/deepagents/deepagents/graph.py:268-300 · create_deep_agent 是 middleware graph builder，不是单一巨大 Agent 类
  - DeepAgents 把 Agent 看成一张可配置的 LangGraph：模型、文件工具、子 Agent、压缩、记忆和审批都作为中间件节点组合。
- deep-arch-002: libs/deepagents/deepagents/graph.py:361-401 · 核心 middleware 有受保护的顺序和排除校验
  - 顺序不是装饰：先把文件/任务工具放进去，再做压缩和 prompt cache，最后把 memory 与审批接在尾部；核心骨架不能被 profile 随意删掉。

## Takeaway
自研可借鉴“装配器 + 可插拔 middleware”模式，把功能切片而非把所有逻辑揉成 turn 函数。
