# M06 · 权限：first-match 规则与 execute gate 缺口

## Hook
同事说文件规则就等于权限，我把 allow/deny/interrupt 和通用 execute gate 分开检查。

## Evidence anchors
- deep-security-001: libs/deepagents/deepagents/middleware/filesystem.py:383-430 · FilesystemPermission 是 first-match allow/deny/interrupt 规则
  - 权限规则像防火墙：先匹配到的规则生效，读写可以拒绝，敏感路径可以暂停让人确认。
- deep-security-002: libs/deepagents/deepagents/middleware/filesystem.py:1649-1674 · 权限对可执行 backend 的通用 execute gate 明确还没实现
  - 文件读写权限很细，但一旦后端允许 shell，通用权限规则不能假装能限制 shell 里的任意命令；代码选择直接拒绝这种配置。
- deep-security-003: libs/code/deepagents_code/agent.py:774-810 · DeepAgents Code 的 shell allow-list 在 execute 前直接返回错误
  - 非交互模式下，危险 shell 不是等人点确认，而是根本不执行；并且不能用空列表伪装成限制或用 all 绕过。

## Takeaway
路径权限要固定顺序、拒绝目录穿越，并让“需要审批”与“直接拒绝”是不同结果。
