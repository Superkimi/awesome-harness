# M04 · 模型与消息：统一 Provider 如何接住不同模型

## Hook
客户临时换模型，业务流程不能跟着重写；我先看 LiteLLM 适配层怎样托住差异。

## Evidence anchors
- aider-provider-001: aider/models.py:985-1037 · LiteLLM 是统一 Provider 适配层
  - Aider 把各家模型 API 的差异交给 LiteLLM，自己的核心只面对一套近似 OpenAI 的消息格式。

## Takeaway
接模型很快，但 Provider 行为、重试和能力元数据也部分受 LiteLLM 语义约束。
