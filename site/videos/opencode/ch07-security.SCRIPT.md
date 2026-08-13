1. 同事说 shell 前缀白名单就够了，我把 last-match 权限、Bash 语法树和死循环确认拆开。
2. 这一章不猜作者意图，只沿固定版本的运行时代码、协议和测试看事实。
3. 固定版本证据：packages/opencode/src/permission/index.ts:28-37 · 权限采用 last-match wildcard 规则，默认 ask 而非默认 allow；packages/opencode/src/session/processor.ts:331-380 · 连续相同工具调用触发 doom-loop 二次确认；packages/opencode/src/tool/shell.ts:257-291 · shell 权限不是简单字符串前缀，而是 Bash/PowerShell 语法树扫描。
4. 事实一：越靠后的规则优先；没写明能不能做时先问人。点“始终允许”会记住本次运行，但不是永久改配置。
5. 源码含义：顺序非常重要，配置合并必须可解释；临时批准不会静默写回磁盘。
6. 事实二：模型若一直用相同参数撞同一扇门，系统不会无限烧 token，而是停下来问人。
7. 数据流：用户消息 → session/processor → Provider 与工具事件 → compaction/permission → patch、回退和交付。
8. 小白动作：先给每一步记录状态，再区分成功、拒绝、超限和中断四种终态。
9. 第二个动作：改文件先看 diff，做高风险动作前让权限规则和 doom-loop 检查说清楚。
10. 局限提醒：已审计 last-match rules、once/always/reject、external directory、doom loop 和敏感文件默认策略。
11. 这一章的结论：顺序非常重要，配置合并必须可解释；临时批准不会静默写回磁盘。
12. 下一章继续沿固定提交的源码锚点，回答一个真实工作问题。

Fixed commit: cc4b45612974f735ddec46009ede07729511fba4
