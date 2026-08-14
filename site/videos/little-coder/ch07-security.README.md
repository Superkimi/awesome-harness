# M07 · 权限与沙箱：白名单不等于容器

- Project: Legacy Little Coder
- Fixed source commit: 0b7234031aabe56163e345792ce7a6ea05af321a
- Evidence ledger: data/legacy/evidence/little-coder/evidence.json
- Episode: ch07-security
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - .pi/extensions/permission-gate/index.ts:11-58 · shell 权限是分段白名单，并显式检测写重定向
  - .pi/extensions/shell-session/index.ts:6-16 · 默认执行是宿主 bash，不是容器或内核沙箱
