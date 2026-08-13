# M08 · 扩展：MCP、AGENTS、Skills 和 Hooks 受预算控制

## Hook
团队要接 MCP 和项目规则，我先看目录版本、分层指令和初始上下文预算。

## Evidence anchors
- codex-mcp-001: codex-rs/codex-mcp/src/connection_manager.rs:66-117 · MCP 是带复用、认证、required gate 和 catalog revision 的运行时
  - 它不是每轮临时扫一遍外接工具，而是维护一套有版本、有健康状态、有认证身份的连接池。
- codex-mcp-002: codex-rs/codex-mcp/src/connection_manager/tool_catalog.rs:34-55 · 模型只能看到显式可见且能绑定到同一目录版本的 MCP 工具
  - 展示给模型的工具名和真正执行它的连接必须来自同一版目录，不能拿新版菜单去点旧版厨房。
- codex-instructions-001: codex-rs/core/src/agents_md.rs:1-16 · AGENTS.md 从项目根向 cwd 分层合并，局部 override 优先且有总字节预算
  - 公司规章先读，走进子目录后再叠加本地规章；同一层的 override 像贴在门上的最新通知。
- codex-extension-001: codex-rs/core/src/session/mod.rs:3336-3397 · Skills、plugins 和 extensions 都在初始上下文构建期受预算与来源控制
  - 扩展不是把所有说明一股脑塞进提示词，而是先做预算，再按可信来源和消息层级装配。
- codex-hooks-001: codex-rs/core/src/hook_runtime.rs:103-220 · Hooks 覆盖 session、prompt、permission、tool、compact、stop 与 subagent 生命周期
  - 钩子既能当门卫，也能当翻译器和旁路记录员；每次执行都有开始、结束和耗时记录。

## Takeaway
工具清单可稳定捕获到 step snapshot，连接变化不会悄悄污染正在执行的一步。
