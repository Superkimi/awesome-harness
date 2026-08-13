1. 模型想重写整个文件，我先检查 Write、Edit 和已知文件集的共同不变量。
2. 这一章不猜作者意图，只沿固定版本的运行时代码、扩展和测试看事实。
3. 固定版本证据：.pi/extensions/write-guard/index.ts:35-75 · 禁止整文件覆写是跨 Write 与 shell 的不变量；.pi/extensions/read-guard-edit/index.ts:4-29 · Edit 强制先 Read，成功 Write/Edit 也更新已知文件集。
4. 事实一：小模型想偷懒把整个文件重写，换成 `cat > file` 也绕不过去；它被迫做小块精确修改。
5. 源码含义：安全/质量不变量应按“副作用”覆盖所有等价工具，而不是只拦一个工具名。
6. 事实二：模型不能凭印象猜 oldText；先亲眼看过文件，才有资格改。
7. 数据流：用户目标 → pi/扩展 → 上下文与工具约束 → 子 Agent 或文件动作 → session evidence。
8. 小白动作：先给任务设一个边界，再列输入、动作、检查和交付四格。
9. 第二个动作：遇到长任务先压缩输入，再给工具和子 Agent 设能力上限。
10. 局限提醒：已审计事件层 write/edit/shell guard、allowlist 和 malformed tool-call 修复。
11. 这一章的结论：安全/质量不变量应按“副作用”覆盖所有等价工具，而不是只拦一个工具名。
12. 下一章继续沿固定提交的源码锚点，回答一个真实工作问题。

Fixed commit: 0b7234031aabe56163e345792ce7a6ea05af321a
