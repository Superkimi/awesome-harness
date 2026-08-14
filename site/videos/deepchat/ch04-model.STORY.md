# M04 · 模型与消息：流式结果如何进入状态

## Hook
模型输出分成好多段，我想知道 DeepChat 怎样把它们拼回可恢复的消息。

## Source proof
- src/main/session/turn.ts · runtime|provider|message

## Lesson
流式 provider 结果要经过 turn、message 和 transcript 才能留下事实。
