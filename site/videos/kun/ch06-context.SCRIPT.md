1. 桌面重启后任务还得接着做，我先查 Kun 的 runtime data recovery。
2. 这一章不背 API，先看 Kun 怎样把 Direct、Graph 和 runtime 变成可追踪的任务。
3. 固定版本证据：src/shared/runtime-data-recovery.ts，只展示源码片段和中性文件名。
4. 实现事实一：Recovery|candidate|inventory。
5. 实现事实二：import { z } from 'zod' export const RUNTIME_DATA_RECOVERY_SCHEMA_VERSION = 1 as const export const RuntimeDataRecoveryCandidateKi。
6. 数据流：目标 → graph/runtime 节点 → 工具或 Agent → 权限/状态 → 交付物。
7. 小白动作：先画节点输入和输出，再补取消、审批和恢复三条边。
8. 第二个动作：给每个扩展声明 schema、能力和可见范围。
9. 边界提醒：桌面应用与运行时耦合度仍然较高
10. 看到 status、cancel 和 recovery 记录，再决定是否交付。
11. 恢复候选、库存和状态机共同决定能否接着工作。
12. 下一章继续用固定提交回答一个真实工作问题。

Fixed commit: 1377249652cef30f9f7b777f8f6111fd6ac70fc9
