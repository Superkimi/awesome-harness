# M07 · 执行边界：宿主 shell、Trust 与凭据锁

- Project: Legacy Pi
- Fixed source commit: 581d75a89cea21e50d6a26df840352f94427f633
- Evidence ledger: data/legacy/evidence/pi/evidence.json
- Episode: ch07-security
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - packages/coding-agent/src/core/tools/bash.ts:82-148 · 默认 CLI 在宿主 shell/filesystem 执行，不是沙箱
  - packages/coding-agent/src/core/project-trust.ts:24-95 · Project Trust 保护仓库可执行资源，但不审批每条命令
  - packages/coding-agent/src/core/auth-storage.ts:21-145 · 本地凭据文件使用权限收紧和跨进程锁
