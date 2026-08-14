1. 架构评审只剩十分钟，我得把 Coder、Repo Map 和模型适配层说清楚。
2. 这一章不猜作者意图，只沿着固定版本的运行时代码、协议和测试看事实。
3. 固定版本证据：aider/models.py:985-1037 · LiteLLM 是统一 Provider 适配层；aider/coders/base_coder.py:1226-1338 · 上下文被拆成稳定的 ChatChunks；aider/coders/base_coder.py:124-201 · 编辑协议是可替换 Coder 家族。
4. 事实一：Aider 把各家模型 API 的差异交给 LiteLLM，自己的核心只面对一套近似 OpenAI 的消息格式。
5. 源码含义：接模型很快，但 Provider 行为、重试和能力元数据也部分受 LiteLLM 语义约束。
6. 事实二：Aider 不把所有材料乱塞成一团，而是把“规则、示例、历史、仓库地图、文件正文、当前问题”分舱装箱。
7. 数据流：需求 → Repo Map/上下文 → Provider → Coder 编辑 → Git/日志交付。
8. 小白动作：先限制本次聊天文件集，再让模型 dry-run，确认 diff 后才授权写入。
9. 第二个动作：为每个自动动作保留 commit、日志和成本记录，失败时能回放。
10. 局限提醒：已审计 Model.send_completion、LiteLLM 与流/非流处理。
11. 这一章的结论：接模型很快，但 Provider 行为、重试和能力元数据也部分受 LiteLLM 语义约束。
12. 下一章继续沿着固定提交的源码锚点，回答一个真实工作问题。

Fixed commit: 5dc9490bb35f9729ef2c95d00a19ccd30c26339c
