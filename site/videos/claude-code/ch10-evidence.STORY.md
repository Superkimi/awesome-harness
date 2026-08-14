# M10 · 证据：JSONL 会话与可观测性边界

## Hook
评审问“复原实现能不能放心采用”，我用 append-only 会话、OTEL 和许可边界回答。

## Evidence anchors
- claude-code-session-001: src/utils/sessionStorage.ts:130-168 · 会话是 append-only JSONL 树，而不是简单聊天数组
  - 日志更像带分叉的版本树：可以从某个节点继续、压缩或恢复文件快照，不只是从头到尾的一串气泡。
- claude-code-observability-001: src/utils/telemetry/instrumentation.ts:1-71 · 开源复原代码中仍有可用 OTEL/Perfetto/Langfuse，但内部 analytics 不可等同
  - 标准观测管道是真代码，可以接企业采集；原厂内部埋点名字很多，但这个仓库里的后端并不完整。
- claude-code-maturity-001: src/services/compact/__tests__/snipCompact.test.ts:1-80 · 测试很多，但复原完整度和许可边界仍是采用门槛
  - 它不是玩具项目，回归网很大；但“测得多”不能消除拆机复原缺件和法律授权不明确的问题。

## Takeaway
可恢复性很强，但 parentUuid 一致性是核心不变量，代码中大量修复逻辑也说明这里是高风险复杂区。
