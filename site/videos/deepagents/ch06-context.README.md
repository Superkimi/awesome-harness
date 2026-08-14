# M06 · 权限：first-match 规则与 execute gate 缺口

- Project: Legacy DeepAgents
- Fixed source commit: 217b9eb372fa51b0439434f31abc3ac22e6cd7f2
- Evidence ledger: data/legacy/evidence/deepagents/evidence.json
- Episode: ch06-context
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - libs/deepagents/deepagents/middleware/filesystem.py:383-430 · FilesystemPermission 是 first-match allow/deny/interrupt 规则
  - libs/deepagents/deepagents/middleware/filesystem.py:1649-1674 · 权限对可执行 backend 的通用 execute gate 明确还没实现
  - libs/code/deepagents_code/agent.py:774-810 · DeepAgents Code 的 shell allow-list 在 execute 前直接返回错误
