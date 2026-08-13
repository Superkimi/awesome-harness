1. 同事说把 max_steps 调大就行，我先看持久目标、排序 memoization 和有界 LRU。
2. 这一章不猜作者意图，只沿固定版本的运行时代码、契约和测试看事实。
3. 固定版本证据：crates/tui/src/tools/registry.rs:200-244 · 工具目录用排序、memoization 和有界 LRU 支持 cache-stable prefix；crates/tui/src/goal_loop.rs:1-23 · Goal loop 是持久目标层，不是把 max_steps 放大。
4. 事实一：HashMap 每次启动的随机顺序不会再把整个 tool schema 变成新前缀；同一工具集合重复检查时只算一次，扩展变化时又能主动失效。
5. 源码含义：要追求 provider cache 命中，catalog 的排序、schema canonicalization、cache invalidation 和扩展生命周期必须绑定设计。
6. 事实二：一个用户目标可以跨多个 turn 继续，但达到完成、阻塞、花费上限或十次没有终态时都会停下来。
7. 数据流：Core/EngineConfig → turn freeze → ToolSpec/MCP → policy/sandbox → session/checkpoint/receipt。
8. 小白动作：先把任务拆成能力、预算、审批、执行和证据五格。
9. 第二个动作：为并行、心跳、取消、恢复和用量归属各留一个明确状态。
10. 局限提醒：immutable prefix、tool catalog LRU、goal continuation 与压缩后继任者 brief。
11. 这一章的结论：要追求 provider cache 命中，catalog 的排序、schema canonicalization、cache invalidation 和扩展生命周期必须绑定设计。
12. 下一章继续沿固定提交的源码锚点，回答一个真实工作问题。

Fixed commit: cfc2f2b13c070e900ee10dbeffb07028d3beaebd
