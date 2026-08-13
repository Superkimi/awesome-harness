1. 同事问“任务锁到底锁了什么”，我把前后端几层拆给他看。
2. Eigent 不是“多一个聊天框”，它把一个工作麻烦拆成了可观察的步骤。
3. 固定版本证据：backend/app/service/task.py，画面只展示源码片段和中性文件名。
4. 事实一：Eigent 把单 Agent、Workforce、多模态工具、MCP 与本地记忆放进一个桌面 Cowork 工作流。源码里最值得学习的是任务锁、上下文构建、动作协议和跨重启记忆，而不是 UI 上的“多 Agent”按钮。
5. 事实二：持久记忆有明确 token budget 与 task-lock 生命周期
6. 数据流：目标 → 状态/上下文 → 工具或节点 → 校验 → 结果交付。
7. 源码里能看到：-> user deactivate_agent = "deactivate_agent" # backend -> user request_usage = "request_usage" # backend。
8. 小白复现：先写目标，再列数据；每一步保留状态，最后再预览或交付。
9. 再看一个边界：Python CAMEL/后端服务与 Electron 前端的链路较长
10. 所以它值得学的不是按钮，而是把过程变成可以检查的证据。
11. 今天记住：先画清边界，再决定每一层的责任：把 Eigent 想成一个带项目记忆的办公室：任务锁是工单，Agent 是员工，MCP 是工具柜，记忆服务负责交接班。
12. 下一条继续拆一个真实章节，先把问题说清，再让 Agent 负责重复劳动。

Fixed commit: 88d837f75ad95a21eebaa638072adad2019644be
