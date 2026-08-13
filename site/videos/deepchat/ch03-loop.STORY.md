# M03 · 主循环：任务为什么会继续推进

## Hook
同事说聊天发出后工具没有继续，我先沿着 SessionTurn 看一次运行的闸门。

## Source proof
- src/main/session/turn.ts · sendMessageUnderSessionGate|startInitialTurn

## Lesson
turn boundary 和 session gate 让一次任务有明确的推进节奏。
