# M04 · Provider：thinking 与 reasoning replay 是协议分支

## Hook
客户要解释 DeepSeek 的思考和工具调用，我先看配对修复、截断 JSON 和 reasoning replay。

## Evidence anchors
- reasonix-provider-001: internal/provider/provider.go:40-75 · Provider 消息对象把模型内容与本地显示元数据分开
  - 用户看到的半截流式输出可以保存下来，但它不会偷偷再喂给模型；真正发到 API 的内容和本地 UI 账本是两条线。
- reasonix-provider-002: internal/provider/provider.go:179-192 · 发请求前会修复 tool-call 配对和被截断的 JSON
  - 模型上次说“我要调用工具”但进程崩了，下一次请求前会补一张“没有结果”的占位回执，避免 API 因为票据对不上直接 400。
- reasonix-provider-003: internal/provider/openai/openai.go:279-316 · DeepSeek thinking 与工具调用 reasoning replay 是显式协议分支
  - Reasonix 没把 DeepSeek 当普通 OpenAI 接口：它记得“思考字段”要跟着工具调用回放，并把 Beta 截断续写和断网重试接在同一个流上。

## Takeaway
本地可观测性、恢复和 prompt cache 可以同时成立；模型可见消息类型必须有单独的 wire sanitizer。
