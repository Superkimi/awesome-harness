1. 工具调用不能无限并发，我先看 typed registry、十个 batch 上限和双预算闸门。
2. 这一章不猜作者意图，只沿固定版本的运行时代码、契约和测试看事实。
3. 固定版本证据：crates/jcode-tool-core/src/lib.rs:9-65 · 工具是 typed registry，定义顺序与 intent 字段集中标准化；crates/jcode-app-core/src/agent/turn_loops.rs:878-917 · 普通模型工具调用串行，显式 batch 最多并发十个；crates/jcode-app-core/src/tool/mod.rs:627-678 · 工具输出有双预算闸门，前台命令超时可升级后台。
4. 事实一：每件工具都交同一种说明书和回执；“为什么调用”不是每个工具自己记得就写，而是总装配线强制补上。
5. 源码含义：便于 UI 显示与审计，稳定排序提高 prompt cache hit。
6. 事实二：模型一次开几张普通工单时按顺序做；只有明确使用 batch 托盘，才会同时跑最多十件事。
7. 数据流：用户 turn → snapshot/journal → Provider/工具 → context/permission → session、swarm 和指标。
8. 小白动作：先给每轮任务写入状态，再把输入、工具、恢复和交付拆成四个检查点。
9. 第二个动作：把串行、batch、重试、压缩和协作预算分别记账，不要只记总耗时。
10. 局限提醒：typed registry、工具快照、batch、输出预算、前后台命令和 stdin。
11. 这一章的结论：便于 UI 显示与审计，稳定排序提高 prompt cache hit。
12. 下一章继续沿固定提交的源码锚点，回答一个真实工作问题。

Fixed commit: 71fa60c4dc875ebdaf089e6e84b29cbd61cbb478f
