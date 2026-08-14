# M09 · 协作：角色白名单与可恢复子 Agent

- Project: Legacy Kimi CLI
- Fixed source commit: cbc15c076d17f70fec9f89c90c0502e68657f505
- Evidence ledger: data/legacy/evidence/kimi-cli/evidence.json
- Episode: ch09-collaboration
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - src/kimi_cli/soul/agent.py:411-431 · 内建 coder/explore/plan 用代码级工具白名单切分角色
  - src/kimi_cli/tools/agent/__init__.py:17-60 · 子 Agent 是可恢复的持久实例，可前台或后台运行
  - src/kimi_cli/soul/agent.py:339-369 · 子 Agent 共享审批/任务/通知底座，但拥有独立 soul/context/模型
