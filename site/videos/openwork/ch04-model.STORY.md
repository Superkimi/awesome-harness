# M04 · 模型与消息：流式结果如何进入状态

## Hook
同事说模型输出偶尔丢字，我先追一条消息从哪里进入状态。

## Evidence
- apps/server/src/routes/sessions.ts · opencode|message|session

## Lesson
流式消息要有顺序、游标和错误边界。
