# M05 · 工具：注册、diff 和 LSP 回送

- Project: Legacy OpenCode
- Fixed source commit: cc4b45612974f735ddec46009ede07729511fba4
- Evidence ledger: data/legacy/evidence/opencode/evidence.json
- Episode: ch05-tools
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - packages/opencode/src/tool/registry.ts:86-175 · 工具注册表统一 builtin、项目脚本和 npm/file plugin 工具
  - packages/opencode/src/tool/edit.ts:35-56 · Edit 在写前生成 diff、请求权限，写后格式化并回送 LSP 错误
