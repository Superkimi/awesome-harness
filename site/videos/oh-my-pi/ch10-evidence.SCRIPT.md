1. 评审问“运行质量能不能审计”，我用树形事件账本、GenAI spans 和机制测试回答。
2. 这一章不猜作者意图，只沿固定版本的运行时代码、契约和测试看事实。
3. 固定版本证据：packages/coding-agent/src/session/session-storage.ts:1-260 · 会话是树形事件账本，存储层可替换；packages/agent/src/telemetry.ts:1-24 · 观测层原生实现 OTEL GenAI spans、成本与 run coverage；packages/coding-agent/test/task/isolation-runner.test.ts:1-100 · 机制测试和基准工程极密集，但仍需外部成功率验证。
4. 事实一：聊天、分支、压缩和配置变化都作为事件保存；存哪里可以从个人本地换到服务端数据库。
5. 源码含义：同一 Harness 可从 CLI 扩到多用户服务，但多后端一致性/锁/迁移成为核心基础设施。
6. 事实二：不仅有终端日志，每次模型和工具调用都能变成标准 trace，还能关联费用和网关调用 ID；敏感内容是否进 trace 可配置。
7. 数据流：用户消息 → Agent loop/Session → Provider/工具 → compaction/Task → 账本与观测。
8. 小白动作：先把长任务拆成主循环、上下文、工具、协作和观测五格。
9. 第二个动作：为并发、预算、审批和恢复都写一个可见的终态，不要只看“运行中”。
10. 局限提醒：已审计 session tree/storage、artifact、OTEL GenAI spans、cost 与 UI/RPC/ACP/collab surface。
11. 这一章的结论：同一 Harness 可从 CLI 扩到多用户服务，但多后端一致性/锁/迁移成为核心基础设施。
12. 下一章继续沿固定提交的源码锚点，回答一个真实工作问题。

Fixed commit: a53e4e790d3939a08708bf0d3c912d0763237a2d
