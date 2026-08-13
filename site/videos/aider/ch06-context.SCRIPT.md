1. 仓库太大，整包塞给模型肯定超窗；我用 Repo Map、ChatChunks 和摘要把重点找回来。
2. 这一章不猜作者意图，只沿着固定版本的运行时代码、协议和测试看事实。
3. 固定版本证据：aider/coders/base_coder.py:1226-1338 · 上下文被拆成稳定的 ChatChunks；aider/repomap.py:300-363 · Repo Map 是基于符号引用图的 PageRank；aider/repomap.py:629-706 · Repo Map 用二分搜索贴合 token 预算。
4. 事实一：Aider 不把所有材料乱塞成一团，而是把“规则、示例、历史、仓库地图、文件正文、当前问题”分舱装箱。
5. 源码含义：分舱让缓存、token 统计和不同模型的 system-message 兼容更可控。
6. 事实二：它不是简单列目录，而是判断“哪些文件定义了被很多地方引用的名字、哪些又和当前问题相关”，再把最重要的代码骨架给模型。
7. 数据流：需求 → Repo Map/上下文 → Provider → Coder 编辑 → Git/日志交付。
8. 小白动作：先限制本次聊天文件集，再让模型 dry-run，确认 diff 后才授权写入。
9. 第二个动作：为每个自动动作保留 commit、日志和成本记录，失败时能回放。
10. 局限提醒：已审计 ChatChunks、RepoMap、历史摘要和 token 门。
11. 这一章的结论：分舱让缓存、token 统计和不同模型的 system-message 兼容更可控。
12. 下一章继续沿着固定提交的源码锚点，回答一个真实工作问题。

Fixed commit: 5dc9490bb35f9729ef2c95d00a19ccd30c26339c
