# M09 · 协作：RLM registry 与 daemon resident worker

- Project: Legacy Prime Agent
- Fixed source commit: 7787f07415d843b9a800f6a4720e0c739bd608e5
- Evidence ledger: data/legacy/evidence/prime-agent/evidence.json
- Episode: ch09-collaboration
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - packages/coding-agent/src/core/rlm-runtime.ts:14-39 · RLM child runtime 有显式 registry、深度和完成释放协议
  - packages/coding-agent/src/modes/daemon/daemon-supervisor.ts:158-212 · Daemon supervisor 是 resident worker 控制面而不是一次性 subprocess
  - packages/coding-agent/src/modes/daemon/daemon-supervisor.ts:1125-1184 · Prompt admission 与 heartbeat 让 daemon 交互可取消且可观测
  - packages/coding-agent/src/modes/daemon/daemon-supervisor.ts:49-53 · Daemon/RLM 的恢复正确性依赖多个 journal、lease 和 session 入口协同
