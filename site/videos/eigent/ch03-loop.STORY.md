# M03 · 主循环：任务为什么会继续推进

## Hook
明早要交接的任务卡住了，我想知道 Eigent 怎样让一步接着一步跑。

## Source proof
- backend/app/service/single_agent_service.py · _build_single_agent_context|_response_content

## Lesson
先把任务拆成可推进的动作，再让状态回到循环里。
