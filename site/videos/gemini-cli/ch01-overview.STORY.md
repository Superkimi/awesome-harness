# M01 · 总览：递归消息流与可回放会话

## Hook
老板让我跑一条长任务，我先确认 Gemini CLI 如何限制 turn、保存 checkpoint 并支持 rewind。

## Evidence anchors
- gemini-loop-001: packages/core/src/core/client.ts:79-111 · 主 Harness 用递归 sendMessageStream 驱动多 turn，硬上限为 100
  - 一次用户请求可以连续让模型说、用工具、再说；但最多转 100 圈，避免无尽自言自语。
- gemini-persistence-001: packages/core/src/services/chatRecordingService.ts:150-203 · 会话记录是增量 JSONL，支持 rewind、metadata patch 和完整 checkpoint
  - 对话文件像事件日志：可以写“回到某一步”、只改元数据，也能偶尔写一张完整快照；一行坏了不拖垮整份会话。

## Takeaway
控制流直观，递归路径共享 prompt_id 和 hook state，需要严格做 activeCalls 记账。
