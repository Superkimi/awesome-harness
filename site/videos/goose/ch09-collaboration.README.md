# M09 · 协作：子 Agent 不是提示词里的角色扮演

- Project: Legacy Goose
- Fixed source commit: 11deb564d09db782a17878af7cfafd299d9fa461
- Evidence ledger: data/legacy/evidence/goose/evidence.json
- Episode: ch09-collaboration
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - crates/goose/src/agents/subagent_handler.rs:121-230 · 子 Agent 是独立 Agent 与子会话，不是主提示词里的角色扮演
