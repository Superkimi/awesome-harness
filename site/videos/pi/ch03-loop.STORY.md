# M03 · 主循环：steering、工具和 follow-up 两层推进

## Hook
同事说只能等工具完成再改方向，我沿低层 loop 看 steering 和 follow-up 如何分工。

## Evidence anchors
- pi-loop-001: packages/agent/src/agent-loop.ts:155-275 · 低层循环把 steering、工具执行和 follow-up 分成内外两层
  - 用户中途插话会先纠偏当前工作，排队的新任务则等当前回合稳定后再接着做。
- pi-loop-002: packages/agent/src/agent-loop.ts:208-245 · 截断响应禁止执行工具；每回合可热刷新完整运行状态
  - 模型半句话里拼出的命令不会贸然执行；同时下一轮可以换模型、换工具或换说明书。

## Takeaway
交互打断与自治续跑共享同一 loop，而不是 UI 另开旁路。
