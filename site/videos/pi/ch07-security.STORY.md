# M07 · 执行边界：宿主 shell、Trust 与凭据锁

## Hook
同事说 Project Trust 就等于命令审批，我把宿主执行、资源信任和凭据文件保护拆开。

## Evidence anchors
- pi-execution-001: packages/coding-agent/src/core/tools/bash.ts:82-148 · 默认 CLI 在宿主 shell/filesystem 执行，不是沙箱
  - 接口上可以换成远端 VM 或容器，但开箱即用的那套仍是在你的真实电脑里读写和跑命令。
- pi-trust-001: packages/coding-agent/src/core/project-trust.ts:24-95 · Project Trust 保护仓库可执行资源，但不审批每条命令
  - 它问的是“要不要加载这个仓库自带的插件和说明书”，不是“接下来这条 rm 命令能不能执行”。
- pi-auth-001: packages/coding-agent/src/core/auth-storage.ts:21-145 · 本地凭据文件使用权限收紧和跨进程锁
  - 密钥本不仅不让其他本机用户随便看，两个 Pi 进程同时刷新 token 时也不会互相踩掉。

## Takeaway
企业无人值守场景必须提供另一套 ExecutionEnv，不能把接口抽象等同于安全隔离。
