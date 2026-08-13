# M07 · 安全：聊天文件集不是完整沙箱

- Project: Legacy Aider
- Fixed source commit: 5dc9490bb35f9729ef2c95d00a19ccd30c26339c
- Evidence ledger: data/legacy/evidence/aider/evidence.json
- Episode: ch07-security
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - aider/coders/base_coder.py:2215-2240 · “聊天文件集”就是主要写权限边界
  - aider/coders/base_coder.py:2434-2485 · Shell 在宿主机执行，没有 OS 沙箱
