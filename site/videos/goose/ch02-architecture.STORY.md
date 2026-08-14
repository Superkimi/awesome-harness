# M02 · 架构：谁管循环，谁管上下文，谁管工具

## Hook
评审只剩十分钟，我得把 Agent 的几层责任讲清楚，不能再用一张模糊架构图糊弄。

## Evidence anchors
- goose-loop-001: crates/goose/src/agents/agent.rs:1930-2043 · 单一流式 Agent 循环驱动推理、工具和持久化
  - 它不是“模型回答一次就结束”，而是模型说一步、系统做一步、把结果再交回模型，直到满足结束条件。
- goose-provider-001: crates/goose-provider-types/src/base.rs:281-286 · Provider 以流式协议统一，工具调用必须完整再上送
  - 不同模型厂商先被翻译成同一种“消息水管”。普通文字可以一个词一个词流出，但工具参数不能半截就执行。
- goose-context-001: crates/goose/src/context_mgmt/mod.rs:26-49 · 80% 阈值触发结构化压缩
  - 快塞满模型记忆时，它不会粗暴删掉全部历史，而是把旧进展整理成一张交接单，再把用户最新要求放回去。

## Takeaway
Harness 的真正核心是状态机而不是提示词；重试、转向、停止钩子和上下文恢复都进入同一控制环。
