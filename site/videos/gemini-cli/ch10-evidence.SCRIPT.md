1. 评审问“失败能不能回放”，我用 chat recording、rewind、metadata patch 和 OTel 输出回答。
2. 这一章不猜作者意图，只沿固定版本的运行时代码、协议和测试看事实。
3. 固定版本证据：packages/core/src/services/chatRecordingService.ts:150-203 · 会话记录是增量 JSONL，支持 rewind、metadata patch 和完整 checkpoint；packages/core/src/telemetry/sdk.ts:240-318 · OpenTelemetry 可导出到 GCP、OTLP HTTP/gRPC、文件或控制台；LICENSE:1-28 · 大型 TypeScript monorepo，测试面广，Apache-2.0。
4. 事实一：对话文件像事件日志：可以写“回到某一步”、只改元数据，也能偶尔写一张完整快照；一行坏了不拖垮整份会话。
5. 源码含义：支持 resume/rewind 与格式迁移，需持续测试 checkpoint 和增量事件的一致性。
6. 事实二：既能接企业观测平台，也能只落本地文件；模型调用之外还能看到进程内存和事件循环卡顿。
7. 数据流：用户消息 → sendMessageStream → Context/Policy → Scheduler/AgentProtocol → JSONL checkpoint。
8. 小白动作：先把长任务拆成循环、上下文、策略、工具和回放五格。
9. 第二个动作：为超限、取消、拒绝和重试分别写终态，不要只看“执行成功”。
10. 局限提醒：增量 JSONL、rewind/checkpoint、OTEL/GCP/file/console、规模与许可证。
11. 这一章的结论：支持 resume/rewind 与格式迁移，需持续测试 checkpoint 和增量事件的一致性。
12. 下一章继续沿固定提交的源码锚点，回答一个真实工作问题。

Fixed commit: 1ac3377395868295e128b96726d605a900b5946b
