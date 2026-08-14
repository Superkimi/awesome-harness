1. 团队要发项目 Skill，我先看系统提示拼装、trust 控制的懒加载和扩展进程边界。
2. 这一章不猜作者意图，只沿固定版本的运行时代码、契约和测试看事实。
3. 固定版本证据：packages/coding-agent/src/core/system-prompt.ts:28-71 · 系统指令由 tool、context files、skills、custom/append prompt 多层拼装；packages/coding-agent/src/core/skills.ts:118-188 · Skill 采用懒加载目录，项目范围受 trust 控制；packages/coding-agent/src/core/extensions/loader.ts:66-124 · 扩展在同一进程执行，覆盖面接近完整产品内核。
4. 事实一：模型看到的不是一段写死提示词，而是当前工具说明、用户规则、项目规则、技能目录和工作目录拼成的最终说明书。
5. 源码含义：必须提供最终展开 prompt 的诊断视图，否则层级覆盖很难排查。
6. 事实二：先给模型一本技能目录，不把每本说明书都塞进上下文；它决定要用时再打开。仓库自带技能则要先信任仓库。
7. 数据流：用户消息 → turn/session → Provider 与工具 → compaction/权限 → JSONL 会话和交付。
8. 小白动作：先把长任务拆成主循环、上下文、工具、信任和观测五格。
9. 第二个动作：为并发、重试、编辑和回退各写一个明确终态，不要只看“运行中”。
10. 局限提醒：已审计 system/context/skill/template 分层、资源优先级和 in-process extension hooks。
11. 这一章的结论：必须提供最终展开 prompt 的诊断视图，否则层级覆盖很难排查。
12. 下一章继续沿固定提交的源码锚点，回答一个真实工作问题。

Fixed commit: 581d75a89cea21e50d6a26df840352f94427f633
