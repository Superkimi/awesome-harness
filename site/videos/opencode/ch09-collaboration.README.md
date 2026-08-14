# M09 · 协作：子 Agent 如何恢复、限深度和递归取消

- Project: Legacy OpenCode
- Fixed source commit: cc4b45612974f735ddec46009ede07729511fba4
- Evidence ledger: data/legacy/evidence/opencode/evidence.json
- Episode: ch09-collaboration
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - packages/opencode/src/agent/subagent-permissions.ts:4-26 · 子 Agent 是独立持久 session，可恢复、限深度并继承关键 deny
  - packages/opencode/src/tool/task.ts:24-62 · 子 Agent 支持 foreground/background、结果自动注回和递归取消
