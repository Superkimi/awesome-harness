# M04 · Provider：流式失败还能退回非流式

## Hook
客户遇到网络波动，我先看 Provider 分流、fallback 和独立超时如何避免整轮失败。

## Evidence anchors
- claude-code-provider-001: src/services/api/claude.ts:1282-1338 · 共享预处理之后按 Provider 分流，Anthropic 仍是最深的主路径
  - 先把所有方言共有的消息账本整理好，再交给各家的翻译器；Anthropic 方言拥有最完整的缓存、thinking 和 beta 功能。
- claude-code-provider-002: src/services/api/claude.ts:818-925 · 流式异常可退回非流式请求，且为 fallback 设置独立超时
  - 流式通道卡住时会换普通请求再试，不让“无限等待”成为默认恢复策略。

## Takeaway
多模型可用性强，但新增兼容层不自动获得 Anthropic 路径全部语义，必须独立做工具与 usage 回归。
