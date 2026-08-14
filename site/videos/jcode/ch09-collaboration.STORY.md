# M09 · 协作：从轻量 swarm 到持久 DAG

## Hook
研究要并发、产物还要可审计；我沿 coordinator、artifact gate、heartbeat 和死亡任务回收看两种 swarm。

## Evidence anchors
- jcode-collab-001: crates/jcode-app-core/src/server/swarm.rs:1528-1613 · 轻量 swarm 先让协调者规划 2–4 个任务，再并发 fork Provider
  - 先拆成几张独立工单，让多个复制了同一模型线路的工人同时做，最后由原会话汇总。
- jcode-collab-002: crates/jcode-base/src/prompt.rs:75-91 · deep swarm 把协作升级成可增长 DAG、强制 artifact 与审计 gate
  - 不是“多叫几个人聊天”，而是把任务画成图：每个节点要交证据包，审计员可以发现缺口后现场加新节点，图没验完就不能宣布完成。
- jcode-collab-003: crates/jcode-swarm-core/src/lib.rs:213-253 · Swarm 有持久成员树、频道、heartbeat 和死亡任务回收
  - 每个工人有户口、上级、频道和心跳；工人挂了，手里的活不会静默卡死，会有限次数重新派发，反复致命才明确失败。

## Takeaway
简单易用；worker 共享 registry 与工作目录，文件级冲突仍需任务切分和外部 git/worktree 纪律。
