# M06 · 上下文：四种压缩策略不是一张摘要

## Hook
长任务快超窗，我先看 handoff、shake、snapcompact、prune 和长期记忆后端如何组合。

## Evidence anchors
- omp-context-001: packages/agent/src/compaction/compaction.ts:148-189 · 压缩不是单一摘要，而是 context-full/handoff/shake/snapcompact 多策略
  - 可以选择传统摘要、交接文档、删除低价值块或 frame 化压缩；预算还会随模型窗口缩放。
- omp-context-002: packages/agent/src/compaction/compaction.ts:501-636 · 传统摘要保留近期原文、拆分超长 turn、迁移文件操作和旧 archive
  - 远处历史压成结构化摘要，最近工作保留原文；一个回合过长就拆开。换模型时也不会把上一家模型才懂的压缩黑盒直接留下。
- omp-context-003: packages/agent/src/compaction/pruning.ts:1-260 · 工具输出还有独立 prune/protection/shake 层
  - 不是等整本对话太厚才总结，旧日志、重复读取和明确无用结果会先做局部瘦身；关键结果和最近工作有保护圈。
- omp-memory-001: packages/coding-agent/src/memory-backend/resolve.ts:6-24 · 长期记忆有 off/local/Mnemopi/Hindsight 四种后端
  - 记忆可以关掉、只做本地日志总结、启用本地语义记忆库，或接远端记忆服务；子 Agent 默认不各自建长期脑库。

## Takeaway
策略实验空间很大，但同一会话跨模型/策略迁移要处理兼容性。
