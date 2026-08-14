# M07 · 执行边界：宿主、子任务和 isolation

## Hook
同事说开个子任务就隔离了，我把主 Agent 宿主执行、子任务 isolation 和权限边界拆开。

## Evidence anchors
- omp-sandbox-001: packages/coding-agent/src/session/bash-runner.ts:1-220 · 主 Agent 默认宿主执行；子任务 isolation 默认 none 且主要隔离工作区
  - 子工人可以拿一份独立项目副本，防止同时改乱代码；这不自动隔离网络、进程和主机秘密，而且默认连副本也不开。
- omp-approval-001: packages/coding-agent/src/tools/approval.ts:13-39 · Approval 分级完整，但默认是 yolo
  - 门卫机制很成熟，但默认把门敞开；用户不改设置时，bash、browser、task 等执行级工具通常不询问。

## Takeaway
工作区隔离与安全沙箱必须分开标注；无人值守仍需外层 VM/container。
