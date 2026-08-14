# M01 · 总览：Boot 是唯一装配根

## Hook
老板让我交付一条长任务，我先确认所有前端为什么都从同一个 Boot 和 Harness 进来。

## Evidence anchors
- reasonix-arch-001: internal/boot/boot.go:1-8 · Boot 是唯一装配根，所有前端共享同一套 Harness
  - 终端、桌面和服务端不是各写一套 Agent，而是都插到同一个“总电闸”上，所以权限、工具和生命周期不会因为换界面而变一套。
- reasonix-arch-002: internal/agent/agent.go:33-62 · 主循环以模型自然结束为主，额外叠加多种止损护栏
  - 它允许长任务一直做，但每个工具输出和“最后确认”都有保险丝；只要交付模式缺验收或验证，主机就不会让它假装完成。

## Takeaway
自研时应把 frontend 变成事件消费者，避免在 UI 层重复实现 turn、审批和恢复。
