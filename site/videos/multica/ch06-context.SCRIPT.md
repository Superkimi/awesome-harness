1. 周报要查一个任务快照，我想知道移动端看到的状态从哪里来。
2. 这一章不背术语，先看 Multica 怎样把 Agent、Runtime 和 Task 放进同一张控制台。
3. 固定版本证据：apps/mobile/data/queries/agent-task-snapshot.ts，只展示源码片段和中性文件名。
4. 实现事实一：snapshot|task|agent。
5. 实现事实二：import { queryOptions } from "@tanstack/react-query"; import { api } from "@/data/api"; // Workspace agent task snapshot — every a。
6. 数据流：目标 → Agent/Runtime 资源 → Task 活动 → 工具或状态 → 可查询结果。
7. 小白动作：先画三列 Agent、Runtime、Task，再把绑定关系写出来。
8. 第二个动作：删除或解绑前先列出 active agent 和 cascade 选择。
9. 边界提醒：控制面很强，但实际执行安全取决于 runtime 实现
10. 看到 activity、usage 和测试结果，再决定是否交付。
11. snapshot 把 agent、task 和当前结果整理成可消费的上下文。
12. 下一章继续用固定提交回答一个真实工作问题。

Fixed commit: d467cc90691587ed00bdaca678475957df62dd3a
