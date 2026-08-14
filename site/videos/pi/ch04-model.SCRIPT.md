1. 客户临时换模型，流程不能重写；我先看 Provider 适配矩阵、热注册和重试分层。
2. 这一章不猜作者意图，只沿固定版本的运行时代码、契约和测试看事实。
3. 固定版本证据：packages/ai/src/providers/all.ts:5-44 · Provider 不是单一 OpenAI 兼容层，而是多协议适配矩阵；packages/coding-agent/src/core/model-runtime.ts:193-230 · Provider 可热注册和覆盖，失败时退回内建组合；packages/ai/src/utils/provider-retry.ts:22-66 · 传输重试与会话重试分层，上下文溢出单独处理。
4. 事实一：每家模型的方言由独立翻译器处理，而不是假设所有服务都说 OpenAI 方言。
5. 源码含义：覆盖面很广，也意味着协议行为和 usage/tool schema 回归成本高。
6. 事实二：扩展可以接入私有模型甚至替换流协议；某个扩展写坏时，内置模型仍尽量可用。
7. 数据流：用户消息 → turn/session → Provider 与工具 → compaction/权限 → JSONL 会话和交付。
8. 小白动作：先把长任务拆成主循环、上下文、工具、信任和观测五格。
9. 第二个动作：为并发、重试、编辑和回退各写一个明确终态，不要只看“运行中”。
10. 局限提醒：已审计 provider/protocol 矩阵、stream hooks、动态凭据和两层 retry。
11. 这一章的结论：覆盖面很广，也意味着协议行为和 usage/tool schema 回归成本高。
12. 下一章继续沿固定提交的源码锚点，回答一个真实工作问题。

Fixed commit: 581d75a89cea21e50d6a26df840352f94427f633
