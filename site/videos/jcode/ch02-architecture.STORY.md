# M02 · 架构：Provider、Prompt 和 Tool Registry

## Hook
架构评审只剩十分钟，我得讲清认证路由、上下文拼装和 typed tool registry 谁负责什么。

## Evidence anchors
- jcode-provider-001: crates/jcode-provider-core/src/lib.rs:76-126 · Provider 契约不仅抽象生成，还抽象认证、路由、transport 与原生能力
  - 它不是只把 URL 换掉；连“谁付费、用哪条线路、能不能续上服务端会话、工具由谁执行、压缩由谁做”都在同一接口里。
- jcode-context-001: crates/jcode-base/src/prompt.rs:451-557 · 静态前缀与每轮动态上下文分离，memory 放尾部保缓存
  - 不常变的说明书放书脊，记忆和本轮提醒贴在最后一页；这样改便签不会让整本书的缓存失效。
- jcode-tools-001: crates/jcode-tool-core/src/lib.rs:9-65 · 工具是 typed registry，定义顺序与 intent 字段集中标准化
  - 每件工具都交同一种说明书和回执；“为什么调用”不是每个工具自己记得就写，而是总装配线强制补上。

## Takeaway
多后端能力完整，但 trait 面积很大，新 Provider 的一致性测试成本高。
