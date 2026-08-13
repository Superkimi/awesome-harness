# M04 · Provider：动态提示和过期 token 刷新

## Hook
客户临时换模型，我先看 provider 系统提示、usage 变换和 token refresh 如何放进边界。

## Evidence anchors
- prime-provider-001: packages/agent/src/types.ts:170-183 · 运行时支持 provider 动态系统提示和过期 token 刷新
  - 长时间工具执行后，下一次模型调用仍能拿到最新授权和最新资源说明。
- prime-arch-002: packages/agent/src/agent-loop.ts:467-521 · Provider 边界前才做上下文变换和密钥解析
  - 上下文不会在会话开始时被一次性拍扁，长任务中每次请求都可以重新裁剪、换系统提示和刷新短期 token。

## Takeaway
多 provider harness 应把 credential refresh 和 system prompt resolution 做成 request-time hook，而不是启动时静态读取。
