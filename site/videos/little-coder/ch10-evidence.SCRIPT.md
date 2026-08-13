1. 评审问“失败能不能回放”，我用 session evidence、checkpoint 和最多两次自纠回答。
2. 这一章不猜作者意图，只沿固定版本的运行时代码、扩展和测试看事实。
3. 固定版本证据：.pi/extensions/evidence/index.ts:5-42 · 证据是 session-scoped 结构化对象，并显式跨压缩；.pi/extensions/quality-monitor/index.ts:5-18 · 质量监控会 steer 自纠，但最多连续两次；.pi/extensions/checkpoint/index.ts:6-45 · checkpoint 是 best-effort 文件快照，且存在 path 键兼容缺口。
4. 事实一：引用依据不只躺在长聊天里，而是放到一个小抽屉；聊天被总结后，抽屉还在。
5. 源码含义：可寻址的结构化证据比让模型从摘要里回忆来源可靠，但进程退出后不持久。
6. 事实二：模型答歪时 Harness 会马上插一句纠偏，但不会无限唠叨把自己困进循环。
7. 数据流：用户目标 → pi/扩展 → 上下文与工具约束 → 子 Agent 或文件动作 → session evidence。
8. 小白动作：先给任务设一个边界，再列输入、动作、检查和交付四格。
9. 第二个动作：遇到长任务先压缩输入，再给工具和子 Agent 设能力上限。
10. 局限提醒：有 UI intervention、子 Agent usage、session evidence 与文件 checkpoint；无统一 trace backend。
11. 这一章的结论：可寻址的结构化证据比让模型从摘要里回忆来源可靠，但进程退出后不持久。
12. 下一章继续沿固定提交的源码锚点，回答一个真实工作问题。

Fixed commit: 0b7234031aabe56163e345792ce7a6ea05af321a
