# M10 · 证据：会话账本、OTEL 和测试密度

## Hook
评审问“运行质量能不能审计”，我用树形事件账本、GenAI spans 和机制测试回答。

## Evidence anchors
- omp-session-001: packages/coding-agent/src/session/session-storage.ts:1-260 · 会话是树形事件账本，存储层可替换
  - 聊天、分支、压缩和配置变化都作为事件保存；存哪里可以从个人本地换到服务端数据库。
- omp-observability-001: packages/agent/src/telemetry.ts:1-24 · 观测层原生实现 OTEL GenAI spans、成本与 run coverage
  - 不仅有终端日志，每次模型和工具调用都能变成标准 trace，还能关联费用和网关调用 ID；敏感内容是否进 trace 可配置。
- omp-tests-001: packages/coding-agent/test/task/isolation-runner.test.ts:1-100 · 机制测试和基准工程极密集，但仍需外部成功率验证
  - 零件级和故障恢复考试数量非常大，也有专门实验 Harness；但仓库内测试多不代表在 SWE-bench 或真实企业任务上一定胜出。

## Takeaway
同一 Harness 可从 CLI 扩到多用户服务，但多后端一致性/锁/迁移成为核心基础设施。
