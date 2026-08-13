# M05 · 编辑：为什么不允许整文件覆盖

- Project: Legacy Little Coder
- Fixed source commit: 0b7234031aabe56163e345792ce7a6ea05af321a
- Evidence ledger: data/legacy/evidence/little-coder/evidence.json
- Episode: ch05-tools
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - .pi/extensions/write-guard/index.ts:35-75 · 禁止整文件覆写是跨 Write 与 shell 的不变量
  - .pi/extensions/read-guard-edit/index.ts:4-29 · Edit 强制先 Read，成功 Write/Edit 也更新已知文件集
