1. 同事说只看最终答案就够了，我沿 processor 看它怎样把中间过程保存下来。
2. 这一章不猜作者意图，只沿固定版本的运行时代码、协议和测试看事实。
3. 固定版本证据：packages/opencode/src/session/processor.ts:315-413 · stream processor 把 reasoning、text、tool、usage、patch 全部事件化持久；packages/opencode/src/session/processor.ts:539-597 · 重试、拒绝、上下文溢出和中断有不同终态。
4. 事实一：模型的思考、文字、每次工具起止和文件变化都不是终端里一闪而过，而是独立可回放的事件。
5. 源码含义：TUI、Web、Desktop、ACP 可以消费同一事件模型。
6. 事实二：网络抖动会重试，权限拒绝会刹车，记忆塞满会整理，进程被打断则把未完成工具明确标成中止，不会都混成一个“失败”。
7. 数据流：用户消息 → session/processor → Provider 与工具事件 → compaction/permission → patch、回退和交付。
8. 小白动作：先给每一步记录状态，再区分成功、拒绝、超限和中断四种终态。
9. 第二个动作：改文件先看 diff，做高风险动作前让权限规则和 doom-loop 检查说清楚。
10. 局限提醒：已审计 AI SDK provider 装载、协议变换、参数/headers hooks、SSE timeout 和 usage。
11. 这一章的结论：TUI、Web、Desktop、ACP 可以消费同一事件模型。
12. 下一章继续沿固定提交的源码锚点，回答一个真实工作问题。

Fixed commit: cc4b45612974f735ddec46009ede07729511fba4
