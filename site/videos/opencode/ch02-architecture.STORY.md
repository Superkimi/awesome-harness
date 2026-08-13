# M02 · 架构：请求、事件和持久化怎么接力

## Hook
架构评审只剩十分钟，我得讲清每一步为什么都要重建 Agent、上下文和模型请求。

## Evidence anchors
- opencode-loop-002: packages/opencode/src/session/prompt.ts:1170-1241 · 每一步动态重建 Agent、工具、系统上下文和模型请求
  - 不是开会前一次性发完所有资料；每走一步都按当前身份、模型和权限重新整理桌面。
- opencode-provider-002: packages/opencode/src/session/llm/request.ts:56-100 · 请求准备层统一合并 prompt、variant、provider options 与 hooks
  - 模型请求像一张多层样式表：厂商默认、模型设置、Agent 设置、当前档位和插件逐层覆盖。
- opencode-observe-001: packages/opencode/src/session/session.ts:120-158 · session 持久化 agent/model/permission/cost/tokens/summary/revert 与 parent
  - 一条任务不只存聊天文本，还存它用了哪个 Agent/模型、花了多少钱、改了哪些文件、能否回退以及是谁的子任务。

## Takeaway
支持运行中配置和权限变化，但每步装配链更复杂、需要缓存与测试。
