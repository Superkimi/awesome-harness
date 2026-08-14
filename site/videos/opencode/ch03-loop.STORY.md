# M03 · 主循环：reasoning、tool 和 patch 都成为事件

## Hook
同事说只看最终答案就够了，我沿 processor 看它怎样把中间过程保存下来。

## Evidence anchors
- opencode-stream-001: packages/opencode/src/session/processor.ts:315-413 · stream processor 把 reasoning、text、tool、usage、patch 全部事件化持久
  - 模型的思考、文字、每次工具起止和文件变化都不是终端里一闪而过，而是独立可回放的事件。
- opencode-retry-001: packages/opencode/src/session/processor.ts:539-597 · 重试、拒绝、上下文溢出和中断有不同终态
  - 网络抖动会重试，权限拒绝会刹车，记忆塞满会整理，进程被打断则把未完成工具明确标成中止，不会都混成一个“失败”。

## Takeaway
TUI、Web、Desktop、ACP 可以消费同一事件模型。
