1. 评审问“回退和质量能不能证明”，我用 append-only 会话、事件账本和 eval 边界回答。
2. 这一章不猜作者意图，只沿固定版本的运行时代码、契约和测试看事实。
3. 固定版本证据：packages/coding-agent/src/core/session-manager.ts:30-153 · 会话是 append-only JSONL 树，可移动叶子、fork 和保存扩展状态；packages/agent/src/types.ts:138-220 · 事件和会话账本细，输出模式丰富，但内核不是完整 OTEL 平台；packages/evals/src/pi-harness.ts:40-170 · 机制测试密集，但仓库行为 eval 目前很窄。
4. 事实一：聊天不是一条会被覆盖的直线，而是一棵只追加的版本树；回到旧节点不会删除未来分支。
5. 源码含义：天然支持回溯、分叉和扩展持久状态，适合审计和复杂交互。
6. 事实二：本地回放和多种客户端接入很强，能知道花了多少 token、每个工具发生了什么；但不像企业观测平台那样开箱把每步发到 OTEL 后端。
7. 数据流：用户消息 → turn/session → Provider 与工具 → compaction/权限 → JSONL 会话和交付。
8. 小白动作：先把长任务拆成主循环、上下文、工具、信任和观测五格。
9. 第二个动作：为并发、重试、编辑和回退各写一个明确终态，不要只看“运行中”。
10. 局限提醒：已审计 JSONL tree、fork/navigation、事件、usage/cost、HTML/JSON/RPC 模式。
11. 这一章的结论：天然支持回溯、分叉和扩展持久状态，适合审计和复杂交互。
12. 下一章继续沿固定提交的源码锚点，回答一个真实工作问题。

Fixed commit: 581d75a89cea21e50d6a26df840352f94427f633
