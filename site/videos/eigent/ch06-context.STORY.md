# M06 · 上下文：长任务怎样不丢重点

## Hook
客户一周的资料塞进来，我最怕 Agent 把项目记忆当成聊天废话。

## Source proof
- backend/app/service/single_agent_service.py · MEMORY_TOKEN_BUDGET|conversation_history|durable

## Lesson
记忆需要 token budget、历史边界和可持久化的任务上下文。
