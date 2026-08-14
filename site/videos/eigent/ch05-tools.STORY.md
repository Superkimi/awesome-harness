# M05 · 工具：Agent 的手脚怎样被注册

## Hook
老板让我接一个 MCP 工具，但权限和配置不能一股脑全开。

## Source proof
- backend/app/service/task.py · activate_toolkit|search_mcp|install_mcp

## Lesson
工具箱要有激活、搜索和安装的明确入口。
