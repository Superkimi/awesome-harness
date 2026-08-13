# Prime Agent · 技术分析总览

- Project: Legacy Prime Agent
- Fixed source commit: 7787f07415d843b9a800f6a4720e0c739bd608e5
- Evidence ledger: data/legacy/evidence/prime-agent/evidence.json
- Episode: analysis
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - packages/agent/src/agent-loop.ts:178-205 · 低层 Agent Loop 是可复用的 provider-neutral 状态机
  - packages/agent/src/agent-loop.ts:608-623 · 工具调用先预检再执行，支持串行和并行两条路径
  - packages/coding-agent/src/core/compaction/compaction.ts:122-132 · 默认压缩预留 16384 token，尾部保留 20000 token
  - packages/coding-agent/src/core/rlm-runtime.ts:14-39 · RLM child runtime 有显式 registry、深度和完成释放协议
  - packages/agent/src/types.ts:399-421 · Agent events 覆盖 agent、turn、message 和 tool execution 四层
