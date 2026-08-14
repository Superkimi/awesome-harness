# M02 · 架构：Controller 如何管理并发 turn

## Hook
架构评审只剩十分钟，我得讲清旋转、收尾、自动保存和并发状态机怎么接起来。

## Evidence anchors
- reasonix-arch-003: internal/control/controller.go:60-76 · Controller 对并发 turn、旋转、收尾和自动保存有明确状态机
  - 用户连按几次发送不会把同一个会话撕成两半：新消息要么排队，要么明确被拒；切换会话时也不会恰好换掉正在用的那份上下文。
- reasonix-persist-001: internal/agent/save.go:26-74 · 会话持久化是带 revision/CAS 的 append-only event log
  - 两个进程同时写同一会话时，旧进程不能把新内容抹掉；坏掉的 JSONL 尾巴先修，冲突会留下可恢复分支。

## Takeaway
桌面/HTTP 多入口必须把“正在运行、等待审批、后台任务、收尾”分开建模，不能只暴露一个 running 布尔值。
