# M07 · 安全：审批、能力授权与 OS 沙箱是三件事

## Hook
同事说选了一个目录就安全，我把原路径、规范化路径、审批和进程沙箱分开检查。

## Evidence anchors
- oi-security-001: codex-rs/core/src/tools/handlers/harness_fs.rs:39-94 · Harness 文件工具先过策略，且同时检查原路径与规范化路径
  - 即使换成 Claude/Pi 风格的 Read/Write，也不能因为路径里有软链接或奇怪别名绕过沙箱。
- oi-security-002: codex-rs/core/src/config/permissions.rs:170-260 · 审批和能力授权是两条轴，OS 沙箱是真实进程变换
  - “要不要先问你”与“即使你同意，它最多能碰哪里”是两回事；后者不是提示词，而是操作系统级限制。

## Takeaway
兼容层与原生工具共享安全边界；搜索 walk 还跳过 symlink、限制 64 层和 5 万项。
