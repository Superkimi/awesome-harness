# M05 · 工具：串行默认与 batch 并发上限

- Project: Legacy JCode
- Fixed source commit: 71fa60c4dc875ebdaf089e6e84b29cbd61cbb478f
- Evidence ledger: data/legacy/evidence/jcode/evidence.json
- Episode: ch05-tools
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - crates/jcode-tool-core/src/lib.rs:9-65 · 工具是 typed registry，定义顺序与 intent 字段集中标准化
  - crates/jcode-app-core/src/agent/turn_loops.rs:878-917 · 普通模型工具调用串行，显式 batch 最多并发十个
  - crates/jcode-app-core/src/tool/mod.rs:627-678 · 工具输出有双预算闸门，前台命令超时可升级后台
