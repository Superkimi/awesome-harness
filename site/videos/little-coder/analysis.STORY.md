# Little Coder · 技术分析总览

## Hook
老板让我把一个小仓库交付出去，但我不想只看它会不会写代码；我要看它怎样压缩上下文、隔离工具、组织子 Agent。

## Evidence anchors
- little-architecture-001: package.json:33-43 · 它是 pi 的 Harness 增强层，而不是另一套 Agent 内核
  - 可以把它理解成给 pi 装了一套“小模型护栏与外挂”，对话循环、会话和基础工具仍由 pi 驱动。
- little-context-001: .pi/extensions/context-watchdog/index.ts:3-29 · 80% 中途压缩 watchdog 补上 pi 的长自主运行缺口
  - 模型若连续几十轮调用工具、不把控制权还给用户，原生 pi 可能迟迟不压缩；这个扩展在每一小轮都看油表，快满了就主动整理上下文再接着做。
- little-edit-001: .pi/extensions/write-guard/index.ts:35-75 · 禁止整文件覆写是跨 Write 与 shell 的不变量
  - 小模型想偷懒把整个文件重写，换成 `cat > file` 也绕不过去；它被迫做小块精确修改。
- little-subagent-001: .pi/extensions/subagent/index.ts:12-20 · 子 Agent 是独立 little-coder 进程，父上下文只收短报告
  - 子任务的搜索过程不会把父模型记忆塞满，父亲只看一页简报。
- little-evidence-001: .pi/extensions/evidence/index.ts:5-42 · 证据是 session-scoped 结构化对象，并显式跨压缩
  - 引用依据不只躺在长聊天里，而是放到一个小抽屉；聊天被总结后，抽屉还在。

## Takeaway
分析和选型时必须把 little-coder 的差异能力与 pi 基座分开计分。
