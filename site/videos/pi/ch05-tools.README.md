# M05 · 工具：并行、精确编辑与双阈值截断

- Project: Legacy Pi
- Fixed source commit: 581d75a89cea21e50d6a26df840352f94427f633
- Evidence ledger: data/legacy/evidence/pi/evidence.json
- Episode: ch05-tools
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - packages/agent/src/agent-loop.ts:411-553 · 工具默认可并行，声明 sequential 或全局策略才串行
  - packages/coding-agent/src/core/tools/edit.ts:33-53 · 编辑采用唯一精确替换，并对同一文件串行化
  - packages/coding-agent/src/core/tools/truncate.ts:1-12 · read 与 bash 使用不同方向的双阈值截断
