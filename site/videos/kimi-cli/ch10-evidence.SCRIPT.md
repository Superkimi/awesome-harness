1. 评审问“状态和审批能不能追”，我用贯穿 turn 的事件、trace 和遥测开关回答。
2. 这一章不猜作者意图，只沿固定版本的运行时代码、协议和测试看事实。
3. 固定版本证据：src/kimi_cli/soul/kimisoul.py:1009-1076 · Wire 事件与 trace id 贯穿 turn、step、tool、approval、MCP、compaction；src/kimi_cli/config.py:261-264 · 匿名遥测默认开启但可配置/环境变量关闭，代码禁止传用户内容；src/kimi_cli/session.py:84-97 · 会话、子 Agent 与遥测均有损坏/并发防护，许可证为 Apache-2.0。
4. 事实一：界面看到的不是一行最终文本，而是一条可还原执行过程的事件河流，并能把 API 请求、工具和审批串起来。
5. 源码含义：适合 IDE/ACP/Wire 客户端和故障分析；不是完整 deterministic replay，外部副作用仍不可重放。
6. 事实二：默认会上报事件名、耗时、模型/平台等运行指标，但设计规则不允许把提示词、路径和代码塞进事件；用户可以关闭。
7. 数据流：用户 turn → Soul/Toolset → Provider/并发工具 → approval/compaction → Wire 事件和 session。
8. 小白动作：先给每轮任务留检查点，再把通知、工具、审批和恢复分开记录。
9. 第二个动作：为重复调用、超时、断流和后台任务各写一个明确终态。
10. 局限提醒：context/wire/state/subagent artifacts、trace/wire events、opt-out telemetry、Apache-2.0。
11. 这一章的结论：适合 IDE/ACP/Wire 客户端和故障分析；不是完整 deterministic replay，外部副作用仍不可重放。
12. 下一章继续沿固定提交的源码锚点，回答一个真实工作问题。

Fixed commit: cbc15c076d17f70fec9f89c90c0502e68657f505
