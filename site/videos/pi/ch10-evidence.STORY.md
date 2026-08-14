# M10 · 证据：JSONL 会话树与窄行为评测

## Hook
评审问“回退和质量能不能证明”，我用 append-only 会话、事件账本和 eval 边界回答。

## Evidence anchors
- pi-session-001: packages/coding-agent/src/core/session-manager.ts:30-153 · 会话是 append-only JSONL 树，可移动叶子、fork 和保存扩展状态
  - 聊天不是一条会被覆盖的直线，而是一棵只追加的版本树；回到旧节点不会删除未来分支。
- pi-observability-001: packages/agent/src/types.ts:138-220 · 事件和会话账本细，输出模式丰富，但内核不是完整 OTEL 平台
  - 本地回放和多种客户端接入很强，能知道花了多少 token、每个工具发生了什么；但不像企业观测平台那样开箱把每步发到 OTEL 后端。
- pi-evals-001: packages/evals/src/pi-harness.ts:40-170 · 机制测试密集，但仓库行为 eval 目前很窄
  - 发动机零件测试很多，真正让整车跑复杂编程赛道的公开考试却还很少。

## Takeaway
天然支持回溯、分叉和扩展持久状态，适合审计和复杂交互。
