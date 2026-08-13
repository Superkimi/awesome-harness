# DeepChat · 技术分析总览

- Project: DeepChat (deepchat)
- Fixed source commit: d5e41ce0bb9e9f264911dbab79182fe376bae2da
- Source repository: ThinkInAIXYZ/deepchat (dev)
- Episode kind: analysis
- Delivery: clean/no synthesized narration + independent SRT
- Source anchors:
  - src/main/session/turn.ts · SessionTurn|SessionTurnDependencies|sendMessage
  - src/main/session/turn.ts · sendMessageUnderSessionGate|startInitialTurn
  - src/shared/agentTools.ts · AGENT_TOOL_EXPOSURE|isUserConfigurableAgentTool
  - src/shared/orchestration/toolEffect.ts · OrchestrationEffectEvidenceSchema|read-only|reviewed
- Story hook: 同事说聊天记录找不到了，可这次工具动作还得能恢复。
