# M09 · 协作：RLM registry 与 daemon resident worker

## Hook
研究要后台跑，我先看 child runtime、深度、lease、heartbeat 和释放协议。

## Evidence anchors
- prime-collab-001: packages/coding-agent/src/core/rlm-runtime.ts:14-39 · RLM child runtime 有显式 registry、深度和完成释放协议
  - 子 Agent 不是简单 `Promise.all`：父子关系、状态、目录、模型、深度和完成后回收都有可查询的对象。
- prime-collab-002: packages/coding-agent/src/modes/daemon/daemon-supervisor.ts:158-212 · Daemon supervisor 是 resident worker 控制面而不是一次性 subprocess
  - 后台 Agent 可以脱离前台 UI 常驻，客户端断线后仍能通过 socket 找回 worker，恢复 journal 和 heartbeat。
- prime-collab-003: packages/coding-agent/src/modes/daemon/daemon-supervisor.ts:1125-1184 · Prompt admission 与 heartbeat 让 daemon 交互可取消且可观测
  - 用户点了等待式 prompt 后断网，不会留下一个永远占着队列的请求；心跳也能告诉控制面任务还活着还是已断开。
- prime-risk-002: packages/coding-agent/src/modes/daemon/daemon-supervisor.ts:49-53 · Daemon/RLM 的恢复正确性依赖多个 journal、lease 和 session 入口协同
  - 它很强，但出错时要同时判断进程身份、socket、worker 状态、session 文件和 child registry，排障门槛高。

## Takeaway
多 Agent 系统要把 child 生命周期持久化，才能支持观察、取消、恢复和成本归因。
