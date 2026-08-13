# M08 · 扩展：MCP、Skill、插件如何接入

## Hook
团队想让 Agent 多一个 Skill，我先确认技能清单和安装动作是不是同一套资源模型。

## Source proof
- server/cmd/multica/cmd_agent.go · agentSkillsCmd|skills

## Lesson
Skill 不是隐藏配置，而是能列出、查询和交付的能力资源。
