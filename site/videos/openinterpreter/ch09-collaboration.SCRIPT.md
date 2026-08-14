1. 研究与实现要并行，我先看 control plane 如何管理线程树，以及 Harness 工具怎样复用子 Agent。
2. 这一章不猜作者意图，只沿固定版本的运行时代码、协议和测试看事实。
3. 固定版本证据：codex-rs/core/src/agent/control.rs:88-180 · 多 Agent 是共享控制面的线程树；codex-rs/core/src/tools/spec_plan.rs:616-685 · Harness 自己的 Agent/Task 工具复用同一子 Agent 系统。
4. 事实一：子 Agent 不是主函数里临时递归一下，而是有独立会话和持久关系的线程树。
5. 源码含义：可以跨步等待、续跑和观测；也需要全局驻留数、运行数和深度限制。
6. 事实二：外面看像 Claude 的 Agent 工具或 OpenCode 的 task，里面其实都在同一棵线程树上派工。
7. 数据流：请求 → Harness 路由 → turn/step → 工具与权限 → JSONL/可恢复结果。
8. 小白动作：先写清要兼容的行为，再列 Provider、Wire API、Harness 三个独立选择。
9. 第二个动作：把工具、指令和沙箱的边界分别验一遍，不要只看一个“允许”按钮。
10. 局限提醒：线程树控制面、fork/message/resume、深度与并发限制；Harness aliases 可复用同一子 Agent 系统。
11. 这一章的结论：可以跨步等待、续跑和观测；也需要全局驻留数、运行数和深度限制。
12. 下一章继续沿固定提交的源码锚点，回答一个真实工作问题。

Fixed commit: 984acc698cd038885ecb0b82721402b01e11a5ad
