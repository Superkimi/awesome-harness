# M05 · 工具：parse、policy、prepare、finish 四阶段

## Hook
模型发来一个工具调用，我先看 use_capability、Delivery policy 和四段式证据链。

## Evidence anchors
- reasonix-tools-001: internal/agent/execute_one.go:20-80 · 每个工具调用固定经过 parse→policy→prepare→finish 四阶段
  - 模型只递交一张工单；真正执行前会先确认工具身份、是否允许、是否会改文件、是否拿到写锁和快照，执行后还要把回执写回账本。
- reasonix-tools-002: internal/agent/execute_one.go:153-269 · use_capability 代理会先解析真实 MCP 目标，再重新做 Plan 与安全判断
  - 模型看到的是一个稳定的“能力入口”，但系统不会因为套了一层代理就放过真实目标；拆包后还要重新验一次。
- reasonix-tools-003: internal/agent/execute_one.go:272-312 · Delivery 模式把验收标准变成 host-enforced tool policy
  - 交付模式不接受“我顺便跑了个检查并 echo $?”这种无法审计的成功；先列验收清单，改完后单独验证，再签收。
- reasonix-tools-004: internal/agent/execute_one.go:552-654 · 执行结果会同时写证据账本、hooks 和恢复观测
  - 工具成功不等于只把一段字符串塞回聊天：系统还保存“谁调用了谁、是否真的产出、哪个 todo 前进了、恢复守卫看到什么”。

## Takeaway
工具扩展点要落在统一 pipeline 中，不能让某个 MCP 或别名工具绕过审批、锁、证据和输出预算。
