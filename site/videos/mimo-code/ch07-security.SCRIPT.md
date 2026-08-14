1. 新插件要求自动授权，评审让我先说明 permission context 到底控制什么。
2. 这一章不背术语，先看 MiMo-Code 怎样把内核、Compose 和插件能力分开。
3. 固定版本证据：packages/app/src/context/permission.tsx，只展示源码片段和中性文件名。
4. 实现事实一：permission|auto|grant。
5. 实现事实二：rams } from "@solidjs/router" import { decode64 } from "@/utils/base64" import { acceptKey, directoryAcceptKey, isDirectoryAutoAcc。
6. 数据流：目标 → microkernel/Compose 状态 → 工具或 Skill → permission/budget → 结果。
7. 小白动作：先写核心循环，再把插件能力接在边界上。
8. 第二个动作：给每个工具写清输入、handler、结果和权限。
9. 边界提醒：项目横跨 Rust/TypeScript/Bun/Nix，开发门槛高
10. 看到 reducer、budget 和测试证据，再决定是否交付。
11. 权限是独立边界，不应该和插件能力一起默认放开。
12. 下一章继续用固定提交回答一个真实工作问题。

Fixed commit: 332d7b0db65ccbcdd31a67b897e80dd6f3671b9b
