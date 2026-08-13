# M09 · 协作：子 Agent 是示例进程，不是调度平面

- Project: Legacy Pi
- Fixed source commit: 581d75a89cea21e50d6a26df840352f94427f633
- Evidence ledger: data/legacy/evidence/pi/evidence.json
- Episode: ch09-collaboration
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - packages/coding-agent/examples/extensions/subagent/index.ts:1-36 · 子 Agent 是独立 pi 进程示例，不是内建调度控制平面
  - packages/coding-agent/src/core/agent-session.ts:2454-2544 · 固定提交未实现内建 MCP client/server
