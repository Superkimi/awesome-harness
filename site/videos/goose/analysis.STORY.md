# Goose · 技术分析总览

## Hook
老板问我：这个 Coding Agent 到底为什么能把工具、审批和上下文接起来？我不讲口号，直接按源码证据拆。

## Evidence anchors
- goose-loop-001: crates/goose/src/agents/agent.rs:1930-2043 · 单一流式 Agent 循环驱动推理、工具和持久化
  - 它不是“模型回答一次就结束”，而是模型说一步、系统做一步、把结果再交回模型，直到满足结束条件。
- goose-context-001: crates/goose/src/context_mgmt/mod.rs:26-49 · 80% 阈值触发结构化压缩
  - 快塞满模型记忆时，它不会粗暴删掉全部历史，而是把旧进展整理成一张交接单，再把用户最新要求放回去。
- goose-tools-001: crates/goose/src/agents/agent.rs:2210-2265 · 同一模型 turn 的多个工具经检查后并发执行
  - 模型一次要读三个文件时，不必傻等第一个完成再做第二个；但每个调用先过安全和审批门。
- goose-security-001: crates/goose/src/agents/agent.rs:659-688 · 工具检查顺序体现“危险优先”
  - 先看是否像恶意命令和数据外传，再做额外对抗审查，然后才判断用户是否需要点批准，最后检查重复循环。
- goose-mcp-001: crates/goose/src/agents/extension_manager.rs:1271-1342 · MCP 工具被统一命名空间化、缓存和动态刷新
  - 各插件都可能有一个叫 search 的工具，所以 Goose 默认把它们改成“插件名__search”，避免撞名，并缓存工具清单减少重复查询。
- goose-session-001: crates/goose/src/session/session_manager.rs:45-96 · 会话、消息、成本与压缩指标落到 SQLite/WAL
  - 对话不只是屏幕上的临时文本：每条消息、用的模型、父子会话、花费和压缩前后 token 都能落盘追踪。

## Takeaway
Harness 的真正核心是状态机而不是提示词；重试、转向、停止钩子和上下文恢复都进入同一控制环。
