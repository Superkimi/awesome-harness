1. 同一个模型换了工作手感，我先看不同 Harness 如何重写历史、工具名和请求形状。
2. 这一章不猜作者意图，只沿固定版本的运行时代码、协议和测试看事实。
3. 固定版本证据：codex-rs/core/src/harness/pi.rs:21-120 · 各 Harness 不只换 prompt，还重写历史和工具协议；codex-rs/core/src/harness/request.rs:75-231 · 优势是“一个安全底盘，多种模型原生手感”；主要成本是兼容矩阵爆炸。
4. 事实一：这不是贴一张角色卡，而是把整段对话和工具说明书翻译成目标 Agent 的“母语”。
5. 源码含义：模型行为更接近目标 Harness；翻译层必须维护 call/result 配对和隐藏上下文，升级成本高。
6. 事实二：它最像“Coding Agent 兼容器”：同一套沙箱和会话底盘，让不同模型吃到熟悉的提示词与工具格式。
7. 数据流：请求 → Harness 路由 → turn/step → 工具与权限 → JSONL/可恢复结果。
8. 小白动作：先写清要兼容的行为，再列 Provider、Wire API、Harness 三个独立选择。
9. 第二个动作：把工具、指令和沙箱的边界分别验一遍，不要只看一个“允许”按钮。
10. 局限提醒：Responses/Chat/Messages、provider 默认 harness、请求/响应整形与兼容边界。
11. 这一章的结论：模型行为更接近目标 Harness；翻译层必须维护 call/result 配对和隐藏上下文，升级成本高。
12. 下一章继续沿固定提交的源码锚点，回答一个真实工作问题。

Fixed commit: 984acc698cd038885ecb0b82721402b01e11a5ad
