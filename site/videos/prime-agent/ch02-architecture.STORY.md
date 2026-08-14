# M02 · 架构：Provider 边界前才变换上下文

## Hook
架构评审只剩十分钟，我得讲清状态机、上下文变换、密钥解析和 host 的接力。

## Evidence anchors
- prime-arch-001: packages/agent/src/agent-loop.ts:178-205 · 低层 Agent Loop 是可复用的 provider-neutral 状态机
  - Prime Agent 把“模型怎么流式回答、什么时候执行工具、用户插话后是否继续”抽成一个不依赖 TUI 的小内核，上层入口只负责喂配置和消费事件。
- prime-arch-002: packages/agent/src/agent-loop.ts:467-521 · Provider 边界前才做上下文变换和密钥解析
  - 上下文不会在会话开始时被一次性拍扁，长任务中每次请求都可以重新裁剪、换系统提示和刷新短期 token。

## Takeaway
自研时可把 loop 做成纯运行时，再让 CLI、RPC、桌面 UI 共用；不要让界面组件自己复制一套 tool loop。
