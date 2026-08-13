# M09 · 插件与子 Agent：能力如何成套交付

## Hook
团队想接 Skills、Commands 和后台子 Agent，我先看 manifest 和 worktree 隔离怎么组合。

## Evidence anchors
- grok-plugin-001: crates/codegen/xai-grok-agent/src/plugins/manifest.rs:103-170 · 一个插件可同时交付 Skills、Commands、Agents、Hooks、MCP、LSP
  - 插件不是只加一个工具，而是可以连同说明书、快捷命令、子 Agent 角色、策略 hook、远程工具和语言服务一起打包。
- grok-subagent-001: crates/codegen/xai-grok-shell/src/session/acp_session_impl/tool_calls.rs:811-839 · 子 Agent 支持后台执行、恢复、深度限制与 worktree 隔离
  - 它是真正的多 Agent 调度：子任务可以后台跑、以后接着跑、在独立分支目录里改代码，但不能无限生孩子。

## Takeaway
生态能力完整，但插件供应链和信任 UI 变成核心安全面。
