1. 评审问这个微内核是不是只换了名字，我用固定文档和 reducer 测试回答。
2. 这一章不背术语，先看 MiMo-Code 怎样把内核、Compose 和插件能力分开。
3. 固定版本证据：packages/app/src/context/global-sync/event-reducer.test.ts，只展示源码片段和中性文件名。
4. 实现事实一：test|reducer。
5. 实现事实二：import { describe, expect, test } from "bun:test" import type { Message, Part, PermissionRequest, Project, QuestionRequest, Sessio。
6. 数据流：目标 → microkernel/Compose 状态 → 工具或 Skill → permission/budget → 结果。
7. 小白动作：先写核心循环，再把插件能力接在边界上。
8. 第二个动作：给每个工具写清输入、handler、结果和权限。
9. 边界提醒：项目横跨 Rust/TypeScript/Bun/Nix，开发门槛高
10. 看到 reducer、budget 和测试证据，再决定是否交付。
11. 架构结论要同时看设计文档、实现边界和测试回路。
12. 下一章继续用固定提交回答一个真实工作问题。

Fixed commit: 332d7b0db65ccbcdd31a67b897e80dd6f3671b9b
