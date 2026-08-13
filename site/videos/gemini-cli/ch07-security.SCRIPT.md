1. 同事说 YOLO 就能解决审批，我把规则优先级、非交互拒绝和三平台隔离拆开。
2. 这一章不猜作者意图，只沿固定版本的运行时代码、协议和测试看事实。
3. 固定版本证据：packages/core/src/policy/policy-engine.ts:49-195 · PolicyEngine 按优先级匹配工具、参数、MCP 身份、annotations、模式、交互状态和 subagent；packages/core/src/policy/policy-engine.ts:253-260 · 非交互默认拒绝，交互默认询问；危险命令强制 ASK，YOLO 例外；packages/core/src/services/sandboxManagerFactory.ts:19-43 · Sandbox 默认不开启，但即使关闭仍净化环境变量。
4. 事实一：政策可以精确到“哪个子 Agent 在非交互模式调用哪个 MCP 的哪个参数”，不只是允许/禁止 Bash。
5. 源码含义：企业控制力强，但规则冲突需要良好解释器和测试。
6. 事实二：没人看屏幕时不赌；有人在时先问。只有明确 YOLO 才允许危险命令绕过这层强制提问。
7. 数据流：用户消息 → sendMessageStream → Context/Policy → Scheduler/AgentProtocol → JSONL checkpoint。
8. 小白动作：先把长任务拆成循环、上下文、策略、工具和回放五格。
9. 第二个动作：为超限、取消、拒绝和重试分别写终态，不要只看“执行成功”。
10. 局限提醒：规则/安全检查/审批模式、环境净化和三平台真实沙箱。
11. 这一章的结论：企业控制力强，但规则冲突需要良好解释器和测试。
12. 下一章继续沿固定提交的源码锚点，回答一个真实工作问题。

Fixed commit: 1ac3377395868295e128b96726d605a900b5946b
