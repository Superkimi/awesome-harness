# M01 · 总览：强化 Agent loop 外面还有状态机

## Hook
老板让我交付一条长任务，我先确认 Oh My Pi 的核心 loop 和 Session maintenance 分别管什么。

## Evidence anchors
- omp-architecture-001: packages/agent/src/agent-loop.ts:879-918 · 核心是强化 Agent loop，产品层再叠加大型 Session maintenance 状态机
  - 内层发动机负责每一步，外层管家负责一步结束后判断要不要重试、压缩、换模型、继续目标或等待后台工作。
- omp-session-001: packages/coding-agent/src/session/session-storage.ts:1-260 · 会话是树形事件账本，存储层可替换
  - 聊天、分支、压缩和配置变化都作为事件保存；存哪里可以从个人本地换到服务端数据库。

## Takeaway
自治恢复能力强，但 session maintenance 已成为复杂调度器，修改顺序容易产生竞态。
