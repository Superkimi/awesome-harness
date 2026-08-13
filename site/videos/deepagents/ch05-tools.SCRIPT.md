1. 模型不能直接拼 grep 字符串，我先看结构化 API、StateBackend 和 execute 的边界。
2. 这一章不猜作者意图，只沿固定版本的运行时代码、契约和测试看事实。
3. 固定版本证据：libs/deepagents/deepagents/backends/protocol.py:378-396 · BackendProtocol 把文件操作和 shell 执行明确拆层；libs/deepagents/deepagents/backends/protocol.py:473-530 · 搜索和编辑工具是结构化 API，不是原始 grep/sed 字符串；libs/deepagents/deepagents/backends/state.py:37-47 · SDK 默认 StateBackend 是会话内临时存储，execute 只对 sandbox backend 出现。
4. 事实一：文件工具不再偷偷依赖 shell：没有 shell 的后端也能读写、搜索和编辑；只有明确实现 SandboxBackendProtocol 才会有 execute。
5. 源码含义：执行能力应是后端能力 trait，不要让 tool 层默认假设机器上有 bash。
6. 事实二：Agent 看到的是可分页、可限量、可解释的文件操作，减少 shell 命令输出不稳定和正则误伤。
7. 数据流：create_deep_agent → middleware graph → backend/tools → policy/sandbox → checkpoint/session/grader。
8. 小白动作：先把任务拆成 middleware、backend、工具、权限和观测五格。
9. 第二个动作：为子 Agent、MCP、shell 和插件分别记录 trust、allowlist、sandbox 和恢复边界。
10. 局限提醒：BackendProtocol 统一 file API，SandboxBackendProtocol 才添加 execute；State/Store 可无 shell。
11. 这一章的结论：执行能力应是后端能力 trait，不要让 tool 层默认假设机器上有 bash。
12. 下一章继续沿固定提交的源码锚点，回答一个真实工作问题。

Fixed commit: 217b9eb372fa51b0439434f31abc3ac22e6cd7f2
