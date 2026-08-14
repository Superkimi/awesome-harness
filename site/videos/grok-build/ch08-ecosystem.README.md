# M08 · 沙箱：真正隔离与降级边界

- Project: Legacy Grok Build
- Fixed source commit: e5fd4816d43260c15ba785f103990c1ed6cea230
- Evidence ledger: data/legacy/evidence/grok-build/evidence.json
- Episode: ch08-ecosystem
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - crates/codegen/xai-grok-sandbox/src/lib.rs:8-18 · 提供真正的内核级文件系统沙箱
  - crates/codegen/xai-grok-sandbox/src/lib.rs:107-129 · 沙箱不支持或应用失败时会降级继续
  - crates/codegen/xai-grok-sandbox/src/lib.rs:8-18 · 子进程网络隔离与主进程网络分离
  - crates/codegen/xai-grok-sandbox/src/profiles.rs:113-167 · 项目不能覆写同名全局安全 Profile
