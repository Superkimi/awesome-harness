1. 团队要接 MCP 和 Skill，我先看 wire subscription、审批子进程、富媒体预算和 slash 映射。
2. 这一章不猜作者意图，只沿固定版本的运行时代码、协议和测试看事实。
3. 固定版本证据：src/kimi_cli/hooks/engine.py:65-91 · Hook 同时支持本地命令与客户端 wire subscription；src/kimi_cli/plugin/tool.py:37-130 · 插件工具是经审批的本地子进程，可获得新鲜 Host 凭证；src/kimi_cli/soul/agent.py:467-485 · MCP 延迟启动、逐服务器状态化，并对富媒体共享 100K 字符预算。
4. 事实一：组织可以在模型动作前后插入自己的门卫/审计脚本，也可以让 IDE 客户端参与判断。
5. 源码含义：扩展面完整；engine、命令错误与超时通常 fail-open，只有成功返回 block/exit 2 才阻止。
6. 事实二：插件本质是本机程序，不是受限脚本；它能按配置拿到主机凭证，所以安装来源和权限同样重要。
7. 数据流：用户 turn → Soul/Toolset → Provider/并发工具 → approval/compaction → Wire 事件和 session。
8. 小白动作：先给每轮任务留检查点，再把通知、工具、审批和恢复分开记录。
9. 第二个动作：为重复调用、超时、断流和后台任务各写一个明确终态。
10. 局限提醒：延迟 MCP、OAuth、输出截断、subprocess plugins、server/wire hooks。
11. 这一章的结论：扩展面完整；engine、命令错误与超时通常 fail-open，只有成功返回 block/exit 2 才阻止。
12. 下一章继续沿固定提交的源码锚点，回答一个真实工作问题。

Fixed commit: cbc15c076d17f70fec9f89c90c0502e68657f505
