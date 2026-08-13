# M04 · Provider：多模型与真实 completion 预算

- Project: Legacy Kimi CLI
- Fixed source commit: cbc15c076d17f70fec9f89c90c0502e68657f505
- Evidence ledger: data/legacy/evidence/kimi-cli/evidence.json
- Episode: ch04-model
- Delivery: engineering-only HyperFrames + independent SRT; no MP4 requested
- Source anchors:
  - src/kimi_cli/llm.py:326-470 · 同一 LLM 层支持 Kimi、OpenAI、Anthropic、Gemini 与 Vertex
  - src/kimi_cli/llm.py:181-263 · completion 上限按真实请求估算并留安全边际
