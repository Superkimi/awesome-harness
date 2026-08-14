# M10 · 证据与取舍：把源码结论带回自研

## Hook
评审问我“删 Runtime 会不会误伤任务”，我只用固定提交和测试回答。

## Source proof
- server/cmd/multica/cmd_runtime_test.go · Test|runtime|delete

## Lesson
资源生命周期的边界，必须由源码和测试一起证明。
