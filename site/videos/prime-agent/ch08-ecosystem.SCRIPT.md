1. 团队要接 Skills、prompts 和自定义 provider，我先看统一资源来源、去重冲突和串行 runner。
2. 这一章不猜作者意图，只沿固定版本的运行时代码、契约和测试看事实。
3. 固定版本证据：packages/coding-agent/src/core/resource-loader.ts:23-39 · ResourceLoader 统一管理 skills、prompts、themes、extensions 和 AGENTS 文件；packages/coding-agent/src/core/resource-loader.ts:646-678 · 资源来源带 user/project/temporary metadata 并去重冲突；packages/coding-agent/src/core/extensions/types.ts:1024-1074 · Extension API 覆盖生命周期、工具、命令、provider 和持久化。
4. 事实一：指令、技能、主题和扩展不是四套互不相干的扫描器，而是在 reload 时形成一份带诊断的资源快照。
5. 源码含义：插件/技能热更新要有单一 loader 和明确的 reload boundary，才能通知 session 资源变了。
6. 事实二：系统知道一个 skill 是用户级、项目级还是临时 CLI 注入的；同名 prompt 不会静默覆盖，而是留下谁赢、谁输的诊断。
7. 数据流：纯 loop → coding host → resources/extensions → RLM/daemon → JSONL events 和恢复。
8. 小白动作：先把任务拆成 loop、工具、上下文、协作和持久化五格。
9. 第二个动作：为每个后台任务记录 admission、heartbeat、lease 和完成释放，避免幽灵进程。
10. 局限提醒：AGENTS/CLAUDE 上下文、skills/prompts/themes/extensions 动态资源和冲突诊断。
11. 这一章的结论：插件/技能热更新要有单一 loader 和明确的 reload boundary，才能通知 session 资源变了。
12. 下一章继续沿固定提交的源码锚点，回答一个真实工作问题。

Fixed commit: 7787f07415d843b9a800f6a4720e0c739bd608e5
