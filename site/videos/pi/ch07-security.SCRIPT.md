1. 同事说 Project Trust 就等于命令审批，我把宿主执行、资源信任和凭据文件保护拆开。
2. 这一章不猜作者意图，只沿固定版本的运行时代码、契约和测试看事实。
3. 固定版本证据：packages/coding-agent/src/core/tools/bash.ts:82-148 · 默认 CLI 在宿主 shell/filesystem 执行，不是沙箱；packages/coding-agent/src/core/project-trust.ts:24-95 · Project Trust 保护仓库可执行资源，但不审批每条命令；packages/coding-agent/src/core/auth-storage.ts:21-145 · 本地凭据文件使用权限收紧和跨进程锁。
4. 事实一：接口上可以换成远端 VM 或容器，但开箱即用的那套仍是在你的真实电脑里读写和跑命令。
5. 源码含义：企业无人值守场景必须提供另一套 ExecutionEnv，不能把接口抽象等同于安全隔离。
6. 事实二：它问的是“要不要加载这个仓库自带的插件和说明书”，不是“接下来这条 rm 命令能不能执行”。
7. 数据流：用户消息 → turn/session → Provider 与工具 → compaction/权限 → JSONL 会话和交付。
8. 小白动作：先把长任务拆成主循环、上下文、工具、信任和观测五格。
9. 第二个动作：为并发、重试、编辑和回退各写一个明确终态，不要只看“运行中”。
10. 局限提醒：默认 Node/CLI 运行在宿主；sandbox 与 command approval 仅有可选 extension 示例。
11. 这一章的结论：企业无人值守场景必须提供另一套 ExecutionEnv，不能把接口抽象等同于安全隔离。
12. 下一章继续沿固定提交的源码锚点，回答一个真实工作问题。

Fixed commit: 581d75a89cea21e50d6a26df840352f94427f633
