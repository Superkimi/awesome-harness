# M03 · 主循环：通知、约束和并发工具一起推进

- Project: Legacy Kimi CLI
- Fixed source commit: cbc15c076d17f70fec9f89c90c0502e68657f505
- Evidence ledger: data/legacy/evidence/kimi-cli/evidence.json
- Episode: ch03-loop
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - src/kimi_cli/soul/kimisoul.py:1132-1194 · 每 step 先注入通知/动态约束，再一次生成并等待并发工具
  - src/kimi_cli/soul/kimisoul.py:622-653 · steer 与 D-Mail 提供两种中途改道机制
