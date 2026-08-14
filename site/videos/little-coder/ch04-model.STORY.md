# M04 · 上下文：动态知识为什么放在对话尾部

## Hook
同事说提示词越多越聪明，我先看 KV cache、技能和知识注入如何控制顺序。

## Evidence anchors
- little-prompt-001: .pi/extensions/_shared/inject.ts:1-27 · 动态知识放在对话尾部，保护 KV cache
  - 固定的历史前缀不动，只在最末尾塞这轮真正需要的小纸条，本地模型就不用每轮重算十几万 token 的缓存。
- little-skills-001: .pi/extensions/skill-inject/index.ts:8-31 · 技能选择按失败恢复、近期工具、当前意图排序
  - 它不会把整本工具手册都塞给小模型，只给最可能马上用到的几张卡；刚失败过的工具优先补课。
- little-knowledge-001: .pi/extensions/knowledge-inject/index.ts:8-35 · 算法知识以关键词打分并反向声明所需工具
  - 题目像动态规划才临时塞动态规划小抄；而且小抄若要求某工具，会顺带保证那张工具说明也进来。

## Takeaway
对本地推理，prompt 稳定性本身就是性能架构。
