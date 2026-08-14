# M05 · 工具与编辑：先预览，再真正写文件

## Hook
同事要我改五个文件，但我不敢让模型直接落盘；先看 dry-run、授权和 Coder 家族怎么配合。

## Evidence anchors
- aider-edit-001: aider/coders/base_coder.py:124-201 · 编辑协议是可替换 Coder 家族
  - Aider 把“模型应该怎样描述改动”做成多种可换的方言，并按模型能力选择最合适的一种。
- aider-edit-002: aider/coders/base_coder.py:2269-2336 · 编辑先 dry-run，再授权，再落盘
  - 模型给出的补丁先试演，确认目标文件允许修改后才真正写；补丁坏了会把错误退回给模型修。

## Takeaway
编辑可靠性可以按模型定制，而不必让所有模型都走同一个 JSON tool schema。
