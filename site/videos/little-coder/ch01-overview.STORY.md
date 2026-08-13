# M01 · 总览：它为什么像一层增强而不是新内核

## Hook
同事把 Little Coder 当成另一套 Agent，我先确认它到底站在谁的肩膀上。

## Evidence anchors
- little-architecture-001: package.json:33-43 · 它是 pi 的 Harness 增强层，而不是另一套 Agent 内核
  - 可以把它理解成给 pi 装了一套“小模型护栏与外挂”，对话循环、会话和基础工具仍由 pi 驱动。
- little-extensions-001: bin/little-coder.mjs:157-217 · 扩展来源分层，默认固定集合，pi 生态桥显式 opt-in
  - 默认追求可预测：装哪些插件是确定的；想接入 pi 大生态可以开开关，但会牺牲冷启动上下文和固定能力面。

## Takeaway
分析和选型时必须把 little-coder 的差异能力与 pi 基座分开计分。
