# M08 · 扩展：ResourceLoader 和 Extension runner

## Hook
团队要接 Skills、prompts 和自定义 provider，我先看统一资源来源、去重冲突和串行 runner。

## Evidence anchors
- prime-resources-001: packages/coding-agent/src/core/resource-loader.ts:23-39 · ResourceLoader 统一管理 skills、prompts、themes、extensions 和 AGENTS 文件
  - 指令、技能、主题和扩展不是四套互不相干的扫描器，而是在 reload 时形成一份带诊断的资源快照。
- prime-resources-002: packages/coding-agent/src/core/resource-loader.ts:646-678 · 资源来源带 user/project/temporary metadata 并去重冲突
  - 系统知道一个 skill 是用户级、项目级还是临时 CLI 注入的；同名 prompt 不会静默覆盖，而是留下谁赢、谁输的诊断。
- prime-ext-001: packages/coding-agent/src/core/extensions/types.ts:1024-1074 · Extension API 覆盖生命周期、工具、命令、provider 和持久化
  - 扩展不是只能加一个 prompt；它可以加入工具、CLI 命令、模型 provider、上下文变换和 session state。
- prime-ext-002: packages/coding-agent/src/core/extensions/runner.ts:670-711 · Extension runner 按注册顺序串行执行，session-before 可以取消
  - 扩展链像一条可观察的中间件管线：早期扩展能阻止 session switch 或 tool call，后面的扩展看到前面已经变换过的 context。
- prime-mcp-001: packages/coding-agent/src/core/mcp/mcp-manager.ts:36-78 · MCP host 侧把 OAuth provider 与 kernel 请求分开
  - 登录凭据、UI 交互和真正的 MCP kernel 连接没有混成一条黑盒；host 只做身份和配置桥接。

## Takeaway
插件/技能热更新要有单一 loader 和明确的 reload boundary，才能通知 session 资源变了。
