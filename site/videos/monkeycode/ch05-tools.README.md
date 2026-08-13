# M05 · 工具与 MCP：有效集、幂等和状态审计

- Project: Legacy MonkeyCode
- Fixed source commit: fcc5320b15a10dfec4d5891ce44d9d1470e10c2b
- Evidence ledger: data/legacy/evidence/monkeycode/evidence.json
- Episode: ch05-tools
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - backend/biz/task/usecase/task.go:741-767 · MCP Hub 把工具身份绑定到具体 user、task 和 VM
  - backend/biz/mcphub/runtime/registry/service.go:56-80 · 工具调用具备有效集过滤、幂等 replay 和状态审计
  - backend/biz/mcphub/runtime/gateway/handler.go:228-251 · MCP 计费接口已预留，但当前实现是 Noop
