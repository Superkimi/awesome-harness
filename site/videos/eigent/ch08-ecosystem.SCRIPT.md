1. 团队想把 Skill 装进工作台，但我不想每个人都手动配一遍。
2. 这一章不背名词，先看 Eigent 怎样把桌面任务拆成能交接的状态。
3. 固定版本证据：src/lib/skillToolkit.ts，只展示源码片段和中性文件名。
4. 实现事实一：skill|toolkit|install。
5. 实现事实二：Copyright 2025-2026 @ Eigent.ai All Rights Reserved. ========= import { getConnectionConfig } from '@/store/connectionStore'; /** 。
6. 数据流：目标 → 任务/记忆状态 → 工具或动作 → 校验 → 结果交付。
7. 小白动作：先写目标和完成条件，再给每个动作留一条可回看的记录。
8. 第二个动作：把可自动、需确认、拒绝三类权限分开。
9. 边界提醒：Python CAMEL/后端服务与 Electron 前端的链路较长
10. 看到状态、回执和限制条件，再决定是否交付。
11. Skill 和 toolkit 是扩展入口，安装动作要能被记录和复用。
12. 下一章继续用固定提交回答一个真实工作问题。

Fixed commit: 88d837f75ad95a21eebaa638072adad2019644be
