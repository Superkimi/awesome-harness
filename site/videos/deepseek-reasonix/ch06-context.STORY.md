# M06 · 上下文：0.5 到 0.9 的多级压缩管道

## Hook
长任务快超窗，我先看多级阈值、最近尾部、归档旧历史和下一 session 的指令延迟。

## Evidence anchors
- reasonix-context-001: internal/agent/compact.go:19-36 · 上下文维护是 0.5/0.6/0.8/0.9 多级管道
  - 它不会一到 50% 就重写整段历史：先提醒、再剪掉过期工具输出，真的快满才摘要；窗口太小导致反复压缩时会熔断而不是死循环。
- reasonix-context-002: internal/agent/compact.go:49-80 · 摘要保留用户事实、最近尾部并归档完整旧历史
  - 压缩不是把聊天变成一句“继续工作”：它把用户硬约束、做过的命令、错误和下一步分栏记录，原始旧消息还留在 archive 里。
- reasonix-context-003: internal/memory/memory.go:12-53 · 项目指令与记忆在启动时组成稳定 system prefix，编辑延迟到下一 session
  - REASONIX/AGENTS/全局记忆像开机时装进机器的说明书；本轮改说明书不会偷偷改掉正在复用的缓存前缀，下一次 session 才完全换新。

## Takeaway
Context pipeline 应把成本、缓存稳定性、信息损失和熔断作为不同阈值测试，而不是单一 max-token 截断。
