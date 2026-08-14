# M04 · 方言与 Provider：不只是原生 tool calling

## Hook
客户换了模型协议，我先看 in-band 方言、Harmony 修复和 Provider 目录如何分离。

## Evidence anchors
- omp-dialect-001: packages/agent/src/agent-loop.ts:26-45 · 原生 tool calling 之外还有多种 in-band 方言和 Harmony 泄漏修复
  - 一些本地模型不会说标准函数调用，它会把工具协议写进文本再解析；对模型意外吐出的内部协议也有专门清洗和恢复。
- omp-provider-001: packages/catalog/src/provider-models/descriptors.ts:1-66 · 模型目录和协议实现分离，Provider 覆盖极广
  - 模型“有哪些”由目录管理，模型“怎么说话”由协议驱动管理，两者不是一张巨型 if/else。
- omp-provider-002: packages/ai/src/providers/register-builtins.ts:181-230 · 流式请求有首事件与空闲双 watchdog，并识别本地工具忙碌
  - 模型一直没开口和说到一半卡死是两种超时；如果它其实在调用本地工具，不会被错杀。

## Takeaway
小模型/非标准模型兼容面很广，但解析器是额外攻击面和回归矩阵。
