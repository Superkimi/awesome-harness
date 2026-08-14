# M06 · 上下文：压缩前先裁剪，失败还能 replay

## Hook
大仓库快超窗，我先看 overflow、近期原文、媒体剥离和工具输出 prune。

## Evidence anchors
- opencode-context-001: packages/opencode/src/session/overflow.ts:8-33 · overflow 阈值为可用输入窗口，而非模型总窗口
  - 它会先给模型回答预留座位，再判断历史是否坐满，避免输入刚好塞满后没有空间输出。
- opencode-context-002: packages/opencode/src/session/compaction.ts:28-35 · 压缩保留近期原文尾部，而不是只剩一段摘要
  - 老故事写成摘要，最近几轮尽量保留原话；必要时甚至保留半个超长回合。
- opencode-context-003: packages/opencode/src/session/compaction.ts:289-354 · 摘要前先去媒体、限制工具输出，失败时可 replay 原请求
  - 整理书桌前先把大图片和长日志搬走；如果一张附件让请求根本进不了门，就去掉附件后把原问题再问一次。
- opencode-context-004: packages/opencode/src/tool/truncate.ts:13-44 · 工具输出先独立裁剪，旧输出还能在后台 prune
  - 长日志不会直接淹没聊天：模型看摘要，全文留在旁边可查；更老的工具输出再逐步从上下文退场。

## Takeaway
比简单按 context×百分比更贴合各 provider 的 input/output 限制。
