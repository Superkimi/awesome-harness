# M03 · 主循环：长任务为什么不轻易失控

## Hook
任务跑到一半开始重复，我沿 watchdog 和 quality monitor 看它怎样自纠又及时停下。

## Evidence anchors
- little-context-001: .pi/extensions/context-watchdog/index.ts:3-29 · 80% 中途压缩 watchdog 补上 pi 的长自主运行缺口
  - 模型若连续几十轮调用工具、不把控制权还给用户，原生 pi 可能迟迟不压缩；这个扩展在每一小轮都看油表，快满了就主动整理上下文再接着做。
- little-quality-001: .pi/extensions/quality-monitor/index.ts:5-18 · 质量监控会 steer 自纠，但最多连续两次
  - 模型答歪时 Harness 会马上插一句纠偏，但不会无限唠叨把自己困进循环。

## Takeaway
长自治任务的上下文治理不能只挂在用户轮边界。
