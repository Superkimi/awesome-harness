# M06 · 上下文：大仓库怎样只带最有用的代码

## Hook
仓库太大，整包塞给模型肯定超窗；我用 Repo Map、ChatChunks 和摘要把重点找回来。

## Evidence anchors
- aider-context-001: aider/coders/base_coder.py:1226-1338 · 上下文被拆成稳定的 ChatChunks
  - Aider 不把所有材料乱塞成一团，而是把“规则、示例、历史、仓库地图、文件正文、当前问题”分舱装箱。
- aider-repomap-001: aider/repomap.py:300-363 · Repo Map 是基于符号引用图的 PageRank
  - 它不是简单列目录，而是判断“哪些文件定义了被很多地方引用的名字、哪些又和当前问题相关”，再把最重要的代码骨架给模型。
- aider-repomap-002: aider/repomap.py:629-706 · Repo Map 用二分搜索贴合 token 预算
  - 先排好“谁最重要”，再用二分法找出能塞进模型窗口的最大一组，而不是拍脑袋截前 100 个。
- aider-summary-001: aider/models.py:339-358 · 历史摘要保留近期尾部并递归收缩头部
  - 老对话压成摘要，最近几轮尽量原样保留；压完还太大就再压一次。
- aider-context-002: aider/coders/base_coder.py:1396-1417 · 预测超窗时由用户决定是否硬发
  - Aider 会提前报警，但不会偷偷重写上下文；你可以执意发送，失败后自己缩小范围。

## Takeaway
分舱让缓存、token 统计和不同模型的 system-message 兼容更可控。
