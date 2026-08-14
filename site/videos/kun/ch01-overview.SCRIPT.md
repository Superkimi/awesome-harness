1. 客户只给了一句话需求，我先看 Kun 如何把它变成可追踪工作流。
2. Kun 不是“多一个聊天框”，它把一个工作麻烦拆成了可观察的步骤。
3. 固定版本证据：src/main/workflow-runtime.ts，画面只展示源码片段和中性文件名。
4. 事实一：Kun 把 Direct 模式、Agent Graph、工作流运行时、扩展 API、权限和本地恢复放进一个桌面 Agent。它的核心学习点是：复杂任务不是多喊几个模型，而是把节点状态、取消、审批、恢复和插件契约做成一套运行时。
5. 事实二：扩展 API 对 agent/tool/permission 有严格 schema
6. 数据流：目标 → 状态/上下文 → 工具或节点 → 校验 → 结果交付。
7. 源码里能看到：type AgentProfileDeclaration = z.infer<typeof AgentProfileDeclarationSchema> export type AgentProfileDecl。
8. 小白复现：先写目标，再列数据；每一步保留状态，最后再预览或交付。
9. 再看一个边界：桌面应用与运行时耦合度仍然较高
10. 所以它值得学的不是按钮，而是把过程变成可以检查的证据。
11. 今天记住：先证明一个真实工作结果，再追问它为什么能稳定完成：把 Kun 想成一张任务白板：每个节点都有输入、权限、状态和交付物，线条表示谁把结果交给谁。
12. 下一条继续拆一个真实章节，先把问题说清，再让 Agent 负责重复劳动。

Fixed commit: 1377249652cef30f9f7b777f8f6111fd6ac70fc9
