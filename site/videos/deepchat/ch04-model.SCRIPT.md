1. 模型输出分成好多段，我想知道 DeepChat 怎样把它们拼回可恢复的消息。
2. 这一章不背概念，先看 DeepChat 怎样把聊天升级成可恢复的 Agent Harness。
3. 固定版本证据：src/main/session/turn.ts，只展示源码片段和中性文件名。
4. 实现事实一：runtime|provider|message。
5. 实现事实二：, SessionTurnRuntimePort, SessionTurnStorePort, SessionTurnTranscriptPort } from './contracts' export interface SessionTurnDepende。
6. 数据流：消息 → SessionTurn/Tape → 工具 effect → Memory/ACP → 可恢复结果。
7. 小白动作：先给每次 turn 留一个边界，再把工具动作写进 transcript。
8. 第二个动作：为子 Agent 设角色、slot 和 exposure，不要默认全开。
9. 边界提醒：功能面很宽，旧 runtime 与新 harness 并存时需要 cleanup guard
10. 看到 tape、effect evidence 和 cleanup guard，再决定是否交付。
11. 流式 provider 结果要经过 turn、message 和 transcript 才能留下事实。
12. 下一章继续用固定提交回答一个真实工作问题。

Fixed commit: d5e41ce0bb9e9f264911dbab79182fe376bae2da
