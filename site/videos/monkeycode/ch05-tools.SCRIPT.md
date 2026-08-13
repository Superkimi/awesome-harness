1. 一个工具调用重试两次会不会扣两次费？我先查 MCP registry 的 replay 和状态审计。
2. 这一章不猜作者意图，只沿固定版本的运行时代码、契约和测试看事实。
3. 固定版本证据：backend/biz/task/usecase/task.go:741-767 · MCP Hub 把工具身份绑定到具体 user、task 和 VM；backend/biz/mcphub/runtime/registry/service.go:56-80 · 工具调用具备有效集过滤、幂等 replay 和状态审计；backend/biz/mcphub/runtime/gateway/handler.go:228-251 · MCP 计费接口已预留，但当前实现是 Noop。
4. 事实一：工具调用不是“拿到平台 token 就随便用”，而是能追到哪台 VM、哪个人、哪个任务。
5. 源码含义：为审计、限额和撤销提供了细粒度主体。
6. 事实二：同一个任务重试同一张工具工单不会重复扣动外部系统；每次调用都有完整状态轨迹。
7. 数据流：任务 → DB/VM/Redis → CLI 或 LLM proxy → MCP/权限 → 流、审计和交付。
8. 小白动作：先把任务状态拆成创建、启动、运行、失败、回收五个节点。
9. 第二个动作：把平台边界和 CLI 内层能力分开，记录谁负责权限、压缩和恢复。
10. 局限提醒：已审计 builtin/platform MCP、scope 合并、OpenCode plugin 注入和 zip 资源传递。
11. 这一章的结论：为审计、限额和撤销提供了细粒度主体。
12. 下一章继续沿固定提交的源码锚点，回答一个真实工作问题。

Fixed commit: fcc5320b15a10dfec4d5891ce44d9d1470e10c2b
