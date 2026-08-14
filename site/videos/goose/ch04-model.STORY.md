# M04 · 模型与消息：流式结果怎样变成可追踪状态

## Hook
模型输出是一段一段来的，但工具参数不能半截执行；我先看 Provider 契约怎样把两者分开。

## Evidence anchors
- goose-provider-001: crates/goose-provider-types/src/base.rs:281-286 · Provider 以流式协议统一，工具调用必须完整再上送
  - 不同模型厂商先被翻译成同一种“消息水管”。普通文字可以一个词一个词流出，但工具参数不能半截就执行。

## Takeaway
Provider 适配层承担格式差异，Agent 主循环不需要为每家 API 复制控制逻辑。
