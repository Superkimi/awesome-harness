# M03 · 主循环：任务为什么会继续推进

## Hook
运营说一个 Agent 的任务量突然涨了，我先沿着 Runtime 活动看它跑到哪一步。

## Source proof
- server/cmd/multica/cmd_runtime.go · runRuntimeActivity|runRuntimeUsage|APIContext

## Lesson
任务不是一句 prompt，而是可以查询的活动和用量轨迹。
