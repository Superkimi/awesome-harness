# M07 · 安全：审批、权限和边界

## Hook
要删掉一个 Runtime，却发现还有 active agent 绑定着它。

## Source proof
- server/cmd/multica/cmd_runtime.go · cascade|active agents|unbind

## Lesson
删除、解绑和 cascade 语义必须先处理仍在运行的 Agent。
