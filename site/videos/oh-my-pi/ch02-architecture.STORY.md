# M02 · 架构：Agent、Session 和 Provider 怎么分工

## Hook
架构评审只剩十分钟，我得把事件账本、模型目录和执行循环拆成三层。

## Evidence anchors
- omp-architecture-001: packages/agent/src/agent-loop.ts:879-918 · 核心是强化 Agent loop，产品层再叠加大型 Session maintenance 状态机
  - 内层发动机负责每一步，外层管家负责一步结束后判断要不要重试、压缩、换模型、继续目标或等待后台工作。
- omp-provider-001: packages/catalog/src/provider-models/descriptors.ts:1-66 · 模型目录和协议实现分离，Provider 覆盖极广
  - 模型“有哪些”由目录管理，模型“怎么说话”由协议驱动管理，两者不是一张巨型 if/else。
- omp-session-001: packages/coding-agent/src/session/session-storage.ts:1-260 · 会话是树形事件账本，存储层可替换
  - 聊天、分支、压缩和配置变化都作为事件保存；存哪里可以从个人本地换到服务端数据库。

## Takeaway
自治恢复能力强，但 session maintenance 已成为复杂调度器，修改顺序容易产生竞态。
