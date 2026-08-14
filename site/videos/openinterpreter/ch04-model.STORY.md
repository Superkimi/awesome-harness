# M04 · Harness：不只换 Prompt，还会改历史和工具协议

## Hook
同一个模型换了工作手感，我先看不同 Harness 如何重写历史、工具名和请求形状。

## Evidence anchors
- oi-harness-005: codex-rs/core/src/harness/pi.rs:21-120 · 各 Harness 不只换 prompt，还重写历史和工具协议
  - 这不是贴一张角色卡，而是把整段对话和工具说明书翻译成目标 Agent 的“母语”。
- oi-maturity-001: codex-rs/core/src/harness/request.rs:75-231 · 优势是“一个安全底盘，多种模型原生手感”；主要成本是兼容矩阵爆炸
  - 它最像“Coding Agent 兼容器”：同一套沙箱和会话底盘，让不同模型吃到熟悉的提示词与工具格式。

## Takeaway
模型行为更接近目标 Harness；翻译层必须维护 call/result 配对和隐藏上下文，升级成本高。
