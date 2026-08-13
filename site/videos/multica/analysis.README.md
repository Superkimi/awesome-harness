# Multica · 技术分析总览

- Project: Multica (multica)
- Fixed source commit: d467cc90691587ed00bdaca678475957df62dd3a
- Source repository: multica-ai/multica (main)
- Episode kind: analysis
- Delivery: clean/no synthesized narration + independent SRT
- Source anchors:
  - server/cmd/multica/cmd_agent.go · agentCmd|agentListCmd|agentCreateCmd
  - server/cmd/multica/cmd_runtime.go · runRuntimeActivity|runRuntimeUsage|APIContext
  - server/pkg/composio/tools.go · ExecuteToolRequest|ConnectedAccountID|Version
  - server/cmd/multica/cmd_runtime.go · cascade|active agents|unbind
- Story hook: 运营说有个 Agent 要下线，但它还绑着三条正在跑的任务。
