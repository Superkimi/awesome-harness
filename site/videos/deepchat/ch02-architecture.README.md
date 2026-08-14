# DeepChat · M02 · 架构：有哪些层，谁负责什么

- Project: DeepChat (deepchat)
- Fixed source commit: d5e41ce0bb9e9f264911dbab79182fe376bae2da
- Source repository: ThinkInAIXYZ/deepchat (dev)
- Episode kind: ch02-architecture
- Delivery: clean/no synthesized narration + independent SRT
- Source anchors:
  - src/main/session/turn.ts · SessionTurn|SessionTurnDependencies|sendMessage
  - src/shared/agentTools.ts · AGENT_TOOL_EXPOSURE|isUserConfigurableAgentTool
  - src/shared/orchestration/toolEffect.ts · OrchestrationEffectEvidenceSchema|read-only|reviewed
- Story hook: 聊天、工具、记忆、子 Agent 混在一起，我先把它们分成四层。
