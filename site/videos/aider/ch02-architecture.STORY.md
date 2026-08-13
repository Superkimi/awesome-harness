# M02 · 架构：模型、上下文和编辑器怎样分工

## Hook
架构评审只剩十分钟，我得把 Coder、Repo Map 和模型适配层说清楚。

## Evidence anchors
- aider-provider-001: aider/models.py:985-1037 · LiteLLM 是统一 Provider 适配层
  - Aider 把各家模型 API 的差异交给 LiteLLM，自己的核心只面对一套近似 OpenAI 的消息格式。
- aider-context-001: aider/coders/base_coder.py:1226-1338 · 上下文被拆成稳定的 ChatChunks
  - Aider 不把所有材料乱塞成一团，而是把“规则、示例、历史、仓库地图、文件正文、当前问题”分舱装箱。
- aider-edit-001: aider/coders/base_coder.py:124-201 · 编辑协议是可替换 Coder 家族
  - Aider 把“模型应该怎样描述改动”做成多种可换的方言，并按模型能力选择最合适的一种。

## Takeaway
接模型很快，但 Provider 行为、重试和能力元数据也部分受 LiteLLM 语义约束。
