# M03 · 主循环：三种队列语义不是一个 pending

## Hook
同事说 follow-up、steer、continuation 都一样，我沿 agent loop 拆三种改道方式。

## Evidence anchors
- prime-loop-003: packages/agent/src/agent-loop.ts:317-345 · Steering、follow-up、continuation 是三个不同的队列语义
  - 用户正在打断时是一种消息，用户等 Agent 停下来再追加是另一种消息，系统为了长目标自动继续又是第三种消息，三者不会混成一个 pending 数组。
- prime-tools-001: packages/agent/src/agent-loop.ts:608-623 · 工具调用先预检再执行，支持串行和并行两条路径
  - 多个独立查询可以并发跑，但带副作用的工具能强制串行；模型给错参数时不会直接进 shell，而是先变成错误 tool result。

## Takeaway
长任务产品应给消息定义明确的 admission boundary，才能保证“插话”不会跳过当前工具调用或错误地重放。
