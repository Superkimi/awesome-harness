# M05 · 参数恢复：模型写错一点也不能全盘失败

## Hook
工具参数少一个字段就崩太脆了；我用恢复层看它怎样把模型瑕疵变成可诊断结果。

## Evidence anchors
- grok-tools-002: crates/codegen/xai-grok-shell/src/session/acp_session_impl/tool_calls.rs:878-950 · 工具参数对模型瑕疵有恢复层
  - 模型偶尔把两个 JSON 粘在一起，Grok Build 会先抢救，不是一看到格式错就整轮失败。

## Takeaway
对模型输出做保守修复能提高成功率，但必须记录恢复行为，避免悄悄改变语义。
