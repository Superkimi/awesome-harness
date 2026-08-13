# M07 · 安全：审批、权限和边界

## Hook
新插件要求自动授权，评审让我先说明 permission context 到底控制什么。

## Source proof
- packages/app/src/context/permission.tsx · permission|auto|grant

## Lesson
权限是独立边界，不应该和插件能力一起默认放开。
