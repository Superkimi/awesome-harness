# Aider · 技术分析总览

## Hook
评审问我：这个 Coding Agent 为什么能把大仓库、编辑和提交串起来？我不念 README，直接按实现证据拆。

## Evidence anchors
- aider-loop-001: aider/coders/base_coder.py:88-106 · 交互外环 + 有界 reflection 内环
  - Aider 的循环很直接：你说一次，它生成修改；修改格式错了或检查失败，就把错误原样喂回模型再试，但不会无限自修。
- aider-context-001: aider/coders/base_coder.py:1226-1338 · 上下文被拆成稳定的 ChatChunks
  - Aider 不把所有材料乱塞成一团，而是把“规则、示例、历史、仓库地图、文件正文、当前问题”分舱装箱。
- aider-edit-001: aider/coders/base_coder.py:124-201 · 编辑协议是可替换 Coder 家族
  - Aider 把“模型应该怎样描述改动”做成多种可换的方言，并按模型能力选择最合适的一种。
- aider-git-001: aider/coders/base_coder.py:2375-2423 · Git 提交是编辑事务和恢复机制
  - Aider 用 Git 当保险箱：改前存一份，改后再存一份，出问题可以退回，但不会随便回滚用户自己的提交。
- aider-collab-001: aider/coders/architect_coder.py:6-48 · Architect/Editor 是顺序双模型链
  - 一个模型负责想清楚“怎么改”，另一个模型只拿方案动手；它们不是并行，也不能继续派生更多 Agent。

## Takeaway
这是“以编辑反馈驱动的局部循环”，而非任意工具调用状态机。
