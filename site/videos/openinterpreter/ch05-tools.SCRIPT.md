1. 要兼容十几套工具名，我先看 aliases、runtime 分发和 FileChange lifecycle 怎样收敛。
2. 这一章不猜作者意图，只沿固定版本的运行时代码、协议和测试看事实。
3. 固定版本证据：codex-rs/core/src/tools/spec_plan.rs:240-268 · 模型可见工具与内部可分发 runtime 分离；codex-rs/core/src/tools/handlers/harness_aliases.rs:102-254 · Harness aliases 将十余套工具名收敛到共享执行器；codex-rs/core/src/tools/handlers/harness_aliases.rs:1749-1821 · Harness 写文件也进入统一 FileChange lifecycle。
4. 事实一：给模型看的菜单和厨房真正能接的订单不是同一张表；旧别名可以藏在后厨，不污染新模型的菜单。
5. 源码含义：兼容多 Harness 时能避免重复工具；隐藏 handler 仍属于攻击面，必须受同一权限检查。
6. 事实二：Claude 叫 Read、Pi 叫 read、OpenCode 叫 task，都可以落到同一套真实能力上。
7. 数据流：请求 → Harness 路由 → turn/step → 工具与权限 → JSONL/可恢复结果。
8. 小白动作：先写清要兼容的行为，再列 Provider、Wire API、Harness 三个独立选择。
9. 第二个动作：把工具、指令和沙箱的边界分别验一遍，不要只看一个“允许”按钮。
10. 局限提醒：可见 spec 与 registry 分离、代码模式、Harness aliases、文件变更事件。
11. 这一章的结论：兼容多 Harness 时能避免重复工具；隐藏 handler 仍属于攻击面，必须受同一权限检查。
12. 下一章继续沿固定提交的源码锚点，回答一个真实工作问题。

Fixed commit: 984acc698cd038885ecb0b82721402b01e11a5ad
