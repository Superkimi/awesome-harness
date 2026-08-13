1. 长任务快超窗，我先看调用配对、多模态 token 和 Harness-aware compact 怎样一起工作。
2. 这一章不猜作者意图，只沿固定版本的运行时代码、协议和测试看事实。
3. 固定版本证据：codex-rs/core/src/context_manager/history.rs:40-186 · 历史管理维护调用配对、多模态能力和可见 token 成本；codex-rs/core/src/compact.rs:299-389 · 压缩是 Harness-aware 的，而不是统一摘要模板。
4. 事实一：上下文不是简单 messages 数组；它会修账，保证工具订单和回执成对，并避免把模型根本不能看的媒体继续塞回去。
5. 源码含义：恢复和压缩后的协议更稳定；token 估算是启发式下界，不等于 provider tokenizer。
6. 事实二：换了驾驶舱，压缩后的“交接便笺”也要换写法，否则目标模型会读不懂或丢失刚看过的文件。
7. 数据流：请求 → Harness 路由 → turn/step → 工具与权限 → JSONL/可恢复结果。
8. 小白动作：先写清要兼容的行为，再列 Provider、Wire API、Harness 三个独立选择。
9. 第二个动作：把工具、指令和沙箱的边界分别验一遍，不要只看一个“允许”按钮。
10. 局限提醒：规范化历史、工具配对、多模态裁剪、Harness-aware 压缩。
11. 这一章的结论：恢复和压缩后的协议更稳定；token 估算是启发式下界，不等于 provider tokenizer。
12. 下一章继续沿固定提交的源码锚点，回答一个真实工作问题。

Fixed commit: 984acc698cd038885ecb0b82721402b01e11a5ad
