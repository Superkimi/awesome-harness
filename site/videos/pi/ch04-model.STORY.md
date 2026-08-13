# M04 · Provider：多协议与热注册怎么共存

## Hook
客户临时换模型，流程不能重写；我先看 Provider 适配矩阵、热注册和重试分层。

## Evidence anchors
- pi-provider-001: packages/ai/src/providers/all.ts:5-44 · Provider 不是单一 OpenAI 兼容层，而是多协议适配矩阵
  - 每家模型的方言由独立翻译器处理，而不是假设所有服务都说 OpenAI 方言。
- pi-provider-002: packages/coding-agent/src/core/model-runtime.ts:193-230 · Provider 可热注册和覆盖，失败时退回内建组合
  - 扩展可以接入私有模型甚至替换流协议；某个扩展写坏时，内置模型仍尽量可用。
- pi-retry-001: packages/ai/src/utils/provider-retry.ts:22-66 · 传输重试与会话重试分层，上下文溢出单独处理
  - HTTP 临时故障在网络层重试；整轮失败在会话层重试；没钱和记忆塞满都不会被误当成网络抖动。

## Takeaway
覆盖面很广，也意味着协议行为和 usage/tool schema 回归成本高。
