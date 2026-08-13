# M04 · 上下文：媒体和旧历史怎么处理

## Hook
客户资料里有图片和长记录，我先看媒体单独上传、归档旧历史和可读取路径。

## Evidence anchors
- deep-context-002: libs/deepagents/deepagents/middleware/summarization.py:1-58 · 压缩先归档旧历史，再把 summary event 放进私有 state
  - 上下文里的旧内容不是直接蒸发：它先被保存成可 read_file 的 markdown，模型只拿摘要和路径，下一轮还能按需取回。
- deep-context-003: libs/deepagents/deepagents/middleware/summarization.py:42-56 · 媒体会单独上传并在摘要中保留可读取路径
  - 图片不会因为转成文字摘要就无声丢失；系统把它变成文件引用，并告诉接手的模型如何再读。

## Takeaway
压缩应同时产生“模型 working set”和“可恢复 archive pointer”，并且 archive failure 要显式告警。
