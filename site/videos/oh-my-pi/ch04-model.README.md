# M04 · 方言与 Provider：不只是原生 tool calling

- Project: Legacy Oh My Pi
- Fixed source commit: a53e4e790d3939a08708bf0d3c912d0763237a2d
- Evidence ledger: data/legacy/evidence/oh-my-pi/evidence.json
- Episode: ch04-model
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - packages/agent/src/agent-loop.ts:26-45 · 原生 tool calling 之外还有多种 in-band 方言和 Harmony 泄漏修复
  - packages/catalog/src/provider-models/descriptors.ts:1-66 · 模型目录和协议实现分离，Provider 覆盖极广
  - packages/ai/src/providers/register-builtins.ts:181-230 · 流式请求有首事件与空闲双 watchdog，并识别本地工具忙碌
