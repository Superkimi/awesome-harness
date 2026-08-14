1. 客户资料里有图片和长记录，我先看媒体单独上传、归档旧历史和可读取路径。
2. 这一章不猜作者意图，只沿固定版本的运行时代码、契约和测试看事实。
3. 固定版本证据：libs/deepagents/deepagents/middleware/summarization.py:1-58 · 压缩先归档旧历史，再把 summary event 放进私有 state；libs/deepagents/deepagents/middleware/summarization.py:42-56 · 媒体会单独上传并在摘要中保留可读取路径。
4. 事实一：上下文里的旧内容不是直接蒸发：它先被保存成可 read_file 的 markdown，模型只拿摘要和路径，下一轮还能按需取回。
5. 源码含义：压缩应同时产生“模型 working set”和“可恢复 archive pointer”，并且 archive failure 要显式告警。
6. 事实二：图片不会因为转成文字摘要就无声丢失；系统把它变成文件引用，并告诉接手的模型如何再读。
7. 数据流：create_deep_agent → middleware graph → backend/tools → policy/sandbox → checkpoint/session/grader。
8. 小白动作：先把任务拆成 middleware、backend、工具、权限和观测五格。
9. 第二个动作：为子 Agent、MCP、shell 和插件分别记录 trust、allowlist、sandbox 和恢复边界。
10. 局限提醒：0.85/0.10 model-aware trigger/keep、overflow fallback、markdown offload、media path 和 manual compact。
11. 这一章的结论：压缩应同时产生“模型 working set”和“可恢复 archive pointer”，并且 archive failure 要显式告警。
12. 下一章继续沿固定提交的源码锚点，回答一个真实工作问题。

Fixed commit: 217b9eb372fa51b0439434f31abc3ac22e6cd7f2
