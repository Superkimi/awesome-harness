1. 产品要加 Skill，我先确认它怎么被发现、加载和撤回。
2. 这一章不讲概念，先看 OpenWork 怎样把问题变成可观察的工作流。
3. 固定版本证据：apps/server/src/skills.ts，画面只展示中性文件名和源码片段。
4. 真实源码锚点：apps/server/src/skills.ts · listSkills|globalAgents|upsertSkill。
5. 白话理解：name, description, path: skillPath, scope, trigger: trigger.trim() || undefined, }; } async function listSkillsInDir(dir: string, 。
6. 数据流：任务目标 → 会话状态 → ecosystem → 校验 → 结果交付。
7. 小白动作：先写一个目标，再记录每次状态变化，不要只看最终答案。
8. 第二个动作：把成功条件和拒绝条件各写一句。
9. 边界提醒：UI 边界不等于 OS 级沙箱，执行器仍要单独审计。
10. 看到回执、快照和限制条件，再决定是否交付。
11. 扩展面要有目录、契约和卸载路径。
12. 下一章继续用固定源码回答一个具体工作问题。
