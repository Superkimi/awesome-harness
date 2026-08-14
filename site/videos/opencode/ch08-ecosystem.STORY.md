# M08 · 扩展：Skills、MCP 和插件进入同一工作流

## Hook
团队要接 MCP 和项目 Skill，我先看发现目录、OAuth、resources 和进程内插件的边界。

## Evidence anchors
- opencode-skill-001: packages/opencode/src/skill/index.ts:21-43 · Skills 支持 OpenCode、Claude、agents 目录与远程 discovery
  - 它能复用多种 Agent 生态的技能目录，也能从远程拉技能；最终只有当前 Agent 有权用的技能会出现。
- opencode-mcp-001: packages/opencode/src/mcp/index.ts:164-198 · MCP 同时支持 stdio、Streamable HTTP、SSE、OAuth、prompts 和 resources
  - 既能在本机拉起一个工具进程，也能连远程工具站；不只会调函数，还能取提示模板和资料。
- opencode-mcp-002: packages/opencode/src/mcp/index.ts:123-125 · MCP OAuth 有 state 校验，但远程连接没有内建 SSRF 私网拦截
  - 登录回调防伪造做了，但“这个 MCP 地址是不是公司内网或云元数据地址”没有额外门卫。
- opencode-plugin-001: packages/opencode/src/plugin/loader.ts:76-144 · 插件是进程内代码，可改 prompt、请求、工具定义和执行结果
  - 插件不是只提供一段文字，而是能伸手进模型请求和工具执行链，因此能力很强、信任也很高。

## Takeaway
兼容性强，但远程技能内容属于 prompt 供应链，应配合 pin/hash/审计。
