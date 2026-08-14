1. 同事要我解释这个 Coding Agent，不许只说“它很智能”。
2. MiMo-Code 不是“多一个聊天框”，它把一个工作麻烦拆成了可观察的步骤。
3. 固定版本证据：docs/harness/Agent Multi-Skill Workflow Orchestration Design.md，画面只展示源码片段和中性文件名。
4. 事实一：MiMo-Code 的源码把 Coding Agent 拆成 microkernel runtime、Compose 编排、插件工具、全局同步、权限和 context budget。它适合研究“内核保持稳定，能力从插件/技能/工作流注入”的工程路线。
5. 事实二：全局同步有 reducer、eviction、trim、prefetch 等状态管理
6. 数据流：目标 → 状态/上下文 → 工具或节点 → 校验 → 结果交付。
7. 源码里能看到：import { z } from "zod" import { Effect } from "effect" export type ToolContext = { sessionID: string mes。
8. 小白复现：先写目标，再列数据；每一步保留状态，最后再预览或交付。
9. 再看一个边界：项目横跨 Rust/TypeScript/Bun/Nix，开发门槛高
10. 所以它值得学的不是按钮，而是把过程变成可以检查的证据。
11. 今天记住：先证明一个真实工作结果，再追问它为什么能稳定完成：把 MiMo-Code 想成一台可换插槽的机器：微内核负责转动，Compose 是控制面，插件和 Skill 是可替换的刀头。
12. 下一条继续拆一个真实章节，先把问题说清，再让 Agent 负责重复劳动。

Fixed commit: 332d7b0db65ccbcdd31a67b897e80dd6f3671b9b
