# M07 · 安全：PolicyEngine、默认 ASK 与真实沙箱

- Project: Legacy Gemini CLI
- Fixed source commit: 1ac3377395868295e128b96726d605a900b5946b
- Evidence ledger: data/legacy/evidence/gemini-cli/evidence.json
- Episode: ch07-security
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - packages/core/src/policy/policy-engine.ts:49-195 · PolicyEngine 按优先级匹配工具、参数、MCP 身份、annotations、模式、交互状态和 subagent
  - packages/core/src/policy/policy-engine.ts:253-260 · 非交互默认拒绝，交互默认询问；危险命令强制 ASK，YOLO 例外
  - packages/core/src/services/sandboxManagerFactory.ts:19-43 · Sandbox 默认不开启，但即使关闭仍净化环境变量
  - packages/core/src/services/sandboxManager.ts:194-223 · 三平台使用真实 OS 隔离，并保护治理文件与 .env 类秘密
  - packages/core/src/policy/sandboxPolicyManager.ts:49-94 · 默认 sandbox mode 的 default 是可写 workspace，plan 才只读
