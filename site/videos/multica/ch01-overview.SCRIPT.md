1. 运营要查一个 Agent 的任务量，我先把控制台的资源关系摊开。
2. Multica 不是“多一个聊天框”，它把一个工作麻烦拆成了可观察的步骤。
3. 固定版本证据：server/cmd/multica/cmd_runtime.go，画面只展示源码片段和中性文件名。
4. 事实一：Multica 把 Agent、Runtime、Task、Skill 和 Composio 工具放进一个可运维控制面。它的源码重点是资源生命周期：删除 runtime 前先处理绑定 Agent，任务与用量可查询，工具版本与连接账户显式传递。
5. 事实二：CLI/API/桌面/移动端共享资源模型
6. 数据流：目标 → 状态/上下文 → 工具或节点 → 校验 → 结果交付。
7. 源码里能看到：RunE: runAgentArchive, } var agentRestoreCmd = &cobra.Command{ Use: "restore <id>", Short: "Restore an ar。
8. 小白复现：先写目标，再列数据；每一步保留状态，最后再预览或交付。
9. 再看一个边界：控制面很强，但实际执行安全取决于 runtime 实现
10. 所以它值得学的不是按钮，而是把过程变成可以检查的证据。
11. 今天记住：先证明一个真实工作结果，再追问它为什么能稳定完成：把 Multica 想成机场调度台：Agent 是航班，Runtime 是跑道，Task 是航段，删除跑道前必须先处理仍在上面的航班。
12. 下一条继续拆一个真实章节，先把问题说清，再让 Agent 负责重复劳动。

Fixed commit: d467cc90691587ed00bdaca678475957df62dd3a
