1. 运营说有个 Agent 要下线，但它还绑着三条正在跑的任务。
2. Multica 不是“多一个聊天框”，它把一个工作麻烦拆成了可观察的步骤。
3. 固定版本证据：server/cmd/multica/cmd_agent.go，画面只展示源码片段和中性文件名。
4. 事实一：Runtime 与 Agent 解耦，支持重绑和级联删除策略
5. 事实二：CLI/API/桌面/移动端共享资源模型
6. 数据流：目标 → 状态/上下文 → 工具或节点 → 校验 → 结果交付。
7. 源码里能看到：unE: runRuntimeUsage, } var runtimeActivityCmd = &cobra.Command{ Use: "activity <runtime-id>", Short: "Ge。
8. 小白复现：先写目标，再列数据；每一步保留状态，最后再预览或交付。
9. 再看一个边界：控制面很强，但实际执行安全取决于 runtime 实现
10. 所以它值得学的不是按钮，而是把过程变成可以检查的证据。
11. 今天记住：把 Multica 想成机场调度台：Agent 是航班，Runtime 是跑道，Task 是航段，删除跑道前必须先处理仍在上面的航班。
12. 下一条继续拆一个真实章节，先把问题说清，再让 Agent 负责重复劳动。

Fixed commit: d467cc90691587ed00bdaca678475957df62dd3a
