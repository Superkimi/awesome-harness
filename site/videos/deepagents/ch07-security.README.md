# M07 · 执行：local shell、remote sandbox 与 PTC

- Project: Legacy DeepAgents
- Fixed source commit: 217b9eb372fa51b0439434f31abc3ac22e6cd7f2
- Evidence ledger: data/legacy/evidence/deepagents/evidence.json
- Episode: ch07-security
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - libs/code/deepagents_code/agent.py:774-810 · DeepAgents Code 的 shell allow-list 在 execute 前直接返回错误
  - libs/code/deepagents_code/agent.py:898-937 · PTC all/YOLO 是强能力开关，代码要求显式承认但允许绕过 HITL
  - libs/code/deepagents_code/agent.py:2685-2728 · CLI 明确区分 local shell、local filesystem 和 remote sandbox
  - libs/code/deepagents_code/agent.py:2706-2728 · local mode 仍是宿主进程，真正隔离取决于 sandbox backend
