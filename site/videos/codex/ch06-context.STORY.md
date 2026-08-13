# M06 · 上下文：Copy-on-Write 历史如何自救

## Hook
长任务快超窗，我先看版本账本、工具配对、多模态成本和逐项删旧记录重试。

## Evidence anchors
- codex-context-001: codex-rs/core/src/context_manager/history.rs:38-60 · 历史是带版本号的 Copy-on-Write 账本，不是随手拼接的消息数组
  - 像有版本号的账本：读取者共享同一份快照，真要改时才复制，且每笔工具调用都要能对上回执。
- codex-context-002: codex-rs/core/src/context_manager/history.rs:189-248 · 上下文裁剪同时维护工具调用配对并计算多模态成本
  - 剪历史不能只撕掉一页：工具问题和答案必须一起处理；图片、音频和加密内容也不能当作零体积。
- codex-context-003: codex-rs/core/src/compact.rs:240-318 · 本地压缩会自救：压缩请求自身超限时逐项删旧记录再重试
  - 连“请帮我整理行李”这句话都塞不进去时，它会先扔掉最旧且成对的票据，直到能完成整理。

## Takeaway
适合并发读取和回滚，也让 compaction、fork 与增量世界状态有明确一致性边界。
