1. 同事说 permission 就能隔离，我把 OS enforcement、显式逃逸授权和凭据防护拆开。
2. 这一章不猜作者意图，只沿固定版本的运行时代码、契约和测试看事实。
3. 固定版本证据：internal/sandbox/sandbox.go:1-14 · Bash 沙箱是独立于 permission 的 OS enforcement 层；internal/sandbox/escape.go:8-46 · 沙箱逃逸是单次、显式、可审计的二次授权；internal/permission/permission.go:1-5 · 权限 Policy 是纯函数，deny→ask→allow→fallback 且按每个路径判定。
4. 事实一：审批是“允许不允许做”，沙箱是“允许做也只能在哪些目录/网络里做”；没有真正的后端时，默认宁可不跑。
5. 源码含义：不要把 Plan mode 或 permission ask 当沙箱；OS backend availability 应有显式 fail-closed 结果。
6. 事实二：沙箱坏了不自动打开裸 shell；只有带 UI 的宿主明确同意某一条命令，才允许这一次越界。
7. 数据流：Boot → Controller/Agent → Provider/工具 → Policy/Sandbox → event wire/Evidence Ledger。
8. 小白动作：先把一轮任务拆成装配、动作、策略、回放和验收五格。
9. 第二个动作：为 thinking、工具、恢复和协作分别记录证据，不要把日志当成事实账本。
10. 局限提醒：macOS Seatbelt、Linux bubblewrap、Windows 差异、workspace roots、network 和 escape approver。
11. 这一章的结论：不要把 Plan mode 或 permission ask 当沙箱；OS backend availability 应有显式 fail-closed 结果。
12. 下一章继续沿固定提交的源码锚点，回答一个真实工作问题。

Fixed commit: 9aaf8d381a214cd2cb6df774d3b207a646ddd651
