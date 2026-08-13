1. 客户临时换模型，我先看 provider 系统提示、usage 变换和 token refresh 如何放进边界。
2. 这一章不猜作者意图，只沿固定版本的运行时代码、契约和测试看事实。
3. 固定版本证据：packages/agent/src/types.ts:170-183 · 运行时支持 provider 动态系统提示和过期 token 刷新；packages/agent/src/agent-loop.ts:467-521 · Provider 边界前才做上下文变换和密钥解析。
4. 事实一：长时间工具执行后，下一次模型调用仍能拿到最新授权和最新资源说明。
5. 源码含义：多 provider harness 应把 credential refresh 和 system prompt resolution 做成 request-time hook，而不是启动时静态读取。
6. 事实二：上下文不会在会话开始时被一次性拍扁，长任务中每次请求都可以重新裁剪、换系统提示和刷新短期 token。
7. 数据流：纯 loop → coding host → resources/extensions → RLM/daemon → JSONL events 和恢复。
8. 小白动作：先把任务拆成 loop、工具、上下文、协作和持久化五格。
9. 第二个动作：为每个后台任务记录 admission、heartbeat、lease 和完成释放，避免幽灵进程。
10. 局限提醒：上下文转换紧贴 provider call，支持动态 key、流式事件与 abort。
11. 这一章的结论：多 provider harness 应把 credential refresh 和 system prompt resolution 做成 request-time hook，而不是启动时静态读取。
12. 下一章继续沿固定提交的源码锚点，回答一个真实工作问题。

Fixed commit: 7787f07415d843b9a800f6a4720e0c739bd608e5
