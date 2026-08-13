# M10 · 证据：会话、影子 Git 和显式分享

## Hook
评审问“改坏了能不能回来”，我用 session ledger、shadow Git、revert 和显式 share 回答。

## Evidence anchors
- opencode-observe-001: packages/opencode/src/session/session.ts:120-158 · session 持久化 agent/model/permission/cost/tokens/summary/revert 与 parent
  - 一条任务不只存聊天文本，还存它用了哪个 Agent/模型、花了多少钱、改了哪些文件、能否回退以及是谁的子任务。
- opencode-snapshot-001: packages/opencode/src/session/processor.ts:98-114 · 每个模型 step 前后用影子 Git 仓库生成可回退 patch
  - 每走一步都拍“修改前后”照片，照片存进旁边的 Git 仓库，不污染用户当前分支。
- opencode-share-001: packages/opencode/src/share/share-next.ts:23-72 · Share 是显式远程同步会话、消息、parts、diff 和模型
  - 分享链接不是只上传一张截图，而是持续同步完整任务数据；若开了自动分享，必须按数据出境功能治理。

## Takeaway
为恢复、审计、成本和协作提供统一数据底座。
