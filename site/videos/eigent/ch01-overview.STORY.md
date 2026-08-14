# Eigent · M01 · 总览：先知道它解决什么问题

## Hook
明早要交接任务，我先确认这个桌面 Cowork 到底记住了什么。

## Proof
- backend/app/service/single_agent_service.py · _build_single_agent_context|_response_content
- backend/app/service/single_agent_service.py · AsyncStreamingChatAgentResponse|response
- backend/app/service/single_agent_service.py · MEMORY_TOKEN_BUDGET|conversation_history|durable

## Lesson
先证明一个真实工作结果，再追问它为什么能稳定完成：把 Eigent 想成一个带项目记忆的办公室：任务锁是工单，Agent 是员工，MCP 是工具柜，记忆服务负责交接班。

## Limitation
Python CAMEL/后端服务与 Electron 前端的链路较长
