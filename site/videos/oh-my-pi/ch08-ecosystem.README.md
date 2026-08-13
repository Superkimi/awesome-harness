# M08 · MCP 与扩展：多个生态怎样接入

- Project: Legacy Oh My Pi
- Fixed source commit: a53e4e790d3939a08708bf0d3c912d0763237a2d
- Evidence ledger: data/legacy/evidence/oh-my-pi/evidence.json
- Episode: ch08-ecosystem
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - packages/coding-agent/src/mcp/manager.ts:282-380 · MCP 是完整内建连接器，不是插件样例
  - packages/coding-agent/src/discovery/opencode.ts:88-167 · 可直接吸收 Claude、Gemini、OpenCode 等生态的 MCP 配置
  - packages/coding-agent/src/extensibility/extensions/loader.ts:120-230 · Extensions、hooks、custom tools 与 marketplace 都是同进程高权限扩展
  - packages/coding-agent/src/system-prompt.ts:332-405 · 指令层兼容多个 Agent 生态，并支持 @include
