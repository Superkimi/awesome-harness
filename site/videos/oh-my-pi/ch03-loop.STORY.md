# M03 · 主循环：工具执行中也能 steering

## Hook
同事说只能等工具完成再改方向，我沿 steering 和 shared/exclusive 调度看协作中断。

## Evidence anchors
- omp-loop-001: packages/agent/src/agent-loop.ts:999-1048 · steering 不只在轮间排队，还能在工具执行中协作中断
  - 用户插话时，纯等待可以立刻停；正在改文件的工具不会粗暴半路杀死，而是完成到安全边界再让模型听新指令。
- omp-loop-002: packages/agent/src/agent-loop.ts:2067-2200 · 工具调度支持 shared/exclusive 并发和完整 pre-dispatch 改写
  - 先把所有施工单审核、改好并固化，再按“可并行/独占”排程，日志看到的参数就是实际执行参数。

## Takeaway
中断语义按工具类型区分，明显优于统一 AbortController。
