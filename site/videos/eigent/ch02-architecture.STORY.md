# Eigent · M02 · 架构：有哪些层，谁负责什么

## Hook
同事问“任务锁到底锁了什么”，我把前后端几层拆给他看。

## Proof
- backend/app/service/task.py · class Action|class|Task
- backend/app/service/task.py · activate_toolkit|search_mcp|install_mcp
- backend/app/service/mcp_config.py · normalize|mcpServers|write_mcp_config

## Lesson
先画清边界，再决定每一层的责任：把 Eigent 想成一个带项目记忆的办公室：任务锁是工单，Agent 是员工，MCP 是工具柜，记忆服务负责交接班。

## Limitation
Python CAMEL/后端服务与 Electron 前端的链路较长
