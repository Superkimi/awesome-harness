# M10 · 证据：会话、影子 Git 和显式分享

- Project: Legacy OpenCode
- Fixed source commit: cc4b45612974f735ddec46009ede07729511fba4
- Evidence ledger: data/legacy/evidence/opencode/evidence.json
- Episode: ch10-evidence
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - packages/opencode/src/session/session.ts:120-158 · session 持久化 agent/model/permission/cost/tokens/summary/revert 与 parent
  - packages/opencode/src/session/processor.ts:98-114 · 每个模型 step 前后用影子 Git 仓库生成可回退 patch
  - packages/opencode/src/share/share-next.ts:23-72 · Share 是显式远程同步会话、消息、parts、diff 和模型
