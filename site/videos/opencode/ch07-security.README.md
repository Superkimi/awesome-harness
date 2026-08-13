# M07 · 安全：默认 ask、语法树扫描和 doom-loop

- Project: Legacy OpenCode
- Fixed source commit: cc4b45612974f735ddec46009ede07729511fba4
- Evidence ledger: data/legacy/evidence/opencode/evidence.json
- Episode: ch07-security
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - packages/opencode/src/permission/index.ts:28-37 · 权限采用 last-match wildcard 规则，默认 ask 而非默认 allow
  - packages/opencode/src/session/processor.ts:331-380 · 连续相同工具调用触发 doom-loop 二次确认
  - packages/opencode/src/tool/shell.ts:257-291 · shell 权限不是简单字符串前缀，而是 Bash/PowerShell 语法树扫描
  - packages/opencode/src/tool/shell.ts:293-309 · shell 最终直接启动宿主子进程，没有内建 OS 沙箱
