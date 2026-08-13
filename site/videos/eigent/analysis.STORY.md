# Eigent · 技术分析总览

## Hook
同事把一堆重复任务丢给我：明早要看到一个能交接的工作台。

## Proof
- backend/app/service/task.py · class Action|class|Task
- backend/app/service/single_agent_service.py · _build_single_agent_context|_response_content
- backend/app/service/task.py · activate_toolkit|search_mcp|install_mcp
- backend/app/service/mcp_config.py · normalize|mcpServers|write_mcp_config

## Lesson
把 Eigent 想成一个带项目记忆的办公室：任务锁是工单，Agent 是员工，MCP 是工具柜，记忆服务负责交接班。

## Limitation
Python CAMEL/后端服务与 Electron 前端的链路较长
