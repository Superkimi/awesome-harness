# M07 · 安全：审批、Plan 模式与宿主 KAOS

## Hook
同事说 YOLO 就等于安全，我把多级审批、Plan 写工具拒绝和宿主执行边界拆开。

## Evidence anchors
- kimi-security-001: src/kimi_cli/soul/approval.py:130-199 · 统一审批支持单次、整会话、拒绝反馈、YOLO 与 AFK
  - 每种危险动作可这次放行、整场放行或拒绝并告诉模型原因；无人值守模式等同自动批准。
- kimi-security-002: src/kimi_cli/soul/kimisoul.py:409-463 · Plan 模式不是隐藏工具，而是写工具调用时再强制拒绝
  - root 的 Plan 模式仍让模型知道写工具存在，但真调用时门禁拦下；专门 plan 子 Agent 更严格，工具箱里压根没有写和 shell。
- kimi-security-003: src/kimi_cli/agents/default/system.md:67-81 · 默认本地 KAOS 是宿主执行抽象，不是 OS 级沙箱
  - KAOS 让同一套代码能接本地或 SSH，但没有把命令关进隔离房间；一旦用户批准，进程拿的是当前用户权限。

## Takeaway
root、前台和后台子 Agent 共用一个审批面；AFK 是高风险开关，不能理解为只关闭提问。
