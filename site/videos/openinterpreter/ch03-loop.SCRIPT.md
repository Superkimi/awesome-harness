1. 模型一边读文件一边改文件，我沿 turn 和 step 快照看它如何共享同一个世界。
2. 这一章不猜作者意图，只沿固定版本的运行时代码、协议和测试看事实。
3. 固定版本证据：codex-rs/core/src/session/turn.rs:140-228 · 共享内核仍是 turn 内多 step 的流式工具循环；codex-rs/core/src/session/turn.rs:243-292 · step 快照让上下文、工具清单与工具执行看到同一世界。
4. 事实一：一次用户请求会反复经历“取固定快照—问模型—跑工具—把结果放回去”，直到模型真正收尾。
5. 源码含义：Harness 仿真共享同一个成熟执行底盘，不需要每种 Harness 重写 agent loop。
6. 事实二：模型看到的工具说明和真正执行工具时的权限/目录不会在同一步里偷偷漂移。
7. 数据流：请求 → Harness 路由 → turn/step → 工具与权限 → JSONL/可恢复结果。
8. 小白动作：先写清要兼容的行为，再列 Provider、Wire API、Harness 三个独立选择。
9. 第二个动作：把工具、指令和沙箱的边界分别验一遍，不要只看一个“允许”按钮。
10. 局限提醒：turn/step 状态机、step 快照、pending input、自动压缩与 stop hook。
11. 这一章的结论：Harness 仿真共享同一个成熟执行底盘，不需要每种 Harness 重写 agent loop。
12. 下一章继续沿固定提交的源码锚点，回答一个真实工作问题。

Fixed commit: 984acc698cd038885ecb0b82721402b01e11a5ad
