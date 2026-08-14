# M09 · 协作：Architect 和 Editor 为什么要分工

## Hook
研究方案和改代码由两个人接力更稳，我用双模型链看谁负责想、谁负责写。

## Evidence anchors
- aider-collab-001: aider/coders/architect_coder.py:6-48 · Architect/Editor 是顺序双模型链
  - 一个模型负责想清楚“怎么改”，另一个模型只拿方案动手；它们不是并行，也不能继续派生更多 Agent。

## Takeaway
职责分离能让强推理模型配合擅长补丁的模型，但缺少多任务 fan-out、共享黑板和子任务调度。
