# DeepChat · M01 · 总览：先知道它解决什么问题

## Hook
昨天的对话今天还要继续，我先看看 DeepChat 如何保留上下文。

## Proof
- src/main/session/turn.ts · sendMessageUnderSessionGate|startInitialTurn
- src/main/session/turn.ts · runtime|provider|message
- src/main/session/data/tape.ts · Tape|subagent|sessionTape

## Lesson
先证明一个真实工作结果，再追问它为什么能稳定完成：把 DeepChat 想成一台带录像机的桌面工作站：每次工具动作和会话分叉都留下可恢复的带子，而不是只保留最后一句话。

## Limitation
功能面很宽，旧 runtime 与新 harness 并存时需要 cleanup guard
