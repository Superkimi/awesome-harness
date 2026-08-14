1. 架构评审只剩十分钟，我得讲清流式生成、Soul 状态机和动态工具表各自负责什么。
2. 这一章不猜作者意图，只沿固定版本的运行时代码、协议和测试看事实。
3. 固定版本证据：packages/kosong/src/kosong/_generate.py:52-103 · Kosong 把流式生成和工具调度拆成两层契约；src/kimi_cli/soul/kimisoul.py:659-742 · 每轮是带检查点的多步状态机，不是单次聊天请求；src/kimi_cli/soul/agent.py:411-451 · 工具表由 agent spec 动态装配，插件和 MCP 追加进入同一 Toolset。
4. 事实一：底层负责把碎片拼成完整回复，上层负责一看到完整工具单就开工；若模型流中断，尚未完成的工具任务会被收拢取消。
5. 源码含义：Provider 和 Harness 解耦，同时避免中断后悬挂任务。
6. 事实二：一次用户输入可能触发多次“模型思考—调工具—看结果—再思考”，每一步前都留存档点。
7. 数据流：用户 turn → Soul/Toolset → Provider/并发工具 → approval/compaction → Wire 事件和 session。
8. 小白动作：先给每轮任务留检查点，再把通知、工具、审批和恢复分开记录。
9. 第二个动作：为重复调用、超时、断流和后台任务各写一个明确终态。
10. 局限提醒：Kosong provider abstraction、Kimi/OpenAI/Anthropic/Gemini/Vertex、thinking 与请求级 completion budget。
11. 这一章的结论：Provider 和 Harness 解耦，同时避免中断后悬挂任务。
12. 下一章继续沿固定提交的源码锚点，回答一个真实工作问题。

Fixed commit: cbc15c076d17f70fec9f89c90c0502e68657f505
