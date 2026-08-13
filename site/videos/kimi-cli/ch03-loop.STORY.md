# M03 · 主循环：通知、约束和并发工具一起推进

## Hook
同事说中途改需求只能等下一轮，我沿 steer、D-Mail 和并发工具看两种改道机制。

## Evidence anchors
- kimi-loop-002: src/kimi_cli/soul/kimisoul.py:1132-1194 · 每 step 先注入通知/动态约束，再一次生成并等待并发工具
  - 模型每次再开口前都会先收新通知和当前模式规则；工具可以边生成边启动，结果到齐后才记账。
- kimi-loop-003: src/kimi_cli/soul/kimisoul.py:622-653 · steer 与 D-Mail 提供两种中途改道机制
  - 用户插话是在当前路线后追加新指令；D-Mail 则像读档，把对话回到旧存档再塞入一张“未来经验”纸条。

## Takeaway
实时性和并行性强；动态注入是上下文的一部分，会影响 token 与缓存。
