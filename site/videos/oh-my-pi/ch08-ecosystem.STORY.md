# M08 · MCP 与扩展：多个生态怎样接入

## Hook
团队要接 Claude、Gemini 和 OpenCode 的 MCP，我先看 manager、discovery 和高权限扩展边界。

## Evidence anchors
- omp-mcp-001: packages/coding-agent/src/mcp/manager.ts:282-380 · MCP 是完整内建连接器，不是插件样例
  - 它不仅能调用 MCP 工具，还管理连接、认证、资源订阅、服务端推送和重连生命周期。
- omp-mcp-002: packages/coding-agent/src/discovery/opencode.ts:88-167 · 可直接吸收 Claude、Gemini、OpenCode 等生态的 MCP 配置
  - 用户换工具时不必手工重写全部 MCP 配置，OMP 会读取其他 Agent 的配置并统一格式。
- omp-plugins-001: packages/coding-agent/src/extensibility/extensions/loader.ts:120-230 · Extensions、hooks、custom tools 与 marketplace 都是同进程高权限扩展
  - 插件几乎能改 Agent 的每个关节，也能执行宿主代码；插件市场因此既是生态优势，也是供应链入口。
- omp-instructions-001: packages/coding-agent/src/system-prompt.ts:332-405 · 指令层兼容多个 Agent 生态，并支持 @include
  - 它会把多种 Agent 留在仓库里的说明书都读成统一规则，越靠近当前目录的规则越显眼，还能在规则里引用其他文件。

## Takeaway
连接器成熟度高，适合企业工具生态；同时需审计远端 URL、headers 和本地 command 配置。
