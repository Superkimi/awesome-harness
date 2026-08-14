# M03 · 主循环：reasoning、tool 和 patch 都成为事件

- Project: Legacy OpenCode
- Fixed source commit: cc4b45612974f735ddec46009ede07729511fba4
- Evidence ledger: data/legacy/evidence/opencode/evidence.json
- Episode: ch03-loop
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - packages/opencode/src/session/processor.ts:315-413 · stream processor 把 reasoning、text、tool、usage、patch 全部事件化持久
  - packages/opencode/src/session/processor.ts:539-597 · 重试、拒绝、上下文溢出和中断有不同终态
