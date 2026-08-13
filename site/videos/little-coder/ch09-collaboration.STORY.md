# M09 · 研究：Deep Research 如何复用生产管线

## Hook
客户要一份有证据的调研，我先看多波次研究怎样复用同一条生产 pipeline。

## Evidence anchors
- little-research-001: .pi/extensions/deep-research/pipeline.ts:1-11 · Deep Research 用生产同一 pipeline 做多波次研究
  - 它像一个小型研究团队：先定题、分工、第一轮搜集，再专门找遗漏补第二轮；评测调用的也是同一套生产函数。
- little-evidence-001: .pi/extensions/evidence/index.ts:5-42 · 证据是 session-scoped 结构化对象，并显式跨压缩
  - 引用依据不只躺在长聊天里，而是放到一个小抽屉；聊天被总结后，抽屉还在。

## Takeaway
工作流可测性较好，但多子进程对本地推理延迟很敏感。
