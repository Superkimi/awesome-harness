1. 同事说工具允许就能跑，我把 session gate、pre_tool gate、Bash destructive gate 和宿主执行边界拆开。
2. 这一章不猜作者意图，只沿固定版本的运行时代码、契约和测试看事实。
3. 固定版本证据：crates/jcode-app-core/src/tool/mod.rs:543-601 · 工具边界由 session allow/disable 与外部 pre_tool gate 双层控制；crates/jcode-app-core/src/tool/bash_destructive_gate.rs:1-39 · Bash 有确定性危险命令 gate，灾难目标直接拒绝；crates/jcode-app-core/src/tool/bash.rs:724-760 · 默认执行环境不是 OS 级沙箱。
4. 事实一：先看这把工具是否在本会话工具箱里，再给企业自定义门卫一次否决机会；门卫自己坏了时默认放行。
5. 源码含义：可扩展治理强，但 pre_tool 的 fail-open 语义不适合要求故障关闭的高风险环境。
6. 事实二：不是让模型自己判断 rm 是否危险：命令先过代码规则；有些可解释后重试，有些目标永远不给过。
7. 数据流：用户 turn → snapshot/journal → Provider/工具 → context/permission → session、swarm 和指标。
8. 小白动作：先给每轮任务写入状态，再把输入、工具、恢复和交付拆成四个检查点。
9. 第二个动作：把串行、batch、重试、压缩和协作预算分别记账，不要只记总耗时。
10. 局限提醒：allowed/disabled tools、pre_tool hook、危险命令 gate；未发现默认 OS 容器/系统沙箱。
11. 这一章的结论：可扩展治理强，但 pre_tool 的 fail-open 语义不适合要求故障关闭的高风险环境。
12. 下一章继续沿固定提交的源码锚点，回答一个真实工作问题。

Fixed commit: 71fa60c4dc875ebdaf089e6e84b29cbd61cbb478f
