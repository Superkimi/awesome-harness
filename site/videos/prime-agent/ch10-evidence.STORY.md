# M10 · 证据：JSONL 树、事件层和测试布局

## Hook
评审问“恢复正确性怎么证明”，我用 parentId journal、四层 event 和测试布局回答。

## Evidence anchors
- prime-persistence-001: packages/coding-agent/src/core/session-manager.ts:33-54 · SessionManager 用带 parentId 的 JSONL 树表达分支、压缩和扩展状态
  - 会话文件不是一条只能向后追加的聊天记录，而是一棵可导航的树；扩展可以持久化自己的 entry，又不会把内部状态强塞给模型。
- prime-persistence-002: packages/coding-agent/src/core/session-manager.ts:472-535 · Context 重建沿 parent tree，并把 compaction summary 放在 retained messages 前
  - 从任意分支恢复时，模型看到的是“摘要→保留的旧消息→新分支”，UI 还可以知道真实的树边界。
- prime-persistence-003: packages/coding-agent/src/core/session-manager.ts:1345-1364 · 写盘采用临时文件 rename，普通 entry 采用 append-only
  - 完整重写时不会留下半个 JSONL；常规消息又不必每次重写整个文件，兼顾可靠性与成本。
- prime-observe-001: packages/agent/src/types.ts:399-421 · Agent events 覆盖 agent、turn、message 和 tool execution 四层
  - UI 可以画出模型流式文本、工具进度和每个 turn 的边界，而不是只能等最终字符串。
- prime-maturity-001: packages/coding-agent/test/acp-rlm-subagents.test.ts:1-12 · 测试布局覆盖 agent、session、daemon、RLM、MCP 与 telemetry
  - 项目没有只测“模型能回答一句话”，而是把长会话、后台 worker、子 Agent 和工具执行拆成可回归的测试文件。

## Takeaway
要支持 fork、resume、compaction 和子 Agent，持久化格式需要 parent link、版本号和“不进入 LLM context”的 entry 类型。
