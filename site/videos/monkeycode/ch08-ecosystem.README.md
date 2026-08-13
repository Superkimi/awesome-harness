# M08 · 资源：rules、skills、plugins 谁覆盖谁

- Project: Legacy MonkeyCode
- Fixed source commit: fcc5320b15a10dfec4d5891ce44d9d1470e10c2b
- Evidence ledger: data/legacy/evidence/monkeycode/evidence.json
- Episode: ch08-ecosystem
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - backend/biz/task/usecase/task.go:795-803 · rules、skills、plugins 是三条不同投放链
  - backend/biz/agentresource/types.go:99-126 · 资源按 global/team/user 合并，同名 user 覆盖 team 覆盖 global
  - backend/biz/agentresource/unpack.go:12-31 · zip 资源有文件数、单文件、总量和 zip-slip 双重校验
