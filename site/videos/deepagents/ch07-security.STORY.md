# M07 · 执行：local shell、remote sandbox 与 PTC

## Hook
要让 Agent 执行命令，我先看 shell allow-list、sandbox backend 和 all/YOLO 的强能力开关。

## Evidence anchors
- deep-security-003: libs/code/deepagents_code/agent.py:774-810 · DeepAgents Code 的 shell allow-list 在 execute 前直接返回错误
  - 非交互模式下，危险 shell 不是等人点确认，而是根本不执行；并且不能用空列表伪装成限制或用 all 绕过。
- deep-security-004: libs/code/deepagents_code/agent.py:898-937 · PTC all/YOLO 是强能力开关，代码要求显式承认但允许绕过 HITL
  - 用户可以选择极快的自动模式，但这不是默认安全路径；代码要求显式开关并记录 write/shell tools。
- deep-runtime-001: libs/code/deepagents_code/agent.py:2685-2728 · CLI 明确区分 local shell、local filesystem 和 remote sandbox
  - 同一个 CLI 可以跑在本机项目目录，也可以把所有文件/命令交给 Modal 等远端 sandbox；模式是显式分支，不是运行中猜。
- deep-risk-001: libs/code/deepagents_code/agent.py:2706-2728 · local mode 仍是宿主进程，真正隔离取决于 sandbox backend
  - 默认本地开发很方便，但它不是容器边界；不可信 repo 需要在 deploy 层传入真正隔离的 sandbox。

## Takeaway
headless runner 可用 fail-fast allow-list 保持连续 trace，但必须明确它只控制 command name，不是完整 OS sandbox。
