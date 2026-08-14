# M10 · 证据：typed event、CAS 和验收账本

## Hook
评审问“交付事实在哪里”，我用 typed wire、revision/CAS、Evidence Ledger 和 loop 测试回答。

## Evidence anchors
- reasonix-persist-001: internal/agent/save.go:26-74 · 会话持久化是带 revision/CAS 的 append-only event log
  - 两个进程同时写同一会话时，旧进程不能把新内容抹掉；坏掉的 JSONL 尾巴先修，冲突会留下可恢复分支。
- reasonix-persist-002: internal/eventwire/wire.go:9-31 · 前端收到的是稳定 typed event wire，不是拼接日志
  - 桌面、TUI、HTTP 都能用同一套事件渲染工具卡、审批卡、压缩卡和成本仪表，不必从人类日志里猜状态。
- reasonix-persist-003: internal/evidence/evidence.go:348-373 · Evidence Ledger 把交付验收从文本变成可检查事实
  - 后台任务说“我改好了”不会自动算完成；只有主任务成功收下回执，证据才从临时状态转为已提交。
- reasonix-tests-001: internal/agent/loop_e2e_test.go:68-102 · 测试覆盖了真实 loop 的配对、取消、断流恢复和 compaction 熔断
  - 这些不是只测 helper 的单元测试，而是把模型流、工具、session 和恢复串起来，专门覆盖最容易把长任务搞坏的边界。

## Takeaway
长任务恢复需要 append-only log、版本号、锁和 conflict branch，单纯覆盖一个 chat.json 不够。
