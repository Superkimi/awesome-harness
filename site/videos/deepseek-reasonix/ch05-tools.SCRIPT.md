1. 模型发来一个工具调用，我先看 use_capability、Delivery policy 和四段式证据链。
2. 这一章不猜作者意图，只沿固定版本的运行时代码、契约和测试看事实。
3. 固定版本证据：internal/agent/execute_one.go:20-80 · 每个工具调用固定经过 parse→policy→prepare→finish 四阶段；internal/agent/execute_one.go:153-269 · use_capability 代理会先解析真实 MCP 目标，再重新做 Plan 与安全判断；internal/agent/execute_one.go:272-312 · Delivery 模式把验收标准变成 host-enforced tool policy。
4. 事实一：模型只递交一张工单；真正执行前会先确认工具身份、是否允许、是否会改文件、是否拿到写锁和快照，执行后还要把回执写回账本。
5. 源码含义：工具扩展点要落在统一 pipeline 中，不能让某个 MCP 或别名工具绕过审批、锁、证据和输出预算。
6. 事实二：模型看到的是一个稳定的“能力入口”，但系统不会因为套了一层代理就放过真实目标；拆包后还要重新验一次。
7. 数据流：Boot → Controller/Agent → Provider/工具 → Policy/Sandbox → event wire/Evidence Ledger。
8. 小白动作：先把一轮任务拆成装配、动作、策略、回放和验收五格。
9. 第二个动作：为 thinking、工具、恢复和协作分别记录证据，不要把日志当成事实账本。
10. 局限提醒：parse→proxy/policy→delivery/recovery/permission→lease/hooks/preview→execute/evidence。
11. 这一章的结论：工具扩展点要落在统一 pipeline 中，不能让某个 MCP 或别名工具绕过审批、锁、证据和输出预算。
12. 下一章继续沿固定提交的源码锚点，回答一个真实工作问题。

Fixed commit: 9aaf8d381a214cd2cb6df774d3b207a646ddd651
