1. 需求只有一句“画出支付链路”，我先把参与者、动作和边界拆成模型。
2. 这一章不背图表名词，先看 Diagram Design 怎样把语义、版式和检查写成可调用的 Skill。
3. 固定版本证据：skills/diagram-design/SKILL.md，只展示源码片段和中性文件名。
4. 实现事实一：agent|generate|semantic。
5. 实现事实二：h containment / scope | **Nested** | [type-nested.md](references/type-nested.md) | | Parent → children relationships | **Tree** | 。
6. 数据流：需求 → semantic pattern → visual type → layout rules → checklist。
7. 小白动作：先写一句“这张图要回答什么问题”，再选架构、时序、状态或数据流。
8. 第二个动作：限制节点数、连接器和文字密度，必要时拆图，不缩小到看不见。
9. 边界提醒：它治理的是图的生成规范，不是执行 Agent
10. 把 template、example 和 reference 当证据，不要只复制一张漂亮截图。
11. 模型先成为事实表，视觉只是它的一个投影。
12. 下一章继续用固定提交回答一个真实画图问题。

Fixed commit: 840f944f08be45eed52a6832d4930c11164a546f
