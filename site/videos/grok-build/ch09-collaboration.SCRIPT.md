1. 团队想接 Skills、Commands 和后台子 Agent，我先看 manifest 和 worktree 隔离怎么组合。
2. 这一章不猜作者意图，只沿着固定版本的运行时代码、协议和测试看事实。
3. 固定版本证据：crates/codegen/xai-grok-agent/src/plugins/manifest.rs:103-170 · 一个插件可同时交付 Skills、Commands、Agents、Hooks、MCP、LSP；crates/codegen/xai-grok-shell/src/session/acp_session_impl/tool_calls.rs:811-839 · 子 Agent 支持后台执行、恢复、深度限制与 worktree 隔离。
4. 事实一：插件不是只加一个工具，而是可以连同说明书、快捷命令、子 Agent 角色、策略 hook、远程工具和语言服务一起打包。
5. 源码含义：生态能力完整，但插件供应链和信任 UI 变成核心安全面。
6. 事实二：它是真正的多 Agent 调度：子任务可以后台跑、以后接着跑、在独立分支目录里改代码，但不能无限生孩子。
7. 数据流：事件 → SessionActor → prepare/dispatch → 权限或沙箱 → 结构化结果。
8. 小白动作：先把动作分成准备、执行、收尾三段，再给每段留一个失败出口。
9. 第二个动作：把安全边界写成只读约束、访问类型、隔离方式和降级策略。
10. 局限提醒：已审计 MCP、LSP、skills、commands、agents、hooks 的统一插件清单。
11. 这一章的结论：生态能力完整，但插件供应链和信任 UI 变成核心安全面。
12. 下一章继续沿着固定提交的源码锚点，回答一个真实工作问题。

Fixed commit: e5fd4816d43260c15ba785f103990c1ed6cea230
