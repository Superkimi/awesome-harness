# M06 · 上下文：JSONL、checkpoint 与活动任务恢复

## Hook
长任务快超窗，我先看事件账本、旧文件保留、压缩阈值和后台任务恢复。

## Evidence anchors
- kimi-context-001: src/kimi_cli/soul/context.py:20-65 · 上下文是可增量恢复的 JSONL 事件账本
  - 每条对话、存档点和 token 仪表读数都单独写一行；尾部坏一行不会让整场会话报废。
- kimi-context-002: src/kimi_cli/soul/context.py:123-200 · checkpoint 回退会保留旧文件并重算状态
  - 读档时旧账本不会消失，而是改名存档；新账本只抄到目标存档点。
- kimi-context-003: src/kimi_cli/soul/compaction.py:37-82 · 压缩由阈值触发，摘要旧历史并保留最近轮次
  - 箱子快满时，把旧账压成一页摘要，最近几轮原样保留；摘要过程不能再调用工具。
- kimi-context-004: src/kimi_cli/soul/kimisoul.py:1432-1476 · 压缩后显式恢复活动后台任务与动态约束状态
  - 摘要不会让正在跑的 build/test 凭空消失；压缩后会重新贴一张活动任务清单，并让 Plan/AFK 提醒重新校准。

## Takeaway
易审计、易增量追加；没有数据库事务，靠逐行容错和旋转文件恢复。
