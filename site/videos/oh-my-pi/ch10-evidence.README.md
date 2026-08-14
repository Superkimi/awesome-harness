# M10 · 证据：会话账本、OTEL 和测试密度

- Project: Legacy Oh My Pi
- Fixed source commit: a53e4e790d3939a08708bf0d3c912d0763237a2d
- Evidence ledger: data/legacy/evidence/oh-my-pi/evidence.json
- Episode: ch10-evidence
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - packages/coding-agent/src/session/session-storage.ts:1-260 · 会话是树形事件账本，存储层可替换
  - packages/agent/src/telemetry.ts:1-24 · 观测层原生实现 OTEL GenAI spans、成本与 run coverage
  - packages/coding-agent/test/task/isolation-runner.test.ts:1-100 · 机制测试和基准工程极密集，但仍需外部成功率验证
