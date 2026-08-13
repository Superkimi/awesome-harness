# M07 · 执行边界：宿主、子任务和 isolation

- Project: Legacy Oh My Pi
- Fixed source commit: a53e4e790d3939a08708bf0d3c912d0763237a2d
- Evidence ledger: data/legacy/evidence/oh-my-pi/evidence.json
- Episode: ch07-security
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - packages/coding-agent/src/session/bash-runner.ts:1-220 · 主 Agent 默认宿主执行；子任务 isolation 默认 none 且主要隔离工作区
  - packages/coding-agent/src/tools/approval.ts:13-39 · Approval 分级完整，但默认是 yolo
