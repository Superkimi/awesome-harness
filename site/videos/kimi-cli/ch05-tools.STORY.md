# M05 · 工具：动态装配、并发去重和重复调用强停

## Hook
同一工具被重复调用时不能无限烧，我先看 Toolset、共享结果和 3/5/8/12 阶梯提醒。

## Evidence anchors
- kimi-tools-001: src/kimi_cli/soul/agent.py:411-451 · 工具表由 agent spec 动态装配，插件和 MCP 追加进入同一 Toolset
  - 工具箱不是写死在循环里，而是由角色配置装配；本地插件和远程 MCP 最终都变成模型看到的同类工具。
- kimi-tools-002: packages/kosong/src/kosong/__init__.py:134-167 · 同一模型回复里的不同工具并发启动，完全重复调用共享结果
  - 模型一口气开多张不同工单会一起跑；两张完全相同的工单只做一次，第二张拿同一结果。
- kimi-tools-003: src/kimi_cli/soul/toolset.py:116-172 · 跨 step 重复调用按 3/5/8/12 阶梯提醒并强停
  - 不是第一次重复就封杀，而是逐级提醒；连续十二次原地打转才硬踩刹车。

## Takeaway
角色最小权限容易表达；工具名称冲突按先到内建优先。
