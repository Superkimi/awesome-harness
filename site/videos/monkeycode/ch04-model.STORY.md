# M04 · 模型代理：临时密钥怎样不暴露上游

## Hook
客户要切模型但不能把真实凭据发给 CLI，我先看 VM 绑定密钥和协议白名单。

## Evidence anchors
- monkey-provider-001: backend/biz/task/usecase/task.go:585-590 · LLM proxy 用 VM 绑定临时密钥隐藏真实上游凭据
  - 工作 VM 拿的是代金券，不是模型厂商的保险柜钥匙；平台看到券后再替它换成真正凭据。
- monkey-provider-002: backend/biz/llmproxy/proxy.go:28-34 · 代理只放行三种 LLM 协议，并阻止任务偷换模型
  - 这不是任意 HTTP 隧道；票上写的是哪个模型，就只能点那个模型。

## Takeaway
可撤销密钥、统一用量和上游切换都集中在控制面。
