# Kimi CLI · 技术分析总览

## Hook
评审问我：这个 CLI 怎么把多步状态机、工具并发、审批、MCP 和子 Agent 串起来？我沿固定证据拆。

## Evidence anchors
- kimi-loop-001: src/kimi_cli/soul/kimisoul.py:659-742 · 每轮是带检查点的多步状态机，不是单次聊天请求
  - 一次用户输入可能触发多次“模型思考—调工具—看结果—再思考”，每一步前都留存档点。
- kimi-provider-001: packages/kosong/src/kosong/_generate.py:52-103 · Kosong 把流式生成和工具调度拆成两层契约
  - 底层负责把碎片拼成完整回复，上层负责一看到完整工具单就开工；若模型流中断，尚未完成的工具任务会被收拢取消。
- kimi-tools-001: src/kimi_cli/soul/agent.py:411-451 · 工具表由 agent spec 动态装配，插件和 MCP 追加进入同一 Toolset
  - 工具箱不是写死在循环里，而是由角色配置装配；本地插件和远程 MCP 最终都变成模型看到的同类工具。
- kimi-security-001: src/kimi_cli/soul/approval.py:130-199 · 统一审批支持单次、整会话、拒绝反馈、YOLO 与 AFK
  - 每种危险动作可这次放行、整场放行或拒绝并告诉模型原因；无人值守模式等同自动批准。
- kimi-subagent-001: src/kimi_cli/soul/agent.py:411-431 · 内建 coder/explore/plan 用代码级工具白名单切分角色
  - 主 Agent 能雇三种工人：能改代码、只探索、只规划；每种工人拿到的钥匙不同，而且不能继续无限招下级。
- kimi-observe-001: src/kimi_cli/soul/kimisoul.py:1009-1076 · Wire 事件与 trace id 贯穿 turn、step、tool、approval、MCP、compaction
  - 界面看到的不是一行最终文本，而是一条可还原执行过程的事件河流，并能把 API 请求、工具和审批串起来。

## Takeaway
长任务可恢复、可插话，也需要严格的步数上限和副作用治理。
