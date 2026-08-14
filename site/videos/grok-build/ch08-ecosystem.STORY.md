# M08 · 沙箱：真正隔离与降级边界

## Hook
要让 Agent 改文件但不能越界，我先看内核沙箱、网络隔离和失败降级。

## Evidence anchors
- grok-sandbox-001: crates/codegen/xai-grok-sandbox/src/lib.rs:8-18 · 提供真正的内核级文件系统沙箱
  - 这不只是“执行前问一下”，操作系统内核会真的挡住不允许的文件访问。
- grok-sandbox-002: crates/codegen/xai-grok-sandbox/src/lib.rs:107-129 · 沙箱不支持或应用失败时会降级继续
  - 配置了沙箱不等于一定锁住；系统不支持时默认是“报警后继续”，不是整个 Agent 拒绝启动。
- grok-sandbox-003: crates/codegen/xai-grok-sandbox/src/lib.rs:8-18 · 子进程网络隔离与主进程网络分离
  - Agent 自己可以连模型服务，但它启动的 bash 不一定能上网，减少 curl 下载执行或数据外传风险。
- grok-sandbox-004: crates/codegen/xai-grok-sandbox/src/profiles.rs:113-167 · 项目不能覆写同名全局安全 Profile
  - 恶意仓库不能悄悄做一个同名“strict”配置，把你信任的全局规则掏空。

## Takeaway
在这 14 个项目里，Grok Build 的安全边界属于更强的系统级设计。
