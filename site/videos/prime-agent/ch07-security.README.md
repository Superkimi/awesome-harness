# M07 · 执行边界：宿主 bash 和临时文件输出

- Project: Legacy Prime Agent
- Fixed source commit: 7787f07415d843b9a800f6a4720e0c739bd608e5
- Evidence ledger: data/legacy/evidence/prime-agent/evidence.json
- Episode: ch07-security
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - packages/coding-agent/src/core/tools/bash.ts:36-58 · 默认 bash 是宿主 shell，不等于 OS 沙箱
  - packages/coding-agent/src/core/tools/bash.ts:250-266 · Bash 输出有行/字节上限并把完整内容留在临时文件
  - packages/coding-agent/src/core/extensions/types.ts:1080-1163 · 扩展可以获得 shell/exec 和 active tool 控制权，权限面很宽
