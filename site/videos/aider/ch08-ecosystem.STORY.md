# M08 · 连接器：核心循环和工具生态要分开

## Hook
团队要加函数工具和插件，我先确认 Aider 的核心不是复制一套 MCP 循环。

## Evidence anchors
- aider-tools-001: aider/models.py:1006-1009 · 核心不是 MCP/函数工具循环
  - Aider 专注“在 Git 仓库里改代码”，不是一个可随时挂几十种业务工具的通用 Agent 平台。

## Takeaway
专注带来可预测性和编辑深度，连接器生态与跨系统工作流则明显受限。
