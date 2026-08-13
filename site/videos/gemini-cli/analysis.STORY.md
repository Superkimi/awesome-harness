# Gemini CLI · 技术分析总览

## Hook
评审问我：这个 CLI 怎么把多 turn、ContextManager、PolicyEngine、MCP 和可回放会话连起来？我沿固定源码证据拆。

## Evidence anchors
- gemini-loop-001: packages/core/src/core/client.ts:79-111 · 主 Harness 用递归 sendMessageStream 驱动多 turn，硬上限为 100
  - 一次用户请求可以连续让模型说、用工具、再说；但最多转 100 圈，避免无尽自言自语。
- gemini-context-004: packages/core/src/context/contextManager.ts:26-88 · 新 ContextManager 是图与流水线系统，带 preview late-bind、压力屏障、GC/蒸馏和结构校验
  - 新系统不再把历史当一长串消息，而是当可追溯的节点图；当前问题先在草稿区处理，确认后才影响长期账本。
- gemini-policy-001: packages/core/src/policy/policy-engine.ts:49-195 · PolicyEngine 按优先级匹配工具、参数、MCP 身份、annotations、模式、交互状态和 subagent
  - 政策可以精确到“哪个子 Agent 在非交互模式调用哪个 MCP 的哪个参数”，不只是允许/禁止 Bash。
- gemini-agent-001: packages/core/src/agent/agent-session.ts:14-69 · 子 Agent 统一为可订阅、可重放、可中止的 AgentProtocol
  - 无论子 Agent 在本机还是远程，上层看到的都是一条带编号、能续看的事件流。
- gemini-persistence-001: packages/core/src/services/chatRecordingService.ts:150-203 · 会话记录是增量 JSONL，支持 rewind、metadata patch 和完整 checkpoint
  - 对话文件像事件日志：可以写“回到某一步”、只改元数据，也能偶尔写一张完整快照；一行坏了不拖垮整份会话。

## Takeaway
控制流直观，递归路径共享 prompt_id 和 hook state，需要严格做 activeCalls 记账。
