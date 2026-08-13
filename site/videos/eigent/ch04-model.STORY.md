# M04 · 模型与消息：流式结果如何进入状态

## Hook
同事说模型明明回复了，桌面却没留下完整结果，我先追消息去哪了。

## Source proof
- backend/app/service/single_agent_service.py · AsyncStreamingChatAgentResponse|response

## Lesson
模型响应不是终点，要经过响应解析和状态回写。
