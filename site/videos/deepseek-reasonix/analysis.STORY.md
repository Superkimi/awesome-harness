# DeepSeek-Reasonix · 技术分析总览

## Hook
评审问我：这个 Harness 怎么把 thinking、工具、沙箱、MCP 和 Evidence Ledger 组成一条可审计链？我沿固定证据拆。

## Evidence anchors
- reasonix-arch-001: internal/boot/boot.go:1-8 · Boot 是唯一装配根，所有前端共享同一套 Harness
  - 终端、桌面和服务端不是各写一套 Agent，而是都插到同一个“总电闸”上，所以权限、工具和生命周期不会因为换界面而变一套。
- reasonix-provider-003: internal/provider/openai/openai.go:279-316 · DeepSeek thinking 与工具调用 reasoning replay 是显式协议分支
  - Reasonix 没把 DeepSeek 当普通 OpenAI 接口：它记得“思考字段”要跟着工具调用回放，并把 Beta 截断续写和断网重试接在同一个流上。
- reasonix-tools-001: internal/agent/execute_one.go:20-80 · 每个工具调用固定经过 parse→policy→prepare→finish 四阶段
  - 模型只递交一张工单；真正执行前会先确认工具身份、是否允许、是否会改文件、是否拿到写锁和快照，执行后还要把回执写回账本。
- reasonix-sandbox-001: internal/sandbox/sandbox.go:1-14 · Bash 沙箱是独立于 permission 的 OS enforcement 层
  - 审批是“允许不允许做”，沙箱是“允许做也只能在哪些目录/网络里做”；没有真正的后端时，默认宁可不跑。
- reasonix-persist-003: internal/evidence/evidence.go:348-373 · Evidence Ledger 把交付验收从文本变成可检查事实
  - 后台任务说“我改好了”不会自动算完成；只有主任务成功收下回执，证据才从临时状态转为已提交。

## Takeaway
自研时应把 frontend 变成事件消费者，避免在 UI 层重复实现 turn、审批和恢复。
