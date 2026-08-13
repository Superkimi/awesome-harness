# M07 · 安全：审批、权限和边界

## Hook
同事把远程子 Agent 的 endpoint 发来，我先确认它有没有越过本地边界。

## Source proof
- backend/app/service/mcp_config.py · normalize|mcpServers|write_mcp_config

## Lesson
配置规范化、权限与执行环境必须分开审计。
