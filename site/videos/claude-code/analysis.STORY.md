# Claude Code（复原实现）· 技术分析总览

## Hook
评审问我：这个复原仓库到底还原了哪些 Claude Code 机制？我先把 provenance、循环、权限和压缩证据摆出来。

## Evidence anchors
- claude-code-provenance-001: AGENTS.md:1-8 · 这是反编译/复原仓库，不是 Anthropic 官方 Claude Code 源码
  - 它像依据成品拆机后复原出的工程图，能研究结构，但不能把每一处细节当成原厂图纸。
- claude-code-loop-001: src/query.ts:460-666 · 主 Harness 是一个持续循环的消息变换与工具执行流水线
  - 每一轮不是“问一次模型就结束”，而是先整理行李、调用模型、执行动作、把结果记账，再决定继续还是停。
- claude-code-permission-001: src/utils/permissions/permissions.ts:1179-1281 · 权限是“规则 → 工具自检 → 安全检查 → 模式 → 用户/自动判定”的有序流水线
  - 不是一个总开关，而是多道门；即使开了 bypass，显式 ask 和某些安全路径仍能拦住。
- claude-code-context-001: src/services/compact/snipCompact.ts:60-147 · 上下文不是单层摘要，而是 snip、工具结果瘦身、session memory 与 autocompact 的阶梯
  - 先精准剪掉明确不要的旧段，再清空大块工具输出，最后才用模型写摘要；不同手术刀处理不同类型的肥胖。
- claude-code-session-001: src/utils/sessionStorage.ts:130-168 · 会话是 append-only JSONL 树，而不是简单聊天数组
  - 日志更像带分叉的版本树：可以从某个节点继续、压缩或恢复文件快照，不只是从头到尾的一串气泡。

## Takeaway
报告可评价这个固定提交的实现，但任何对官方产品内部机制的映射都必须标注为推断。
