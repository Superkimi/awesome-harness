# M03 · 主循环：工具执行中也能 steering

- Project: Legacy Oh My Pi
- Fixed source commit: a53e4e790d3939a08708bf0d3c912d0763237a2d
- Evidence ledger: data/legacy/evidence/oh-my-pi/evidence.json
- Episode: ch03-loop
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - packages/agent/src/agent-loop.ts:999-1048 · steering 不只在轮间排队，还能在工具执行中协作中断
  - packages/agent/src/agent-loop.ts:2067-2200 · 工具调度支持 shared/exclusive 并发和完整 pre-dispatch 改写
