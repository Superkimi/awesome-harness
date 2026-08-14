1. 同事说有 sandbox 就安全，我把权限流水线、后台 fail closed 和默认非沙箱退回拆开。
2. 这一章不猜官方意图，只沿固定版本的复原代码、协议和测试看事实。
3. 固定版本证据：src/utils/permissions/permissions.ts:1179-1281 · 权限是“规则 → 工具自检 → 安全检查 → 模式 → 用户/自动判定”的有序流水线；src/utils/permissions/permissions.ts:392-470 · 无头与后台 Agent 默认不能弹窗，先给 hook/分类器机会再 fail closed；src/utils/sandbox/sandbox-adapter.ts:1-22 · 有真实 OS sandbox 适配，但默认关闭且默认允许退回非沙箱命令。
4. 事实一：不是一个总开关，而是多道门；即使开了 bypass，显式 ask 和某些安全路径仍能拦住。
5. 源码含义：规则优先级清晰，适合企业策略；复杂度也意味着每种工具必须准确返回 decisionReason。
6. 事实二：没人盯屏幕时不会卡在“请点允许”；可以让自动政策先裁决，裁决不了再拒绝或向上冒泡。
7. 数据流：用户消息 → query/Provider → 工具与权限 → compaction/Agent → JSONL 会话与可回退结果。
8. 小白动作：先确认实现来源和许可边界，再用一个小任务验证循环、工具、权限、恢复四件事。
9. 第二个动作：失败时分别记录 provider、context、permission 和 sandbox，不要把所有错误归成“模型不行”。
10. 局限提醒：审计规则优先级、模式、hook/classifier、无头行为与可选 OS sandbox。
11. 这一章的结论：规则优先级清晰，适合企业策略；复杂度也意味着每种工具必须准确返回 decisionReason。
12. 下一章继续沿固定提交的源码锚点，回答一个真实工作问题。

Fixed commit: 3bb6b5746238c418138eb96d57765d79012edd96
