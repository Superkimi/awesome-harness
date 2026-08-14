# M06 · 上下文：Legacy 压缩到新图系统

- Project: Legacy Gemini CLI
- Fixed source commit: 1ac3377395868295e128b96726d605a900b5946b
- Evidence ledger: data/legacy/evidence/gemini-cli/evidence.json
- Episode: ch06-context
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - packages/core/src/context/chatCompressionService.ts:37-52 · Legacy 压缩默认在 50% 窗口触发，并保留最近约 30%
  - packages/core/src/context/chatCompressionService.ts:124-142 · 旧工具输出采用反向预算，超额内容落临时文件并只留尾部
  - packages/core/src/core/client.ts:107-120 · 摘要膨胀会触发熔断，随后只做内容截断
  - packages/core/src/context/contextManager.ts:26-88 · 新 ContextManager 是图与流水线系统，带 preview late-bind、压力屏障、GC/蒸馏和结构校验
  - packages/core/src/core/client.ts:640-678 · 新上下文系统用真实 API token 反校准本地估算
