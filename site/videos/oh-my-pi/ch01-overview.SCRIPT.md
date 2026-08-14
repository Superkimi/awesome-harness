1. 老板让我交付一条长任务，我先确认 Oh My Pi 的核心 loop 和 Session maintenance 分别管什么。
2. 这一章不猜作者意图，只沿固定版本的运行时代码、契约和测试看事实。
3. 固定版本证据：packages/agent/src/agent-loop.ts:879-918 · 核心是强化 Agent loop，产品层再叠加大型 Session maintenance 状态机；packages/coding-agent/src/session/session-storage.ts:1-260 · 会话是树形事件账本，存储层可替换。
4. 事实一：内层发动机负责每一步，外层管家负责一步结束后判断要不要重试、压缩、换模型、继续目标或等待后台工作。
5. 源码含义：自治恢复能力强，但 session maintenance 已成为复杂调度器，修改顺序容易产生竞态。
6. 事实二：聊天、分支、压缩和配置变化都作为事件保存；存哪里可以从个人本地换到服务端数据库。
7. 数据流：用户消息 → Agent loop/Session → Provider/工具 → compaction/Task → 账本与观测。
8. 小白动作：先把长任务拆成主循环、上下文、工具、协作和观测五格。
9. 第二个动作：为并发、预算、审批和恢复都写一个可见的终态，不要只看“运行中”。
10. 局限提醒：已审计 loop、session maintenance、steering/asides、yield、错误恢复和 goal continuation。
11. 这一章的结论：自治恢复能力强，但 session maintenance 已成为复杂调度器，修改顺序容易产生竞态。
12. 下一章继续沿固定提交的源码锚点，回答一个真实工作问题。

Fixed commit: a53e4e790d3939a08708bf0d3c912d0763237a2d
