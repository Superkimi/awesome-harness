1. 架构评审只剩十分钟，我得讲清每一步为什么都要重建 Agent、上下文和模型请求。
2. 这一章不猜作者意图，只沿固定版本的运行时代码、协议和测试看事实。
3. 固定版本证据：packages/opencode/src/session/prompt.ts:1170-1241 · 每一步动态重建 Agent、工具、系统上下文和模型请求；packages/opencode/src/session/llm/request.ts:56-100 · 请求准备层统一合并 prompt、variant、provider options 与 hooks；packages/opencode/src/session/session.ts:120-158 · session 持久化 agent/model/permission/cost/tokens/summary/revert 与 parent。
4. 事实一：不是开会前一次性发完所有资料；每走一步都按当前身份、模型和权限重新整理桌面。
5. 源码含义：支持运行中配置和权限变化，但每步装配链更复杂、需要缓存与测试。
6. 事实二：模型请求像一张多层样式表：厂商默认、模型设置、Agent 设置、当前档位和插件逐层覆盖。
7. 数据流：用户消息 → session/processor → Provider 与工具事件 → compaction/permission → patch、回退和交付。
8. 小白动作：先给每一步记录状态，再区分成功、拒绝、超限和中断四种终态。
9. 第二个动作：改文件先看 diff，做高风险动作前让权限规则和 doom-loop 检查说清楚。
10. 局限提醒：已审计持久消息驱动 loop、任务选择、流事件处理、退出、重试和 cleanup。
11. 这一章的结论：支持运行中配置和权限变化，但每步装配链更复杂、需要缓存与测试。
12. 下一章继续沿固定提交的源码锚点，回答一个真实工作问题。

Fixed commit: cc4b45612974f735ddec46009ede07729511fba4
