# M07 · 安全：PolicyEngine、默认 ASK 与真实沙箱

## Hook
同事说 YOLO 就能解决审批，我把规则优先级、非交互拒绝和三平台隔离拆开。

## Evidence anchors
- gemini-policy-001: packages/core/src/policy/policy-engine.ts:49-195 · PolicyEngine 按优先级匹配工具、参数、MCP 身份、annotations、模式、交互状态和 subagent
  - 政策可以精确到“哪个子 Agent 在非交互模式调用哪个 MCP 的哪个参数”，不只是允许/禁止 Bash。
- gemini-policy-002: packages/core/src/policy/policy-engine.ts:253-260 · 非交互默认拒绝，交互默认询问；危险命令强制 ASK，YOLO 例外
  - 没人看屏幕时不赌；有人在时先问。只有明确 YOLO 才允许危险命令绕过这层强制提问。
- gemini-sandbox-001: packages/core/src/services/sandboxManagerFactory.ts:19-43 · Sandbox 默认不开启，但即使关闭仍净化环境变量
  - 防护罩不是默认扣上的；没扣罩子时至少会先从进程环境里清理不该传给子进程的东西。
- gemini-sandbox-002: packages/core/src/services/sandboxManager.ts:194-223 · 三平台使用真实 OS 隔离，并保护治理文件与 .env 类秘密
  - 开罩后不是靠模型自觉：Linux、macOS、Windows 各用系统级限制器，仓库规则和秘密文件另加保护。
- gemini-sandbox-003: packages/core/src/policy/sandboxPolicyManager.ts:49-94 · 默认 sandbox mode 的 default 是可写 workspace，plan 才只读
  - 即使开启沙箱，普通默认模式也允许改工作区；“开沙箱”不等于“只读”。

## Takeaway
企业控制力强，但规则冲突需要良好解释器和测试。
