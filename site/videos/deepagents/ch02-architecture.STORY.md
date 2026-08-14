# M02 · 架构：middleware 顺序与 profile exclusion

## Hook
架构评审只剩十分钟，我得讲清受保护顺序、排除校验和 BackendProtocol 怎么组合。

## Evidence anchors
- deep-arch-002: libs/deepagents/deepagents/graph.py:361-401 · 核心 middleware 有受保护的顺序和排除校验
  - 顺序不是装饰：先把文件/任务工具放进去，再做压缩和 prompt cache，最后把 memory 与审批接在尾部；核心骨架不能被 profile 随意删掉。
- deep-recommend-001: libs/deepagents/deepagents/backends/protocol.py:378-396 · 最值得借鉴的是 BackendProtocol 与 middleware 的正交组合
  - 同一套 Agent 逻辑可以跑在内存 state、数据库、真实文件夹或远端 sandbox，而不用重写工具。
- deep-backend-001: libs/deepagents/deepagents/backends/protocol.py:378-396 · BackendProtocol 把文件操作和 shell 执行明确拆层
  - 文件工具不再偷偷依赖 shell：没有 shell 的后端也能读写、搜索和编辑；只有明确实现 SandboxBackendProtocol 才会有 execute。

## Takeaway
middleware 系统要有 required classes/names 和 exclusion coverage 检查，避免“配置成功但安全/持久化节点没装上”。
