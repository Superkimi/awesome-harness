# M07 · 安全：聊天文件集不是完整沙箱

## Hook
同事说选中的文件就是安全边界，我再往下查 shell 和权限，避免把“可见”误当成“隔离”。

## Evidence anchors
- aider-permission-001: aider/coders/base_coder.py:2215-2240 · “聊天文件集”就是主要写权限边界
  - 文件有没有放进聊天，不只是上下文选择，也决定模型能不能直接改它。
- aider-shell-001: aider/coders/base_coder.py:2434-2485 · Shell 在宿主机执行，没有 OS 沙箱
  - 命令执行前会问你，但点了同意以后就是在真实终端里跑；Aider 本身没有容器、seccomp 或工作区文件系统隔离。

## Takeaway
Aider 把最重要的权限问题压缩成一个易懂交互，但它不是细粒度路径策略或 RBAC。
