1. 同事把一堆重复任务丢给我：明早要看到一个能交接的工作台。
2. Eigent 不是“多一个聊天框”，它把一个工作麻烦拆成了可观察的步骤。
3. 固定版本证据：backend/app/service/task.py，画面只展示源码片段和中性文件名。
4. 事实一：持久记忆有明确 token budget 与 task-lock 生命周期
5. 事实二：后端动作协议把任务状态和用户交互拆开
6. 数据流：目标 → 状态/上下文 → 工具或节点 → 校验 → 结果交付。
7. 源码里能看到：tune in the field. try: _MEMORY_TOKEN_BUDGET = int( os.environ.get("EIGENT_MEMORY_TOKEN_BUDGET", "8000") 。
8. 小白复现：先写目标，再列数据；每一步保留状态，最后再预览或交付。
9. 再看一个边界：Python CAMEL/后端服务与 Electron 前端的链路较长
10. 所以它值得学的不是按钮，而是把过程变成可以检查的证据。
11. 今天记住：把 Eigent 想成一个带项目记忆的办公室：任务锁是工单，Agent 是员工，MCP 是工具柜，记忆服务负责交接班。
12. 下一条继续拆一个真实章节，先把问题说清，再让 Agent 负责重复劳动。

Fixed commit: 88d837f75ad95a21eebaa638072adad2019644be
