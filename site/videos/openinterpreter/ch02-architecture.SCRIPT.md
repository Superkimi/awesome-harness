1. 架构评审只剩十分钟，我得说清楚请求从哪层进来、哪层改协议、哪层执行。
2. 这一章不猜作者意图，只沿固定版本的运行时代码、协议和测试看事实。
3. 固定版本证据：codex-rs/app-server-protocol/src/protocol/v2/interpreter.rs:8-44 · Provider、Wire API、Harness 是三层独立选择；codex-rs/core/src/harness/routing.rs:5-151 · 路由矩阵在代码里硬校验，不兼容组合直接报错；codex-rs/core/src/harness/request.rs:1-8 · 请求仿真的单一入口统一处理前置与后置整形。
4. 事实一：“连哪家服务器”“用哪个模型”“让请求长得像哪个 Coding Agent”不是同一个开关。
5. 源码含义：可做跨模型的 Harness A/B；默认映射是产品经验规则，不代表所有组合都兼容。
6. 事实二：不是把任意协议和任意外壳随便相乘；路由表会在发请求前拦住不支持的组合。
7. 数据流：请求 → Harness 路由 → turn/step → 工具与权限 → JSONL/可恢复结果。
8. 小白动作：先写清要兼容的行为，再列 Provider、Wire API、Harness 三个独立选择。
9. 第二个动作：把工具、指令和沙箱的边界分别验一遍，不要只看一个“允许”按钮。
10. 局限提醒：Responses/Chat/Messages、provider 默认 harness、请求/响应整形与兼容边界。
11. 这一章的结论：可做跨模型的 Harness A/B；默认映射是产品经验规则，不代表所有组合都兼容。
12. 下一章继续沿固定提交的源码锚点，回答一个真实工作问题。

Fixed commit: 984acc698cd038885ecb0b82721402b01e11a5ad
