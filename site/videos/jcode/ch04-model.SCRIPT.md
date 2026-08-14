1. 客户要切 runtime，我先看 MultiProvider、兼容 profile 和服务端原生能力如何汇合。
2. 这一章不猜作者意图，只沿固定版本的运行时代码、契约和测试看事实。
3. 固定版本证据：crates/jcode-provider-core/src/lib.rs:76-126 · Provider 契约不仅抽象生成，还抽象认证、路由、transport 与原生能力；crates/jcode-base/src/provider/mod.rs:328-374 · MultiProvider 同时容纳九类 runtime 与兼容端点 profile；crates/jcode-app-core/src/agent/turn_loops.rs:485-547 · 服务端会话、原生工具和原生压缩都能穿过统一事件流。
4. 事实一：它不是只把 URL 换掉；连“谁付费、用哪条线路、能不能续上服务端会话、工具由谁执行、压缩由谁做”都在同一接口里。
5. 源码含义：多后端能力完整，但 trait 面积很大，新 Provider 的一致性测试成本高。
6. 事实二：像一个总机：同一 Agent 可以接订阅 CLI、官方 API、Copilot、Gemini、Bedrock 或自定义兼容网关，并保留各自认证身份。
7. 数据流：用户 turn → snapshot/journal → Provider/工具 → context/permission → session、swarm 和指标。
8. 小白动作：先给每轮任务写入状态，再把输入、工具、恢复和交付拆成四个检查点。
9. 第二个动作：把串行、batch、重试、压缩和协作预算分别记账，不要只记总耗时。
10. 局限提醒：统一 Provider、MultiProvider 路由、认证/模型切换、provider-native tool/compaction。
11. 这一章的结论：多后端能力完整，但 trait 面积很大，新 Provider 的一致性测试成本高。
12. 下一章继续沿固定提交的源码锚点，回答一个真实工作问题。

Fixed commit: 71fa60c4dc875ebdaf089e6e84b29cbd61cbb478f
