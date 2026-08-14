1. 研究要后台跑，我先看 child runtime、深度、lease、heartbeat 和释放协议。
2. 这一章不猜作者意图，只沿固定版本的运行时代码、契约和测试看事实。
3. 固定版本证据：packages/coding-agent/src/core/rlm-runtime.ts:14-39 · RLM child runtime 有显式 registry、深度和完成释放协议；packages/coding-agent/src/modes/daemon/daemon-supervisor.ts:158-212 · Daemon supervisor 是 resident worker 控制面而不是一次性 subprocess；packages/coding-agent/src/modes/daemon/daemon-supervisor.ts:1125-1184 · Prompt admission 与 heartbeat 让 daemon 交互可取消且可观测。
4. 事实一：子 Agent 不是简单 `Promise.all`：父子关系、状态、目录、模型、深度和完成后回收都有可查询的对象。
5. 源码含义：多 Agent 系统要把 child 生命周期持久化，才能支持观察、取消、恢复和成本归因。
6. 事实二：后台 Agent 可以脱离前台 UI 常驻，客户端断线后仍能通过 socket 找回 worker，恢复 journal 和 heartbeat。
7. 数据流：纯 loop → coding host → resources/extensions → RLM/daemon → JSONL events 和恢复。
8. 小白动作：先把任务拆成 loop、工具、上下文、协作和持久化五格。
9. 第二个动作：为每个后台任务记录 admission、heartbeat、lease 和完成释放，避免幽灵进程。
10. 局限提醒：RLM child registry、daemon resident workers、prompt admission、heartbeats 与 recovery journals。
11. 这一章的结论：多 Agent 系统要把 child 生命周期持久化，才能支持观察、取消、恢复和成本归因。
12. 下一章继续沿固定提交的源码锚点，回答一个真实工作问题。

Fixed commit: 7787f07415d843b9a800f6a4720e0c739bd608e5
