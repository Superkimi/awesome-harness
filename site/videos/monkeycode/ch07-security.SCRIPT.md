1. 同事说 auto-approve 就等于平台放行，我再查 VM 边界、CLI 继承权限和 DNS rebinding 防护。
2. 这一章不猜作者意图，只沿固定版本的运行时代码、契约和测试看事实。
3. 固定版本证据：backend/biz/task/usecase/task.go:157-163 · 平台只转发 auto-approve，具体权限语义继承所选 CLI；backend/pkg/taskflow/types.go:72-92 · 隔离边界主要依赖仓库外 VM，Codex 内层 sandbox 明确关闭；backend/pkg/netguard/guard.go:53-69 · SSRF guard 能防 DNS rebinding，但私有化示例默认关闭。
4. 事实一：平台提供“自动点同意”的总开关，但什么动作需要同意、允许后能做多大，仍由里面那套 CLI 决定。
5. 源码含义：统一 UI 不等于统一安全语义，需要为每个 runtime 建立可比较的 capability policy。
6. 事实二：Codex 在房间里面拿的是万能钥匙；安全取决于这个“房间”到底是不是一间真正隔离的 VM，而造房间的代码不在本仓库。
7. 数据流：任务 → DB/VM/Redis → CLI 或 LLM proxy → MCP/权限 → 流、审计和交付。
8. 小白动作：先把任务状态拆成创建、启动、运行、失败、回收五个节点。
9. 第二个动作：把平台边界和 CLI 内层能力分开，记录谁负责权限、压缩和恢复。
10. 局限提醒：已审计 owner write gate、auto-approve、LLM proxy allowlist、SSRF guard 与资源包安全。
11. 这一章的结论：统一 UI 不等于统一安全语义，需要为每个 runtime 建立可比较的 capability policy。
12. 下一章继续沿固定提交的源码锚点，回答一个真实工作问题。

Fixed commit: fcc5320b15a10dfec4d5891ce44d9d1470e10c2b
