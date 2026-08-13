# M03 · 生命周期：任务为什么会卡在 processing

## Hook
任务创建失败后页面还在转圈，我沿 Taskflow hook 查它如何记录失败又可能吞掉错误。

## Evidence anchors
- monkey-lifecycle-002: backend/pkg/lifecycle/taskhook.go:104-123 · Taskflow Create 失败被记录但吞掉，任务可能滞留 processing
  - 工单已经盖了“处理中”，但真正开工失败后只记了一条日志，状态机可能还以为工作在继续。

## Takeaway
应把 Create 错误返回给生命周期管理器，并为 processing-without-session 增加 watchdog。
