# M07 · 权限与沙箱：默认关闭意味着什么

## Hook
同事说有 sandbox 就安全，我把权限流水线、后台 fail closed 和默认非沙箱退回拆开。

## Evidence anchors
- claude-code-permission-001: src/utils/permissions/permissions.ts:1179-1281 · 权限是“规则 → 工具自检 → 安全检查 → 模式 → 用户/自动判定”的有序流水线
  - 不是一个总开关，而是多道门；即使开了 bypass，显式 ask 和某些安全路径仍能拦住。
- claude-code-permission-002: src/utils/permissions/permissions.ts:392-470 · 无头与后台 Agent 默认不能弹窗，先给 hook/分类器机会再 fail closed
  - 没人盯屏幕时不会卡在“请点允许”；可以让自动政策先裁决，裁决不了再拒绝或向上冒泡。
- claude-code-sandbox-001: src/utils/sandbox/sandbox-adapter.ts:1-22 · 有真实 OS sandbox 适配，但默认关闭且默认允许退回非沙箱命令
  - 确实能装防护罩，但开箱时罩子没扣上，而且政策默认允许个别命令绕开它。
- claude-code-sandbox-002: src/utils/hooks.ts:1041-1088 · hook 只做网络沙箱，包装失败时会继续无沙箱执行
  - hook 能被断网，但仍可改本机文件；连断网罩都戴不上时，为兼容旧行为会直接执行。

## Takeaway
规则优先级清晰，适合企业策略；复杂度也意味着每种工具必须准确返回 decisionReason。
