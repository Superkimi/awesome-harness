1. 评审问我：这个 Open Interpreter 现在到底是什么底盘？我不按名字猜，直接沿固定证据看 Harness、工具和兼容契约。
2. 这一章不猜作者意图，只沿固定版本的运行时代码、协议和测试看事实。
3. 固定版本证据：codex-rs/product-info/src/lib.rs:45-79 · 当前源码不是经典 Python Open Interpreter，而是 Rust/Codex 兼容分叉；codex-rs/core/src/harness/mod.rs:1-18 · 核心差异是一层多 Harness 仿真目录；codex-rs/core/src/session/turn.rs:140-228 · 共享内核仍是 turn 内多 step 的流式工具循环。
4. 事实一：它不是在旧 Python 循环上继续打补丁，而是把一套 Codex 级 Rust Harness 换了产品入口，再加入自己的多 Harness 能力。
5. 源码含义：评估时必须把它与同批次的 openai/codex 分开：共享基座很多，但 Open Interpreter 的差异主要落在品牌、provider/harness 选择和协议仿真。
6. 事实二：同一个底盘能换不同“驾驶舱”：改变系统提示词、消息格式、工具名称与参数，去适配最合适的模型习惯。
7. 数据流：请求 → Harness 路由 → turn/step → 工具与权限 → JSONL/可恢复结果。
8. 小白动作：先写清要兼容的行为，再列 Provider、Wire API、Harness 三个独立选择。
9. 第二个动作：把工具、指令和沙箱的边界分别验一遍，不要只看一个“允许”按钮。
10. 局限提醒：当前快照是 Rust/Codex 分叉式产品，保留 Codex SDK/协议兼容并通过包变体重品牌。
11. 这一章的结论：评估时必须把它与同批次的 openai/codex 分开：共享基座很多，但 Open Interpreter 的差异主要落在品牌、provider/harness 选择和协议仿真。
12. 下一章继续沿固定提交的源码锚点，回答一个真实工作问题。

Fixed commit: 984acc698cd038885ecb0b82721402b01e11a5ad
