# M06 · 上下文：预算、cut point 和一次恢复重试

- Project: Legacy Pi
- Fixed source commit: 581d75a89cea21e50d6a26df840352f94427f633
- Evidence ledger: data/legacy/evidence/pi/evidence.json
- Episode: ch06-context
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - packages/coding-agent/src/core/compaction/compaction.ts:190-237 · 压缩阈值给输出预留固定预算，并尽量使用真实 usage
  - packages/coding-agent/src/core/compaction/compaction.ts:345-460 · cut point 不切 tool result，并支持拆分超长 turn
  - packages/coding-agent/src/core/agent-session.ts:1783-1924 · overflow 最多压缩后自动重试一次，扩展可取消或替换摘要
