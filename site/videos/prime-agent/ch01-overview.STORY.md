# M01 · 总览：纯 Loop、Coding Host、Extension Bus

## Hook
老板让我跑一条长任务，我先确认 Prime Agent 的三层分离各自守哪条边界。

## Evidence anchors
- prime-recommend-001: packages/coding-agent/src/core/agent-session.ts:1-13 · 最值得借鉴的是“纯 loop + coding host + extension bus”三层分离
  - 这套分层让我们既能复用基础 loop，又能按产品需要装配 TUI、RPC、daemon 或插件，而不是把所有能力塞进一个巨型 Agent 类。
- prime-arch-001: packages/agent/src/agent-loop.ts:178-205 · 低层 Agent Loop 是可复用的 provider-neutral 状态机
  - Prime Agent 把“模型怎么流式回答、什么时候执行工具、用户插话后是否继续”抽成一个不依赖 TUI 的小内核，上层入口只负责喂配置和消费事件。

## Takeaway
自研架构建议沿此边界拆包：Core Loop、Harness Session、Policy/Extension Bus、Execution Adapters、Persistence/Control Plane。
