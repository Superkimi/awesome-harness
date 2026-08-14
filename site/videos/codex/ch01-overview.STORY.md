# M01 · 总览：多前端共享控制面

## Hook
老板让我交付一条长任务，我先确认 Codex 的共享控制面和 JSONL 事实源各自负责什么。

## Evidence anchors
- codex-maturity-001: LICENSE:1-28 · 这是大型、多前端、测试密集的 Rust Harness，许可证为 Apache-2.0
  - 它不是一段 CLI 脚本，而是一套带协议、TUI、app server、状态库、插件和跨平台后端的系统工程。
- codex-persistence-001: codex-rs/rollout/src/recorder.rs:93-171 · 会话采用 JSONL rollout 作为事件事实源，后台 writer 支持 persist、flush 与失败记忆
  - 先把每一步写成可重放流水账，后台书记员负责落盘；书记员一旦坏掉，后续调用会记得这次故障而不是假装成功。

## Takeaway
可借鉴性高，但直接复刻意味着承担很大的平台与回归测试成本。
