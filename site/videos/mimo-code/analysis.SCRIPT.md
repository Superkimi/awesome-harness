1. 评审会上有人问：这个 Coding Agent 加插件，会不会把内核搞乱？
2. MiMo-Code 不是“多一个聊天框”，它把一个工作麻烦拆成了可观察的步骤。
3. 固定版本证据：docs/architecture/codex-microkernel-runtime.md，画面只展示源码片段和中性文件名。
4. 事实一：微内核与 Compose/插件边界清晰
5. 事实二：全局同步有 reducer、eviction、trim、prefetch 等状态管理
6. 数据流：目标 → 状态/上下文 → 工具或节点 → 校验 → 结果交付。
7. 源码里能看到：ead the SKILL.md of every referenced skill FIRST, then plan (never plan from skill descriptions alone — t。
8. 小白复现：先写目标，再列数据；每一步保留状态，最后再预览或交付。
9. 再看一个边界：项目横跨 Rust/TypeScript/Bun/Nix，开发门槛高
10. 所以它值得学的不是按钮，而是把过程变成可以检查的证据。
11. 今天记住：把 MiMo-Code 想成一台可换插槽的机器：微内核负责转动，Compose 是控制面，插件和 Skill 是可替换的刀头。
12. 下一条继续拆一个真实章节，先把问题说清，再让 Agent 负责重复劳动。

Fixed commit: 332d7b0db65ccbcdd31a67b897e80dd6f3671b9b
