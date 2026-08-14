# M04 · Provider：Responses API 之外是可扩展端点

## Hook
客户要换传输方式，我先看 Responses 契约、SSE、WebSocket 和 turn 粘性状态。

## Evidence anchors
- codex-provider-001: codex-rs/model-provider-info/src/lib.rs:54-84 · 模型协议只保留 Responses API，但 Provider 端点与认证可扩展
  - 它允许换“接线地址和门禁方式”，但要求对方都说 Responses 这门语言；不是任意 Chat Completions 方言翻译器。
- codex-provider-002: codex-rs/core/src/client.rs:1-24 · 传输层同时支持 SSE 与可复用 WebSocket，并带 turn 粘性状态
  - 每轮对话尽量占用一条可复用的高速通道，还带着本轮路由票据；热身失败不会把整轮任务判死。

## Takeaway
兼容面更一致，第三方 Provider 必须实现 Responses 语义而非只暴露 chat/completions。
