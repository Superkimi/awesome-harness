# Open Interpreter · 技术分析总览

## Hook
评审问我：这个 Open Interpreter 现在到底是什么底盘？我不按名字猜，直接沿固定证据看 Harness、工具和兼容契约。

## Evidence anchors
- oi-identity-001: codex-rs/product-info/src/lib.rs:45-79 · 当前源码不是经典 Python Open Interpreter，而是 Rust/Codex 兼容分叉
  - 它不是在旧 Python 循环上继续打补丁，而是把一套 Codex 级 Rust Harness 换了产品入口，再加入自己的多 Harness 能力。
- oi-harness-001: codex-rs/core/src/harness/mod.rs:1-18 · 核心差异是一层多 Harness 仿真目录
  - 同一个底盘能换不同“驾驶舱”：改变系统提示词、消息格式、工具名称与参数，去适配最合适的模型习惯。
- oi-loop-001: codex-rs/core/src/session/turn.rs:140-228 · 共享内核仍是 turn 内多 step 的流式工具循环
  - 一次用户请求会反复经历“取固定快照—问模型—跑工具—把结果放回去”，直到模型真正收尾。
- oi-security-002: codex-rs/core/src/config/permissions.rs:170-260 · 审批和能力授权是两条轴，OS 沙箱是真实进程变换
  - “要不要先问你”与“即使你同意，它最多能碰哪里”是两回事；后者不是提示词，而是操作系统级限制。
- oi-observe-001: codex-rs/core/src/session/rollout_reconstruction.rs:116-288 · JSONL rollout 是可恢复事件事实源，SQLite/trace 是查询与诊断层
  - 先保存完整流水账，再从流水账还原聊天、文件、工具和子 Agent 发生了什么。

## Takeaway
评估时必须把它与同批次的 openai/codex 分开：共享基座很多，但 Open Interpreter 的差异主要落在品牌、provider/harness 选择和协议仿真。
