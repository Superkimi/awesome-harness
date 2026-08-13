# DeepChat · M02 · 架构：有哪些层，谁负责什么

## Hook
聊天、工具、记忆、子 Agent 混在一起，我先把它们分成四层。

## Proof
- src/main/session/turn.ts · SessionTurn|SessionTurnDependencies|sendMessage
- src/shared/agentTools.ts · AGENT_TOOL_EXPOSURE|isUserConfigurableAgentTool
- src/shared/orchestration/toolEffect.ts · OrchestrationEffectEvidenceSchema|read-only|reviewed

## Lesson
先画清边界，再决定每一层的责任：把 DeepChat 想成一台带录像机的桌面工作站：每次工具动作和会话分叉都留下可恢复的带子，而不是只保留最后一句话。

## Limitation
功能面很宽，旧 runtime 与新 harness 并存时需要 cleanup guard
