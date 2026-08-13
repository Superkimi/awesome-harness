# M07 · 安全：VM、权限转发与 SSRF guard

- Project: Legacy MonkeyCode
- Fixed source commit: fcc5320b15a10dfec4d5891ce44d9d1470e10c2b
- Evidence ledger: data/legacy/evidence/monkeycode/evidence.json
- Episode: ch07-security
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - backend/biz/task/usecase/task.go:157-163 · 平台只转发 auto-approve，具体权限语义继承所选 CLI
  - backend/pkg/taskflow/types.go:72-92 · 隔离边界主要依赖仓库外 VM，Codex 内层 sandbox 明确关闭
  - backend/pkg/netguard/guard.go:53-69 · SSRF guard 能防 DNS rebinding，但私有化示例默认关闭
