1. 客户遇到网络波动，我先看 Provider 分流、fallback 和独立超时如何避免整轮失败。
2. 这一章不猜官方意图，只沿固定版本的复原代码、协议和测试看事实。
3. 固定版本证据：src/services/api/claude.ts:1282-1338 · 共享预处理之后按 Provider 分流，Anthropic 仍是最深的主路径；src/services/api/claude.ts:818-925 · 流式异常可退回非流式请求，且为 fallback 设置独立超时。
4. 事实一：先把所有方言共有的消息账本整理好，再交给各家的翻译器；Anthropic 方言拥有最完整的缓存、thinking 和 beta 功能。
5. 源码含义：多模型可用性强，但新增兼容层不自动获得 Anthropic 路径全部语义，必须独立做工具与 usage 回归。
6. 事实二：流式通道卡住时会换普通请求再试，不让“无限等待”成为默认恢复策略。
7. 数据流：用户消息 → query/Provider → 工具与权限 → compaction/Agent → JSONL 会话与可回退结果。
8. 小白动作：先确认实现来源和许可边界，再用一个小任务验证循环、工具、权限、恢复四件事。
9. 第二个动作：失败时分别记录 provider、context、permission 和 sandbox，不要把所有错误归成“模型不行”。
10. 局限提醒：审计 Anthropic 主路径、Bedrock/Vertex 相关参数和本 fork 增加的 OpenAI/Gemini/Grok adapter。
11. 这一章的结论：多模型可用性强，但新增兼容层不自动获得 Anthropic 路径全部语义，必须独立做工具与 usage 回归。
12. 下一章继续沿固定提交的源码锚点，回答一个真实工作问题。

Fixed commit: 3bb6b5746238c418138eb96d57765d79012edd96
