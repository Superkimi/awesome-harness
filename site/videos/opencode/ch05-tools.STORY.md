# M05 · 工具：注册、diff 和 LSP 回送

## Hook
模型要改文件，我先看 registry、Edit diff、权限请求和格式化错误怎样闭环。

## Evidence anchors
- opencode-tool-001: packages/opencode/src/tool/registry.ts:86-175 · 工具注册表统一 builtin、项目脚本和 npm/file plugin 工具
  - 内置扳手、项目自制工具和插件工具最后都进同一个工具箱，走同一套执行上下文。
- opencode-edit-001: packages/opencode/src/tool/edit.ts:35-56 · Edit 在写前生成 diff、请求权限，写后格式化并回送 LSP 错误
  - 先把拟修改内容展示给门卫，再落盘；落盘后自动格式化，并立刻告诉模型有没有新语法错误。

## Takeaway
能力面一致，但本地 JS/TS plugin 是可执行代码，信任边界等同于宿主进程。
