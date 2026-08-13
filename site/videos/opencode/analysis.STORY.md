# OpenCode · 技术分析总览

## Hook
评审问我：这个 Agent 怎么把持久化会话、工具、压缩、子 Agent 和回退都串起来？我不猜，直接按源码证据拆。

## Evidence anchors
- opencode-loop-001: packages/opencode/src/session/prompt.ts:1081-1130 · 主循环由持久化消息状态驱动，而不是一次性的 while(tool_call)
  - 它每一轮都重新看账本决定“接下来做什么”，所以进程中断、工具异步完成和压缩都能落在统一状态机里。
- opencode-stream-001: packages/opencode/src/session/processor.ts:315-413 · stream processor 把 reasoning、text、tool、usage、patch 全部事件化持久
  - 模型的思考、文字、每次工具起止和文件变化都不是终端里一闪而过，而是独立可回放的事件。
- opencode-context-002: packages/opencode/src/session/compaction.ts:28-35 · 压缩保留近期原文尾部，而不是只剩一段摘要
  - 老故事写成摘要，最近几轮尽量保留原话；必要时甚至保留半个超长回合。
- opencode-permission-001: packages/opencode/src/permission/index.ts:28-37 · 权限采用 last-match wildcard 规则，默认 ask 而非默认 allow
  - 越靠后的规则优先；没写明能不能做时先问人。点“始终允许”会记住本次运行，但不是永久改配置。
- opencode-snapshot-001: packages/opencode/src/session/processor.ts:98-114 · 每个模型 step 前后用影子 Git 仓库生成可回退 patch
  - 每走一步都拍“修改前后”照片，照片存进旁边的 Git 仓库，不污染用户当前分支。

## Takeaway
消息/part 是事实源，loop 是其投影；这比仅在内存追加数组更利于恢复和多客户端。
