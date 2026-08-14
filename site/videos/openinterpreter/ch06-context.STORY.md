# M06 · 上下文：压缩要尊重 Harness 和真实成本

## Hook
长任务快超窗，我先看调用配对、多模态 token 和 Harness-aware compact 怎样一起工作。

## Evidence anchors
- oi-context-001: codex-rs/core/src/context_manager/history.rs:40-186 · 历史管理维护调用配对、多模态能力和可见 token 成本
  - 上下文不是简单 messages 数组；它会修账，保证工具订单和回执成对，并避免把模型根本不能看的媒体继续塞回去。
- oi-context-002: codex-rs/core/src/compact.rs:299-389 · 压缩是 Harness-aware 的，而不是统一摘要模板
  - 换了驾驶舱，压缩后的“交接便笺”也要换写法，否则目标模型会读不懂或丢失刚看过的文件。

## Takeaway
恢复和压缩后的协议更稳定；token 估算是启发式下界，不等于 provider tokenizer。
