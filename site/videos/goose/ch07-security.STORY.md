# M07 · 安全：审批不等于隔离

## Hook
同事说点了允许就安全，我把 inspector 顺序、权限模式和 shell 的真实边界一起查出来。

## Evidence anchors
- goose-security-001: crates/goose/src/agents/agent.rs:659-688 · 工具检查顺序体现“危险优先”
  - 先看是否像恶意命令和数据外传，再做额外对抗审查，然后才判断用户是否需要点批准，最后检查重复循环。
- goose-permission-001: crates/goose/src/permission/permission_inspector.rs:159-268 · Auto、Approve、SmartApprove 是不同权限语义
  - “智能批准”不是无条件执行：读文件一类操作可能自动过，写文件或判断不清的操作仍会问人。
- goose-sandbox-001: crates/goose/src/agents/platform_extensions/developer/shell.rs:25-49 · 内置开发者工具没有强制工作区边界
  - Goose 会先决定“该不该执行”，但一旦放行，命令通常是在真实电脑环境里跑，不是在一个只能碰项目目录的小盒子里。

## Takeaway
审批不是唯一防线；危险检测应在便利性策略之前执行。
