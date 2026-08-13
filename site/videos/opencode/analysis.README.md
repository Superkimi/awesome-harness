# OpenCode · 技术分析总览

- Project: Legacy OpenCode
- Fixed source commit: cc4b45612974f735ddec46009ede07729511fba4
- Evidence ledger: data/legacy/evidence/opencode/evidence.json
- Episode: analysis
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - packages/opencode/src/session/prompt.ts:1081-1130 · 主循环由持久化消息状态驱动，而不是一次性的 while(tool_call)
  - packages/opencode/src/session/processor.ts:315-413 · stream processor 把 reasoning、text、tool、usage、patch 全部事件化持久
  - packages/opencode/src/session/compaction.ts:28-35 · 压缩保留近期原文尾部，而不是只剩一段摘要
  - packages/opencode/src/permission/index.ts:28-37 · 权限采用 last-match wildcard 规则，默认 ask 而非默认 allow
  - packages/opencode/src/session/processor.ts:98-114 · 每个模型 step 前后用影子 Git 仓库生成可回退 patch
