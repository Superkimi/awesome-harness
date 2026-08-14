# M09 · 协作：子 Agent 是示例进程，不是调度平面

## Hook
研究与实现要并行，我先确认 subagent 示例怎样独立启动，以及 Pi 内核没有替它做什么。

## Evidence anchors
- pi-subagent-001: packages/coding-agent/examples/extensions/subagent/index.ts:1-36 · 子 Agent 是独立 pi 进程示例，不是内建调度控制平面
  - 它展示了“主 Agent 叫几个临时 Pi 工人”的方法，但没有内核级 durable queue、共享记忆、远程 worker 或统一权限继承。
- pi-connectors-001: packages/coding-agent/src/core/agent-session.ts:2454-2544 · 固定提交未实现内建 MCP client/server
  - Pi 可以通过扩展接任意协议，但开箱没有像部分竞品那样配置 MCP server 后自动发现 tools/resources/prompts。

## Takeaway
适合参考 subprocess orchestration，不应与成熟多 Agent 控制平面等同。
