# M07 · 权限与沙箱：白名单不等于容器

## Hook
同事说 shell 能跑就算隔离，我把分段白名单、重定向检测和宿主 bash 边界拆开。

## Evidence anchors
- little-permission-001: .pi/extensions/permission-gate/index.ts:11-58 · shell 权限是分段白名单，并显式检测写重定向
  - 不是看到开头是 `ls` 就放行 `ls && rm -rf /`，整条链每一段都要安全。
- little-sandbox-001: .pi/extensions/shell-session/index.ts:6-16 · 默认执行是宿主 bash，不是容器或内核沙箱
  - 一旦命令通过权限门，它就在你的真实机器上跑；白名单是保安问话，不是墙。

## Takeaway
字符串白名单比简单前缀更稳，但仍不是操作系统沙箱。
