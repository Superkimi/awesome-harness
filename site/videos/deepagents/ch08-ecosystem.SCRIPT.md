1. 团队要装 Skill 和 MCP，我先看 progressive disclosure、server lock、trust precedence 和 plugin containment。
2. 这一章不猜作者意图，只沿固定版本的运行时代码、契约和测试看事实。
3. 固定版本证据：libs/deepagents/deepagents/middleware/skills.py:721-761 · Skills 使用 progressive disclosure，先给索引再按需读 SKILL.md；libs/deepagents/deepagents/middleware/memory.py:103-145 · Memory 被明确标成文件参考资料，不是隐藏 system instruction；libs/code/deepagents_code/mcp_tools.py:279-312 · MCP session manager 按 server lazy cache，并用 per-server lock/close timeout。
4. 事实一：系统提示不会把所有技能全文塞进上下文，而是像目录一样按需展开；同时明确技能文件是外部资料，不应绕过用户请求或安全规则。
5. 源码含义：自研技能系统可以用 metadata→full instruction 两阶段，降低 token 成本和 prompt 污染面。
6. 事实二：即使 memory 文件写着“永远执行某命令”，模型也不能把它当最高优先级系统指令。
7. 数据流：create_deep_agent → middleware graph → backend/tools → policy/sandbox → checkpoint/session/grader。
8. 小白动作：先把任务拆成 middleware、backend、工具、权限和观测五格。
9. 第二个动作：为子 Agent、MCP、shell 和插件分别记录 trust、allowlist、sandbox 和恢复边界。
10. 局限提醒：skills progressive disclosure、AGENTS memory、插件 manifest/path containment、versioned cache/atomic replace。
11. 这一章的结论：自研技能系统可以用 metadata→full instruction 两阶段，降低 token 成本和 prompt 污染面。
12. 下一章继续沿固定提交的源码锚点，回答一个真实工作问题。

Fixed commit: 217b9eb372fa51b0439434f31abc3ac22e6cd7f2
