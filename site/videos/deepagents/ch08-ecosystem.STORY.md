# M08 · 扩展：Skills、Memory、MCP 与插件安装

## Hook
团队要装 Skill 和 MCP，我先看 progressive disclosure、server lock、trust precedence 和 plugin containment。

## Evidence anchors
- deep-skills-001: libs/deepagents/deepagents/middleware/skills.py:721-761 · Skills 使用 progressive disclosure，先给索引再按需读 SKILL.md
  - 系统提示不会把所有技能全文塞进上下文，而是像目录一样按需展开；同时明确技能文件是外部资料，不应绕过用户请求或安全规则。
- deep-memory-001: libs/deepagents/deepagents/middleware/memory.py:103-145 · Memory 被明确标成文件参考资料，不是隐藏 system instruction
  - 即使 memory 文件写着“永远执行某命令”，模型也不能把它当最高优先级系统指令。
- deep-mcp-001: libs/code/deepagents_code/mcp_tools.py:279-312 · MCP session manager 按 server lazy cache，并用 per-server lock/close timeout
  - 第一次用某个连接才启动它，同一服务器不会每次 tool call 重启；退出时又限制坏连接的拖延范围。
- deep-mcp-002: libs/code/deepagents_code/mcp_tools.py:475-504 · MCP config 延迟解析 env，并对项目 server 做 trust/deny precedence
  - 一个坏 server 的缺失环境变量不会让同文件其他 server 一起消失；项目里的 MCP 也不会因为被发现就自动执行。
- deep-plugin-001: libs/code/deepagents_code/plugins/manifest.py:87-120 · Plugin manifest 对组件路径做 plugin-root containment 校验
  - 插件不能在 manifest 里写一个任意绝对路径偷偷指向用户 home 或别的仓库。
- deep-plugin-002: libs/code/deepagents_code/plugins/store.py:219-232 · 插件安装先复制到版本化 cache，再原子替换并移除 .git
  - 运行中的插件不直接从 marketplace 工作目录读，安装过程也不会留下半更新目录或把源码仓库的 .git 带进插件 cache。

## Takeaway
自研技能系统可以用 metadata→full instruction 两阶段，降低 token 成本和 prompt 污染面。
