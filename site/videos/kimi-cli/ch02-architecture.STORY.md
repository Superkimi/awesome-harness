# M02 · 架构：Kosong、Soul 与 Toolset 怎么分工

## Hook
架构评审只剩十分钟，我得讲清流式生成、Soul 状态机和动态工具表各自负责什么。

## Evidence anchors
- kimi-provider-001: packages/kosong/src/kosong/_generate.py:52-103 · Kosong 把流式生成和工具调度拆成两层契约
  - 底层负责把碎片拼成完整回复，上层负责一看到完整工具单就开工；若模型流中断，尚未完成的工具任务会被收拢取消。
- kimi-loop-001: src/kimi_cli/soul/kimisoul.py:659-742 · 每轮是带检查点的多步状态机，不是单次聊天请求
  - 一次用户输入可能触发多次“模型思考—调工具—看结果—再思考”，每一步前都留存档点。
- kimi-tools-001: src/kimi_cli/soul/agent.py:411-451 · 工具表由 agent spec 动态装配，插件和 MCP 追加进入同一 Toolset
  - 工具箱不是写死在循环里，而是由角色配置装配；本地插件和远程 MCP 最终都变成模型看到的同类工具。

## Takeaway
Provider 和 Harness 解耦，同时避免中断后悬挂任务。
