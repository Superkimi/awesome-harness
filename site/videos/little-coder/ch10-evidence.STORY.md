# M10 · 证据：质量、checkpoint 和输出纠偏

## Hook
评审问“失败能不能回放”，我用 session evidence、checkpoint 和最多两次自纠回答。

## Evidence anchors
- little-evidence-001: .pi/extensions/evidence/index.ts:5-42 · 证据是 session-scoped 结构化对象，并显式跨压缩
  - 引用依据不只躺在长聊天里，而是放到一个小抽屉；聊天被总结后，抽屉还在。
- little-quality-001: .pi/extensions/quality-monitor/index.ts:5-18 · 质量监控会 steer 自纠，但最多连续两次
  - 模型答歪时 Harness 会马上插一句纠偏，但不会无限唠叨把自己困进循环。
- little-checkpoint-001: .pi/extensions/checkpoint/index.ts:6-45 · checkpoint 是 best-effort 文件快照，且存在 path 键兼容缺口
  - 它有安全网，但不是保证能回滚的事务；而且某些正常工具参数形态可能连网都没张开。
- little-output-001: .pi/extensions/output-parser/index.ts:5-20 · 文本化 tool call 只能纠偏，不能由扩展代执行
  - 它能看出模型把工具调用写成了普通文字，但没法替模型按下执行键，只能让模型重发，或要求修服务器模板。

## Takeaway
可寻址的结构化证据比让模型从摘要里回忆来源可靠，但进程退出后不持久。
