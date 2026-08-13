1. 团队要接 MCP 和项目 Skill，我先看发现目录、OAuth、resources 和进程内插件的边界。
2. 这一章不猜作者意图，只沿固定版本的运行时代码、协议和测试看事实。
3. 固定版本证据：packages/opencode/src/skill/index.ts:21-43 · Skills 支持 OpenCode、Claude、agents 目录与远程 discovery；packages/opencode/src/mcp/index.ts:164-198 · MCP 同时支持 stdio、Streamable HTTP、SSE、OAuth、prompts 和 resources；packages/opencode/src/mcp/index.ts:123-125 · MCP OAuth 有 state 校验，但远程连接没有内建 SSRF 私网拦截。
4. 事实一：它能复用多种 Agent 生态的技能目录，也能从远程拉技能；最终只有当前 Agent 有权用的技能会出现。
5. 源码含义：兼容性强，但远程技能内容属于 prompt 供应链，应配合 pin/hash/审计。
6. 事实二：既能在本机拉起一个工具进程，也能连远程工具站；不只会调函数，还能取提示模板和资料。
7. 数据流：用户消息 → session/processor → Provider 与工具事件 → compaction/permission → patch、回退和交付。
8. 小白动作：先给每一步记录状态，再区分成功、拒绝、超限和中断四种终态。
9. 第二个动作：改文件先看 diff，做高风险动作前让权限规则和 doom-loop 检查说清楚。
10. 局限提醒：已审计 provider prompt、AGENTS/CLAUDE 层级指令、remote instructions、skills 和 compaction hooks。
11. 这一章的结论：兼容性强，但远程技能内容属于 prompt 供应链，应配合 pin/hash/审计。
12. 下一章继续沿固定提交的源码锚点，回答一个真实工作问题。

Fixed commit: cc4b45612974f735ddec46009ede07729511fba4
