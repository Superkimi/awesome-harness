# M05 · 工具：typed runtime 与并行排他锁

## Hook
工具越来越多，我先看 typed contract、并行组、全局排他和模型可见清单。

## Evidence anchors
- codex-tools-001: codex-rs/core/src/tools/registry.rs:48-149 · 工具有统一 typed runtime 契约，hooks、观测和流式参数 diff 都是一级能力
  - 每个新工具不只是写一个 execute 函数，还要说明如何取消、怎么记日志、钩子看什么、参数流到一半时如何展示。
- codex-tools-002: codex-rs/core/src/tools/parallel.rs:74-145 · 并发工具用读写锁实现“并行组 + 全局排他工具”
  - 能并行的工具像多人同时读资料；危险或有状态的工具拿独占钥匙，等所有并行动作结束后自己运行。
- codex-tools-003: codex-rs/core/src/tools/spec_plan_tests.rs:637-708 · 工具暴露与分发分离，兼容旧 shell 又不污染模型可见清单
  - 后台可以保留旧插座做兼容，但模型眼前只摆当前应该用的工具，避免同功能多把扳手。

## Takeaway
扩展成本高于轻量 Agent，但跨工具的安全和观测语义更一致。
