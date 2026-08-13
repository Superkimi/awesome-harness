# M03 · 主循环：每轮先检查再锁定工具

- Project: Legacy Gemini CLI
- Fixed source commit: 1ac3377395868295e128b96726d605a900b5946b
- Evidence ledger: data/legacy/evidence/gemini-cli/evidence.json
- Episode: ch03-loop
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - packages/core/src/core/client.ts:614-715 · 每轮先做上下文、溢出、IDE 配对和 loop 检测，再锁定模型与工具
  - packages/core/src/core/client.ts:744-763 · 循环检测能先恢复一次，再判定硬循环
