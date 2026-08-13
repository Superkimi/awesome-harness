# M10 · 证据：提示、事件与恢复如何可审计

## Hook
评审问“安全和恢复是不是口号”，我用 PromptContext、结构化事件和 compaction 记录回答。

## Evidence anchors
- grok-prompt-001: crates/codegen/xai-grok-agent/src/prompt/context.rs:80-152 · PromptContext 是可序列化、可检查的一等契约
  - 系统提示词的输入不是散落变量，而是一张可以导出检查的配置表。
- grok-observe-001: crates/codegen/xai-grok-shell/src/session/acp_session_impl/tool_calls.rs:392-436 · 工具、权限、压缩和沙箱均产出结构化事件
  - 不仅能看到“失败了”，还能回答失败在哪个关、谁批准的、等了多久、压缩试了几次、沙箱挡了什么。
- grok-context-002: crates/codegen/xai-grok-shell/src/session/compaction.rs:1282-1460 · 压缩后重建的是“任务状态”，不是纯聊天摘要
  - 总结完以后还会把“哪些子任务在跑、待办是什么、插件有哪些、当前计划阶段”重新装回去，避免只剩一段模糊回忆。

## Takeaway
Prompt provenance 和可重放性明显优于只在运行时拼字符串。
