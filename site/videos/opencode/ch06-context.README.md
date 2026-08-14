# M06 · 上下文：压缩前先裁剪，失败还能 replay

- Project: Legacy OpenCode
- Fixed source commit: cc4b45612974f735ddec46009ede07729511fba4
- Evidence ledger: data/legacy/evidence/opencode/evidence.json
- Episode: ch06-context
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - packages/opencode/src/session/overflow.ts:8-33 · overflow 阈值为可用输入窗口，而非模型总窗口
  - packages/opencode/src/session/compaction.ts:28-35 · 压缩保留近期原文尾部，而不是只剩一段摘要
  - packages/opencode/src/session/compaction.ts:289-354 · 摘要前先去媒体、限制工具输出，失败时可 replay 原请求
  - packages/opencode/src/tool/truncate.ts:13-44 · 工具输出先独立裁剪，旧输出还能在后台 prune
