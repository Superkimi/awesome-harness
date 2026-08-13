# M08 · 扩展：指令、Skills 和同进程插件

## Hook
团队要发项目 Skill，我先看系统提示拼装、trust 控制的懒加载和扩展进程边界。

## Evidence anchors
- pi-instructions-001: packages/coding-agent/src/core/system-prompt.ts:28-71 · 系统指令由 tool、context files、skills、custom/append prompt 多层拼装
  - 模型看到的不是一段写死提示词，而是当前工具说明、用户规则、项目规则、技能目录和工作目录拼成的最终说明书。
- pi-skills-001: packages/coding-agent/src/core/skills.ts:118-188 · Skill 采用懒加载目录，项目范围受 trust 控制
  - 先给模型一本技能目录，不把每本说明书都塞进上下文；它决定要用时再打开。仓库自带技能则要先信任仓库。
- pi-extension-001: packages/coding-agent/src/core/extensions/loader.ts:66-124 · 扩展在同一进程执行，覆盖面接近完整产品内核
  - 插件不是只能加一个小工具，它几乎能摸到 Agent 每个关节；代价是插件代码和主进程同等权限。

## Takeaway
必须提供最终展开 prompt 的诊断视图，否则层级覆盖很难排查。
