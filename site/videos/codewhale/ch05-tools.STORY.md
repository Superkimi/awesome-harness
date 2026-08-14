# M05 · 工具：能力、审批、只读和资源一张 ToolSpec

## Hook
模型要并行读文件，我先看 ToolSpec、machine authority、只读投影和 heartbeat。

## Evidence anchors
- codewhale-tools-001: crates/tui/src/tools/spec.rs:1158-1217 · ToolSpec 把能力、审批、只读、并行和资源声明放到同一输入特化接口
  - 工具不是只有一个名字和一个函数；系统会问“这一次具体参数是否只读、能否并行、需要什么审批、会占什么资源”。
- codewhale-tools-002: crates/tui/src/tools/registry.rs:91-99 · Registry 执行前会重新施加 machine authority，并提供只读事实投影
  - 预览层拿到的是一份不能执行的菜单，执行层还要再验一次；模型叫错 `read-file` 也会按固定规则解析，不会随机挑工具。
- codewhale-tools-003: crates/tui/src/core/engine/tool_execution.rs:230-287 · 并行工具只允许 read-only、Auto approval 且声明 supports_parallel
  - 并行不是模型说了算：写文件、需要询问用户或没声明线程安全的工具都不能塞进并行批次。
- codewhale-tools-004: crates/tui/src/core/engine/tool_execution.rs:353-406 · 工具执行有 heartbeat、读写锁、交互终端 RAII 和结构化结束日志
  - 一个长时间 build 不会被 UI 误判为死掉；并发读不会阻塞，写会排他；交互终端中途取消也会恢复 TUI 状态。

## Takeaway
工具能力要来自类型和实际 input，而不是维护一份会漏掉插件/MCP 的名字黑名单。
