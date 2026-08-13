# M09 · 协作：子 Agent 不是提示词里的角色扮演

## Hook
研究和实现要分工，我先确认子 Agent 是不是独立会话，以及它为什么不能无限递归委派。

## Evidence anchors
- goose-subagent-001: crates/goose/src/agents/subagent_handler.rs:121-230 · 子 Agent 是独立 Agent 与子会话，不是主提示词里的角色扮演
  - 主 Agent 真正启动了另一个有独立历史和工具集的执行循环，而不是在同一段对话里假装分身；但只允许一层委派。

## Takeaway
独立会话便于隔离上下文、统计成本和回传结果；禁止递归可控制爆炸式 fan-out。
