# M08 · 扩展：Skills、Memory、MCP 与插件安装

- Project: Legacy DeepAgents
- Fixed source commit: 217b9eb372fa51b0439434f31abc3ac22e6cd7f2
- Evidence ledger: data/legacy/evidence/deepagents/evidence.json
- Episode: ch08-ecosystem
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - libs/deepagents/deepagents/middleware/skills.py:721-761 · Skills 使用 progressive disclosure，先给索引再按需读 SKILL.md
  - libs/deepagents/deepagents/middleware/memory.py:103-145 · Memory 被明确标成文件参考资料，不是隐藏 system instruction
  - libs/code/deepagents_code/mcp_tools.py:279-312 · MCP session manager 按 server lazy cache，并用 per-server lock/close timeout
  - libs/code/deepagents_code/mcp_tools.py:475-504 · MCP config 延迟解析 env，并对项目 server 做 trust/deny precedence
  - libs/code/deepagents_code/plugins/manifest.py:87-120 · Plugin manifest 对组件路径做 plugin-root containment 校验
  - libs/code/deepagents_code/plugins/store.py:219-232 · 插件安装先复制到版本化 cache，再原子替换并移除 .git
