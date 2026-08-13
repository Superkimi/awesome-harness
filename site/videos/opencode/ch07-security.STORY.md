# M07 · 安全：默认 ask、语法树扫描和 doom-loop

## Hook
同事说 shell 前缀白名单就够了，我把 last-match 权限、Bash 语法树和死循环确认拆开。

## Evidence anchors
- opencode-permission-001: packages/opencode/src/permission/index.ts:28-37 · 权限采用 last-match wildcard 规则，默认 ask 而非默认 allow
  - 越靠后的规则优先；没写明能不能做时先问人。点“始终允许”会记住本次运行，但不是永久改配置。
- opencode-permission-003: packages/opencode/src/session/processor.ts:331-380 · 连续相同工具调用触发 doom-loop 二次确认
  - 模型若一直用相同参数撞同一扇门，系统不会无限烧 token，而是停下来问人。
- opencode-shell-001: packages/opencode/src/tool/shell.ts:257-291 · shell 权限不是简单字符串前缀，而是 Bash/PowerShell 语法树扫描
  - 它会拆开一条复杂命令，分别看里面有哪些子命令和文件路径，而不是只看第一个单词。
- opencode-sandbox-001: packages/opencode/src/tool/shell.ts:293-309 · shell 最终直接启动宿主子进程，没有内建 OS 沙箱
  - 权限门像门卫，但命令一旦放行就在你的真实机器上跑，并不是在一次性隔离箱里。

## Takeaway
顺序非常重要，配置合并必须可解释；临时批准不会静默写回磁盘。
