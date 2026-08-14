# M05 · 工具：串行默认与 batch 并发上限

## Hook
工具调用不能无限并发，我先看 typed registry、十个 batch 上限和双预算闸门。

## Evidence anchors
- jcode-tools-001: crates/jcode-tool-core/src/lib.rs:9-65 · 工具是 typed registry，定义顺序与 intent 字段集中标准化
  - 每件工具都交同一种说明书和回执；“为什么调用”不是每个工具自己记得就写，而是总装配线强制补上。
- jcode-tools-002: crates/jcode-app-core/src/agent/turn_loops.rs:878-917 · 普通模型工具调用串行，显式 batch 最多并发十个
  - 模型一次开几张普通工单时按顺序做；只有明确使用 batch 托盘，才会同时跑最多十件事。
- jcode-tools-003: crates/jcode-app-core/src/tool/mod.rs:627-678 · 工具输出有双预算闸门，前台命令超时可升级后台
  - 一份巨型日志不能吃掉整本上下文；长命令如果只是前台等不及，会转到后台继续，而显式后台设置的超时才负责杀进程组。

## Takeaway
便于 UI 显示与审计，稳定排序提高 prompt cache hit。
