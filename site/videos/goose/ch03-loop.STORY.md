# M03 · 主循环：任务为什么不会只回答一次

## Hook
老板催进度时模型只回一句不算完成，我沿着 reply_internal 看它怎样继续、重试、压缩再结束。

## Evidence anchors
- goose-loop-001: crates/goose/src/agents/agent.rs:1930-2043 · 单一流式 Agent 循环驱动推理、工具和持久化
  - 它不是“模型回答一次就结束”，而是模型说一步、系统做一步、把结果再交回模型，直到满足结束条件。
- goose-loop-002: crates/goose/src/agents/agent.rs:67-79 · 结束条件有防失控上限
  - 即使模型什么都不返回，或插件一直说“还不能停”，Goose 也不会永远卡住。

## Takeaway
Harness 的真正核心是状态机而不是提示词；重试、转向、停止钩子和上下文恢复都进入同一控制环。
