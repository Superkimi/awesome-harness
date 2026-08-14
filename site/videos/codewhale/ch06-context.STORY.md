# M06 · 长任务：Goal loop 和 cache-stable prefix

## Hook
同事说把 max_steps 调大就行，我先看持久目标、排序 memoization 和有界 LRU。

## Evidence anchors
- codewhale-context-004: crates/tui/src/tools/registry.rs:200-244 · 工具目录用排序、memoization 和有界 LRU 支持 cache-stable prefix
  - HashMap 每次启动的随机顺序不会再把整个 tool schema 变成新前缀；同一工具集合重复检查时只算一次，扩展变化时又能主动失效。
- codewhale-context-005: crates/tui/src/goal_loop.rs:1-23 · Goal loop 是持久目标层，不是把 max_steps 放大
  - 一个用户目标可以跨多个 turn 继续，但达到完成、阻塞、花费上限或十次没有终态时都会停下来。

## Takeaway
要追求 provider cache 命中，catalog 的排序、schema canonicalization、cache invalidation 和扩展生命周期必须绑定设计。
