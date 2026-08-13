# M05 · 工具：预检、hook 与并行路径

## Hook
模型要并行读文件，我先看 before/after hook、预检和串并行两条执行路径。

## Evidence anchors
- prime-tools-001: packages/agent/src/agent-loop.ts:608-623 · 工具调用先预检再执行，支持串行和并行两条路径
  - 多个独立查询可以并发跑，但带副作用的工具能强制串行；模型给错参数时不会直接进 shell，而是先变成错误 tool result。
- prime-tools-002: packages/agent/src/agent-loop.ts:795-848 · before/after tool hook 是可编程的策略门
  - 审批、审计、脱敏、工具白名单和“这个结果是否要终止 Agent”都可以在一个统一钩子里实现，而且 block 发生在真正执行前。

## Takeaway
工具调度应把“可并行性”和“参数校验”写进 ToolDefinition，而不是让模型提示词决定。
