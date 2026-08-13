1. 模型能做的不止读写文件；我先看工具面、Approval 分级和 yolo 默认意味着什么。
2. 这一章不猜作者意图，只沿固定版本的运行时代码、契约和测试看事实。
3. 固定版本证据：packages/coding-agent/src/tools/index.ts:38-105 · 内建工具面远超文件与 shell；packages/coding-agent/src/tools/approval.ts:13-39 · Approval 分级完整，但默认是 yolo。
4. 事实一：它更像一套本地 Agent 操作系统，而不是四件套 coding CLI。
5. 源码含义：覆盖广但默认 prompt/tool schema 成本和安全面都更大，需要动态激活与分组。
6. 事实二：门卫机制很成熟，但默认把门敞开；用户不改设置时，bash、browser、task 等执行级工具通常不询问。
7. 数据流：用户消息 → Agent loop/Session → Provider/工具 → compaction/Task → 账本与观测。
8. 小白动作：先把长任务拆成主循环、上下文、工具、协作和观测五格。
9. 第二个动作：为并发、预算、审批和恢复都写一个可见的终态，不要只看“运行中”。
10. 局限提醒：已审计内建工具面、调度、宿主 shell、approval 和 output guard。
11. 这一章的结论：覆盖广但默认 prompt/tool schema 成本和安全面都更大，需要动态激活与分组。
12. 下一章继续沿固定提交的源码锚点，回答一个真实工作问题。

Fixed commit: a53e4e790d3939a08708bf0d3c912d0763237a2d
