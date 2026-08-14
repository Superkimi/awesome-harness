1. 聊天、工具、记忆、子 Agent 混在一起，我先把它们分成四层。
2. DeepChat 不是“多一个聊天框”，它把一个工作麻烦拆成了可观察的步骤。
3. 固定版本证据：src/main/session/turn.ts，画面只展示源码片段和中性文件名。
4. 事实一：DeepChat 把对话运行时拆成 SessionTurn、Tape/Transcript、工具 effect、Memory lineage、ACP 与 Subagent slots。它特别适合学习“聊天产品如何升级成可恢复 Agent Harness”。
5. 事实二：Tape/Transcript/SQLite 为恢复和分叉提供事实源
6. 数据流：目标 → 状态/上下文 → 工具或节点 → 校验 → 结果交付。
7. 源码里能看到：TapeToolName = (typeof TAPE_TOOL_NAMES)[keyof typeof TAPE_TOOL_NAMES] export type AgentToolExposure = 'us。
8. 小白复现：先写目标，再列数据；每一步保留状态，最后再预览或交付。
9. 再看一个边界：功能面很宽，旧 runtime 与新 harness 并存时需要 cleanup guard
10. 所以它值得学的不是按钮，而是把过程变成可以检查的证据。
11. 今天记住：先画清边界，再决定每一层的责任：把 DeepChat 想成一台带录像机的桌面工作站：每次工具动作和会话分叉都留下可恢复的带子，而不是只保留最后一句话。
12. 下一条继续拆一个真实章节，先把问题说清，再让 Agent 负责重复劳动。

Fixed commit: d5e41ce0bb9e9f264911dbab79182fe376bae2da
