1. 模型要改文件，我先看 registry、Edit diff、权限请求和格式化错误怎样闭环。
2. 这一章不猜作者意图，只沿固定版本的运行时代码、协议和测试看事实。
3. 固定版本证据：packages/opencode/src/tool/registry.ts:86-175 · 工具注册表统一 builtin、项目脚本和 npm/file plugin 工具；packages/opencode/src/tool/edit.ts:35-56 · Edit 在写前生成 diff、请求权限，写后格式化并回送 LSP 错误。
4. 事实一：内置扳手、项目自制工具和插件工具最后都进同一个工具箱，走同一套执行上下文。
5. 源码含义：能力面一致，但本地 JS/TS plugin 是可执行代码，信任边界等同于宿主进程。
6. 事实二：先把拟修改内容展示给门卫，再落盘；落盘后自动格式化，并立刻告诉模型有没有新语法错误。
7. 数据流：用户消息 → session/processor → Provider 与工具事件 → compaction/permission → patch、回退和交付。
8. 小白动作：先给每一步记录状态，再区分成功、拒绝、超限和中断四种终态。
9. 第二个动作：改文件先看 diff，做高风险动作前让权限规则和 doom-loop 检查说清楚。
10. 局限提醒：已审计 builtins/custom/plugin/MCP 动态工具、schema 转换、hooks、truncation 和 snapshots。
11. 这一章的结论：能力面一致，但本地 JS/TS plugin 是可执行代码，信任边界等同于宿主进程。
12. 下一章继续沿固定提交的源码锚点，回答一个真实工作问题。

Fixed commit: cc4b45612974f735ddec46009ede07729511fba4
