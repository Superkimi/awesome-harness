# M07 · 权限与沙箱：默认关闭意味着什么

- Project: Legacy Claude Code (reconstruction)
- Fixed source commit: 3bb6b5746238c418138eb96d57765d79012edd96
- Evidence ledger: data/legacy/evidence/claude-code/evidence.json
- Episode: ch07-security
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - src/utils/permissions/permissions.ts:1179-1281 · 权限是“规则 → 工具自检 → 安全检查 → 模式 → 用户/自动判定”的有序流水线
  - src/utils/permissions/permissions.ts:392-470 · 无头与后台 Agent 默认不能弹窗，先给 hook/分类器机会再 fail closed
  - src/utils/sandbox/sandbox-adapter.ts:1-22 · 有真实 OS sandbox 适配，但默认关闭且默认允许退回非沙箱命令
  - src/utils/hooks.ts:1041-1088 · hook 只做网络沙箱，包装失败时会继续无沙箱执行
