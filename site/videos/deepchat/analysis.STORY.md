# DeepChat · 技术分析总览

## Hook
同事说聊天记录找不到了，可这次工具动作还得能恢复。

## Proof
- src/main/session/turn.ts · SessionTurn|SessionTurnDependencies|sendMessage
- src/main/session/turn.ts · sendMessageUnderSessionGate|startInitialTurn
- src/shared/agentTools.ts · AGENT_TOOL_EXPOSURE|isUserConfigurableAgentTool
- src/shared/orchestration/toolEffect.ts · OrchestrationEffectEvidenceSchema|read-only|reviewed

## Lesson
把 DeepChat 想成一台带录像机的桌面工作站：每次工具动作和会话分叉都留下可恢复的带子，而不是只保留最后一句话。

## Limitation
功能面很宽，旧 runtime 与新 harness 并存时需要 cleanup guard
