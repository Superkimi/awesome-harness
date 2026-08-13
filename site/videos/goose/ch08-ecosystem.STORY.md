# M08 · 扩展：MCP、Skills 和 Hooks 怎样接进来

## Hook
团队要接一个远程 MCP，我不想只看按钮，先追工具命名、缓存、技能目录和 Hook 注入。

## Evidence anchors
- goose-mcp-001: crates/goose/src/agents/extension_manager.rs:1271-1342 · MCP 工具被统一命名空间化、缓存和动态刷新
  - 各插件都可能有一个叫 search 的工具，所以 Goose 默认把它们改成“插件名__search”，避免撞名，并缓存工具清单减少重复查询。
- goose-mcp-002: crates/goose/src/agents/extension_manager.rs:612-730 · 远端 MCP 支持 HTTP、OAuth 和交互通知
  - 插件不一定是本机子进程，也可以是要登录的远程服务；执行过程中还能弹出“需要用户操作”的中间事件。
- goose-mcp-003: crates/goose/src/agents/extension_manager.rs:322-346 · MCP UI 元数据采用“先剥离、再可信补写”
  - 插件不能只靠自己声称“这是可信 UI”就让前端照单全收，Goose 会清掉敏感标记并由宿主重新验证、重新封装。
- goose-skills-001: crates/goose/src/skills/mod.rs:313-341 · Skills 采用渐进加载和多生态目录兼容
  - 模型一开始只拿到“技能目录”，需要时再打开说明书和附件，既省上下文，也防止通过 ../ 偷读技能目录外文件。
- goose-hooks-001: crates/goose/src/hooks/mod.rs:64-95 · 插件 Hooks 覆盖工具、文件、Shell、会话和停止事件
  - 组织可以在“运行命令前”“改文件后”“会话开始”“Agent 想结束”等时点执行自己的脚本，但普通通知脚本坏掉不会让整个 Agent 瘫痪。

## Takeaway
工具注册表既是性能组件也是一致性组件；热插拔后必须原子失效。
