# M01 · 总览：从一句需求到一次可恢复交付

## Hook
老板把一个半成品仓库丢给我，今晚要能交付；我先确认 Aider 真正替我做了哪几步。

## Evidence anchors
- aider-loop-001: aider/coders/base_coder.py:88-106 · 交互外环 + 有界 reflection 内环
  - Aider 的循环很直接：你说一次，它生成修改；修改格式错了或检查失败，就把错误原样喂回模型再试，但不会无限自修。
- aider-loop-002: aider/coders/base_coder.py:1530-1623 · 一次回复后的固定交付链
  - Aider 更像一条固定流水线，不是让模型临场决定下一步用什么工具。

## Takeaway
这是“以编辑反馈驱动的局部循环”，而非任意工具调用状态机。
