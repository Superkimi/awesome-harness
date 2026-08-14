1. 客户资料太多，我先查 Tape 怎样保存会话分叉和子 Agent 上下文。
2. 这一章不背概念，先看 DeepChat 怎样把聊天升级成可恢复的 Agent Harness。
3. 固定版本证据：src/main/session/data/tape.ts，只展示源码片段和中性文件名。
4. 实现事实一：Tape|subagent|sessionTape。
5. 实现事实二：/** @deprecated Import Tape application APIs from `@/tape/application/sessionTape`. */ export { AgentTapeViewError, normalizeSubag。
6. 数据流：消息 → SessionTurn/Tape → 工具 effect → Memory/ACP → 可恢复结果。
7. 小白动作：先给每次 turn 留一个边界，再把工具动作写进 transcript。
8. 第二个动作：为子 Agent 设角色、slot 和 exposure，不要默认全开。
9. 边界提醒：功能面很宽，旧 runtime 与新 harness 并存时需要 cleanup guard
10. 看到 tape、effect evidence 和 cleanup guard，再决定是否交付。
11. Tape、sessionTape 和 lineage 让长任务可以回放而不是只剩最后一句。
12. 下一章继续用固定提交回答一个真实工作问题。

Fixed commit: d5e41ce0bb9e9f264911dbab79182fe376bae2da
