1. 团队要加一个工具，但我不想让 handler 绕过统一注册入口。
2. 这一章不背术语，先看 MiMo-Code 怎样把内核、Compose 和插件能力分开。
3. 固定版本证据：packages/plugin/src/tool.ts，只展示源码片段和中性文件名。
4. 实现事实一：Tool|handler|register。
5. 实现事实二：import { z } from "zod" import { Effect } from "effect" export type ToolContext = { sessionID: string messageID: string agent: str。
6. 数据流：目标 → microkernel/Compose 状态 → 工具或 Skill → permission/budget → 结果。
7. 小白动作：先写核心循环，再把插件能力接在边界上。
8. 第二个动作：给每个工具写清输入、handler、结果和权限。
9. 边界提醒：项目横跨 Rust/TypeScript/Bun/Nix，开发门槛高
10. 看到 reducer、budget 和测试证据，再决定是否交付。
11. 工具注册、handler 和结果回传是一个可检查的契约。
12. 下一章继续用固定提交回答一个真实工作问题。

Fixed commit: 332d7b0db65ccbcdd31a67b897e80dd6f3671b9b
