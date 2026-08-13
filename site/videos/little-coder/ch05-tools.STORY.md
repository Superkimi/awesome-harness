# M05 · 编辑：为什么不允许整文件覆盖

## Hook
模型想重写整个文件，我先检查 Write、Edit 和已知文件集的共同不变量。

## Evidence anchors
- little-edit-001: .pi/extensions/write-guard/index.ts:35-75 · 禁止整文件覆写是跨 Write 与 shell 的不变量
  - 小模型想偷懒把整个文件重写，换成 `cat > file` 也绕不过去；它被迫做小块精确修改。
- little-edit-002: .pi/extensions/read-guard-edit/index.ts:4-29 · Edit 强制先 Read，成功 Write/Edit 也更新已知文件集
  - 模型不能凭印象猜 oldText；先亲眼看过文件，才有资格改。

## Takeaway
安全/质量不变量应按“副作用”覆盖所有等价工具，而不是只拦一个工具名。
