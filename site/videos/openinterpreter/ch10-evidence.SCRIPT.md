1. 评审问恢复和观测是不是口号，我用 rollout reconstruction、SQLite/trace 和分析端点回答。
2. 这一章不猜作者意图，只沿固定版本的运行时代码、协议和测试看事实。
3. 固定版本证据：codex-rs/core/src/session/rollout_reconstruction.rs:116-288 · JSONL rollout 是可恢复事件事实源，SQLite/trace 是查询与诊断层；codex-rs/analytics/src/client.rs:54-105 · Open Interpreter 使用独立分析端点，默认启用但可显式关闭。
4. 事实一：先保存完整流水账，再从流水账还原聊天、文件、工具和子 Agent 发生了什么。
5. 源码含义：恢复与审计能力强；事件 schema 演进、敏感字段保留和磁盘生命周期需要治理。
6. 事实二：默认会发产品使用事件到 Open Interpreter 的后端，用户可以在配置里关掉；遥测故障不会卡住编码任务。
7. 数据流：请求 → Harness 路由 → turn/step → 工具与权限 → JSONL/可恢复结果。
8. 小白动作：先写清要兼容的行为，再列 Provider、Wire API、Harness 三个独立选择。
9. 第二个动作：把工具、指令和沙箱的边界分别验一遍，不要只看一个“允许”按钮。
10. 局限提醒：JSONL rollout、SQLite 镜像、文件变更 lifecycle、Open Interpreter 独立 analytics endpoint 与 opt-out。
11. 这一章的结论：恢复与审计能力强；事件 schema 演进、敏感字段保留和磁盘生命周期需要治理。
12. 下一章继续沿固定提交的源码锚点，回答一个真实工作问题。

Fixed commit: 984acc698cd038885ecb0b82721402b01e11a5ad
