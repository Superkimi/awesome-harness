1. 研究、整理、写信三件事同时来，我想知道远程子 Agent 怎么交接。
2. 这一章不背名词，先看 Eigent 怎样把桌面任务拆成能交接的状态。
3. 固定版本证据：server/app/model/remote_sub_agent/provider.py，只展示源码片段和中性文件名。
4. 实现事实一：validate_enabled_config|endpoint_url。
5. 实现事实二：False api_key: str = "" endpoint_url: str = "" agent_name: str = "" model_name: str = "" config: dict | None = None @model_validat。
6. 数据流：目标 → 任务/记忆状态 → 工具或动作 → 校验 → 结果交付。
7. 小白动作：先写目标和完成条件，再给每个动作留一条可回看的记录。
8. 第二个动作：把可自动、需确认、拒绝三类权限分开。
9. 边界提醒：Python CAMEL/后端服务与 Electron 前端的链路较长
10. 看到状态、回执和限制条件，再决定是否交付。
11. 协作单元要有 endpoint、身份和启用校验，不能只靠一个按钮。
12. 下一章继续用固定提交回答一个真实工作问题。

Fixed commit: 88d837f75ad95a21eebaa638072adad2019644be
