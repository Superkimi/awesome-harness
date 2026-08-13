1. 客户要换传输方式，我先看 Responses 契约、SSE、WebSocket 和 turn 粘性状态。
2. 这一章不猜作者意图，只沿固定版本的运行时代码、协议和测试看事实。
3. 固定版本证据：codex-rs/model-provider-info/src/lib.rs:54-84 · 模型协议只保留 Responses API，但 Provider 端点与认证可扩展；codex-rs/core/src/client.rs:1-24 · 传输层同时支持 SSE 与可复用 WebSocket，并带 turn 粘性状态。
4. 事实一：它允许换“接线地址和门禁方式”，但要求对方都说 Responses 这门语言；不是任意 Chat Completions 方言翻译器。
5. 源码含义：兼容面更一致，第三方 Provider 必须实现 Responses 语义而非只暴露 chat/completions。
6. 事实二：每轮对话尽量占用一条可复用的高速通道，还带着本轮路由票据；热身失败不会把整轮任务判死。
7. 数据流：用户消息 → turn/step 快照 → Provider/工具 → 权限与沙箱 → rollout/SQLite 交付。
8. 小白动作：先把任务拆成状态快照、动作、审批和回放四格，再决定并发方式。
9. 第二个动作：把模型可见工具、真实执行器和审计事件分别记录，不要混成一张列表。
10. 局限提醒：审计 Responses-only wire API、可配置兼容 Provider、WebSocket/SSE 和认证边界。
11. 这一章的结论：兼容面更一致，第三方 Provider 必须实现 Responses 语义而非只暴露 chat/completions。
12. 下一章继续沿固定提交的源码锚点，回答一个真实工作问题。

Fixed commit: 902bd9e06b3ecb32cbf7f8e64cd23b956be3e7fe
