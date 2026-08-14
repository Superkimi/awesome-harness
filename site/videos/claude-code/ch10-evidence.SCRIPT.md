1. 评审问“复原实现能不能放心采用”，我用 append-only 会话、OTEL 和许可边界回答。
2. 这一章不猜官方意图，只沿固定版本的复原代码、协议和测试看事实。
3. 固定版本证据：src/utils/sessionStorage.ts:130-168 · 会话是 append-only JSONL 树，而不是简单聊天数组；src/utils/telemetry/instrumentation.ts:1-71 · 开源复原代码中仍有可用 OTEL/Perfetto/Langfuse，但内部 analytics 不可等同；src/services/compact/__tests__/snipCompact.test.ts:1-80 · 测试很多，但复原完整度和许可边界仍是采用门槛。
4. 事实一：日志更像带分叉的版本树：可以从某个节点继续、压缩或恢复文件快照，不只是从头到尾的一串气泡。
5. 源码含义：可恢复性很强，但 parentUuid 一致性是核心不变量，代码中大量修复逻辑也说明这里是高风险复杂区。
6. 事实二：标准观测管道是真代码，可以接企业采集；原厂内部埋点名字很多，但这个仓库里的后端并不完整。
7. 数据流：用户消息 → query/Provider → 工具与权限 → compaction/Agent → JSONL 会话与可回退结果。
8. 小白动作：先确认实现来源和许可边界，再用一个小任务验证循环、工具、权限、恢复四件事。
9. 第二个动作：失败时分别记录 provider、context、permission 和 sandbox，不要把所有错误归成“模型不行”。
10. 局限提醒：审计 JSONL parentUuid 链、sidechain、file snapshots、OTEL、Perfetto、Langfuse 与 stub analytics 边界。
11. 这一章的结论：可恢复性很强，但 parentUuid 一致性是核心不变量，代码中大量修复逻辑也说明这里是高风险复杂区。
12. 下一章继续沿固定提交的源码锚点，回答一个真实工作问题。

Fixed commit: 3bb6b5746238c418138eb96d57765d79012edd96
