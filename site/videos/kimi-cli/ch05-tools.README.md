# M05 · 工具：动态装配、并发去重和重复调用强停

- Project: Legacy Kimi CLI
- Fixed source commit: cbc15c076d17f70fec9f89c90c0502e68657f505
- Evidence ledger: data/legacy/evidence/kimi-cli/evidence.json
- Episode: ch05-tools
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - src/kimi_cli/soul/agent.py:411-451 · 工具表由 agent spec 动态装配，插件和 MCP 追加进入同一 Toolset
  - packages/kosong/src/kosong/__init__.py:134-167 · 同一模型回复里的不同工具并发启动，完全重复调用共享结果
  - src/kimi_cli/soul/toolset.py:116-172 · 跨 step 重复调用按 3/5/8/12 阶梯提醒并强停
