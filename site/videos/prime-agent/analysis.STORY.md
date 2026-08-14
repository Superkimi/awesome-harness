# Prime Agent · 技术分析总览

## Hook
评审问我：这个 Agent 怎么把纯 loop、coding host、扩展总线、daemon 和 RLM 组织起来？我沿固定证据拆。

## Evidence anchors
- prime-arch-001: packages/agent/src/agent-loop.ts:178-205 · 低层 Agent Loop 是可复用的 provider-neutral 状态机
  - Prime Agent 把“模型怎么流式回答、什么时候执行工具、用户插话后是否继续”抽成一个不依赖 TUI 的小内核，上层入口只负责喂配置和消费事件。
- prime-tools-001: packages/agent/src/agent-loop.ts:608-623 · 工具调用先预检再执行，支持串行和并行两条路径
  - 多个独立查询可以并发跑，但带副作用的工具能强制串行；模型给错参数时不会直接进 shell，而是先变成错误 tool result。
- prime-context-001: packages/coding-agent/src/core/compaction/compaction.ts:122-132 · 默认压缩预留 16384 token，尾部保留 20000 token
  - 它不会等到 provider 报 context overflow 才处理，而是提前留出一块回答空间，再保留最近工作集。
- prime-collab-001: packages/coding-agent/src/core/rlm-runtime.ts:14-39 · RLM child runtime 有显式 registry、深度和完成释放协议
  - 子 Agent 不是简单 `Promise.all`：父子关系、状态、目录、模型、深度和完成后回收都有可查询的对象。
- prime-observe-001: packages/agent/src/types.ts:399-421 · Agent events 覆盖 agent、turn、message 和 tool execution 四层
  - UI 可以画出模型流式文本、工具进度和每个 turn 的边界，而不是只能等最终字符串。

## Takeaway
自研时可把 loop 做成纯运行时，再让 CLI、RPC、桌面 UI 共用；不要让界面组件自己复制一套 tool loop。
