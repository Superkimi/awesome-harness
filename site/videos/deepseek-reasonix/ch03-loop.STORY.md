# M03 · 主循环：自然结束之外还有止损护栏

## Hook
同事说模型停下来就算完成，我沿 Controller 和 Agent 看取消、轮次和恢复边界。

## Evidence anchors
- reasonix-arch-002: internal/agent/agent.go:33-62 · 主循环以模型自然结束为主，额外叠加多种止损护栏
  - 它允许长任务一直做，但每个工具输出和“最后确认”都有保险丝；只要交付模式缺验收或验证，主机就不会让它假装完成。
- reasonix-arch-003: internal/control/controller.go:60-76 · Controller 对并发 turn、旋转、收尾和自动保存有明确状态机
  - 用户连按几次发送不会把同一个会话撕成两半：新消息要么排队，要么明确被拒；切换会话时也不会恰好换掉正在用的那份上下文。

## Takeaway
“无限循环”与“无限输出”被拆开治理；建设时要同时设计自然终止、重复调用 guard、输出预算和交付完成判定。
