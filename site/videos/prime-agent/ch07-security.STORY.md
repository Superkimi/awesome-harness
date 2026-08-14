# M07 · 执行边界：宿主 bash 和临时文件输出

## Hook
同事说输出限制就算沙箱，我把宿主 shell、行/字节上限和临时文件边界拆开。

## Evidence anchors
- prime-exec-001: packages/coding-agent/src/core/tools/bash.ts:36-58 · 默认 bash 是宿主 shell，不等于 OS 沙箱
  - 它能可靠地超时和杀掉进程树，但默认命令就是在当前机器的 shell 里跑；源码没有在这里自动启动容器、Seatbelt 或 bubblewrap。
- prime-exec-002: packages/coding-agent/src/core/tools/bash.ts:250-266 · Bash 输出有行/字节上限并把完整内容留在临时文件
  - 大日志不会把上下文撑爆，模型还能拿到一个完整输出文件路径继续查。
- prime-risk-001: packages/coding-agent/src/core/extensions/types.ts:1080-1163 · 扩展可以获得 shell/exec 和 active tool 控制权，权限面很宽
  - 插件一旦被加载，不只是加一段说明，它可以执行命令、改工具面、持久化状态和注册模型。

## Takeaway
如果产品面向不可信仓库，必须显式注入远端/容器 BashOperations 或在更上层做 sandbox policy，不能把 timeout 当隔离。
