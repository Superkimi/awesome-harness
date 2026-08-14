# M07 · 安全：OS 沙箱与 deny/ask/allow 策略分开

- Project: Legacy DeepSeek-Reasonix
- Fixed source commit: 9aaf8d381a214cd2cb6df774d3b207a646ddd651
- Evidence ledger: data/legacy/evidence/deepseek-reasonix/evidence.json
- Episode: ch07-security
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - internal/sandbox/sandbox.go:1-14 · Bash 沙箱是独立于 permission 的 OS enforcement 层
  - internal/sandbox/escape.go:8-46 · 沙箱逃逸是单次、显式、可审计的二次授权
  - internal/permission/permission.go:1-5 · 权限 Policy 是纯函数，deny→ask→allow→fallback 且按每个路径判定
  - internal/boot/boot.go:200-211 · 凭据防护同时覆盖子进程环境、敏感文件和诊断文本
