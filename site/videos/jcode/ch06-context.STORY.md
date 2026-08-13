# M06 · 上下文：压缩只移动游标，不复制历史

## Hook
长任务快超窗，我先看静态前缀、动态尾部、三种策略和独立 memory agent。

## Evidence anchors
- jcode-context-001: crates/jcode-base/src/prompt.rs:451-557 · 静态前缀与每轮动态上下文分离，memory 放尾部保缓存
  - 不常变的说明书放书脊，记忆和本轮提醒贴在最后一页；这样改便签不会让整本书的缓存失效。
- jcode-context-002: crates/jcode-base/src/compaction.rs:128-205 · 压缩器不复制历史，只记录被摘要的前缀游标
  - 原始账本仍归 Session 管，压缩器只记“前 N 条已折叠成摘要”，不会偷偷维护第二份容易漂移的历史。
- jcode-context-003: crates/jcode-base/src/compaction.rs:456-543 · 压缩支持 reactive、趋势预测和语义换题三种策略
  - 可以等箱子快满再整理，也可以看增长速度提前整理，还可以在话题换挡时整理；但都会先检查“现在整理是否值得”。
- jcode-context-004: crates/jcode-app-core/src/agent/compaction.rs:90-182 · 上下文溢出与请求体过大走不同紧急恢复路径
  - “字太多”“图片字节太大”“服务端压缩包本身太大”不是同一种病，分别治疗。
- jcode-memory-001: crates/jcode-base/src/memory_agent.rs:1-45 · 跨会话 memory 是独立后台 Agent，不阻塞主 turn
  - 主 Agent 回答时，旁边有个只管记忆的小秘书；它来不及的结果不会卡住当前回答，而是下一轮再递纸条。

## Takeaway
明显以 prompt-cache economics 为一等设计目标。
