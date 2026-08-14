# M09 · 协作：从轻量 swarm 到持久 DAG

- Project: Legacy JCode
- Fixed source commit: 71fa60c4dc875ebdaf089e6e84b29cbd61cbb478f
- Evidence ledger: data/legacy/evidence/jcode/evidence.json
- Episode: ch09-collaboration
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - crates/jcode-app-core/src/server/swarm.rs:1528-1613 · 轻量 swarm 先让协调者规划 2–4 个任务，再并发 fork Provider
  - crates/jcode-base/src/prompt.rs:75-91 · deep swarm 把协作升级成可增长 DAG、强制 artifact 与审计 gate
  - crates/jcode-swarm-core/src/lib.rs:213-253 · Swarm 有持久成员树、频道、heartbeat 和死亡任务回收
