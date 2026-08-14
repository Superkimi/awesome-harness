# M03 · 主循环：为什么不是模型说完就结束

## Hook
同事说 Agent 回答完就算完成，我沿着外环和 reflection 内环看它怎样继续修正。

## Evidence anchors
- aider-loop-001: aider/coders/base_coder.py:88-106 · 交互外环 + 有界 reflection 内环
  - Aider 的循环很直接：你说一次，它生成修改；修改格式错了或检查失败，就把错误原样喂回模型再试，但不会无限自修。
- aider-loop-002: aider/coders/base_coder.py:1530-1623 · 一次回复后的固定交付链
  - Aider 更像一条固定流水线，不是让模型临场决定下一步用什么工具。

## Takeaway
这是“以编辑反馈驱动的局部循环”，而非任意工具调用状态机。
