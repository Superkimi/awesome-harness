1. 架构评审只剩十分钟，我得讲清认证路由、上下文拼装和 typed tool registry 谁负责什么。
2. 这一章不猜作者意图，只沿固定版本的运行时代码、契约和测试看事实。
3. 固定版本证据：crates/jcode-provider-core/src/lib.rs:76-126 · Provider 契约不仅抽象生成，还抽象认证、路由、transport 与原生能力；crates/jcode-base/src/prompt.rs:451-557 · 静态前缀与每轮动态上下文分离，memory 放尾部保缓存；crates/jcode-tool-core/src/lib.rs:9-65 · 工具是 typed registry，定义顺序与 intent 字段集中标准化。
4. 事实一：它不是只把 URL 换掉；连“谁付费、用哪条线路、能不能续上服务端会话、工具由谁执行、压缩由谁做”都在同一接口里。
5. 源码含义：多后端能力完整，但 trait 面积很大，新 Provider 的一致性测试成本高。
6. 事实二：不常变的说明书放书脊，记忆和本轮提醒贴在最后一页；这样改便签不会让整本书的缓存失效。
7. 数据流：用户 turn → snapshot/journal → Provider/工具 → context/permission → session、swarm 和指标。
8. 小白动作：先给每轮任务写入状态，再把输入、工具、恢复和交付拆成四个检查点。
9. 第二个动作：把串行、batch、重试、压缩和协作预算分别记账，不要只记总耗时。
10. 局限提醒：统一 Provider、MultiProvider 路由、认证/模型切换、provider-native tool/compaction。
11. 这一章的结论：多后端能力完整，但 trait 面积很大，新 Provider 的一致性测试成本高。
12. 下一章继续沿固定提交的源码锚点，回答一个真实工作问题。

Fixed commit: 71fa60c4dc875ebdaf089e6e84b29cbd61cbb478f
