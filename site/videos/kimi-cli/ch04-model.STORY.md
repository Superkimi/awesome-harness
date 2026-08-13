# M04 · Provider：多模型与真实 completion 预算

## Hook
客户要换 Kimi、OpenAI 或 Gemini，我先看统一 LLM 层和安全边际怎么算。

## Evidence anchors
- kimi-provider-002: src/kimi_cli/llm.py:326-470 · 同一 LLM 层支持 Kimi、OpenAI、Anthropic、Gemini 与 Vertex
  - 主循环不绑某一家 API，同一套工具和上下文可换不同模型协议。
- kimi-provider-003: src/kimi_cli/llm.py:181-263 · completion 上限按真实请求估算并留安全边际
  - 不只数聊天正文，还把工具说明书和图片等隐藏成本算进去，再决定模型最多还能写多少。

## Takeaway
可移植性好，但 Kimi 专属 generation override、prompt cache key 与 preserved thinking 只在 Kimi provider 生效。
