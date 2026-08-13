# M05 · 工具与审批：能力很多，但默认很宽

## Hook
模型能做的不止读写文件；我先看工具面、Approval 分级和 yolo 默认意味着什么。

## Evidence anchors
- omp-tools-001: packages/coding-agent/src/tools/index.ts:38-105 · 内建工具面远超文件与 shell
  - 它更像一套本地 Agent 操作系统，而不是四件套 coding CLI。
- omp-approval-001: packages/coding-agent/src/tools/approval.ts:13-39 · Approval 分级完整，但默认是 yolo
  - 门卫机制很成熟，但默认把门敞开；用户不改设置时，bash、browser、task 等执行级工具通常不询问。

## Takeaway
覆盖广但默认 prompt/tool schema 成本和安全面都更大，需要动态激活与分组。
