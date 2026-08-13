# Multica · M02 · 架构：有哪些层，谁负责什么

- Project: Multica (multica)
- Fixed source commit: d467cc90691587ed00bdaca678475957df62dd3a
- Source repository: multica-ai/multica (main)
- Episode kind: ch02-architecture
- Delivery: clean/no synthesized narration + independent SRT
- Source anchors:
  - server/cmd/multica/cmd_agent.go · agentCmd|agentListCmd|agentCreateCmd
  - server/pkg/composio/tools.go · ExecuteToolRequest|ConnectedAccountID|Version
  - server/cmd/multica/cmd_runtime.go · cascade|active agents|unbind
- Story hook: 要删一个 Runtime，却先撞上 active agent；这次看它的资源生命周期。
