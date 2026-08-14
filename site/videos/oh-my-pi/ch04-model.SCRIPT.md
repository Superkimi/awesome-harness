1. 客户换了模型协议，我先看 in-band 方言、Harmony 修复和 Provider 目录如何分离。
2. 这一章不猜作者意图，只沿固定版本的运行时代码、契约和测试看事实。
3. 固定版本证据：packages/agent/src/agent-loop.ts:26-45 · 原生 tool calling 之外还有多种 in-band 方言和 Harmony 泄漏修复；packages/catalog/src/provider-models/descriptors.ts:1-66 · 模型目录和协议实现分离，Provider 覆盖极广；packages/ai/src/providers/register-builtins.ts:181-230 · 流式请求有首事件与空闲双 watchdog，并识别本地工具忙碌。
4. 事实一：一些本地模型不会说标准函数调用，它会把工具协议写进文本再解析；对模型意外吐出的内部协议也有专门清洗和恢复。
5. 源码含义：小模型/非标准模型兼容面很广，但解析器是额外攻击面和回归矩阵。
6. 事实二：模型“有哪些”由目录管理，模型“怎么说话”由协议驱动管理，两者不是一张巨型 if/else。
7. 数据流：用户消息 → Agent loop/Session → Provider/工具 → compaction/Task → 账本与观测。
8. 小白动作：先把长任务拆成主循环、上下文、工具、协作和观测五格。
9. 第二个动作：为并发、预算、审批和恢复都写一个可见的终态，不要只看“运行中”。
10. 局限提醒：已审计 provider catalog、多协议 stream、in-band dialect 与 watchdog。
11. 这一章的结论：小模型/非标准模型兼容面很广，但解析器是额外攻击面和回归矩阵。
12. 下一章继续沿固定提交的源码锚点，回答一个真实工作问题。

Fixed commit: a53e4e790d3939a08708bf0d3c912d0763237a2d
