1. 同事说输出限制就算沙箱，我把宿主 shell、行/字节上限和临时文件边界拆开。
2. 这一章不猜作者意图，只沿固定版本的运行时代码、契约和测试看事实。
3. 固定版本证据：packages/coding-agent/src/core/tools/bash.ts:36-58 · 默认 bash 是宿主 shell，不等于 OS 沙箱；packages/coding-agent/src/core/tools/bash.ts:250-266 · Bash 输出有行/字节上限并把完整内容留在临时文件；packages/coding-agent/src/core/extensions/types.ts:1080-1163 · 扩展可以获得 shell/exec 和 active tool 控制权，权限面很宽。
4. 事实一：它能可靠地超时和杀掉进程树，但默认命令就是在当前机器的 shell 里跑；源码没有在这里自动启动容器、Seatbelt 或 bubblewrap。
5. 源码含义：如果产品面向不可信仓库，必须显式注入远端/容器 BashOperations 或在更上层做 sandbox policy，不能把 timeout 当隔离。
6. 事实二：大日志不会把上下文撑爆，模型还能拿到一个完整输出文件路径继续查。
7. 数据流：纯 loop → coding host → resources/extensions → RLM/daemon → JSONL events 和恢复。
8. 小白动作：先把任务拆成 loop、工具、上下文、协作和持久化五格。
9. 第二个动作：为每个后台任务记录 admission、heartbeat、lease 和完成释放，避免幽灵进程。
10. 局限提醒：bash 默认 spawn 宿主 shell；BashOperations 可换远端执行器，但本包没有默认 OS sandbox。
11. 这一章的结论：如果产品面向不可信仓库，必须显式注入远端/容器 BashOperations 或在更上层做 sandbox policy，不能把 timeout 当隔离。
12. 下一章继续沿固定提交的源码锚点，回答一个真实工作问题。

Fixed commit: 7787f07415d843b9a800f6a4720e0c739bd608e5
