# M07 · 安全：OS 沙箱与 deny/ask/allow 策略分开

## Hook
同事说 permission 就能隔离，我把 OS enforcement、显式逃逸授权和凭据防护拆开。

## Evidence anchors
- reasonix-sandbox-001: internal/sandbox/sandbox.go:1-14 · Bash 沙箱是独立于 permission 的 OS enforcement 层
  - 审批是“允许不允许做”，沙箱是“允许做也只能在哪些目录/网络里做”；没有真正的后端时，默认宁可不跑。
- reasonix-sandbox-002: internal/sandbox/escape.go:8-46 · 沙箱逃逸是单次、显式、可审计的二次授权
  - 沙箱坏了不自动打开裸 shell；只有带 UI 的宿主明确同意某一条命令，才允许这一次越界。
- reasonix-security-001: internal/permission/permission.go:1-5 · 权限 Policy 是纯函数，deny→ask→allow→fallback 且按每个路径判定
  - 权限规则可以单测；一个 move 同时碰两个路径时，只要一个路径被拒就拒绝整单；`bash -c`、`eval` 这类能藏第二条命令的写法不会被普通前缀规则轻易放过。
- reasonix-security-002: internal/boot/boot.go:200-211 · 凭据防护同时覆盖子进程环境、敏感文件和诊断文本
  - 项目目录里的配置不能偷偷改全局 secret 开关；工具子进程拿到的是清理后的环境，日志/错误边界还会把常见 token 形状打码。

## Takeaway
不要把 Plan mode 或 permission ask 当沙箱；OS backend availability 应有显式 fail-closed 结果。
