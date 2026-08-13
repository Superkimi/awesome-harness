1. 同事说文件规则就等于权限，我把 allow/deny/interrupt 和通用 execute gate 分开检查。
2. 这一章不猜作者意图，只沿固定版本的运行时代码、契约和测试看事实。
3. 固定版本证据：libs/deepagents/deepagents/middleware/filesystem.py:383-430 · FilesystemPermission 是 first-match allow/deny/interrupt 规则；libs/deepagents/deepagents/middleware/filesystem.py:1649-1674 · 权限对可执行 backend 的通用 execute gate 明确还没实现；libs/code/deepagents_code/agent.py:774-810 · DeepAgents Code 的 shell allow-list 在 execute 前直接返回错误。
4. 事实一：权限规则像防火墙：先匹配到的规则生效，读写可以拒绝，敏感路径可以暂停让人确认。
5. 源码含义：路径权限要固定顺序、拒绝目录穿越，并让“需要审批”与“直接拒绝”是不同结果。
6. 事实二：文件读写权限很细，但一旦后端允许 shell，通用权限规则不能假装能限制 shell 里的任意命令；代码选择直接拒绝这种配置。
7. 数据流：create_deep_agent → middleware graph → backend/tools → policy/sandbox → checkpoint/session/grader。
8. 小白动作：先把任务拆成 middleware、backend、工具、权限和观测五格。
9. 第二个动作：为子 Agent、MCP、shell 和插件分别记录 trust、allowlist、sandbox 和恢复边界。
10. 局限提醒：first-match filesystem rules/HITL 很清晰，但 permissions 对能 execute 的 backend 明确暂不支持通用 tool-level gate。
11. 这一章的结论：路径权限要固定顺序、拒绝目录穿越，并让“需要审批”与“直接拒绝”是不同结果。
12. 下一章继续沿固定提交的源码锚点，回答一个真实工作问题。

Fixed commit: 217b9eb372fa51b0439434f31abc3ac22e6cd7f2
