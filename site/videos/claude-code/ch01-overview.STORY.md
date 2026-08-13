# M01 · 总览：先看复原边界，再谈能力

## Hook
同事把它当成官方源码，我先用 provenance 证据说明这是一份复原实现。

## Evidence anchors
- claude-code-provenance-001: AGENTS.md:1-8 · 这是反编译/复原仓库，不是 Anthropic 官方 Claude Code 源码
  - 它像依据成品拆机后复原出的工程图，能研究结构，但不能把每一处细节当成原厂图纸。
- claude-code-maturity-001: src/services/compact/__tests__/snipCompact.test.ts:1-80 · 测试很多，但复原完整度和许可边界仍是采用门槛
  - 它不是玩具项目，回归网很大；但“测得多”不能消除拆机复原缺件和法律授权不明确的问题。

## Takeaway
报告可评价这个固定提交的实现，但任何对官方产品内部机制的映射都必须标注为推断。
