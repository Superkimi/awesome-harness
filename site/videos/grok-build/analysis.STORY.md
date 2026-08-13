# Grok Build · 技术分析总览

## Hook
评审问我：这个 Agent 为什么能把权限、沙箱、插件和长期会话放在一条链上？我直接按源码证据拆。

## Evidence anchors
- grok-loop-001: crates/codegen/xai-grok-shell/src/session/acp_session_impl/run_loop.rs:120-183 · SessionActor 是事件驱动的长期存活 Actor
  - 它不像一个简单 while 循环，更像一间控制室：用户输入、工具结果、文件变化、后台任务、模型切换都从不同通道进来，由同一个会话 Actor 排队处理。
- grok-tools-001: crates/codegen/xai-grok-shell/src/session/acp_session_impl/tool_calls.rs:355-449 · 工具执行明确拆成 prepare、并发 dispatch、post-flight
  - 能并行的尽量并行，但两个工具若同时写同一个文件会排队，避免互相覆盖。
- grok-sandbox-001: crates/codegen/xai-grok-sandbox/src/lib.rs:8-18 · 提供真正的内核级文件系统沙箱
  - 这不只是“执行前问一下”，操作系统内核会真的挡住不允许的文件访问。
- grok-context-001: crates/codegen/xai-grok-shell/src/session/compaction.rs:3-35 · 压缩是一条带预热、两阶段和恢复梯子的子系统
  - 不是等窗口爆了才临时总结：它会提前准备摘要草稿，到红线时再完成第二遍；若摘要输入也太大，就逐级减料。
- grok-plugin-001: crates/codegen/xai-grok-agent/src/plugins/manifest.rs:103-170 · 一个插件可同时交付 Skills、Commands、Agents、Hooks、MCP、LSP
  - 插件不是只加一个工具，而是可以连同说明书、快捷命令、子 Agent 角色、策略 hook、远程工具和语言服务一起打包。

## Takeaway
这套 Harness 面向长会话、后台工作和 IDE/ACP 集成，控制面复杂度显著高于纯 CLI Agent。
