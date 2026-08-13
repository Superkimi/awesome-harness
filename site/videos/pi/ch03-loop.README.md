# M03 · 主循环：steering、工具和 follow-up 两层推进

- Project: Legacy Pi
- Fixed source commit: 581d75a89cea21e50d6a26df840352f94427f633
- Evidence ledger: data/legacy/evidence/pi/evidence.json
- Episode: ch03-loop
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - packages/agent/src/agent-loop.ts:155-275 · 低层循环把 steering、工具执行和 follow-up 分成内外两层
  - packages/agent/src/agent-loop.ts:208-245 · 截断响应禁止执行工具；每回合可热刷新完整运行状态
