1. 客户要切 ADC、API key 或 Vertex，我先看统一契约和连接/中途流错误的分层重试。
2. 这一章不猜作者意图，只沿固定版本的运行时代码、协议和测试看事实。
3. 固定版本证据：packages/core/src/core/contentGenerator.ts:35-70 · 统一 ContentGenerator 契约覆盖流式、非流式、计数与 embedding；packages/core/src/core/contentGenerator.ts:285-310 · 个人/ADC 走 Code Assist，API key/Vertex/Gateway 走 Google GenAI SDK；packages/core/src/core/geminiChat.ts:517-578 · 连接阶段与中途流错误分开重试，中途流最多四次尝试。
4. 事实一：上层只认一套生成接口，底下可换个人 Google 登录、API key、企业 Vertex 或网关。
5. 源码含义：Provider 切换不改主循环，但 thought signature 兼容性仍需在切换认证后处理。
6. 事实二：登录方式不仅换凭证，也可能换后端客户端；企业 Vertex 还能指定共享/专用路由。
7. 数据流：用户消息 → sendMessageStream → Context/Policy → Scheduler/AgentProtocol → JSONL checkpoint。
8. 小白动作：先把长任务拆成循环、上下文、策略、工具和回放五格。
9. 第二个动作：为超限、取消、拒绝和重试分别写终态，不要只看“执行成功”。
10. 局限提醒：ContentGenerator、Google OAuth/API key/Vertex/Gateway、流式重试。
11. 这一章的结论：Provider 切换不改主循环，但 thought signature 兼容性仍需在切换认证后处理。
12. 下一章继续沿固定提交的源码锚点，回答一个真实工作问题。

Fixed commit: 1ac3377395868295e128b96726d605a900b5946b
