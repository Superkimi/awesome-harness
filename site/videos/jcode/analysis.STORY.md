# JCode · 技术分析总览

## Hook
评审问我：这个 Agent 怎么把可恢复 turn、多 Provider、压缩、工具闸门和 swarm 放在一起？我沿固定证据拆。

## Evidence anchors
- jcode-loop-001: crates/jcode-app-core/src/agent/turn_execution.rs:4-35 · 每个用户 turn 先写盘，再进入可恢复的流式循环
  - 模型还没开口，用户输入已经落账；即使后面 API 或工具出错，恢复时也不会连问题本身都丢掉。
- jcode-provider-001: crates/jcode-provider-core/src/lib.rs:76-126 · Provider 契约不仅抽象生成，还抽象认证、路由、transport 与原生能力
  - 它不是只把 URL 换掉；连“谁付费、用哪条线路、能不能续上服务端会话、工具由谁执行、压缩由谁做”都在同一接口里。
- jcode-context-001: crates/jcode-base/src/prompt.rs:451-557 · 静态前缀与每轮动态上下文分离，memory 放尾部保缓存
  - 不常变的说明书放书脊，记忆和本轮提醒贴在最后一页；这样改便签不会让整本书的缓存失效。
- jcode-security-001: crates/jcode-app-core/src/tool/mod.rs:543-601 · 工具边界由 session allow/disable 与外部 pre_tool gate 双层控制
  - 先看这把工具是否在本会话工具箱里，再给企业自定义门卫一次否决机会；门卫自己坏了时默认放行。
- jcode-collab-001: crates/jcode-app-core/src/server/swarm.rs:1528-1613 · 轻量 swarm 先让协调者规划 2–4 个任务，再并发 fork Provider
  - 先拆成几张独立工单，让多个复制了同一模型线路的工人同时做，最后由原会话汇总。
- jcode-persist-001: crates/jcode-base/src/session/persistence.rs:307-395 · Session 用完整 snapshot 加 append-only JSONL journal
  - 平时只往流水账追加新变化，偶尔把整本账重抄成快照；这样频繁保存不会每次重写全部历史。

## Takeaway
耐崩溃性强，但每轮和工具结果频繁保存会增加本地 I/O，需要 journal 快路径配合。
