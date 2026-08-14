# M09 · 协作：AgentProtocol 的订阅、回放与取消

## Hook
研究要后台跑，结果还要可中止；我沿 AgentProtocol 和 local subagent 的并发约束看边界。

## Evidence anchors
- gemini-agent-001: packages/core/src/agent/agent-session.ts:14-69 · 子 Agent 统一为可订阅、可重放、可中止的 AgentProtocol
  - 无论子 Agent 在本机还是远程，上层看到的都是一条带编号、能续看的事件流。
- gemini-agent-002: packages/core/src/agents/local-subagent-protocol.ts:69-95 · Local 子 Agent 支持后台执行和取消，但同一 protocol 实例不允许并发 stream
  - 一个子 Agent 会话一次只接一单；主线程能先拿到 streamId，不必等它做完，但不能同时塞第二单。

## Takeaway
UI、SDK 与 A2A server 可共享协议，断线恢复不必理解每种 executor。
