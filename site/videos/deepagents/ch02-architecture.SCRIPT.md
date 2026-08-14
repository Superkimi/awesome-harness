1. 架构评审只剩十分钟，我得讲清受保护顺序、排除校验和 BackendProtocol 怎么组合。
2. 这一章不猜作者意图，只沿固定版本的运行时代码、契约和测试看事实。
3. 固定版本证据：libs/deepagents/deepagents/graph.py:361-401 · 核心 middleware 有受保护的顺序和排除校验；libs/deepagents/deepagents/backends/protocol.py:378-396 · 最值得借鉴的是 BackendProtocol 与 middleware 的正交组合；libs/deepagents/deepagents/backends/protocol.py:378-396 · BackendProtocol 把文件操作和 shell 执行明确拆层。
4. 事实一：顺序不是装饰：先把文件/任务工具放进去，再做压缩和 prompt cache，最后把 memory 与审批接在尾部；核心骨架不能被 profile 随意删掉。
5. 源码含义：middleware 系统要有 required classes/names 和 exclusion coverage 检查，避免“配置成功但安全/持久化节点没装上”。
6. 事实二：同一套 Agent 逻辑可以跑在内存 state、数据库、真实文件夹或远端 sandbox，而不用重写工具。
7. 数据流：create_deep_agent → middleware graph → backend/tools → policy/sandbox → checkpoint/session/grader。
8. 小白动作：先把任务拆成 middleware、backend、工具、权限和观测五格。
9. 第二个动作：为子 Agent、MCP、shell 和插件分别记录 trust、allowlist、sandbox 和恢复边界。
10. 局限提醒：Skills、Filesystem、SubAgent、Summarization、Patch、Memory、HITL 以受保护顺序装配。
11. 这一章的结论：middleware 系统要有 required classes/names 和 exclusion coverage 检查，避免“配置成功但安全/持久化节点没装上”。
12. 下一章继续沿固定提交的源码锚点，回答一个真实工作问题。

Fixed commit: 217b9eb372fa51b0439434f31abc3ac22e6cd7f2
