# M06 · 读取：超大结果怎样在进模型前变短

## Hook
一个 Read 返回几千行，长上下文马上被吃光；我看 read guard 怎样先缩成 30 行。

## Evidence anchors
- little-context-002: .pi/extensions/read-guard/index.ts:4-27 · 超大 Read 结果在进入 LLM 前缩成 30 行
  - 文件虽然已经从磁盘读了，但在送给模型前会截流，避免一份两千行源码把小模型的记忆一次塞爆。

## Takeaway
工具输出也是上下文预算的一等公民，不能只压聊天历史。
