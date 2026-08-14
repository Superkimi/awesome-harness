# M07 · 权限：Plan Mode 和 Hook 先于按钮批准

## Hook
同事说 Always Approve 就够安全，我把只读约束、访问类型和 PreToolUse Hook 一起查。

## Evidence anchors
- grok-plan-001: crates/codegen/xai-grok-shell/src/session/acp_session_impl/tool_calls.rs:157-205 · Plan Mode 的只读约束独立于 Always Approve
  - “全部自动批准”也不等于“计划阶段可以乱改代码”。计划模式另有一把更早、更硬的锁。
- grok-permission-001: crates/codegen/xai-grok-shell/src/session/acp_session_impl/tool_calls.rs:1035-1102 · 权限判断理解访问类型和会话上下文
  - 它不是只看工具名，而是知道“这是读哪个路径、改哪个文件、跑什么命令、访问哪个网站”，自动模式还会参考最近几轮对话。
- grok-hooks-001: crates/codegen/xai-grok-shell/src/session/acp_session_impl/tool_calls.rs:977-1034 · PreToolUse Hook 可在权限前阻断
  - 企业策略脚本可以比用户批准更早说“不”，避免用户误点同意覆盖组织规则。

## Takeaway
工作流阶段约束不能依赖通用权限模式，否则高权限模式会破坏阶段不变量。
