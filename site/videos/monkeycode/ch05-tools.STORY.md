# M05 · 工具与 MCP：有效集、幂等和状态审计

## Hook
一个工具调用重试两次会不会扣两次费？我先查 MCP registry 的 replay 和状态审计。

## Evidence anchors
- monkey-mcp-001: backend/biz/task/usecase/task.go:741-767 · MCP Hub 把工具身份绑定到具体 user、task 和 VM
  - 工具调用不是“拿到平台 token 就随便用”，而是能追到哪台 VM、哪个人、哪个任务。
- monkey-mcp-002: backend/biz/mcphub/runtime/registry/service.go:56-80 · 工具调用具备有效集过滤、幂等 replay 和状态审计
  - 同一个任务重试同一张工具工单不会重复扣动外部系统；每次调用都有完整状态轨迹。
- monkey-mcp-003: backend/biz/mcphub/runtime/gateway/handler.go:228-251 · MCP 计费接口已预留，但当前实现是 Noop
  - 水表接口和插座都装好了，但现在里面还没有真正的计费表芯。

## Takeaway
为审计、限额和撤销提供了细粒度主体。
