1. 长任务快超窗，我先看输出预算、tool result cut point 和 overflow 后的恢复边界。
2. 这一章不猜作者意图，只沿固定版本的运行时代码、契约和测试看事实。
3. 固定版本证据：packages/coding-agent/src/core/compaction/compaction.ts:190-237 · 压缩阈值给输出预留固定预算，并尽量使用真实 usage；packages/coding-agent/src/core/compaction/compaction.ts:345-460 · cut point 不切 tool result，并支持拆分超长 turn；packages/coding-agent/src/core/agent-session.ts:1783-1924 · overflow 最多压缩后自动重试一次，扩展可取消或替换摘要。
4. 事实一：不会等输入把窗口完全塞满；先给回答留座位。能拿到模型账单就用真实 token，拿不到才用字符粗算。
5. 源码含义：比单纯按消息数量可靠，但固定 16k 对不同模型/任务可调性很重要。
6. 事实二：工具调用和结果不会被拦腰拆散；最近一个超长回合也不必全丢或全留，前半段概括、后半段保真。
7. 数据流：用户消息 → turn/session → Provider 与工具 → compaction/权限 → JSONL 会话和交付。
8. 小白动作：先把长任务拆成主循环、上下文、工具、信任和观测五格。
9. 第二个动作：为并发、重试、编辑和回退各写一个明确终态，不要只看“运行中”。
10. 局限提醒：已审计 token 估算、cut point、split turn、结构化摘要、overflow recovery 和 retained tail。
11. 这一章的结论：比单纯按消息数量可靠，但固定 16k 对不同模型/任务可调性很重要。
12. 下一章继续沿固定提交的源码锚点，回答一个真实工作问题。

Fixed commit: 581d75a89cea21e50d6a26df840352f94427f633
