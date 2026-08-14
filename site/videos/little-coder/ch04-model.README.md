# M04 · 上下文：动态知识为什么放在对话尾部

- Project: Legacy Little Coder
- Fixed source commit: 0b7234031aabe56163e345792ce7a6ea05af321a
- Evidence ledger: data/legacy/evidence/little-coder/evidence.json
- Episode: ch04-model
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - .pi/extensions/_shared/inject.ts:1-27 · 动态知识放在对话尾部，保护 KV cache
  - .pi/extensions/skill-inject/index.ts:8-31 · 技能选择按失败恢复、近期工具、当前意图排序
  - .pi/extensions/knowledge-inject/index.ts:8-35 · 算法知识以关键词打分并反向声明所需工具
