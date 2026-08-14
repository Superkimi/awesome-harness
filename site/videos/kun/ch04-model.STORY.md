# M04 · 模型与消息：流式结果如何进入状态

## Hook
同事说 Agent 的一次运行到底产出了什么，我先看 run request 和 event 怎样对上。

## Source proof
- packages/extension-api/src/agent.ts · AgentCreateRunRequestSchema|AgentRunEventSchema

## Lesson
请求 schema 和运行事件 schema 让模型动作进入可追踪状态。
