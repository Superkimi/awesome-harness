# M02 · 架构：Agent、Session 和 Provider 怎么分工

- Project: Legacy Oh My Pi
- Fixed source commit: a53e4e790d3939a08708bf0d3c912d0763237a2d
- Evidence ledger: data/legacy/evidence/oh-my-pi/evidence.json
- Episode: ch02-architecture
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - packages/agent/src/agent-loop.ts:879-918 · 核心是强化 Agent loop，产品层再叠加大型 Session maintenance 状态机
  - packages/catalog/src/provider-models/descriptors.ts:1-66 · 模型目录和协议实现分离，Provider 覆盖极广
  - packages/coding-agent/src/session/session-storage.ts:1-260 · 会话是树形事件账本，存储层可替换
