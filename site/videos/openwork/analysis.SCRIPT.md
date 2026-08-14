1. 老板让我把“会话、插件、审批”讲清楚，下午还要给客户演示。
2. OpenWork 不是“多一个聊天框”，它把一个工作麻烦拆成了可观察的步骤。
3. 固定版本证据：packages/types/src/openwork-context.ts，画面只展示源码片段和中性文件名。
4. 事实一：MCP Apps / OAuth / 插件生态完整
5. 事实二：上下文快照把 UI 与执行状态显式化
6. 数据流：目标 → 状态/上下文 → 工具或节点 → 校验 → 结果交付。
7. 源码里能看到：eResult; } function isRecord(value: unknown): value is Record<string, unknown> { return typeof value === 。
8. 小白复现：先写目标，再列数据；每一步保留状态，最后再预览或交付。
9. 再看一个边界：主执行器依赖 OpenCode，不能把 UI 边界误认为 OS 级沙箱
10. 所以它值得学的不是按钮，而是把过程变成可以检查的证据。
11. 今天记住：把 OpenWork 想成一张控制台：左边是会话，右边是 MCP App，底层还有一个负责记录游标和重载原因的服务。
12. 下一条继续拆一个真实章节，先把问题说清，再让 Agent 负责重复劳动。

Fixed commit: 51902a94b1d1a8ba4eb5eca01a25f6288d843efc
