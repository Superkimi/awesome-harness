# M08 · 扩展：指令、Skills 和同进程插件

- Project: Legacy Pi
- Fixed source commit: 581d75a89cea21e50d6a26df840352f94427f633
- Evidence ledger: data/legacy/evidence/pi/evidence.json
- Episode: ch08-ecosystem
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - packages/coding-agent/src/core/system-prompt.ts:28-71 · 系统指令由 tool、context files、skills、custom/append prompt 多层拼装
  - packages/coding-agent/src/core/skills.ts:118-188 · Skill 采用懒加载目录，项目范围受 trust 控制
  - packages/coding-agent/src/core/extensions/loader.ts:66-124 · 扩展在同一进程执行，覆盖面接近完整产品内核
