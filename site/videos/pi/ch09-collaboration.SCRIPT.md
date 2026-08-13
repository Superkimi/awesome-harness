1. 研究与实现要并行，我先确认 subagent 示例怎样独立启动，以及 Pi 内核没有替它做什么。
2. 这一章不猜作者意图，只沿固定版本的运行时代码、契约和测试看事实。
3. 固定版本证据：packages/coding-agent/examples/extensions/subagent/index.ts:1-36 · 子 Agent 是独立 pi 进程示例，不是内建调度控制平面；packages/coding-agent/src/core/agent-session.ts:2454-2544 · 固定提交未实现内建 MCP client/server。
4. 事实一：它展示了“主 Agent 叫几个临时 Pi 工人”的方法，但没有内核级 durable queue、共享记忆、远程 worker 或统一权限继承。
5. 源码含义：适合参考 subprocess orchestration，不应与成熟多 Agent 控制平面等同。
6. 事实二：Pi 可以通过扩展接任意协议，但开箱没有像部分竞品那样配置 MCP server 后自动发现 tools/resources/prompts。
7. 数据流：用户消息 → turn/session → Provider 与工具 → compaction/权限 → JSONL 会话和交付。
8. 小白动作：先把长任务拆成主循环、上下文、工具、信任和观测五格。
9. 第二个动作：为并发、重试、编辑和回退各写一个明确终态，不要只看“运行中”。
10. 局限提醒：子 Agent 是 subprocess extension 示例，不是默认调度器。
11. 这一章的结论：适合参考 subprocess orchestration，不应与成熟多 Agent 控制平面等同。
12. 下一章继续沿固定提交的源码锚点，回答一个真实工作问题。

Fixed commit: 581d75a89cea21e50d6a26df840352f94427f633
