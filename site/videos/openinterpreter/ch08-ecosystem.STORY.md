# M08 · 扩展：MCP、Apps、Skills 和 Hooks 如何进入 step

## Hook
团队要接扩展，但不能绕过快照和指令预算；我沿工具计划与 AGENTS 合并规则看边界。

## Evidence anchors
- oi-mcp-001: codex-rs/core/src/session/turn.rs:546-650 · MCP、Apps、Plugins、Extensions 都在 step 工具计划中受快照控制
  - 连接器不是随时从全局表里飘进来，而是在这一轮、这一步被拍成快照后再装进工具箱。
- oi-instructions-001: codex-rs/core/src/agents_md.rs:1-49 · AGENTS.md 从项目根到 cwd 合并，局部 override 优先且有总预算
  - 仓库总规矩先读，子目录的局部规矩后读；局部 override 能盖住普通 AGENTS 文件，所有说明不能无限占上下文。
- oi-instructions-002: codex-rs/core/src/harness/session_skills.rs:1-65 · Skills developer block 不允许被 Harness 转换悄悄丢掉
  - 换成 Claude/Kimi/Pi 外壳时，用户装的技能仍要跟过去，不能因为消息格式翻译而消失。
- oi-hooks-001: codex-rs/hooks/src/types.rs:1-152 · Hooks 覆盖会话、输入、权限、工具、压缩、停止和子 Agent 生命周期
  - 外部治理系统能在关键关口插卡：开始前补上下文，危险动作前审批，工具后审计，结束前决定是否继续。

## Takeaway
可复现性和权限边界较清楚；插件配置变化通常下一 step 才生效。
