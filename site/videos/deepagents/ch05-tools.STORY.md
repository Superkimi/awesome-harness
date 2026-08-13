# M05 · 工具：结构化搜索编辑与 BackendProtocol

## Hook
模型不能直接拼 grep 字符串，我先看结构化 API、StateBackend 和 execute 的边界。

## Evidence anchors
- deep-backend-001: libs/deepagents/deepagents/backends/protocol.py:378-396 · BackendProtocol 把文件操作和 shell 执行明确拆层
  - 文件工具不再偷偷依赖 shell：没有 shell 的后端也能读写、搜索和编辑；只有明确实现 SandboxBackendProtocol 才会有 execute。
- deep-backend-002: libs/deepagents/deepagents/backends/protocol.py:473-530 · 搜索和编辑工具是结构化 API，不是原始 grep/sed 字符串
  - Agent 看到的是可分页、可限量、可解释的文件操作，减少 shell 命令输出不稳定和正则误伤。
- deep-backend-003: libs/deepagents/deepagents/backends/state.py:37-47 · SDK 默认 StateBackend 是会话内临时存储，execute 只对 sandbox backend 出现
  - 纯 SDK 默认不会因为用了 FilesystemMiddleware 就在用户电脑执行 shell；要持久化或执行，调用方必须显式换 backend。

## Takeaway
执行能力应是后端能力 trait，不要让 tool 层默认假设机器上有 bash。
