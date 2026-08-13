# M04 · Provider：多入口与流式重试

## Hook
客户要切 ADC、API key 或 Vertex，我先看统一契约和连接/中途流错误的分层重试。

## Evidence anchors
- gemini-provider-001: packages/core/src/core/contentGenerator.ts:35-70 · 统一 ContentGenerator 契约覆盖流式、非流式、计数与 embedding
  - 上层只认一套生成接口，底下可换个人 Google 登录、API key、企业 Vertex 或网关。
- gemini-provider-002: packages/core/src/core/contentGenerator.ts:285-310 · 个人/ADC 走 Code Assist，API key/Vertex/Gateway 走 Google GenAI SDK
  - 登录方式不仅换凭证，也可能换后端客户端；企业 Vertex 还能指定共享/专用路由。
- gemini-provider-003: packages/core/src/core/geminiChat.ts:517-578 · 连接阶段与中途流错误分开重试，中途流最多四次尝试
  - 连不上和连上后半路断掉是两类事故，分别计数；不会因为全局重试设得很大就反复重播半截响应。

## Takeaway
Provider 切换不改主循环，但 thought signature 兼容性仍需在切换认证后处理。
