1. 客户要解释 DeepSeek 的思考和工具调用，我先看配对修复、截断 JSON 和 reasoning replay。
2. 这一章不猜作者意图，只沿固定版本的运行时代码、契约和测试看事实。
3. 固定版本证据：internal/provider/provider.go:40-75 · Provider 消息对象把模型内容与本地显示元数据分开；internal/provider/provider.go:179-192 · 发请求前会修复 tool-call 配对和被截断的 JSON；internal/provider/openai/openai.go:279-316 · DeepSeek thinking 与工具调用 reasoning replay 是显式协议分支。
4. 事实一：用户看到的半截流式输出可以保存下来，但它不会偷偷再喂给模型；真正发到 API 的内容和本地 UI 账本是两条线。
5. 源码含义：本地可观测性、恢复和 prompt cache 可以同时成立；模型可见消息类型必须有单独的 wire sanitizer。
6. 事实二：模型上次说“我要调用工具”但进程崩了，下一次请求前会补一张“没有结果”的占位回执，避免 API 因为票据对不上直接 400。
7. 数据流：Boot → Controller/Agent → Provider/工具 → Policy/Sandbox → event wire/Evidence Ledger。
8. 小白动作：先把一轮任务拆成装配、动作、策略、回放和验收五格。
9. 第二个动作：为 thinking、工具、恢复和协作分别记录证据，不要把日志当成事实账本。
10. 局限提醒：OpenAI-compatible/DeepSeek 与 Anthropic SSE、thinking replay、断流重连和工具调用配对修复。
11. 这一章的结论：本地可观测性、恢复和 prompt cache 可以同时成立；模型可见消息类型必须有单独的 wire sanitizer。
12. 下一章继续沿固定提交的源码锚点，回答一个真实工作问题。

Fixed commit: 9aaf8d381a214cd2cb6df774d3b207a646ddd651
