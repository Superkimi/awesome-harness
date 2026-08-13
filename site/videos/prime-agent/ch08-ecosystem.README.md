# M08 · 扩展：ResourceLoader 和 Extension runner

- Project: Legacy Prime Agent
- Fixed source commit: 7787f07415d843b9a800f6a4720e0c739bd608e5
- Evidence ledger: data/legacy/evidence/prime-agent/evidence.json
- Episode: ch08-ecosystem
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - packages/coding-agent/src/core/resource-loader.ts:23-39 · ResourceLoader 统一管理 skills、prompts、themes、extensions 和 AGENTS 文件
  - packages/coding-agent/src/core/resource-loader.ts:646-678 · 资源来源带 user/project/temporary metadata 并去重冲突
  - packages/coding-agent/src/core/extensions/types.ts:1024-1074 · Extension API 覆盖生命周期、工具、命令、provider 和持久化
  - packages/coding-agent/src/core/extensions/runner.ts:670-711 · Extension runner 按注册顺序串行执行，session-before 可以取消
  - packages/coding-agent/src/core/mcp/mcp-manager.ts:36-78 · MCP host 侧把 OAuth provider 与 kernel 请求分开
