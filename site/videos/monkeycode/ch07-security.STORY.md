# M07 · 安全：VM、权限转发与 SSRF guard

## Hook
同事说 auto-approve 就等于平台放行，我再查 VM 边界、CLI 继承权限和 DNS rebinding 防护。

## Evidence anchors
- monkey-permission-001: backend/biz/task/usecase/task.go:157-163 · 平台只转发 auto-approve，具体权限语义继承所选 CLI
  - 平台提供“自动点同意”的总开关，但什么动作需要同意、允许后能做多大，仍由里面那套 CLI 决定。
- monkey-sandbox-001: backend/pkg/taskflow/types.go:72-92 · 隔离边界主要依赖仓库外 VM，Codex 内层 sandbox 明确关闭
  - Codex 在房间里面拿的是万能钥匙；安全取决于这个“房间”到底是不是一间真正隔离的 VM，而造房间的代码不在本仓库。
- monkey-security-001: backend/pkg/netguard/guard.go:53-69 · SSRF guard 能防 DNS rebinding，但私有化示例默认关闭
  - 防护能力本身很认真，但自建用户照示例部署时默认不会打开这扇防火门。

## Takeaway
统一 UI 不等于统一安全语义，需要为每个 runtime 建立可比较的 capability policy。
