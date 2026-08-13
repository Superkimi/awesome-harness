1. 客户要换模型，我先看 AI SDK 适配矩阵和 request prepare 如何保持调用层稳定。
2. 这一章不猜作者意图，只沿固定版本的运行时代码、协议和测试看事实。
3. 固定版本证据：packages/opencode/src/provider/provider.ts:101-145 · Provider 层是 AI SDK 适配矩阵，不只兼容 OpenAI API；packages/opencode/src/session/llm/request.ts:56-100 · 请求准备层统一合并 prompt、variant、provider options 与 hooks。
4. 事实一：它不是把所有厂商硬塞成同一种 HTTP；每家方言由独立适配器翻译。
5. 源码含义：模型覆盖广，但 provider 特例数量大，回归测试成本高。
6. 事实二：模型请求像一张多层样式表：厂商默认、模型设置、Agent 设置、当前档位和插件逐层覆盖。
7. 数据流：用户消息 → session/processor → Provider 与工具事件 → compaction/permission → patch、回退和交付。
8. 小白动作：先给每一步记录状态，再区分成功、拒绝、超限和中断四种终态。
9. 第二个动作：改文件先看 diff，做高风险动作前让权限规则和 doom-loop 检查说清楚。
10. 局限提醒：已审计 AI SDK provider 装载、协议变换、参数/headers hooks、SSE timeout 和 usage。
11. 这一章的结论：模型覆盖广，但 provider 特例数量大，回归测试成本高。
12. 下一章继续沿固定提交的源码锚点，回答一个真实工作问题。

Fixed commit: cc4b45612974f735ddec46009ede07729511fba4
