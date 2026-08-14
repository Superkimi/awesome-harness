# M03 · 主循环：流式响应为什么能提前启动工具

- Project: Legacy Claude Code (reconstruction)
- Fixed source commit: 3bb6b5746238c418138eb96d57765d79012edd96
- Evidence ledger: data/legacy/evidence/claude-code/evidence.json
- Episode: ch03-loop
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - src/query.ts:460-666 · 主 Harness 是一个持续循环的消息变换与工具执行流水线
  - src/query.ts:971-1124 · 工具可以随流式响应提前启动，并补齐协议不完整的 tool result
