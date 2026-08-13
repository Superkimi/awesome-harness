# M01 · 总览：先辨认它，再讲它能做什么

## Hook
同事把“经典 Python 版”当成现状，我先用 identity 和兼容测试把项目真实身份讲清楚。

## Evidence anchors
- oi-identity-001: codex-rs/product-info/src/lib.rs:45-79 · 当前源码不是经典 Python Open Interpreter，而是 Rust/Codex 兼容分叉
  - 它不是在旧 Python 循环上继续打补丁，而是把一套 Codex 级 Rust Harness 换了产品入口，再加入自己的多 Harness 能力。
- oi-identity-002: scripts/test-codex-sdk-compat.sh:21-36 · 兼容性是被测试的产品契约，不只是目录遗留
  - “还能被 Codex SDK 当成 Codex 用”是 CI 级目标，不是偶然能跑。

## Takeaway
评估时必须把它与同批次的 openai/codex 分开：共享基座很多，但 Open Interpreter 的差异主要落在品牌、provider/harness 选择和协议仿真。
