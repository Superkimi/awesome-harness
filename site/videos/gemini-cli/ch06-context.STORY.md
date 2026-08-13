# M06 · 上下文：Legacy 压缩到新图系统

## Hook
长任务快超窗，我先看 50% 压缩、反向预算和 ContextManager 的压力屏障。

## Evidence anchors
- gemini-context-001: packages/core/src/context/chatCompressionService.ts:37-52 · Legacy 压缩默认在 50% 窗口触发，并保留最近约 30%
  - 箱子装到一半就提前整理，最近三成原文留下，旧七成写成摘要；切口只选完整对话边界。
- gemini-context-002: packages/core/src/context/chatCompressionService.ts:124-142 · 旧工具输出采用反向预算，超额内容落临时文件并只留尾部
  - 最新日志全文留在桌面，旧日志搬进档案室，只在上下文里留末尾和取件地址。
- gemini-context-003: packages/core/src/core/client.ts:107-120 · 摘要膨胀会触发熔断，随后只做内容截断
  - 如果摘要反而比原文胖，就不再每轮花钱重写摘要，改用更轻的裁剪。
- gemini-context-004: packages/core/src/context/contextManager.ts:26-88 · 新 ContextManager 是图与流水线系统，带 preview late-bind、压力屏障、GC/蒸馏和结构校验
  - 新系统不再把历史当一长串消息，而是当可追溯的节点图；当前问题先在草稿区处理，确认后才影响长期账本。
- gemini-context-005: packages/core/src/core/client.ts:640-678 · 新上下文系统用真实 API token 反校准本地估算
  - 先用本地尺子估，再用模型 API 的过磅结果校准尺子。

## Takeaway
为长回复和工具调用预留较大余量，代价是较早产生摘要成本。
