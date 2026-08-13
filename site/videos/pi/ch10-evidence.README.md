# M10 · 证据：JSONL 会话树与窄行为评测

- Project: Legacy Pi
- Fixed source commit: 581d75a89cea21e50d6a26df840352f94427f633
- Evidence ledger: data/legacy/evidence/pi/evidence.json
- Episode: ch10-evidence
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - packages/coding-agent/src/core/session-manager.ts:30-153 · 会话是 append-only JSONL 树，可移动叶子、fork 和保存扩展状态
  - packages/agent/src/types.ts:138-220 · 事件和会话账本细，输出模式丰富，但内核不是完整 OTEL 平台
  - packages/evals/src/pi-harness.ts:40-170 · 机制测试密集，但仓库行为 eval 目前很窄
