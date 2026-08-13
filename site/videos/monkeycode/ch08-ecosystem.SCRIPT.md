1. 团队要发一套资源包，我先看 global、team、user 合并规则和 zip-slip 校验。
2. 这一章不猜作者意图，只沿固定版本的运行时代码、契约和测试看事实。
3. 固定版本证据：backend/biz/task/usecase/task.go:795-803 · rules、skills、plugins 是三条不同投放链；backend/biz/agentresource/types.go:99-126 · 资源按 global/team/user 合并，同名 user 覆盖 team 覆盖 global；backend/biz/agentresource/unpack.go:12-31 · zip 资源有文件数、单文件、总量和 zip-slip 双重校验。
4. 事实一：规则是小纸条直接塞进去，技能是压缩包让 VM 自己下载，插件还要告诉 OpenCode 从哪个入口文件启动。
5. 源码含义：资源协议兼顾小文本与大包，但各 runtime 的插件能力并不对齐。
6. 事实二：公司给默认技能，团队可换一版，个人还能再覆盖同名版本；被禁用的资源不会因强制投放而复活。
7. 数据流：任务 → DB/VM/Redis → CLI 或 LLM proxy → MCP/权限 → 流、审计和交付。
8. 小白动作：先把任务状态拆成创建、启动、运行、失败、回收五个节点。
9. 第二个动作：把平台边界和 CLI 内层能力分开，记录谁负责权限、压缩和恢复。
10. 局限提醒：已审计 system prompt hook、rules、skills、plugins 和各 CLI 模板。
11. 这一章的结论：资源协议兼顾小文本与大包，但各 runtime 的插件能力并不对齐。
12. 下一章继续沿固定提交的源码锚点，回答一个真实工作问题。

Fixed commit: fcc5320b15a10dfec4d5891ce44d9d1470e10c2b
