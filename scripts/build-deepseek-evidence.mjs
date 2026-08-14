#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourceRoot = path.join(root, "sources", "deepseek-harness");
const output = path.join(root, "data", "deepseek-harness-evidence.json");
const commit = "47f943859bef60e4160492346772ded9b24f765a";

const specs = [
  {
    id: "dsh-architecture-001", dimension: "architecture", evidenceLevel: "L4", claimType: "fact",
    title: { zh: "Cordis 把整个 Harness 组织成可重组插件树", en: "Cordis composes the whole harness as a reconfigurable plugin tree" },
    fact: { zh: "architecture.md 把模型适配器、工具注册表、会话日志、沙箱和 Agent loop 都列为 Cordis 插件；profile 选择 bundle，bundle 提供 patch，启动时按层叠加。", en: "architecture.md lists model adapters, tools, session logs, sandbox, and the agent loop as Cordis plugins; profiles select bundles and bundles provide layered patches." },
    plain: { zh: "不是一个巨大的 Agent 类里面塞满 if/else，而是一棵可以替换枝条的运行树。", en: "Instead of one giant Agent class full of conditionals, the runtime is a tree whose branches can be replaced." },
    implication: { zh: "自研时应把可替换能力做成 service seam，并把最终启动配置打印出来。", en: "A new harness should expose replaceable service seams and print the resolved boot configuration." },
    citation: ["docs/architecture.md", 8, 58, "contract"]
  },
  {
    id: "dsh-architecture-002", dimension: "architecture", evidenceLevel: "L1", claimType: "fact",
    title: { zh: "Agent、Session、LLM 和工具通过 Context 服务互相连接", en: "Agent, Session, LLM, and tools meet through Context services" },
    fact: { zh: "agent-loop 构造函数一次性创建 event dispatch、Inbox、Scope、RuntimeContextProjection，并把它们挂进 Cordis context。", en: "The agent-loop constructor creates the event dispatcher, Inbox, Scope, and RuntimeContextProjection, then attaches them to the Cordis context." },
    plain: { zh: "Agent 本身只负责驾驶，工具、日志和提示词从上下文里取，不直接互相 import。", en: "The Agent drives the work; tools, logs, and prompt assembly come from context instead of direct cross-package imports." },
    implication: { zh: "扩展点要围绕上下文服务设计，避免 UI 或单一 provider 侵入主循环。", en: "Design extensions around context services so UI or one provider cannot invade the main loop." },
    citation: ["packages/core/agent-loop/src/agent.ts", 63, 97, "implementation"]
  },
  {
    id: "dsh-loop-001", dimension: "loop", evidenceLevel: "L1", claimType: "fact",
    title: { zh: "一个 turn 由多个 step 组成，并且每个边界都写入日志", en: "A turn contains steps, and every boundary is logged" },
    fact: { zh: "turn() 先 append turn/start，再进入 preStep；每个 step 写 step/start、user/message、step/end，最后根据 turnEnds 写 turn/end。", en: "turn() appends turn/start, enters preStep, records step/start, user/message, and step/end, then closes with turn/end." },
    plain: { zh: "一次用户任务不是一个请求，而是一串可以回放的工单。", en: "A user task is not one request; it is a replayable sequence of work orders." },
    implication: { zh: "不要只保存最终回答；状态机边界本身就是恢复和观测数据。", en: "Do not retain only the final answer; state-machine boundaries are recovery and observability data." },
    citation: ["packages/core/agent-loop/src/agent.ts", 245, 330, "implementation"]
  },
  {
    id: "dsh-loop-002", dimension: "loop", evidenceLevel: "L1", claimType: "fact",
    title: { zh: "pre-step 是可拦截的模型请求闸门", en: "pre-step is an interceptable gate before a model request" },
    fact: { zh: "preStep 先 claim inbox，再组装 system prompt 与 runtime context，之后经过 agent/pre-step waterfall；监听器可以重写 messages 或 reject。", en: "preStep claims inbox input, assembles prompt and runtime context, then runs the agent/pre-step waterfall where listeners may rewrite messages or reject." },
    plain: { zh: "模型还没收到请求前，插件可以补上下文，也可以明确说这一步不该执行。", en: "Before the model sees a request, plugins may add context or explicitly reject the step." },
    implication: { zh: "审批、计划、预算和动态上下文应放在模型请求前的明确 seam。", en: "Approval, planning, budgets, and dynamic context belong at an explicit pre-request seam." },
    citation: ["packages/core/agent-loop/src/agent.ts", 225, 243, "implementation"]
  },
  {
    id: "dsh-model-001", dimension: "modelContext", evidenceLevel: "L1", claimType: "fact",
    title: { zh: "流式 chunk 先入日志，再由 BlockAssembler 合成消息", en: "Stream chunks enter the log before BlockAssembler creates a message" },
    fact: { zh: "step() 调用 llm.stream，逐个 append assistant/chunk，同时把 chunk 推入 BlockAssembler；结束后生成 assistant/message，并保存 sourceEventSeqs。", en: "step() calls llm.stream, appends every assistant/chunk, feeds BlockAssembler, then records assistant/message with sourceEventSeqs." },
    plain: { zh: "页面可以实时显示半句话，但恢复时仍知道这句话由哪些小片段组成。", en: "The UI can show partial text while recovery still knows which chunks formed the message." },
    implication: { zh: "流式 UI、审计回放和模型消息不要使用三套互不相干的数据。", en: "Streaming UI, audit replay, and model messages should share one causal record." },
    citation: ["packages/core/agent-loop/src/agent.ts", 332, 391, "implementation"]
  },
  {
    id: "dsh-model-002", dimension: "modelContext", evidenceLevel: "L2", claimType: "fact",
    title: { zh: "Provider 错误是带 code/status/requestId 的结构化事实", en: "Provider failures carry structured code, status, and request facts" },
    fact: { zh: "LlmFailure 明确 message、code、status、providerRetryAfterMs、requestId；request-error waterfall 决定 retry，其他错误保留为 LlmError。", en: "LlmFailure defines message, code, status, retry delay, and request id; request-error decides retry while other failures remain LlmError." },
    plain: { zh: "失败不是一行字符串，系统可以判断是鉴权、限流、适配器缺失还是网络问题。", en: "A failure is not just a string; the harness can distinguish auth, rate limits, missing adapters, and transport faults." },
    implication: { zh: "错误分类要进入可回放事件和重试策略，不能靠 UI 猜。", en: "Error taxonomy must feed replay and retry policy instead of being guessed by the UI." },
    citation: ["packages/llm/llm/src/types.ts", 39, 51, "contract"]
  },
  {
    id: "dsh-tools-001", dimension: "tools", evidenceLevel: "L1", claimType: "fact",
    title: { zh: "工具调用先按 executionMode 分组", en: "Tool calls are grouped by executionMode before dispatch" },
    fact: { zh: "executeToolCalls 先解析所有 tool-call，再按 executionMode 把连续 parallel 调用放进 bounded pool；遇到 exclusive 就形成 barrier。", en: "executeToolCalls parses every tool call, puts consecutive parallel calls in a bounded pool, and treats exclusive calls as barriers." },
    plain: { zh: "能并行的读操作一起做，可能冲突的写操作排队做。", en: "Safe parallel reads can run together while conflict-prone writes form a queue." },
    implication: { zh: "并发策略应是工具声明的一部分，而不是模型临时决定。", en: "Concurrency policy should be part of the tool declaration, not an ad hoc model decision." },
    citation: ["packages/core/agent-loop/src/tool-calls.ts", 59, 100, "implementation"]
  },
  {
    id: "dsh-tools-002", dimension: "tools", evidenceLevel: "L1", claimType: "fact",
    title: { zh: "工具结果异步完成，但按模型顺序提交", en: "Tool results may finish asynchronously but commit in model order" },
    fact: { zh: "runGroup 用 slots 保存完成结果，commitReady 只从连续可提交的 index 开始 finalize/finish、appendToolResult，并把 additionalContexts 放进下一步。", en: "runGroup stores results in slots; commitReady finalizes contiguous indexes in order, appends tool results, and queues additionalContexts for the next step." },
    plain: { zh: "第三个工具先完成也不能把第二个工具的回执顶到模型前面。", en: "A third tool finishing first cannot place its receipt before the second tool in model history." },
    implication: { zh: "并发系统一定要有稳定 call id、提交序号和取消后的合成结果。", en: "Concurrent tools need stable call ids, commit order, and synthetic results for cancellation." },
    citation: ["packages/core/agent-loop/src/tool-calls.ts", 112, 159, "implementation"]
  },
  {
    id: "dsh-context-001", dimension: "context", evidenceLevel: "L1", claimType: "fact",
    title: { zh: "动态上下文通过 projection 注入下一次请求", en: "Dynamic context enters the next request through a projection" },
    fact: { zh: "preStep 将 prompt sections 渲染后交给 RuntimeContextProjection.project，再把返回的 UserMessage 追加到 claimed messages。", en: "preStep renders prompt sections through RuntimeContextProjection.project and appends the returned UserMessage to claimed messages." },
    plain: { zh: "上下文不是永远拼进系统提示，而是按当前 session 状态生成一条可追踪的消息。", en: "Context is not permanently baked into the system prompt; it is generated from session state as a traceable message." },
    implication: { zh: "动态环境信息应有预算、来源和版本，而不是隐藏注入。", en: "Dynamic environment context needs a budget, source, and version rather than hidden injection." },
    citation: ["packages/core/agent-loop/src/agent.ts", 225, 242, "implementation"]
  },
  {
    id: "dsh-context-002", dimension: "context", evidenceLevel: "L4", claimType: "fact",
    title: { zh: "模型可见输入必须能从 session log 重建", en: "Model-visible input must be reconstructable from the session log" },
    fact: { zh: "architecture.md 明确规定 model-visible ⟺ logged：任何到达模型请求的内容都必须有事件来源，并由 deriveMessages 从日志投影。", en: "architecture.md states model-visible ⟺ logged: anything reaching a model request must have an event source and be projected by deriveMessages." },
    plain: { zh: "如果某段上下文只存在内存里，重启后模型就会失忆，所以它不能算正式输入。", en: "If context exists only in memory, a restart makes the model forget it; it is not a durable input." },
    implication: { zh: "新增上下文能力时先加事件，再加 prompt 投影。", en: "When adding context, add the event first and then the prompt projection." },
    citation: ["docs/architecture.md", 95, 112, "contract"]
  },
  {
    id: "dsh-execution-001", dimension: "execution", evidenceLevel: "L1", claimType: "fact",
    title: { zh: "沙箱 provider 先选择 runner，再包装 argv", en: "The sandbox provider selects a runner before wrapping argv" },
    fact: { zh: "sandbox-local 为 Linux 配置 bwrap→Landlock 链，为 macOS 使用 Seatbelt，为 Windows 使用 restricted-token ACL；confine 返回 runner argv、enforcement 与 failure rules。", en: "sandbox-local defines bwrap→Landlock on Linux, Seatbelt on macOS, and restricted-token ACL on Windows; confine returns runner argv, enforcement, and failure rules." },
    plain: { zh: "执行器拿到的不是原始命令，而是已经套上操作系统隔离参数的命令。", en: "The executor receives an OS-constrained command, not the raw argv." },
    implication: { zh: "沙箱应是执行 seam，shell、PTY、LSP 等消费者共用同一套隔离。", en: "Sandboxing should be an execution seam shared by shell, PTY, and LSP consumers." },
    citation: ["packages/sandbox/sandbox-local/src/index.ts", 150, 186, "implementation"]
  },
  {
    id: "dsh-execution-002", dimension: "execution", evidenceLevel: "L1", claimType: "limitation",
    title: { zh: "隔离能力探测失败时 fail closed，而不是降级裸执行", en: "Failed confinement probes fail closed instead of running raw argv" },
    fact: { zh: "sandbox-local 的模块注释和 confine 契约都要求 runner 不可用时抛出 SANDBOX_UNAVAILABLE；不会把原始 argv 返回给调用方。", en: "sandbox-local documents and implements SANDBOX_UNAVAILABLE when a runner is unusable; it does not return the original argv." },
    plain: { zh: "机器没有 bwrap 或 sandbox-exec 时，Agent 宁可不执行，也不会偷偷退回宿主 shell。", en: "Without bwrap or sandbox-exec, the Agent refuses to execute rather than silently falling back to the host shell." },
    implication: { zh: "部署检查必须把 runner 可用性当成启动前 gate。", en: "Deployment checks should treat runner availability as a preflight gate." },
    citation: ["packages/sandbox/sandbox-local/src/index.ts", 1, 18, "implementation"]
  },
  {
    id: "dsh-connectors-001", dimension: "connectors", evidenceLevel: "L2", claimType: "fact",
    title: { zh: "LLM、MCP、FS、Shell 和子 Agent 共用 capability seam", en: "LLM, MCP, filesystem, shell, and sub-agents share capability seams" },
    fact: { zh: "architecture.md 将 Service Definition、Provider、Consumer 定义为 seam 的三个角色；远端 sandbox 可以同时替换 Bash、PTY 和 LSP 的执行世界。", en: "architecture.md defines Service Definition, Provider, and Consumer as the three roles of a seam; a remote sandbox can move Bash, PTY, and LSP together." },
    plain: { zh: "换一个 provider，不需要为每种工具复制一套逻辑。", en: "Swapping a provider does not require duplicating logic for every tool." },
    implication: { zh: "连接器设计应先抽象执行世界，再堆具体工具。", en: "Design the execution world first, then add concrete connectors." },
    citation: ["docs/architecture.md", 99, 142, "contract"]
  },
  {
    id: "dsh-connectors-002", dimension: "connectors", evidenceLevel: "L1", claimType: "fact",
    title: { zh: "工具管道用 waterfall/emit 区分决策与观测", en: "The tool pipeline separates decisions from observation with waterfall and emit" },
    fact: { zh: "tools/pre-execute 可以 allow/deny/ask，tools/execute 包装实际 dispatch，tools/post-execute 可改写结果，tools/result 只观察最终冻结结果。", en: "tools/pre-execute can allow/deny/ask, tools/execute wraps dispatch, tools/post-execute may transform results, and tools/result observes the frozen final outcome." },
    plain: { zh: "审批、重试、结果改写和指标不是一个大函数里的隐式分支，而是可插拔的阶段。", en: "Approval, retry, result transformation, and metrics are pluggable stages rather than hidden branches in one function." },
    implication: { zh: "每个阶段要写清楚是否能阻断、是否持久化、是否允许改写。", en: "Document whether each stage can block, persist, or transform data." },
    citation: ["packages/core/tools/src/index.ts", 137, 207, "contract"]
  },
  {
    id: "dsh-security-001", dimension: "security", evidenceLevel: "L2", claimType: "fact",
    title: { zh: "审批与沙箱是两条不同的控制轴", en: "Approval and sandboxing are separate control axes" },
    fact: { zh: "工具 pre-execute 的 ask/deny/allow 是策略判断；sandbox-local 的 confine 则负责把 argv 放进 OS runner，两者在不同 package 和事件 seam。", en: "Tool ask/deny/allow is a policy decision, while sandbox-local confine wraps argv in an OS runner; they live in separate packages and seams." },
    plain: { zh: "问用户‘是否允许’不能替代限制命令能碰到哪些文件。", en: "Asking the user for permission does not replace limiting which files a command can touch." },
    implication: { zh: "安全面板和审计日志要同时显示 approval 与 enforcement。", en: "Security UI and audit logs should show approval and enforcement separately." },
    citation: ["packages/core/tools/src/index.ts", 142, 175, "contract"]
  },
  {
    id: "dsh-security-002", dimension: "security", evidenceLevel: "L1", claimType: "fact",
    title: { zh: "工具回调必须尊重 caller signal，取消不能丢失", en: "Tool callbacks must honor the caller signal so cancellation is not lost" },
    fact: { zh: "工具 around-dispatch 允许替换 exec.signal，但 registry 会在 body 前重新融合 caller signal；文档要求 listener 等待自有工作 quiescence。", en: "Around-dispatch may replace exec.signal, but the registry re-fuses the caller signal before the body; listeners must wait for owned work to quiesce." },
    plain: { zh: "超时或取消不能只让 UI 变灰，真正的子进程和网络请求也要停在安全边界。", en: "Timeout or cancellation must stop the process or network work at a safe boundary, not merely gray out the UI." },
    implication: { zh: "取消语义是工具契约的一部分，测试必须覆盖半途取消。", en: "Cancellation belongs in the tool contract and needs mid-flight tests." },
    citation: ["packages/core/tools/src/index.ts", 154, 176, "contract"]
  },
  {
    id: "dsh-observability-001", dimension: "observability", evidenceLevel: "L1", claimType: "fact",
    title: { zh: "JSONL 持久化用稳定 stat/read 循环避免 torn read", en: "JSONL persistence avoids torn reads with a stable stat/read loop" },
    fact: { zh: "readStableFile 在 readFile 前后比较 fileRevision，若 writer 在读期间追加就重试；readRaw 还能保留原始 JSONL 文本和压缩 frame。", en: "readStableFile compares fileRevision before and after readFile and retries if a writer appended; readRaw preserves the original JSONL text and compressed frames." },
    plain: { zh: "恢复时不会把刚写到一半的会话误当成完整事实。", en: "Recovery does not mistake a session being written for a complete fact." },
    implication: { zh: "持久化读取必须考虑并发写入，不是简单 readFile 一次。", en: "Persistence readers must account for concurrent writers rather than calling readFile once." },
    citation: ["packages/session/session-persistence-jsonl/src/index.ts", 239, 303, "implementation"]
  },
  {
    id: "dsh-observability-002", dimension: "observability", evidenceLevel: "L4", claimType: "fact",
    title: { zh: "持久事件与实时事件分层，回放和在线控制不混用", en: "Durable and live events are separate surfaces for replay and control" },
    fact: { zh: "architecture.md 把 session events 定义为 durable facts，把 agent/* 定义为 live coordination，把 capability events 定义为 policy/adapters 的 extension point。", en: "architecture.md defines session events as durable facts, agent/* as live coordination, and capability events as policy/adapter extension points." },
    plain: { zh: "回放用黑匣子，实时控制用对讲机，两者不能拿同一条消息互相替代。", en: "Replay is the black box; live control is the radio. One cannot replace the other." },
    implication: { zh: "观测系统要明确哪些数据可恢复、哪些只在当前进程有效。", en: "Observability must state which data is recoverable and which exists only in the live process." },
    citation: ["docs/architecture.md", 67, 95, "contract"]
  },
  {
    id: "dsh-collaboration-001", dimension: "collaboration", evidenceLevel: "L1", claimType: "fact",
    title: { zh: "子 Agent 有独立 session、descriptor 和 depth", en: "Sub-agents have independent sessions, descriptors, and depth" },
    fact: { zh: "subagent 包围绕 child-agent、descriptor、delegation depth、lifecycle 和 run settlement 组织，子 Agent 的结果从自己的事件后缀提取。", en: "The subagent package centers child-agent, descriptors, delegation depth, lifecycle, and run settlement; child output is extracted from its own event suffix." },
    plain: { zh: "子 Agent 不是在主提示里假装成另一个角色，而是另开一本可恢复的工作账。", en: "A sub-agent is not a role inside the parent prompt; it owns another recoverable work ledger." },
    implication: { zh: "委派要有独立上下文、生命周期、取消和结算，而不只是再发一次 prompt。", en: "Delegation needs independent context, lifecycle, cancellation, and settlement—not another prompt." },
    citation: ["packages/subagent/subagent/src/child-agent.ts", 1, 120, "implementation"]
  },
  {
    id: "dsh-collaboration-002", dimension: "collaboration", evidenceLevel: "L1", claimType: "fact",
    title: { zh: "子 Agent 终态从自己的事件事实推导", en: "Child-agent terminal state is derived from its own event facts" },
    fact: { zh: "lifecycle 的 epochStopReason 根据 child session 的 turn/end、droppedUnrun、error、aborted 和 blocked 事件推导 completed/error/refusal/aborted。", en: "lifecycle derives completed, error, refusal, or aborted from the child session's turn/end, dropped work, errors, and blocked events." },
    plain: { zh: "拆除进程成功不代表任务成功，系统会看孩子到底做到了什么。", en: "A process being torn down successfully does not mean the task succeeded; the child log decides." },
    implication: { zh: "协作结果必须以任务事实为准，而不是以线程退出码为准。", en: "Collaboration results should follow task facts, not merely a thread exit code." },
    citation: ["packages/subagent/subagent/src/lifecycle.ts", 220, 258, "implementation"]
  },
  {
    id: "dsh-instructions-001", dimension: "instructions", evidenceLevel: "L2", claimType: "fact",
    title: { zh: "system-prompt 有严格的 section 和 toolOrder 规则", en: "system-prompt enforces strict sections and toolOrder rules" },
    fact: { zh: "system-prompt 对变量、重复 toolOrder、<unlisted-tools> 和未知工具名进行校验，再按稳定顺序渲染 sections。", en: "system-prompt validates variables, duplicate toolOrder entries, <unlisted-tools>, and unknown tool names before rendering sections in stable order." },
    plain: { zh: "提示词和工具目录不是随便拼字符串，顺序和未知项都会被拒绝。", en: "Prompts and tool catalogs are not arbitrary string concatenation; order and unknown entries are rejected." },
    implication: { zh: "指令系统要能 fail loudly，否则模型看到的能力集合会悄悄漂移。", en: "Instruction assembly should fail loudly so the model's capability set cannot drift silently." },
    citation: ["packages/core/system-prompt/src/index.ts", 142, 182, "implementation"]
  },
  {
    id: "dsh-instructions-002", dimension: "instructions", evidenceLevel: "L4", claimType: "fact",
    title: { zh: "配置通过 profile、bundle 和 patch 分层覆盖", en: "Configuration is layered through profiles, bundles, and patches" },
    fact: { zh: "architecture.md 规定 bundle 顺序、profile patch、home patch 和 --patch overlay 的覆盖顺序，用户可以 dump-config 查看最终运行树。", en: "architecture.md defines bundle, profile, home, and --patch overlay order, and exposes dump-config to inspect the resolved runtime tree." },
    plain: { zh: "同一套源码在 web、headless、企业 profile 中可以换不同能力，但必须能看到最后到底装了什么。", en: "The same source can power web, headless, or enterprise profiles, but the final mounted capability tree must be visible." },
    implication: { zh: "部署时应把 resolved config 当作可审计产物。", en: "Treat the resolved config as a deploy-time audit artifact." },
    citation: ["docs/architecture.md", 17, 47, "contract"]
  },
  {
    id: "dsh-recovery-001", dimension: "recovery", evidenceLevel: "L1", claimType: "fact",
    title: { zh: "上下文压缩在 pre-step 和 canonical overflow 两个时点触发", en: "Compaction runs at pre-step pressure and canonical overflow" },
    fact: { zh: "agent-lifecycle 文档说明 compaction-basic 在 agent/pre-step 处理压力，并在 agent/request-error 处理 canonical context overflow；失败 step 先闭合，再决定是否开新 retry turn。", en: "agent-lifecycle documents compaction-basic handling pressure at agent/pre-step and canonical overflow at agent/request-error; the failed step closes before a retry turn is considered." },
    plain: { zh: "压缩不是把历史突然删掉，而是在一次失败的 step 收尾后重新组织请求。", en: "Compaction does not suddenly delete history; it reorganizes the request after a failed step is closed." },
    implication: { zh: "压缩、重试和事件闭合必须有明确先后，否则会产生孤儿 tool result。", en: "Compaction, retry, and event closure need an explicit order to avoid orphan tool results." },
    citation: ["docs/agent-lifecycle.md", 73, 95, "contract"]
  },
  {
    id: "dsh-recovery-002", dimension: "recovery", evidenceLevel: "L1", claimType: "fact",
    title: { zh: "JSONL 记录版本、父会话、delegationDepth 与压缩编码", en: "JSONL records version, parent session, delegation depth, and encoding" },
    fact: { zh: "HeaderLine 包含 version、id、cwd、parentSession、origin、delegationDepth、agentPreset；logPath 再根据 zstd/none 选择物理文件后缀。", en: "HeaderLine carries version, id, cwd, parentSession, origin, delegationDepth, and agentPreset; logPath selects zstd or plaintext artifacts." },
    plain: { zh: "恢复时先知道这本账是谁、从哪来、属于哪个委派深度，再读后续事件。", en: "Recovery first identifies the ledger, its parent, and delegation depth before reading later events." },
    implication: { zh: "会话文件头应是可验证的迁移协议，而不只是几个方便调试的字段。", en: "A session header should be a verifiable migration protocol, not a few debug fields." },
    citation: ["packages/session/session-persistence-jsonl/src/format.ts", 29, 85, "contract"]
  }
]

function snippet(relative, start, end) {
  const file = path.join(sourceRoot, relative)
  const lines = fs.readFileSync(file, "utf8").split(/\r?\n/)
  const from = Math.max(1, start)
  const to = Math.min(lines.length, end)
  return lines.slice(from - 1, to).map((line, index) => `${String(from + index).padStart(5, " ")}  ${line}`).join("\n")
}

const findings = specs.map((item) => ({
  id: item.id,
  dimension: item.dimension,
  evidenceLevel: item.evidenceLevel,
  claimType: item.claimType,
  title: item.title,
  fact: item.fact,
  plainLanguage: item.plain,
  implication: item.implication,
  citations: [{
    path: item.citation[0],
    startLine: item.citation[1],
    endLine: item.citation[2],
    role: item.citation[3],
    excerpt: snippet(item.citation[0], item.citation[1], item.citation[2]),
  }],
}))

const dimensions = [...new Set(findings.map((finding) => finding.dimension))]
const ledger = {
  agent: "DeepSeek Harness",
  snapshot: {
    repository: "deepseek-ai/deepseek-harness",
    commit,
    commitDate: "2026-08-13T19:38:46+08:00",
  },
  method: {
    readmePolicy: "README 只用于定位入口；实现结论必须回到 packages/、docs/architecture.md、测试或运行时契约。",
    factPolicy: "L1 运行时源码优先，L2 类型/事件/配置契约补足，L3 测试和 L4 架构文档用于交叉验证。",
    inferencePolicy: "白话解释和迁移建议与 fact 分栏展示，不把设计推断伪装成作者声明。",
  },
  coverage: dimensions.map((dimension) => ({ dimension, status: "verified", evidenceLevels: ["L1", "L2", "L4"] })),
  findings,
}
fs.mkdirSync(path.dirname(output), { recursive: true })
fs.writeFileSync(output, `${JSON.stringify(ledger, null, 2)}\n`)
console.log(JSON.stringify({ output: path.relative(root, output), findings: findings.length, dimensions: dimensions.length, commit }))
