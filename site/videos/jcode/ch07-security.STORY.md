# M07 · 安全：双层 gate 与危险命令拒绝

## Hook
同事说工具允许就能跑，我把 session gate、pre_tool gate、Bash destructive gate 和宿主执行边界拆开。

## Evidence anchors
- jcode-security-001: crates/jcode-app-core/src/tool/mod.rs:543-601 · 工具边界由 session allow/disable 与外部 pre_tool gate 双层控制
  - 先看这把工具是否在本会话工具箱里，再给企业自定义门卫一次否决机会；门卫自己坏了时默认放行。
- jcode-security-002: crates/jcode-app-core/src/tool/bash_destructive_gate.rs:1-39 · Bash 有确定性危险命令 gate，灾难目标直接拒绝
  - 不是让模型自己判断 rm 是否危险：命令先过代码规则；有些可解释后重试，有些目标永远不给过。
- jcode-security-003: crates/jcode-app-core/src/tool/bash.rs:724-760 · 默认执行环境不是 OS 级沙箱
  - 它有门禁和刹车，但不是把命令关进另一个房间；一旦获准，进程仍在你的机器权限下跑。

## Takeaway
可扩展治理强，但 pre_tool 的 fail-open 语义不适合要求故障关闭的高风险环境。
