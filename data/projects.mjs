import { legacyProjects } from "./legacy-projects.mjs";

const baseProjects = [
  {
    slug: "openwork",
    name: "OpenWork",
    repo: "different-ai/openwork",
    branch: "dev",
    commit: "51902a94b1d1a8ba4eb5eca01a25f6288d843efc",
    date: "2026-08-12T17:55:34Z",
    language: "TypeScript / Rust examples",
    kind: "MCP-first desktop/server harness",
    zh: {
      thesis: "OpenWork 把桌面工作区、OpenCode 会话和 MCP Apps 组合成一个可观察的工作台；它的关键不是“能聊天”，而是把界面状态、会话路由、插件装配和沙箱边界做成可验证的协议。",
      strengths: ["MCP Apps / OAuth / 插件生态完整", "上下文快照把 UI 与执行状态显式化", "CSP + iframe + origin 检查形成多层浏览器边界"],
      limits: ["主执行器依赖 OpenCode，不能把 UI 边界误认为 OS 级沙箱", "企业版与开源版目录交织，部署面较大", "工作区事件与运行时配置需要额外持久化治理"],
      lesson: "把 OpenWork 想成一张控制台：左边是会话，右边是 MCP App，底层还有一个负责记录游标和重载原因的服务。"
    },
    en: {
      thesis: "OpenWork combines a desktop workspace, OpenCode sessions, and MCP Apps into an observable workbench. Its important design is the protocol around UI state, session routing, plugin assembly, and browser boundaries—not chat alone.",
      strengths: ["Broad MCP Apps, OAuth, and plugin surface", "Explicit context snapshots for UI and execution state", "CSP, iframe, and origin checks form a layered browser boundary"],
      limits: ["The executor is OpenCode; UI isolation is not an OS sandbox", "Open-source and enterprise surfaces broaden the deployment graph", "Workspace events and runtime config need persistence governance"],
      lesson: "Think of OpenWork as a control desk: sessions on the left, MCP Apps on the right, and a server tracking cursors and reload causes underneath."
    },
    anchors: [
      ["architecture", "packages/types/src/openwork-context.ts", "openworkContextSnapshotSchema|execution|sidePanel"],
      ["loop", "apps/server/src/routes/sessions.ts", "registerSessionRoutes|createWorkspaceSession|buildSession"],
      ["model", "apps/server/src/routes/sessions.ts", "opencode|message|session"],
      ["tools", "apps/server/src/plugins.ts", "listPlugins|addPlugin|validatePluginSpec"],
      ["context", "packages/types/src/openwork-context.ts", "conversations|resources|availableAffordances"],
      ["security", "apps/server/src/mcp-app-sandbox.ts", "MAX_CSP_QUERY_BYTES|safeOrigin|default-src|sandbox"],
      ["ecosystem", "apps/server/src/skills.ts", "listSkills|globalAgents|upsertSkill"],
      ["collaboration", "apps/server/src/routes/sessions.ts", "sessionGroup|session"],
      ["state", "apps/server/src/events.ts", "ReloadEventStore|recordDebounced|cursor"],
      ["engineering", "apps/server/src/mcp-app-sandbox.test.ts", "test|sandbox|CSP"]
    ]
  },
  {
    slug: "eigent",
    name: "Eigent",
    repo: "eigent-ai/eigent",
    branch: "main",
    commit: "88d837f75ad95a21eebaa638072adad2019644be",
    date: "2026-08-07T17:52:01+08:00",
    language: "Python / TypeScript / Electron",
    kind: "Local-first multi-agent cowork desktop",
    zh: {
      thesis: "Eigent 把单 Agent、Workforce、多模态工具、MCP 与本地记忆放进一个桌面 Cowork 工作流。源码里最值得学习的是任务锁、上下文构建、动作协议和跨重启记忆，而不是 UI 上的“多 Agent”按钮。",
      strengths: ["持久记忆有明确 token budget 与 task-lock 生命周期", "后端动作协议把任务状态和用户交互拆开", "MCP、Skills、远程子 Agent 都有独立配置面"],
      limits: ["Python CAMEL/后端服务与 Electron 前端的链路较长", "远程子 Agent 配置需要 API key、endpoint 与 agent name 三件套", "本地安全边界更多依赖运行环境与配置，而非单一强沙箱"],
      lesson: "把 Eigent 想成一个带项目记忆的办公室：任务锁是工单，Agent 是员工，MCP 是工具柜，记忆服务负责交接班。"
    },
    en: {
      thesis: "Eigent places single-agent, workforce, multimodal tools, MCP, and local memory in a desktop cowork workflow. The source-level lesson is the task lock, context builder, action protocol, and restart-safe memory—not the multi-agent button in the UI.",
      strengths: ["Durable memory has an explicit token budget and task-lock lifecycle", "Backend actions separate task state from user interaction", "MCP, Skills, and remote sub-agents have separate configuration surfaces"],
      limits: ["The Python CAMEL/backend to Electron path is long", "Remote sub-agents require an API key, endpoint, and agent name", "The default safety boundary is more environment/config driven than OS-sandbox driven"],
      lesson: "Think of Eigent as an office with project memory: a task lock is a ticket, agents are staff, MCP is the toolbox, and memory handles handoff."
    },
    anchors: [
      ["architecture", "backend/app/service/task.py", "class Action|class|Task"],
      ["loop", "backend/app/service/single_agent_service.py", "_build_single_agent_context|_response_content"],
      ["model", "backend/app/service/single_agent_service.py", "AsyncStreamingChatAgentResponse|response"],
      ["tools", "backend/app/service/task.py", "activate_toolkit|search_mcp|install_mcp"],
      ["context", "backend/app/service/single_agent_service.py", "MEMORY_TOKEN_BUDGET|conversation_history|durable"],
      ["security", "backend/app/service/mcp_config.py", "normalize|mcpServers|write_mcp_config"],
      ["ecosystem", "src/lib/skillToolkit.ts", "skill|toolkit|install"],
      ["collaboration", "server/app/model/remote_sub_agent/provider.py", "validate_enabled_config|endpoint_url"],
      ["state", "src/lib/events/appEvents.ts", "bufferedEvents|subscribeAppEvents|replay"],
      ["engineering", "server/tests/test_remote_sub_agent_provider.py", "test|provider|remote"]
    ]
  },
  {
    slug: "multica",
    name: "Multica",
    repo: "multica-ai/multica",
    branch: "main",
    commit: "d467cc90691587ed00bdaca678475957df62dd3a",
    date: "2026-08-13T02:29:49+08:00",
    language: "Go / TypeScript",
    kind: "Agent control plane with runtimes",
    zh: {
      thesis: "Multica 把 Agent、Runtime、Task、Skill 和 Composio 工具放进一个可运维控制面。它的源码重点是资源生命周期：删除 runtime 前先处理绑定 Agent，任务与用量可查询，工具版本与连接账户显式传递。",
      strengths: ["Runtime 与 Agent 解耦，支持重绑和级联删除策略", "CLI/API/桌面/移动端共享资源模型", "Composio 工具请求显式携带连接账户与版本"],
      limits: ["控制面很强，但实际执行安全取决于 runtime 实现", "Go server、web、desktop、mobile 组件多，升级协调成本高", "CLI 删除操作需要用户理解 active-agent 冲突与 cascade 语义"],
      lesson: "把 Multica 想成机场调度台：Agent 是航班，Runtime 是跑道，Task 是航段，删除跑道前必须先处理仍在上面的航班。"
    },
    en: {
      thesis: "Multica puts Agents, Runtimes, Tasks, Skills, and Composio tools behind an operable control plane. Its source-level focus is resource lifecycle: runtime deletion handles bound agents, usage is queryable, and tool versions/accounts are explicit.",
      strengths: ["Runtimes and agents are decoupled with rebind and cascade semantics", "CLI, API, desktop, and mobile share resource models", "Composio requests carry connected accounts and tool versions explicitly"],
      limits: ["The control plane is strong, while execution safety depends on the runtime", "Go server plus web/desktop/mobile increases coordination cost", "CLI deletion requires understanding active-agent conflicts and cascade behavior"],
      lesson: "Think of Multica as an airport control tower: agents are flights, runtimes are runways, tasks are legs, and deletion must handle flights still bound to a runway."
    },
    anchors: [
      ["architecture", "server/cmd/multica/cmd_agent.go", "agentCmd|agentListCmd|agentCreateCmd"],
      ["loop", "server/cmd/multica/cmd_runtime.go", "runRuntimeActivity|runRuntimeUsage|APIContext"],
      ["model", "server/cmd/multica/cmd_agent.go", "agentTasksCmd|agentGetCmd"],
      ["tools", "server/pkg/composio/tools.go", "ExecuteToolRequest|ConnectedAccountID|Version"],
      ["context", "apps/mobile/data/queries/agent-task-snapshot.ts", "snapshot|task|agent"],
      ["security", "server/cmd/multica/cmd_runtime.go", "cascade|active agents|unbind"],
      ["ecosystem", "server/cmd/multica/cmd_agent.go", "agentSkillsCmd|skills"],
      ["collaboration", "server/cmd/multica/cmd_agent.go", "tasks|agent"],
      ["state", "server/cmd/multica/cmd_runtime.go", "usage|activity|runtime"],
      ["engineering", "server/cmd/multica/cmd_runtime_test.go", "Test|runtime|delete"]
    ]
  },
  {
    slug: "mimo-code",
    name: "MiMo-Code",
    repo: "XiaomiMiMo/MiMo-Code",
    branch: "main",
    commit: "332d7b0db65ccbcdd31a67b897e80dd6f3671b9b",
    date: "2026-08-12T22:01:56+08:00",
    language: "TypeScript / Rust / Bun",
    kind: "Coding agent with microkernel and Compose",
    zh: {
      thesis: "MiMo-Code 的源码把 Coding Agent 拆成 microkernel runtime、Compose 编排、插件工具、全局同步、权限和 context budget。它适合研究“内核保持稳定，能力从插件/技能/工作流注入”的工程路线。",
      strengths: ["微内核与 Compose/插件边界清晰", "全局同步有 reducer、eviction、trim、prefetch 等状态管理", "权限与 context budget 都有独立设计文档和测试"],
      limits: ["项目横跨 Rust/TypeScript/Bun/Nix，开发门槛高", "Compose 的多 Agent 语义需要结合多个 spec 才能读懂", "插件能力很强，必须把 tool catalog 与权限治理一起部署"],
      lesson: "把 MiMo-Code 想成一台可换插槽的机器：微内核负责转动，Compose 是控制面，插件和 Skill 是可替换的刀头。"
    },
    en: {
      thesis: "MiMo-Code separates a microkernel runtime, Compose orchestration, plugin tools, global sync, permissions, and context budgets. It is a useful case study in keeping the kernel stable while injecting capabilities through plugins, skills, and workflows.",
      strengths: ["Clear microkernel versus Compose/plugin boundaries", "Global sync has reducer, eviction, trim, and prefetch state management", "Permissions and context budgets have dedicated specs and tests"],
      limits: ["Rust/TypeScript/Bun/Nix make the project demanding", "Compose semantics require reading several specs together", "A broad plugin surface must ship with tool-catalog and permission governance"],
      lesson: "Think of MiMo-Code as a machine with interchangeable sockets: the microkernel turns, Compose controls, and plugins/skills are replaceable bits."
    },
    anchors: [
      ["architecture", "docs/architecture/codex-microkernel-runtime.md", "microkernel|runtime|kernel"],
      ["loop", "docs/harness/Agent Multi-Skill Workflow Orchestration Design.md", "workflow|orchestration|agent"],
      ["model", "packages/plugin/src/tool.ts", "ToolContext|ToolDefinition|function tool"],
      ["tools", "packages/plugin/src/tool.ts", "Tool|handler|register"],
      ["context", "docs/compose/spec/context-budget-control.md", "budget|context|token"],
      ["security", "packages/app/src/context/permission.tsx", "permission|auto|grant"],
      ["ecosystem", "packages/plugin/src/index.ts", "plugin|extension"],
      ["collaboration", "docs/compose/spec/skill-multi-injection.md", "multi|skill|agent"],
      ["state", "packages/app/src/context/global-sync/event-reducer.ts", "reducer|event|session"],
      ["engineering", "packages/app/src/context/global-sync/event-reducer.test.ts", "test|reducer"]
    ]
  },
  {
    slug: "kun",
    name: "Kun",
    repo: "KunAgent/Kun",
    branch: "master",
    commit: "1377249652cef30f9f7b777f8f6111fd6ac70fc9",
    date: "2026-08-08T01:39:24+08:00",
    language: "TypeScript / Electron",
    kind: "Local-first desktop agent with workflow graph",
    zh: {
      thesis: "Kun 把 Direct 模式、Agent Graph、工作流运行时、扩展 API、权限和本地恢复放进一个桌面 Agent。它的核心学习点是：复杂任务不是多喊几个模型，而是把节点状态、取消、审批、恢复和插件契约做成一套运行时。",
      strengths: ["Agent Graph 让委派关系可视化", "扩展 API 对 agent/tool/permission 有严格 schema", "本地优先与 runtime data recovery 有明确状态机"],
      limits: ["桌面应用与运行时耦合度仍然较高", "Graph 节点越多，状态/取消/错误传播越难测试", "本地优先不等于数据永不离开设备，provider 配置仍需审计"],
      lesson: "把 Kun 想成一张任务白板：每个节点都有输入、权限、状态和交付物，线条表示谁把结果交给谁。"
    },
    en: {
      thesis: "Kun combines Direct mode, Agent Graph, workflow runtime, extension APIs, permissions, and local recovery in a desktop agent. The lesson is that complex work needs a runtime contract for node state, cancellation, approvals, recovery, and plugins.",
      strengths: ["Agent Graph makes delegation visible", "Extension APIs use strict schemas for agents, tools, and permissions", "Local-first recovery has an explicit state machine"],
      limits: ["The desktop and runtime remain fairly coupled", "More graph nodes increase state, cancellation, and error-propagation test cost", "Local-first does not mean data never leaves the device"],
      lesson: "Think of Kun as a task whiteboard: every node has inputs, permissions, state, and an artifact; lines show result handoffs."
    },
    anchors: [
      ["architecture", "docs/workflow-loop.md", "workflow|node|runtime"],
      ["loop", "src/main/workflow-runtime.ts", "class|run|workflow"],
      ["model", "packages/extension-api/src/agent.ts", "AgentCreateRunRequestSchema|AgentRunEventSchema"],
      ["tools", "packages/extension-api/src/tools.ts", "ToolInvocationSchema|ToolResultSchema"],
      ["context", "src/shared/runtime-data-recovery.ts", "Recovery|candidate|inventory"],
      ["security", "packages/extension-api/src/permissions.ts", "STATIC_PERMISSIONS|permissionMatches|network"],
      ["ecosystem", "packages/extension-api/src/agent.ts", "ExtensionVisibility|AgentProfile"],
      ["collaboration", "docs/workflow-loop.md", "delegation|graph|subagent"],
      ["state", "src/main/workflow-run-coordinator.ts", "status|cancel|coordinator"],
      ["engineering", "src/main/workflow-run-coordinator.test.ts", "cancellation|approval|status"]
    ]
  },
  {
    slug: "deepchat",
    name: "DeepChat",
    repo: "ThinkInAIXYZ/deepchat",
    branch: "dev",
    commit: "d5e41ce0bb9e9f264911dbab79182fe376bae2da",
    date: "2026-08-13T09:59:41+08:00",
    language: "TypeScript / Electron",
    kind: "Desktop agent with Tape, ACP, memory, and subagents",
    zh: {
      thesis: "DeepChat 把对话运行时拆成 SessionTurn、Tape/Transcript、工具 effect、Memory lineage、ACP 与 Subagent slots。它特别适合学习“聊天产品如何升级成可恢复 Agent Harness”。",
      strengths: ["Tape/Transcript/SQLite 为恢复和分叉提供事实源", "Tool effect schema 区分 builtin/MCP/plugin/shell 来源", "Subagent slot、exposure、context 与并发策略显式化"],
      limits: ["功能面很宽，旧 runtime 与新 harness 并存时需要 cleanup guard", "桌面运行时、插件、MCP、ACP 的边界较复杂", "高阶记忆与 Tape 机制需要配合数据模型理解"],
      lesson: "把 DeepChat 想成一台带录像机的桌面工作站：每次工具动作和会话分叉都留下可恢复的带子，而不是只保留最后一句话。"
    },
    en: {
      thesis: "DeepChat splits its conversation runtime into SessionTurn, Tape/Transcript, tool effects, memory lineage, ACP, and subagent slots. It is a strong case study in turning a chat product into a recoverable agent harness.",
      strengths: ["Tape/Transcript/SQLite provide recovery and branching facts", "Tool-effect schemas distinguish builtin, MCP, plugin, and shell sources", "Subagent slots, exposure, context, and concurrency policy are explicit"],
      limits: ["A wide feature surface requires cleanup guards while old and new runtimes coexist", "Desktop runtime, plugins, MCP, and ACP boundaries are complex", "Memory and Tape are best understood with the data model"],
      lesson: "Think of DeepChat as a desktop workstation with a flight recorder: tool actions and session branches remain recoverable instead of only the final answer."
    },
    anchors: [
      ["architecture", "src/main/session/turn.ts", "SessionTurn|SessionTurnDependencies|sendMessage"],
      ["loop", "src/main/session/turn.ts", "sendMessageUnderSessionGate|startInitialTurn"],
      ["model", "src/main/session/turn.ts", "runtime|provider|message"],
      ["tools", "src/shared/agentTools.ts", "AGENT_TOOL_EXPOSURE|isUserConfigurableAgentTool"],
      ["context", "src/main/session/data/tape.ts", "Tape|subagent|sessionTape"],
      ["security", "src/shared/orchestration/toolEffect.ts", "OrchestrationEffectEvidenceSchema|read-only|reviewed"],
      ["ecosystem", "src/shared/agentTools.ts", "cronjob|MCP|diagnostic"],
      ["collaboration", "src/shared/lib/deepchatSubagents.ts", "SLOT_LIMIT|explorer|implementer|reviewer"],
      ["state", "src/main/session/data/database.ts", "SessionDatabase|createConversation|queryMessages"],
      ["engineering", "scripts/agent-cleanup-guard.mjs", "protected|harness|legacy"]
    ]
  },
  {
    slug: "diagram-design",
    name: "Diagram Design",
    repo: "cathrynlavery/diagram-design",
    branch: "main",
    commit: "840f944f08be45eed52a6832d4930c11164a546f",
    date: "2026-08-12T17:05:24-07:00",
    language: "Markdown / HTML / SVG skill",
    kind: "Semantic diagram design skill",
    zh: {
      thesis: "Diagram Design 不是一个 Agent runtime，而是一套把语义模式、图形类型、复杂度预算、连接器规则和可访问性检查固化进 Skill 的 Harness。它是这批项目里最适合研究“如何让模型稳定产出技术图”的样本。",
      strengths: ["先选语义模式再选图形类型，避免图形先行", "复杂度、连接器、文字间距和图例都有硬规则", "模板/示例/引用文档让生成结果可复用和可审计"],
      limits: ["它治理的是图的生成规范，不是执行 Agent", "规则需要被调用方真正加载，不能只存在于 README", "默认输出仍需按项目品牌与数据事实做二次审查"],
      lesson: "把它想成一本会被 Agent 读取的制图规范：先问图要表达什么，再决定用架构图、时序图、状态机还是数据流。"
    },
    en: {
      thesis: "Diagram Design is not an agent runtime; it is a Skill harness that codifies semantic patterns, visual types, complexity budgets, connector rules, and accessibility checks. It is a useful study in making model-generated technical diagrams consistent.",
      strengths: ["Choose semantics before visual type", "Hard rules cover complexity, connectors, labels, and legends", "Templates, examples, and references make output reusable and auditable"],
      limits: ["It governs diagram generation, not agent execution", "The caller must actually load the rules", "Generated diagrams still need project-brand and fact review"],
      lesson: "Think of it as a drafting standard an agent can read: first define the meaning, then choose architecture, sequence, state, or data-flow grammar."
    },
    anchors: [
      ["architecture", "skills/diagram-design/SKILL.md", "27|Architecture|components"],
      ["loop", "skills/diagram-design/SKILL.md", "semantic pattern|behavior|state"],
      ["model", "skills/diagram-design/SKILL.md", "agent|generate|semantic"],
      ["tools", "skills/diagram-design/SKILL.md", "visual type|Architecture|Sequence"],
      ["context", "skills/diagram-design/SKILL.md", "complexity budget|split"],
      ["security", "skills/diagram-design/SKILL.md", "secure paved road|security|boundary"],
      ["ecosystem", "skills/diagram-design/SKILL.md", "references|template|example"],
      ["collaboration", "skills/diagram-design/SKILL.md", "ownership|routing|escalation"],
      ["state", "skills/diagram-design/SKILL.md", "state machine|transitions|guards"],
      ["engineering", "skills/diagram-design/SKILL.md", "Pre-Output Checklist|anti-pattern|accessibility"]
    ]
  }
];

export const projects = [...baseProjects, ...legacyProjects];

// These notes are deliberately kept separate from the marketing metadata above. Each sentence is a
// source-backed reading cue; the generator pairs it with the corresponding pinned file and line range.
export const dimensionNotes = {
  openwork: {
    zh: {
      architecture: "入口由桌面工作区和 server routes 分开，OpenWork context schema 再把 screen、conversation、chrome、execution 和 side-panel 状态收拢成一个可校验快照。",
      loop: "会话路由负责创建/恢复 OpenCode session，事件 store 记录 sequence 与 cursor，前端因此知道应该从哪里继续读取。",
      modelContext: "上下文不是一段隐藏 prompt，而是带 schemaVersion、revision、capturedAt 的结构化快照；查询可并行，命令明确串行。",
      execution: "MCP App 被放进 sandbox iframe，CSP 只放行声明的连接源；这保护浏览器页面，不等于给 OpenCode 执行器提供 OS 沙箱。",
      tools: "插件规范会被 normalize，再按 config/global/project 与目录层级排序；MCP App、OAuth 和 Skills 通过不同入口接入。",
      security: "sandbox 只接受 http/https origin，postMessage 前做 exact-origin 检查，CSP query 还有 8 KiB 上限，形成输入、网络、消息三道门。",
      observability: "ReloadEventStore 保存递增 sequence、cursor 和最近事件，750ms debounce 将高频 workspace 变化压成可消费的事件流。",
      collaboration: "会话组与 session refs 让多个会话共享工作区视图，但源码展示的是路由/状态协作，不是自动生成的子 Agent 池。",
      instructions: "Skills、plugins 和 runtime/project config 是三类不同指令面；加载顺序写在代码里，不能把一个插件目录当成全部能力。",
      recovery: "事件游标、快照 revision 与 sandbox 测试共同构成恢复线索；工程上仍需要把事件持久化和 OpenCode 的执行恢复接起来。"
    },
    en: {
      architecture: "The desktop workspace and server routes form separate entry layers, while the OpenWork context schema validates screen, conversations, chrome, execution, and side-panel state as one snapshot.",
      loop: "Session routes create or restore OpenCode sessions; the event store records a sequence and cursor so the client knows where to resume reading.",
      modelContext: "Context is not a hidden prompt: it is a schema-versioned snapshot with revision and capture time, with parallel queries and serialized commands made explicit.",
      execution: "MCP Apps run in sandboxed iframes with an allow-listed CSP. This protects the browser surface; it is not an OS sandbox around the OpenCode executor.",
      tools: "Plugin specs are normalized and ordered across config, global, project, and directory layers; MCP Apps, OAuth, and Skills enter through distinct paths.",
      security: "The sandbox accepts only HTTP(S) origins, checks exact origins before postMessage, and caps CSP query size at 8 KiB—input, network, and message gates.",
      observability: "ReloadEventStore keeps a monotonic sequence, cursor, and recent events; a 750 ms debounce compresses noisy workspace changes into a consumable stream.",
      collaboration: "Session groups and refs let several sessions share a workspace view, but the source shows routing/state collaboration rather than an automatic sub-agent pool.",
      instructions: "Skills, plugins, and runtime/project config are separate instruction surfaces. Their load order is code, not an assumption that one plugin directory is the whole system.",
      recovery: "Event cursors, snapshot revisions, and sandbox tests provide recovery clues; durable event storage and OpenCode execution recovery still need to be joined operationally."
    }
  },
  eigent: {
    zh: {
      architecture: "Electron 前端、Python backend service 与 server model 分层；single_agent_service 负责把任务锁、记忆、历史和当前请求拼成一次 agent turn。",
      loop: "Task Action 枚举把 improve、update、decompose、create_agent、activate_toolkit、install_mcp 等动作变成可路由协议，而不是散落的 UI 回调。",
      modelContext: "上下文构建先读跨重启 LocalMemoryStore，再放热对话与 memory，最后才用前端 project_context 兜底；memory token budget 默认 8000。",
      execution: "执行主要依赖 Python/CAMEL 与本地配置，代码里没有一个统一的强 OS 沙箱；部署时必须把工作目录、网络和凭据边界补齐。",
      tools: "MCP 配置读写 ~/.eigent/mcp.json，参数会被 normalize；Skill toolkit、MCP server 和远程 agent 是不同的连接器面。",
      security: "远程 sub-agent 启用时需要 provider_name、api_key、endpoint_url、agent_name 等字段；配置校验是门槛，但不是完整的运行时隔离。",
      observability: "AppEventMap 与 bufferedEvents 提供前端事件订阅和 replay，但源码注释明确说内存 buffer 没有 adapter 时不会自动发往别处。",
      collaboration: "remote sub-agent provider 把 provider、endpoint 与 agent name 作为显式契约；这比 UI 上一个‘派 Agent’按钮更接近可审计协作。",
      instructions: "Action enum、Skill toolkit、MCP 配置和 project_context 分别承载任务动作、插件说明、外部工具与项目指令，不能混作一个 prompt。",
      recovery: "task lock、turn finalize 与 durable memory 写回形成跨重启恢复链；测试覆盖 provider 配置，真正的后端故障恢复仍需部署级演练。"
    },
    en: {
      architecture: "Electron, Python backend services, and server models form layers; single_agent_service assembles the task lock, memory, history, and request into one agent turn.",
      loop: "The Task Action enum turns improve, update, decompose, create_agent, activate_toolkit, and install_mcp into a routable protocol instead of scattered UI callbacks.",
      modelContext: "Context first reads cross-restart LocalMemoryStore, then hot conversation/memory, and only then falls back to frontend project_context; the default memory budget is 8,000 tokens.",
      execution: "Execution relies on Python/CAMEL and local configuration; there is no single strong OS sandbox, so deployment must define workdir, network, and secret boundaries.",
      tools: "MCP config is read and written at ~/.eigent/mcp.json with normalized args; Skill toolkit, MCP servers, and remote agents are distinct connector surfaces.",
      security: "Enabling a remote sub-agent requires provider, API key, endpoint URL, and agent name fields. Validation is a gate, not a complete runtime isolation boundary.",
      observability: "AppEventMap and bufferedEvents provide subscription and replay, while the source notes that the in-memory buffer goes nowhere without an adapter.",
      collaboration: "The remote sub-agent provider makes provider, endpoint, and agent name an explicit contract—more auditable than a UI-only ‘delegate’ button.",
      instructions: "Action enums, Skill toolkit, MCP config, and project_context carry task actions, extension instructions, external tools, and project guidance separately.",
      recovery: "Task locks, turn finalization, and durable-memory writes form a cross-restart recovery chain; provider tests help, but backend failure drills remain deployment work."
    }
  },
  multica: {
    zh: {
      architecture: "Multica 的控制面把 Agent、Runtime、Task、Skill 和连接账户做成资源 API；CLI 与 server 共享同一套生命周期语义。",
      loop: "runtime activity/usage 与 task 查询把一次执行拆成可查询的运行记录，而不是只返回最终文本。",
      modelContext: "移动端 agent-task-snapshot 只把窗口状态、任务和 agent 摘要带到界面，长上下文仍由绑定 runtime 负责。",
      execution: "Runtime 是真正的执行胶囊，控制面只负责绑定、排队、取消和删除；因此 shell、浏览器或容器隔离不能从 CLI 推断。",
      tools: "Composio ExecuteToolRequest 显式传 connected account、user/toolkit 与 version，连接器调用不是隐式读取全局登录态。",
      security: "删除 runtime 时若仍有 active agent 会拒绝；--cascade 会先解绑、取消排队/运行任务，再删 runtime，避免孤儿引用。",
      observability: "activity、usage 和 task endpoints 让运行量、状态和历史可查询，控制面因此具备运维而不是只有对话。",
      collaboration: "Agent 与 Runtime 解耦允许重绑定；Agent tasks、skills 和 environment variables 组成协作与运行时配置的边界。",
      instructions: "agent skills、env custom variables、CLI flags 和 Composio toolkit version 都是显式输入，版本与凭据不会藏在自然语言里。",
      recovery: "queued/running task 的取消、runtime 删除保护和保留 agent/history 的策略提供资源恢复语义，但具体 runtime 崩溃恢复要看执行器实现。"
    },
    en: {
      architecture: "Multica models Agents, Runtimes, Tasks, Skills, and connected accounts as control-plane resources; CLI and server share the lifecycle semantics.",
      loop: "Runtime activity/usage and task queries turn an execution into inspectable records instead of returning only final text.",
      modelContext: "The mobile agent-task snapshot carries window state, task, and agent summaries; the bound runtime remains responsible for long context.",
      execution: "The Runtime is the execution capsule. The control plane binds, queues, cancels, and deletes it, so shell/browser/container isolation cannot be inferred from the CLI.",
      tools: "Composio ExecuteToolRequest explicitly carries a connected account, user/toolkit identity, and version rather than reading a hidden global login.",
      security: "Runtime deletion refuses active-agent bindings; --cascade unbinds agents and cancels queued/running tasks before removing the runtime.",
      observability: "Activity, usage, and task endpoints expose volume, state, and history, giving the control plane operational visibility beyond chat.",
      collaboration: "Agent/runtime decoupling supports rebinding; agent tasks, skills, and environment variables define collaboration and runtime configuration boundaries.",
      instructions: "Agent skills, custom env vars, CLI flags, and Composio toolkit versions are explicit inputs; credentials and versions are not hidden in prose.",
      recovery: "Queued/running cancellation, deletion guards, and retained agent/history provide resource recovery semantics; runtime crash recovery depends on the executor."
    }
  },
  "mimo-code": {
    zh: {
      architecture: "microkernel runtime 保持稳定，Compose、插件、全局同步和 context budget 作为上层能力注入，形成内核—编排—扩展三层。",
      loop: "Multi-Skill workflow spec 把技能选择、注入、执行和 handoff 写成编排阶段，主循环不必知道每个 Skill 的业务细节。",
      modelContext: "context-budget-control 把 token budget、压缩、trim、eviction 和 prefetch 当作显式控制面，而非达到上限才临时截断。",
      execution: "Bun、Rust 与 TypeScript 共同组成运行时；插件 tool handler 才是能力执行点，安全边界必须与宿主权限一起审计。",
      tools: "packages/plugin 的 Tool/handler/context API 为插件提供统一注册面，Compose 再决定哪些工具被某个 Agent 注入。",
      security: "permission context 与自动授权策略分开，权限决策是全局同步事件的一部分；工具目录宽度不能替代权限检查。",
      observability: "global-sync reducer、event reducer tests、eviction/trim 状态让会话变化可重放，减少多个 UI 对同一状态各自解释。",
      collaboration: "Compose 的多 Agent/多 Skill 注入把协作建模为编排数据，适合做可回放 handoff，但也增加 schema 与预算协调成本。",
      instructions: "Compose spec、Skill multi-injection、plugin index 与 tool API 各自定义指令/扩展契约；技能不是一段随意拼接的 prompt。",
      recovery: "reducer、trim、eviction、prefetch 与测试共同提供上下文和状态恢复路径；跨进程恢复仍要把 Rust/Bun 的持久化边界接好。"
    },
    en: {
      architecture: "The microkernel stays stable while Compose, plugins, global sync, and context budgets inject higher-level capability—a kernel/orchestration/extension stack.",
      loop: "The multi-skill workflow spec makes selection, injection, execution, and handoff explicit stages, so the core loop need not know each skill's business details.",
      modelContext: "The context-budget spec treats tokens, compaction, trim, eviction, and prefetch as controls rather than a last-minute truncation.",
      execution: "Bun, Rust, and TypeScript share the runtime; plugin tool handlers are execution points, so the host permission boundary must be audited with them.",
      tools: "The plugin Tool/handler/context API provides a common registration surface, while Compose decides which tools enter an Agent.",
      security: "Permission context and auto-grant policy are separate, and permission decisions flow through global-sync events; a broad tool catalog is not authorization.",
      observability: "The global-sync reducer and tests make session changes replayable, reducing competing interpretations of shared state across UI surfaces.",
      collaboration: "Compose models multi-agent/multi-skill handoff as orchestration data, enabling replay but increasing schema and budget coordination cost.",
      instructions: "Compose specs, skill injection, plugin index, and tool API each define an extension/instruction contract; a skill is not arbitrary prompt concatenation.",
      recovery: "Reducer, trim, eviction, prefetch, and tests provide context/state recovery paths; cross-process persistence still needs clear Rust/Bun boundaries."
    }
  },
  kun: {
    zh: {
      architecture: "Direct mode 与 Agent Graph 共享 workflow runtime；extension-api 把 Agent、Tool、Permission、RunEvent 对外固化成 schema。",
      loop: "workflow runtime/coordinator 处理节点状态、取消、审批和事件，图上的每一步都有明确的运行契约。",
      modelContext: "AgentRunEvent 把消息、工具进度、状态变化和错误分成可判别事件；runtime data recovery 负责找回不完整的本地数据。",
      execution: "工作流节点在桌面 runtime 中执行，扩展 API 的 side-effects 标出 read/write/external/destructive；真正的进程隔离仍需宿主配置。",
      tools: "ToolInvocation、progress、result 和 cancellation token 形成工具回执协议，工具不只是一个返回字符串的函数。",
      security: "静态 permission 包括 agent.run、tools.register、provider/network pattern，并有 permissionMatches/hasPermission 做匹配。",
      observability: "AgentRunEvent 与 coordinator status 让运行、取消、审批和失败都有事件入口，测试把这些边界锁住。",
      collaboration: "Agent Graph 把 delegation、节点输入输出和 handoff 可视化；它是工作流协作，不等于无限并行子 Agent。",
      instructions: "AgentProfileDeclaration、extension visibility、tools.register 和权限声明共同构成插件/指令面，调用者必须声明需要什么。",
      recovery: "runtime-data-recovery 的 inventory、candidate、repair 状态与 coordinator cancel 共同覆盖断电/异常后的恢复，而不是只重启 UI。"
    },
    en: {
      architecture: "Direct mode and Agent Graph share a workflow runtime; extension-api freezes Agent, Tool, Permission, and RunEvent contracts as schemas.",
      loop: "The workflow runtime/coordinator handles node state, cancellation, approvals, and events, giving each graph step an explicit run contract.",
      modelContext: "AgentRunEvent separates messages, tool progress, state transitions, and errors; runtime-data-recovery finds incomplete local data.",
      execution: "Workflow nodes run in the desktop runtime, while extension side-effects label read/write/external/destructive work; process isolation still belongs to the host.",
      tools: "Tool invocation, progress, result, and cancellation tokens form a receipt protocol instead of a function that merely returns a string.",
      security: "Static permissions include agent.run, tools.register, and provider/network patterns, with permissionMatches/hasPermission enforcing matches.",
      observability: "AgentRunEvent and coordinator status expose run, cancel, approval, and failure entry points, with tests locking down edges.",
      collaboration: "Agent Graph makes delegation, node I/O, and handoff visible; it is workflow collaboration, not unlimited parallel sub-agents.",
      instructions: "Agent profile declarations, extension visibility, tool registration, and permission declarations form the extension/instruction surface.",
      recovery: "Recovery inventory, candidates, repair states, and coordinator cancellation cover interrupted work rather than merely restarting the UI."
    }
  },
  deepchat: {
    zh: {
      architecture: "SessionTurn 负责一次 turn，Tape/Transcript/SQLite 负责事实源，agentTools、ACP 和 memory 负责能力与分叉，桌面 UI 只是其中一层。",
      loop: "sendMessageUnderSessionGate 与 startInitialTurn 把并发 turn 串在 session gate 后，避免同一会话同时写出两条互相覆盖的历史。",
      modelContext: "Tape 保存消息、工具与 subagent lineage，数据库提供 conversation/message CRUD，长上下文可以从事实源重新拼回。",
      execution: "Tool effect 明确 none/read/unknown/write，并记录 builtin/MCP/plugin/shell evidence；这比把所有工具都当作同一种 shell 更容易治理。",
      tools: "agentTools 为 cronjob、subagent、diagnostic、MCP 等工具声明 exposure，区分 user-configurable、system-model 与 runtime-only。",
      security: "只读恢复要求 reviewed built-in contract；effect evidence 不可信时会升级成 unknown，而不是默认把副作用说成安全。",
      observability: "Tape、Transcript、SQLite 和 effect evidence 保留动作链；cleanup guard 还会保护新 harness 目录不被旧 runtime 清理。",
      collaboration: "subagent slot limit=5，并区分 self、explorer、implementer、reviewer，指导语要求避免重叠的 write-heavy 任务。",
      instructions: "agent tool exposure、ACP、MCP、plugin 和 subagent guidance 是多套指令/连接器；每套都标注谁可见、何时可调用。",
      recovery: "SessionDatabase 的 child conversations、Tape lineage 和 cleanup guard 共同支撑分叉、恢复与升级迁移，避免只保留最后一条回答。"
    },
    en: {
      architecture: "SessionTurn owns a turn, Tape/Transcript/SQLite are the fact source, and agentTools, ACP, and memory provide capability and branching; the desktop UI is only one layer.",
      loop: "sendMessageUnderSessionGate and startInitialTurn serialize writes behind a session gate so concurrent turns cannot overwrite one another.",
      modelContext: "Tape keeps messages, tools, and subagent lineage; database CRUD lets long context be reconstructed from durable facts.",
      execution: "Tool effects label none/read/unknown/write and record builtin/MCP/plugin/shell evidence, making governance more precise than treating every tool as shell.",
      tools: "agentTools exposes cronjob, subagent, diagnostic, and MCP tools with user-configurable, system-model, and runtime-only visibility.",
      security: "Read-only recovery requires a reviewed built-in contract; uncertain evidence is promoted to unknown instead of being called safe by default.",
      observability: "Tape, Transcript, SQLite, and effect evidence preserve the action chain; cleanup guard protects new harness directories from legacy cleanup.",
      collaboration: "Subagent slots are capped at five and distinguish self, explorer, implementer, and reviewer, with guidance against overlapping write-heavy work.",
      instructions: "Tool exposure, ACP, MCP, plugins, and subagent guidance are distinct instruction/connector surfaces with explicit visibility and call timing.",
      recovery: "Child conversations, Tape lineage, and cleanup guard support branching, recovery, and migration instead of retaining only the final answer."
    }
  },
  "diagram-design": {
    zh: {
      architecture: "SKILL.md 先定义语义模式，再映射到 27 类视觉图形；template.html 与 examples 是可复用的渲染层。",
      loop: "生成流程先问目的、读者和数据，再选 architecture/sequence/state/data-flow 等语法，最后跑 pre-output checklist。",
      modelContext: "复杂度预算要求限制节点、层级、连接器和文字密度，必要时拆图，防止模型把所有内容塞进一张海报。",
      execution: "它没有 shell 或模型执行沙箱；安全来自 secure paved road、边界说明和输出检查，调用方仍要隔离不可信数据。",
      tools: "视觉类型、连接器、图例、模板和 SVG/HTML 资产构成它的工具箱；工具选择服从语义而不是装饰。",
      security: "安全/信任边界是被要求显式画出的语义模式，accessibility、对比度和可读性也在检查清单里。",
      observability: "pre-output checklist、examples 和 source references 让图的质量可审计，失败可以定位到规则而不是审美争论。",
      collaboration: "ownership、routing、escalation 等图形语义把团队协作关系画清楚，但不会代替实际的任务编排 runtime。",
      instructions: "SKILL.md、references、template 与 examples 是它的全部指令/插件面；调用者必须按路由加载所需资源。",
      recovery: "state-machine 语义要求显式列出 transitions、guards、side effects 和 failure paths，便于从图回到实现和测试。"
    },
    en: {
      architecture: "SKILL.md defines semantic patterns first and maps them to 27 visual types; template.html and examples provide the reusable rendering layer.",
      loop: "The flow asks for purpose, audience, and data, chooses architecture/sequence/state/data-flow grammar, then runs the pre-output checklist.",
      modelContext: "A complexity budget limits nodes, hierarchy, connectors, and text density; diagrams split when needed instead of becoming one poster.",
      execution: "There is no shell or model execution sandbox; safety comes from the secure paved road, boundary notes, and output checks, so callers still isolate untrusted data.",
      tools: "Visual types, connectors, legends, templates, and SVG/HTML assets form the toolbox; semantic fit outranks decoration.",
      security: "Security/trust boundaries must be drawn as semantic content, while accessibility, contrast, and legibility also appear in the checklist.",
      observability: "The pre-output checklist, examples, and source references make diagram quality auditable and failures attributable to rules.",
      collaboration: "Ownership, routing, and escalation semantics clarify team relationships, but do not replace a task-orchestration runtime.",
      instructions: "SKILL.md, references, templates, and examples are the complete instruction/extension surface; callers must load resources by route.",
      recovery: "State-machine guidance asks for transitions, guards, side effects, and failure paths, making it possible to trace a diagram back to code and tests."
    }
  }
};

export const chapterDefs = [
  { id: "overview", number: "01", title: { zh: "总览：先知道它解决什么问题", en: "Overview: start with the problem" }, question: { zh: "如果你第一次打开这个项目，应该先建立哪张地图？", en: "What map should a beginner build first?" } },
  { id: "architecture", number: "02", title: { zh: "架构：有哪些层，谁负责什么", en: "Architecture: layers and ownership" }, question: { zh: "入口、运行时、模型、工具和状态怎样连起来？", en: "How do entrypoints, runtime, models, tools, and state connect?" } },
  { id: "loop", number: "03", title: { zh: "主循环：任务为什么会继续推进", en: "The loop: why work keeps moving" }, question: { zh: "一次用户请求如何变成多步执行？", en: "How does one request become multiple executable steps?" } },
  { id: "model", number: "04", title: { zh: "模型与消息：流式结果如何进入状态", en: "Models and messages: turning streams into state" }, question: { zh: "模型输出、消息和错误如何被接住？", en: "How are model output, messages, and errors captured?" } },
  { id: "tools", number: "05", title: { zh: "工具：Agent 的手脚怎样被注册", en: "Tools: registering the agent's hands" }, question: { zh: "工具声明、参数、执行和回执在哪里发生？", en: "Where are tool declarations, arguments, execution, and receipts handled?" } },
  { id: "context", number: "06", title: { zh: "上下文：长任务怎样不丢重点", en: "Context: keeping long tasks coherent" }, question: { zh: "哪些内容进入上下文，哪些内容被压缩或恢复？", en: "What enters context, and what gets compacted or recovered?" } },
  { id: "security", number: "07", title: { zh: "安全：审批、权限和边界", en: "Security: approvals, permissions, boundaries" }, question: { zh: "问用户、限制能力和隔离执行分别解决什么问题？", en: "What do approval, capability restriction, and isolation each solve?" } },
  { id: "ecosystem", number: "08", title: { zh: "扩展：MCP、Skill、插件如何接入", en: "Extensions: MCP, Skills, and plugins" }, question: { zh: "新能力如何被发现、加载、调用和卸载？", en: "How are new capabilities discovered, loaded, called, and removed?" } },
  { id: "collaboration", number: "09", title: { zh: "协作：子 Agent 与工作流", en: "Collaboration: sub-agents and workflows" }, question: { zh: "什么时候是工具，什么时候才是协作单元？", en: "When is something a tool, and when is it a collaboration unit?" } },
  { id: "evidence", number: "10", title: { zh: "证据与取舍：把源码结论带回自研", en: "Evidence and trade-offs: bringing lessons home" }, question: { zh: "哪些是源码事实，哪些是推断，哪些风险必须补？", en: "Which claims are facts, inferences, and risks to address?" } }
];
