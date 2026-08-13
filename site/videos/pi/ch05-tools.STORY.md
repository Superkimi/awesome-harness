# M05 · 工具：并行、精确编辑与双阈值截断

## Hook
模型要改文件又读大输出，我先看并行策略、唯一替换和 read/bash 两套截断。

## Evidence anchors
- pi-tool-dispatch-001: packages/agent/src/agent-loop.ts:411-553 · 工具默认可并行，声明 sequential 或全局策略才串行
  - 互不冲突的工具一起跑更快；有副作用的工具可以声明排队。即使并发完成顺序不同，交给模型的账本仍按原顺序。
- pi-edit-001: packages/coding-agent/src/core/tools/edit.ts:33-53 · 编辑采用唯一精确替换，并对同一文件串行化
  - 它不凭模糊相似度猜改哪里；目标文字必须只出现一次。同一文件上的两把手术刀要排队，避免互相覆盖。
- pi-tool-output-001: packages/coding-agent/src/core/tools/truncate.ts:1-12 · read 与 bash 使用不同方向的双阈值截断
  - 读文件通常从开头看，命令日志通常看结尾报错；超出的内容没有直接消失，而是留全文路径。

## Takeaway
吞吐高，但自定义工具作者必须正确声明副作用和并发语义。
