# M08 · 资源：rules、skills、plugins 谁覆盖谁

## Hook
团队要发一套资源包，我先看 global、team、user 合并规则和 zip-slip 校验。

## Evidence anchors
- monkey-resource-001: backend/biz/task/usecase/task.go:795-803 · rules、skills、plugins 是三条不同投放链
  - 规则是小纸条直接塞进去，技能是压缩包让 VM 自己下载，插件还要告诉 OpenCode 从哪个入口文件启动。
- monkey-resource-002: backend/biz/agentresource/types.go:99-126 · 资源按 global/team/user 合并，同名 user 覆盖 team 覆盖 global
  - 公司给默认技能，团队可换一版，个人还能再覆盖同名版本；被禁用的资源不会因强制投放而复活。
- monkey-resource-003: backend/biz/agentresource/unpack.go:12-31 · zip 资源有文件数、单文件、总量和 zip-slip 双重校验
  - 插件压缩包不能假装很小再突然炸开，也不能用 ../../ 偷写 VM 里的其他路径。

## Takeaway
资源协议兼顾小文本与大包，但各 runtime 的插件能力并不对齐。
