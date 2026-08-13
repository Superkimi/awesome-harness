# M10 · 证据：Wire 事件、trace id 与匿名遥测

## Hook
评审问“状态和审批能不能追”，我用贯穿 turn 的事件、trace 和遥测开关回答。

## Evidence anchors
- kimi-observe-001: src/kimi_cli/soul/kimisoul.py:1009-1076 · Wire 事件与 trace id 贯穿 turn、step、tool、approval、MCP、compaction
  - 界面看到的不是一行最终文本，而是一条可还原执行过程的事件河流，并能把 API 请求、工具和审批串起来。
- kimi-observe-002: src/kimi_cli/config.py:261-264 · 匿名遥测默认开启但可配置/环境变量关闭，代码禁止传用户内容
  - 默认会上报事件名、耗时、模型/平台等运行指标，但设计规则不允许把提示词、路径和代码塞进事件；用户可以关闭。
- kimi-maturity-001: src/kimi_cli/session.py:84-97 · 会话、子 Agent 与遥测均有损坏/并发防护，许可证为 Apache-2.0
  - 它把“崩一次后还能继续”和“后台任务结束后别留下悬空审批”当成正式设计，而不是只做 happy path。

## Takeaway
适合 IDE/ACP/Wire 客户端和故障分析；不是完整 deterministic replay，外部副作用仍不可重放。
