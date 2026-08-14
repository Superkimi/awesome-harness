# M07 · 安全：何时问人与允许做什么是两条轴

## Hook
同事说批准一次就够了，我把审批策略、默认中止和平台级沙箱拆开。

## Evidence anchors
- codex-permission-001: codex-rs/protocol/src/protocol.rs:890-932 · 审批策略把“何时问”与“允许做什么”分成两条轴
  - 一条轴决定要不要敲门，另一条轴决定进门后活动范围；“不用问”不等于“拥有整台机器”。
- codex-permission-002: codex-rs/core/src/session/mod.rs:2295-2376 · 审批缺失默认中止，且可授予一次、本会话或规则/网络修订
  - 授权不是一个“永远允许”按钮；可以只放这次、放本会话、或把精确规则写进政策，没人回答则停下。
- codex-sandbox-001: codex-rs/sandboxing/src/manager.rs:34-73 · 沙箱按平台变换真实进程：macOS Seatbelt、Linux seccomp/bwrap/landlock、Windows restricted token
  - 不是在提示词里说“请别乱动”，而是在启动进程前给命令套上操作系统能执行的限制器。
- codex-sandbox-002: codex-rs/core/src/config/permissions.rs:203-213 · 自定义 permission profile 默认从受限文件系统和受限网络开始
  - 自定义政策从“什么都别给”开始逐项开门，而不是先全开再查漏补缺。

## Takeaway
企业策略能单独收紧提权频率与文件/网络能力。
