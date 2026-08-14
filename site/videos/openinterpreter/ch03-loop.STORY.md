# M03 · 主循环：一次 turn 里为什么有多个 step

## Hook
模型一边读文件一边改文件，我沿 turn 和 step 快照看它如何共享同一个世界。

## Evidence anchors
- oi-loop-001: codex-rs/core/src/session/turn.rs:140-228 · 共享内核仍是 turn 内多 step 的流式工具循环
  - 一次用户请求会反复经历“取固定快照—问模型—跑工具—把结果放回去”，直到模型真正收尾。
- oi-loop-002: codex-rs/core/src/session/turn.rs:243-292 · step 快照让上下文、工具清单与工具执行看到同一世界
  - 模型看到的工具说明和真正执行工具时的权限/目录不会在同一步里偷偷漂移。

## Takeaway
Harness 仿真共享同一个成熟执行底盘，不需要每种 Harness 重写 agent loop。
