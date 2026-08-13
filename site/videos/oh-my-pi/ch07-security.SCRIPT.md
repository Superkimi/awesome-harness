1. 同事说开个子任务就隔离了，我把主 Agent 宿主执行、子任务 isolation 和权限边界拆开。
2. 这一章不猜作者意图，只沿固定版本的运行时代码、契约和测试看事实。
3. 固定版本证据：packages/coding-agent/src/session/bash-runner.ts:1-220 · 主 Agent 默认宿主执行；子任务 isolation 默认 none 且主要隔离工作区；packages/coding-agent/src/tools/approval.ts:13-39 · Approval 分级完整，但默认是 yolo。
4. 事实一：子工人可以拿一份独立项目副本，防止同时改乱代码；这不自动隔离网络、进程和主机秘密，而且默认连副本也不开。
5. 源码含义：工作区隔离与安全沙箱必须分开标注；无人值守仍需外层 VM/container。
6. 事实二：门卫机制很成熟，但默认把门敞开；用户不改设置时，bash、browser、task 等执行级工具通常不询问。
7. 数据流：用户消息 → Agent loop/Session → Provider/工具 → compaction/Task → 账本与观测。
8. 小白动作：先把长任务拆成主循环、上下文、工具、协作和观测五格。
9. 第二个动作：为并发、预算、审批和恢复都写一个可见的终态，不要只看“运行中”。
10. 局限提醒：已审计内建工具面、调度、宿主 shell、approval 和 output guard。
11. 这一章的结论：工作区隔离与安全沙箱必须分开标注；无人值守仍需外层 VM/container。
12. 下一章继续沿固定提交的源码锚点，回答一个真实工作问题。

Fixed commit: a53e4e790d3939a08708bf0d3c912d0763237a2d
