# Claude Code（复原实现）· 技术分析总览

- Project: Legacy Claude Code (reconstruction)
- Fixed source commit: 3bb6b5746238c418138eb96d57765d79012edd96
- Evidence ledger: data/legacy/evidence/claude-code/evidence.json
- Episode: analysis
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - AGENTS.md:1-8 · 这是反编译/复原仓库，不是 Anthropic 官方 Claude Code 源码
  - src/query.ts:460-666 · 主 Harness 是一个持续循环的消息变换与工具执行流水线
  - src/utils/permissions/permissions.ts:1179-1281 · 权限是“规则 → 工具自检 → 安全检查 → 模式 → 用户/自动判定”的有序流水线
  - src/services/compact/snipCompact.ts:60-147 · 上下文不是单层摘要，而是 snip、工具结果瘦身、session memory 与 autocompact 的阶梯
  - src/utils/sessionStorage.ts:130-168 · 会话是 append-only JSONL 树，而不是简单聊天数组
