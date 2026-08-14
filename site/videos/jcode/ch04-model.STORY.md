# M04 · Provider：九类 runtime 走同一事件流

## Hook
客户要切 runtime，我先看 MultiProvider、兼容 profile 和服务端原生能力如何汇合。

## Evidence anchors
- jcode-provider-001: crates/jcode-provider-core/src/lib.rs:76-126 · Provider 契约不仅抽象生成，还抽象认证、路由、transport 与原生能力
  - 它不是只把 URL 换掉；连“谁付费、用哪条线路、能不能续上服务端会话、工具由谁执行、压缩由谁做”都在同一接口里。
- jcode-provider-002: crates/jcode-base/src/provider/mod.rs:328-374 · MultiProvider 同时容纳九类 runtime 与兼容端点 profile
  - 像一个总机：同一 Agent 可以接订阅 CLI、官方 API、Copilot、Gemini、Bedrock 或自定义兼容网关，并保留各自认证身份。
- jcode-provider-003: crates/jcode-app-core/src/agent/turn_loops.rs:485-547 · 服务端会话、原生工具和原生压缩都能穿过统一事件流
  - 底层 Provider 可以说“以后用这个会话号续聊”“我已经压缩过了”或“替我本地跑这个工具”，上层都能接住。

## Takeaway
多后端能力完整，但 trait 面积很大，新 Provider 的一致性测试成本高。
