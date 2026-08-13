# M02 · 架构：Provider、Wire API、Harness 三层分开

## Hook
架构评审只剩十分钟，我得说清楚请求从哪层进来、哪层改协议、哪层执行。

## Evidence anchors
- oi-harness-002: codex-rs/app-server-protocol/src/protocol/v2/interpreter.rs:8-44 · Provider、Wire API、Harness 是三层独立选择
  - “连哪家服务器”“用哪个模型”“让请求长得像哪个 Coding Agent”不是同一个开关。
- oi-harness-003: codex-rs/core/src/harness/routing.rs:5-151 · 路由矩阵在代码里硬校验，不兼容组合直接报错
  - 不是把任意协议和任意外壳随便相乘；路由表会在发请求前拦住不支持的组合。
- oi-harness-004: codex-rs/core/src/harness/request.rs:1-8 · 请求仿真的单一入口统一处理前置与后置整形
  - 每种外壳的怪癖被收在一个总路由器里：发出前改请求，回来后必要时把文本动作翻译成工具动作。

## Takeaway
可做跨模型的 Harness A/B；默认映射是产品经验规则，不代表所有组合都兼容。
