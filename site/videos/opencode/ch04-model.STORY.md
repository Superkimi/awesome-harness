# M04 · Provider：不只是兼容 OpenAI API

## Hook
客户要换模型，我先看 AI SDK 适配矩阵和 request prepare 如何保持调用层稳定。

## Evidence anchors
- opencode-provider-001: packages/opencode/src/provider/provider.ts:101-145 · Provider 层是 AI SDK 适配矩阵，不只兼容 OpenAI API
  - 它不是把所有厂商硬塞成同一种 HTTP；每家方言由独立适配器翻译。
- opencode-provider-002: packages/opencode/src/session/llm/request.ts:56-100 · 请求准备层统一合并 prompt、variant、provider options 与 hooks
  - 模型请求像一张多层样式表：厂商默认、模型设置、Agent 设置、当前档位和插件逐层覆盖。

## Takeaway
模型覆盖广，但 provider 特例数量大，回归测试成本高。
