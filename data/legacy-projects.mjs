// Generated from data/legacy/inventory.json and data/legacy/evidence/*/evidence.json.
export const legacyProjects = [
  {
    "slug": "goose",
    "name": "Goose",
    "repo": "aaif-goose/goose",
    "branch": "main",
    "commit": "11deb564d09db782a17878af7cfafd299d9fa461",
    "date": "2026-08-13T02:45:24Z",
    "language": "TypeScript / Rust / Markdown",
    "kind": "Legacy source-backed harness audit",
    "legacy": true,
    "zh": {
      "thesis": "Goose 的既有源码账本覆盖 11 个 Harness 维度；这次迁移把原有事实重新排成单页分析和十章教程，不把 README 当作实现证据。",
      "strengths": [
        "它不是“模型回答一次就结束”，而是模型说一步、系统做一步、把结果再交回模型，直到满足结束条件。",
        "即使模型什么都不返回，或插件一直说“还不能停”，Goose 也不会永远卡住。",
        "不同模型厂商先被翻译成同一种“消息水管”。普通文字可以一个词一个词流出，但工具参数不能半截就执行。"
      ],
      "limits": [
        "关键路径测试已定位；全仓测试与 benchmark 数量统计待补。",
        "当前页面复用既有源码账本；迁移到自研前仍需做部署级验证",
        "当前页面复用既有源码账本；迁移到自研前仍需做部署级验证"
      ],
      "lesson": "它不是“模型回答一次就结束”，而是模型说一步、系统做一步、把结果再交回模型，直到满足结束条件。"
    },
    "en": {
      "thesis": "The existing source ledger for Goose covers 11 Harness dimensions. This migration reshapes those facts into a single analysis page and ten standalone chapters instead of treating README claims as implementation evidence.",
      "strengths": [
        "Pinned source findings expose the control loop",
        "Context, tools, and policy are separated into reviewable dimensions",
        "Each chapter keeps a file and line-range trail"
      ],
      "limits": [
        "This snapshot reuses the prior source ledger and its pinned commit",
        "Deployment-level behavior still needs a fresh run",
        "Legacy findings should be re-audited when the repository moves"
      ],
      "lesson": "Read the implementation as input, state, tool effect, receipt, and recovery—not as a feature list."
    },
    "anchors": [
      [
        "overview",
        "crates/goose/src/agents/agent.rs",
        {
          "path": "crates/goose/src/agents/agent.rs",
          "start": 1930,
          "end": 2043,
          "snippet": " 1930              .hook_manager\n 1931              .has_hooks(crate::hooks::HookEvent::UserPromptSubmit)\n 1932          {\n 1933              let ctx = crate::hooks::HookContext::new(\n 1934                  crate::hooks::HookEvent::UserPromptSubmit,\n 1935                  &session_config.id,\n 1936              )\n 1937              .with_message(message_text.clone());\n 1938              self.hook_manager\n 1939                  .emit(crate::hooks::HookEvent::UserPromptSubmit, ctx)\n 1940                  .await;\n 1941          }\n 1942  \n 1943          let command_result = self\n 1944              .execute_command(&message_text, &session_config.id)\n 1945              .await;\n 1946  \n 1947          let mut command_preamble: Vec<AgentEvent> = Vec::new();\n 1948  \n 1949          match command_result {\n 1950              Err(e) => {\n 1951                  let error_message = Message::assistant()\n 1952                      .with_text(e.to_string())\n 1953                      .with_visibility(true, false);\n 1954                  return Ok(Box::pin(stream::once(async move {\n 1955                      Ok(AgentEvent::Message(error_message))\n 1956                  })));\n 1957              }\n 1958              Ok(Some(response))\n 1959                  if response.role == rmcp::model::Role::Assistant",
          "findingId": "goose-loop-001",
          "title": "单一流式 Agent 循环驱动推理、工具和持久化"
        }
      ],
      [
        "architecture",
        "crates/goose/src/agents/agent.rs",
        {
          "path": "crates/goose/src/agents/agent.rs",
          "start": 67,
          "end": 79,
          "snippet": "   67  use crate::utils::is_token_cancelled;\n   68  use goose_providers::conversation::token_usage::{ProviderUsage, Usage};\n   69  use goose_providers::errors::ProviderError;\n   70  use goose_providers::thinking::ThinkingEffort;\n   71  use regex::Regex;\n   72  use rmcp::model::{\n   73      CallToolRequestParams, CallToolResult, ContentBlock, ElicitationAction, ErrorCode, ErrorData,\n   74      GetPromptResult, Prompt, ServerNotification, Tool,\n   75  };\n   76  use serde_json::Value;\n   77  use tokio::sync::{mpsc, Mutex};\n   78  use tokio_util::sync::CancellationToken;\n   79  use tracing::{debug, error, info, instrument, warn};",
          "findingId": "goose-loop-002",
          "title": "结束条件有防失控上限"
        }
      ],
      [
        "loop",
        "crates/goose-provider-types/src/base.rs",
        {
          "path": "crates/goose-provider-types/src/base.rs",
          "start": 281,
          "end": 286,
          "snippet": "  281      /// Create a new ModelInfo with cost information (per token)\n  282      pub fn with_cost(\n  283          name: impl Into<String>,\n  284          context_limit: usize,\n  285          input_cost: f64,\n  286          output_cost: f64,",
          "findingId": "goose-provider-001",
          "title": "Provider 以流式协议统一，工具调用必须完整再上送"
        }
      ],
      [
        "model",
        "crates/goose-provider-types/src/base.rs",
        {
          "path": "crates/goose-provider-types/src/base.rs",
          "start": 281,
          "end": 286,
          "snippet": "  281      /// Create a new ModelInfo with cost information (per token)\n  282      pub fn with_cost(\n  283          name: impl Into<String>,\n  284          context_limit: usize,\n  285          input_cost: f64,\n  286          output_cost: f64,",
          "findingId": "goose-provider-001",
          "title": "Provider 以流式协议统一，工具调用必须完整再上送"
        }
      ],
      [
        "tools",
        "crates/goose/src/agents/agent.rs",
        {
          "path": "crates/goose/src/agents/agent.rs",
          "start": 2210,
          "end": 2265,
          "snippet": " 2210              let session_name_update_tx = self.config.session_name_update_tx.clone();\n 2211              tokio::spawn(async move {\n 2212                  match manager_for_spawn\n 2213                      .maybe_update_name(&session_id, provider)\n 2214                      .await\n 2215                  {\n 2216                      Ok(Some(update)) => {\n 2217                          if let Some(tx) = session_name_update_tx {\n 2218                              if tx.send(update).is_err() {\n 2219                                  warn!(\"Failed to publish generated session name\");\n 2220                              }\n 2221                          }\n 2222                      }\n 2223                      Ok(None) => {}\n 2224                      Err(e) => warn!(\"Failed to generate session description: {}\", e),\n 2225                  }\n 2226              });\n 2227          }\n 2228  \n 2229          // Count tool calls present before this reply — everything added during\n 2230          // the reply loop is part of the current turn and should not be summarized.\n 2231          let pre_turn_tool_count = conversation\n 2232              .messages()\n 2233              .iter()\n 2234              .flat_map(|m| m.content.iter())\n 2235              .filter(|c| matches!(c, MessageContent::ToolRequest(_)))\n 2236              .count();\n 2237  \n 2238          let working_dir = session.working_dir.clone();\n 2239          let reply_stream_span = tracing::info_span!(",
          "findingId": "goose-tools-001",
          "title": "同一模型 turn 的多个工具经检查后并发执行"
        }
      ],
      [
        "context",
        "crates/goose/src/context_mgmt/mod.rs",
        {
          "path": "crates/goose/src/context_mgmt/mod.rs",
          "start": 26,
          "end": 49,
          "snippet": "   26  \n   27  pub(crate) fn tool_pair_summarization_enabled() -> bool {\n   28      Config::global()\n   29          .get_param::<bool>(\"GOOSE_TOOL_PAIR_SUMMARIZATION\")\n   30          .unwrap_or(true)\n   31  }\n   32  \n   33  const CONVERSATION_CONTINUATION_TEXT: &str =\n   34      \"Your context was compacted. The previous message contains a summary of the conversation so far.\n   35  Do not mention that you read a summary or that conversation summarization occurred.\n   36  Just continue the conversation naturally based on the summarized context.\";\n   37  \n   38  const TOOL_LOOP_CONTINUATION_TEXT: &str =\n   39      \"Your context was compacted. The previous message contains a summary of the conversation so far.\n   40  Do not mention that you read a summary or that conversation summarization occurred.\n   41  Continue calling tools as necessary to complete the task.\";\n   42  \n   43  const MANUAL_COMPACT_CONTINUATION_TEXT: &str =\n   44      \"Your context was compacted at the user's request. The previous message contains a summary of the conversation so far.\n   45  Do not mention that you read a summary or that conversation summarization occurred.\n   46  Just continue the conversation naturally based on the summarized context.\";\n   47  \n   48  pub struct CompactionResult {\n   49      pub conversation: Conversation,",
          "findingId": "goose-context-001",
          "title": "80% 阈值触发结构化压缩"
        }
      ],
      [
        "security",
        "crates/goose/src/agents/agent.rs",
        {
          "path": "crates/goose/src/agents/agent.rs",
          "start": 659,
          "end": 688,
          "snippet": "  659          let fut = async move {\n  660              let processed_result =\n  661                  super::large_response_handler::process_tool_response(result.result.await);\n  662              if capture_message_content {\n  663                  let output = gen_ai_telemetry::tool_result_json(&processed_result);\n  664                  span.record(\"output\", output.as_str());\n  665                  if let Some(result) =\n  666                      gen_ai_telemetry::successful_tool_result_json(&processed_result)\n  667                  {\n  668                      span.record(\"gen_ai.tool.call.result\", result.as_str());\n  669                  }\n  670              }\n  671              let event = match &processed_result {\n  672                  Ok(call_result) if call_result.is_error != Some(true) => {\n  673                      crate::hooks::HookEvent::PostToolUse\n  674                  }\n  675                  _ => crate::hooks::HookEvent::PostToolUseFailure,\n  676              };\n  677  \n  678              if hook_manager.has_hooks(event) {\n  679                  let ctx = crate::hooks::HookContext::new(event, &session_id)\n  680                      .with_tool(tool_name.clone(), tool_input.clone())\n  681                      .with_working_dir(working_dir.clone());\n  682                  hook_manager.emit(event, ctx).await;\n  683              }\n  684  \n  685              if event == crate::hooks::HookEvent::PostToolUse {\n  686                  let extended = match category {\n  687                      ToolCategory::Shell => Some((\n  688                          crate::hooks::HookEvent::AfterShellExecution,",
          "findingId": "goose-security-001",
          "title": "工具检查顺序体现“危险优先”"
        }
      ],
      [
        "ecosystem",
        "crates/goose/src/agents/extension_manager.rs",
        {
          "path": "crates/goose/src/agents/extension_manager.rs",
          "start": 1271,
          "end": 1342,
          "snippet": " 1271                  let instructions = instructions.replace(\"{{WORKING_DIR}}\", &working_dir_str);\n 1272                  ExtensionInfo::new(name, &instructions, ext.supports_resources())\n 1273              })\n 1274              .collect()\n 1275      }\n 1276  \n 1277      /// Get aggregated usage statistics\n 1278      pub async fn remove_extension(&self, name: &str) -> ExtensionResult<()> {\n 1279          let sanitized_name = name_to_key(name);\n 1280          self.extensions.lock().await.remove(&sanitized_name);\n 1281          self.invalidate_tools_cache_and_bump_version().await;\n 1282          Ok(())\n 1283      }\n 1284  \n 1285      pub async fn update_working_dir(&self, new_dir: &std::path::Path) {\n 1286          let extensions = self.extensions.lock().await;\n 1287          for (name, ext) in extensions.iter() {\n 1288              if let Err(e) = ext.client.update_working_dir(new_dir.to_path_buf()).await {\n 1289                  tracing::warn!(extension = %name, error = %e, \"failed to update roots\");\n 1290              }\n 1291          }\n 1292      }\n 1293  \n 1294      pub async fn list_extensions(&self) -> ExtensionResult<Vec<String>> {\n 1295          Ok(self.extensions.lock().await.keys().cloned().collect())\n 1296      }\n 1297  \n 1298      pub async fn is_extension_enabled(&self, name: &str) -> bool {\n 1299          let normalized = name_to_key(name);\n 1300          self.extensions.lock().await.contains_key(&normalized)",
          "findingId": "goose-mcp-001",
          "title": "MCP 工具被统一命名空间化、缓存和动态刷新"
        }
      ],
      [
        "collaboration",
        "crates/goose/src/agents/subagent_handler.rs",
        {
          "path": "crates/goose/src/agents/subagent_handler.rs",
          "start": 121,
          "end": 230,
          "snippet": "  121  fn get_agent_messages(params: SubagentRunParams) -> AgentMessagesFuture {\n  122      Box::pin(async move {\n  123          let SubagentRunParams {\n  124              config,\n  125              recipe,\n  126              task_config,\n  127              session_id,\n  128              cancellation_token,\n  129              on_message,\n  130              notification_tx,\n  131              ..\n  132          } = params;\n  133  \n  134          let system_instructions = recipe.instructions.clone().unwrap_or_default();\n  135          let user_task = recipe\n  136              .prompt\n  137              .clone()\n  138              .unwrap_or_else(|| \"Begin.\".to_string());\n  139  \n  140          let agent = Arc::new(Agent::with_config(config));\n  141  \n  142          agent\n  143              .update_provider(\n  144                  task_config.provider.clone(),\n  145                  task_config.model_config.clone(),\n  146                  &session_id,\n  147              )\n  148              .await\n  149              .map_err(|e| anyhow!(\"Failed to set provider on sub agent: {}\", e))?;\n  150  ",
          "findingId": "goose-subagent-001",
          "title": "子 Agent 是独立 Agent 与子会话，不是主提示词里的角色扮演"
        }
      ],
      [
        "evidence",
        "crates/goose/src/session/session_manager.rs",
        {
          "path": "crates/goose/src/session/session_manager.rs",
          "start": 45,
          "end": 96,
          "snippet": "   45  #[strum(serialize_all = \"snake_case\")]\n   46  pub enum SessionType {\n   47      #[default]\n   48      User,\n   49      Scheduled,\n   50      SubAgent,\n   51      Hidden,\n   52      Terminal,\n   53      Gateway,\n   54      Acp,\n   55  }\n   56  \n   57  static SESSION_STORAGE: LazyLock<Arc<SessionStorage>> =\n   58      LazyLock::new(|| Arc::new(SessionStorage::new(Paths::data_dir())));\n   59  \n   60  #[derive(Debug, Clone, Serialize, Deserialize)]\n   61  pub struct Session {\n   62      pub id: String,\n   63      pub working_dir: PathBuf,\n   64      #[serde(alias = \"description\")]\n   65      pub name: String,\n   66      #[serde(default)]\n   67      pub user_set_name: bool,\n   68      #[serde(default)]\n   69      pub session_type: SessionType,\n   70      pub created_at: DateTime<Utc>,\n   71      pub updated_at: DateTime<Utc>,\n   72      pub extension_data: ExtensionData,\n   73      #[serde(default)]\n   74      pub usage: Usage,",
          "findingId": "goose-session-001",
          "title": "会话、消息、成本与压缩指标落到 SQLite/WAL"
        }
      ]
    ]
  },
  {
    "slug": "aider",
    "name": "Aider",
    "repo": "Aider-AI/aider",
    "branch": "main",
    "commit": "5dc9490bb35f9729ef2c95d00a19ccd30c26339c",
    "date": "2026-05-22T07:02:20-07:00",
    "language": "Markdown / Python / Shell",
    "kind": "Legacy source-backed harness audit",
    "legacy": true,
    "zh": {
      "thesis": "Aider 的既有源码账本覆盖 10 个 Harness 维度；这次迁移把原有事实重新排成单页分析和十章教程，不把 README 当作实现证据。",
      "strengths": [
        "Aider 的循环很直接：你说一次，它生成修改；修改格式错了或检查失败，就把错误原样喂回模型再试，但不会无限自修。",
        "Aider 更像一条固定流水线，不是让模型临场决定下一步用什么工具。",
        "Aider 把各家模型 API 的差异交给 LiteLLM，自己的核心只面对一套近似 OpenAI 的消息格式。"
      ],
      "limits": [
        "编辑格式和 RepoMap 测试已定位；完整 benchmark 体系待报告章节汇总。",
        "当前页面复用既有源码账本；迁移到自研前仍需做部署级验证",
        "当前页面复用既有源码账本；迁移到自研前仍需做部署级验证"
      ],
      "lesson": "Aider 的循环很直接：你说一次，它生成修改；修改格式错了或检查失败，就把错误原样喂回模型再试，但不会无限自修。"
    },
    "en": {
      "thesis": "The existing source ledger for Aider covers 10 Harness dimensions. This migration reshapes those facts into a single analysis page and ten standalone chapters instead of treating README claims as implementation evidence.",
      "strengths": [
        "Pinned source findings expose the control loop",
        "Context, tools, and policy are separated into reviewable dimensions",
        "Each chapter keeps a file and line-range trail"
      ],
      "limits": [
        "This snapshot reuses the prior source ledger and its pinned commit",
        "Deployment-level behavior still needs a fresh run",
        "Legacy findings should be re-audited when the repository moves"
      ],
      "lesson": "Read the implementation as input, state, tool effect, receipt, and recovery—not as a feature list."
    },
    "anchors": [
      [
        "overview",
        "aider/coders/base_coder.py",
        {
          "path": "aider/coders/base_coder.py",
          "start": 88,
          "end": 106,
          "snippet": "   88  class Coder:\n   89      abs_fnames = None\n   90      abs_read_only_fnames = None\n   91      repo = None\n   92      last_aider_commit_hash = None\n   93      aider_edited_files = None\n   94      last_asked_for_commit_time = 0\n   95      repo_map = None\n   96      functions = None\n   97      num_exhausted_context_windows = 0\n   98      num_malformed_responses = 0\n   99      last_keyboard_interrupt = None\n  100      num_reflections = 0\n  101      max_reflections = 3\n  102      edit_format = None\n  103      yield_stream = False\n  104      temperature = None\n  105      auto_lint = True\n  106      auto_test = False",
          "findingId": "aider-loop-001",
          "title": "交互外环 + 有界 reflection 内环"
        }
      ],
      [
        "architecture",
        "aider/coders/base_coder.py",
        {
          "path": "aider/coders/base_coder.py",
          "start": 1530,
          "end": 1623,
          "snippet": " 1530          self.io.tool_output()\n 1531  \n 1532          self.show_usage_report()\n 1533  \n 1534          self.add_assistant_reply_to_cur_messages()\n 1535  \n 1536          if exhausted:\n 1537              if self.cur_messages and self.cur_messages[-1][\"role\"] == \"user\":\n 1538                  self.cur_messages += [\n 1539                      dict(\n 1540                          role=\"assistant\",\n 1541                          content=\"FinishReasonLength exception: you sent too many tokens\",\n 1542                      ),\n 1543                  ]\n 1544  \n 1545              self.show_exhausted_error()\n 1546              self.num_exhausted_context_windows += 1\n 1547              return\n 1548  \n 1549          if self.partial_response_function_call:\n 1550              args = self.parse_partial_args()\n 1551              if args:\n 1552                  content = args.get(\"explanation\") or \"\"\n 1553              else:\n 1554                  content = \"\"\n 1555          elif self.partial_response_content:\n 1556              content = self.partial_response_content\n 1557          else:\n 1558              content = \"\"\n 1559  ",
          "findingId": "aider-loop-002",
          "title": "一次回复后的固定交付链"
        }
      ],
      [
        "loop",
        "aider/models.py",
        {
          "path": "aider/models.py",
          "start": 985,
          "end": 1037,
          "snippet": "  985      def send_completion(self, messages, functions, stream, temperature=None):\n  986          if os.environ.get(\"AIDER_SANITY_CHECK_TURNS\"):\n  987              sanity_check_messages(messages)\n  988  \n  989          if self.is_deepseek_r1():\n  990              messages = ensure_alternating_roles(messages)\n  991  \n  992          kwargs = dict(\n  993              model=self.name,\n  994              stream=stream,\n  995          )\n  996  \n  997          if self.use_temperature is not False:\n  998              if temperature is None:\n  999                  if isinstance(self.use_temperature, bool):\n 1000                      temperature = 0\n 1001                  else:\n 1002                      temperature = float(self.use_temperature)\n 1003  \n 1004              kwargs[\"temperature\"] = temperature\n 1005  \n 1006          if functions is not None:\n 1007              function = functions[0]\n 1008              kwargs[\"tools\"] = [dict(type=\"function\", function=function)]\n 1009              kwargs[\"tool_choice\"] = {\"type\": \"function\", \"function\": {\"name\": function[\"name\"]}}\n 1010          if self.extra_params:\n 1011              kwargs.update(self.extra_params)\n 1012          if self.is_ollama() and \"num_ctx\" not in kwargs:\n 1013              num_ctx = int(self.token_count(messages) * 1.25) + 8192\n 1014              kwargs[\"num_ctx\"] = num_ctx",
          "findingId": "aider-provider-001",
          "title": "LiteLLM 是统一 Provider 适配层"
        }
      ],
      [
        "model",
        "aider/models.py",
        {
          "path": "aider/models.py",
          "start": 985,
          "end": 1037,
          "snippet": "  985      def send_completion(self, messages, functions, stream, temperature=None):\n  986          if os.environ.get(\"AIDER_SANITY_CHECK_TURNS\"):\n  987              sanity_check_messages(messages)\n  988  \n  989          if self.is_deepseek_r1():\n  990              messages = ensure_alternating_roles(messages)\n  991  \n  992          kwargs = dict(\n  993              model=self.name,\n  994              stream=stream,\n  995          )\n  996  \n  997          if self.use_temperature is not False:\n  998              if temperature is None:\n  999                  if isinstance(self.use_temperature, bool):\n 1000                      temperature = 0\n 1001                  else:\n 1002                      temperature = float(self.use_temperature)\n 1003  \n 1004              kwargs[\"temperature\"] = temperature\n 1005  \n 1006          if functions is not None:\n 1007              function = functions[0]\n 1008              kwargs[\"tools\"] = [dict(type=\"function\", function=function)]\n 1009              kwargs[\"tool_choice\"] = {\"type\": \"function\", \"function\": {\"name\": function[\"name\"]}}\n 1010          if self.extra_params:\n 1011              kwargs.update(self.extra_params)\n 1012          if self.is_ollama() and \"num_ctx\" not in kwargs:\n 1013              num_ctx = int(self.token_count(messages) * 1.25) + 8192\n 1014              kwargs[\"num_ctx\"] = num_ctx",
          "findingId": "aider-provider-001",
          "title": "LiteLLM 是统一 Provider 适配层"
        }
      ],
      [
        "tools",
        "aider/coders/base_coder.py",
        {
          "path": "aider/coders/base_coder.py",
          "start": 124,
          "end": 201,
          "snippet": "  124      @classmethod\n  125      def create(\n  126          self,\n  127          main_model=None,\n  128          edit_format=None,\n  129          io=None,\n  130          from_coder=None,\n  131          summarize_from_coder=True,\n  132          **kwargs,\n  133      ):\n  134          import aider.coders as coders\n  135  \n  136          if not main_model:\n  137              if from_coder:\n  138                  main_model = from_coder.main_model\n  139              else:\n  140                  main_model = models.Model(models.DEFAULT_MODEL_NAME)\n  141  \n  142          if edit_format == \"code\":\n  143              edit_format = None\n  144          if edit_format is None:\n  145              if from_coder:\n  146                  edit_format = from_coder.edit_format\n  147              else:\n  148                  edit_format = main_model.edit_format\n  149  \n  150          if not io and from_coder:\n  151              io = from_coder.io\n  152  \n  153          if from_coder:",
          "findingId": "aider-edit-001",
          "title": "编辑协议是可替换 Coder 家族"
        }
      ],
      [
        "context",
        "aider/coders/base_coder.py",
        {
          "path": "aider/coders/base_coder.py",
          "start": 1226,
          "end": 1338,
          "snippet": " 1226      def format_chat_chunks(self):\n 1227          self.choose_fence()\n 1228          main_sys = self.fmt_system_prompt(self.gpt_prompts.main_system)\n 1229          if self.main_model.system_prompt_prefix:\n 1230              main_sys = self.main_model.system_prompt_prefix + \"\\n\" + main_sys\n 1231  \n 1232          example_messages = []\n 1233          if self.main_model.examples_as_sys_msg:\n 1234              if self.gpt_prompts.example_messages:\n 1235                  main_sys += \"\\n# Example conversations:\\n\\n\"\n 1236              for msg in self.gpt_prompts.example_messages:\n 1237                  role = msg[\"role\"]\n 1238                  content = self.fmt_system_prompt(msg[\"content\"])\n 1239                  main_sys += f\"## {role.upper()}: {content}\\n\\n\"\n 1240              main_sys = main_sys.strip()\n 1241          else:\n 1242              for msg in self.gpt_prompts.example_messages:\n 1243                  example_messages.append(\n 1244                      dict(\n 1245                          role=msg[\"role\"],\n 1246                          content=self.fmt_system_prompt(msg[\"content\"]),\n 1247                      )\n 1248                  )\n 1249              if self.gpt_prompts.example_messages:\n 1250                  example_messages += [\n 1251                      dict(\n 1252                          role=\"user\",\n 1253                          content=(\n 1254                              \"I switched to a new code base. Please don't consider the above files\"\n 1255                              \" or try to edit them any longer.\"",
          "findingId": "aider-context-001",
          "title": "上下文被拆成稳定的 ChatChunks"
        }
      ],
      [
        "security",
        "aider/coders/base_coder.py",
        {
          "path": "aider/coders/base_coder.py",
          "start": 2215,
          "end": 2240,
          "snippet": " 2215  \n 2216                  # Seems unlikely that we needed to create the file, but it was\n 2217                  # actually already part of the repo.\n 2218                  # But let's only add if we need to, just to be safe.\n 2219                  if need_to_add and self.auto_commits:\n 2220                      self.repo.repo.git.add(full_path)\n 2221  \n 2222              self.abs_fnames.add(full_path)\n 2223              self.check_added_files()\n 2224              return True\n 2225  \n 2226          if not self.io.confirm_ask(\n 2227              \"Allow edits to file that has not been added to the chat?\",\n 2228              subject=path,\n 2229          ):\n 2230              self.io.tool_output(f\"Skipping edits to {path}\")\n 2231              return\n 2232  \n 2233          if need_to_add and self.auto_commits:\n 2234              self.repo.repo.git.add(full_path)\n 2235  \n 2236          self.abs_fnames.add(full_path)\n 2237          self.check_added_files()\n 2238          self.check_for_dirty_commit(path)\n 2239  \n 2240          return True",
          "findingId": "aider-permission-001",
          "title": "“聊天文件集”就是主要写权限边界"
        }
      ],
      [
        "ecosystem",
        "aider/models.py",
        {
          "path": "aider/models.py",
          "start": 1006,
          "end": 1009,
          "snippet": " 1006          if functions is not None:\n 1007              function = functions[0]\n 1008              kwargs[\"tools\"] = [dict(type=\"function\", function=function)]\n 1009              kwargs[\"tool_choice\"] = {\"type\": \"function\", \"function\": {\"name\": function[\"name\"]}}",
          "findingId": "aider-tools-001",
          "title": "核心不是 MCP/函数工具循环"
        }
      ],
      [
        "collaboration",
        "aider/coders/architect_coder.py",
        {
          "path": "aider/coders/architect_coder.py",
          "start": 6,
          "end": 48,
          "snippet": "    6  class ArchitectCoder(AskCoder):\n    7      edit_format = \"architect\"\n    8      gpt_prompts = ArchitectPrompts()\n    9      auto_accept_architect = False\n   10  \n   11      def reply_completed(self):\n   12          content = self.partial_response_content\n   13  \n   14          if not content or not content.strip():\n   15              return\n   16  \n   17          if not self.auto_accept_architect and not self.io.confirm_ask(\"Edit the files?\"):\n   18              return\n   19  \n   20          kwargs = dict()\n   21  \n   22          # Use the editor_model from the main_model if it exists, otherwise use the main_model itself\n   23          editor_model = self.main_model.editor_model or self.main_model\n   24  \n   25          kwargs[\"main_model\"] = editor_model\n   26          kwargs[\"edit_format\"] = self.main_model.editor_edit_format\n   27          kwargs[\"suggest_shell_commands\"] = False\n   28          kwargs[\"map_tokens\"] = 0\n   29          kwargs[\"total_cost\"] = self.total_cost\n   30          kwargs[\"cache_prompts\"] = False\n   31          kwargs[\"num_cache_warming_pings\"] = 0\n   32          kwargs[\"summarize_from_coder\"] = False\n   33  \n   34          new_kwargs = dict(io=self.io, from_coder=self)\n   35          new_kwargs.update(kwargs)",
          "findingId": "aider-collab-001",
          "title": "Architect/Editor 是顺序双模型链"
        }
      ],
      [
        "evidence",
        "aider/coders/base_coder.py",
        {
          "path": "aider/coders/base_coder.py",
          "start": 2375,
          "end": 2423,
          "snippet": " 2375      def auto_commit(self, edited, context=None):\n 2376          if not self.repo or not self.auto_commits or self.dry_run:\n 2377              return\n 2378  \n 2379          if not context:\n 2380              context = self.get_context_from_history(self.cur_messages)\n 2381  \n 2382          try:\n 2383              res = self.repo.commit(fnames=edited, context=context, aider_edits=True, coder=self)\n 2384              if res:\n 2385                  self.show_auto_commit_outcome(res)\n 2386                  commit_hash, commit_message = res\n 2387                  return self.gpt_prompts.files_content_gpt_edits.format(\n 2388                      hash=commit_hash,\n 2389                      message=commit_message,\n 2390                  )\n 2391  \n 2392              return self.gpt_prompts.files_content_gpt_no_edits\n 2393          except ANY_GIT_ERROR as err:\n 2394              self.io.tool_error(f\"Unable to commit: {str(err)}\")\n 2395              return\n 2396  \n 2397      def show_auto_commit_outcome(self, res):\n 2398          commit_hash, commit_message = res\n 2399          self.last_aider_commit_hash = commit_hash\n 2400          self.aider_commit_hashes.add(commit_hash)\n 2401          self.last_aider_commit_message = commit_message\n 2402          if self.show_diffs:\n 2403              self.commands.cmd_diff()\n 2404  ",
          "findingId": "aider-git-001",
          "title": "Git 提交是编辑事务和恢复机制"
        }
      ]
    ]
  },
  {
    "slug": "grok-build",
    "name": "Grok Build",
    "repo": "xai-org/grok-build",
    "branch": "main",
    "commit": "e5fd4816d43260c15ba785f103990c1ed6cea230",
    "date": "2026-08-13T01:40:17+03:00",
    "language": "Rust / Markdown / Shell",
    "kind": "Legacy source-backed harness audit",
    "legacy": true,
    "zh": {
      "thesis": "Grok Build 的既有源码账本覆盖 9 个 Harness 维度；这次迁移把原有事实重新排成单页分析和十章教程，不把 README 当作实现证据。",
      "strengths": [
        "它不像一个简单 while 循环，更像一间控制室：用户输入、工具结果、文件变化、后台任务、模型切换都从不同通道进来，由同一个会话 Actor 排队处理。",
        "能并行的尽量并行，但两个工具若同时写同一个文件会排队，避免互相覆盖。",
        "模型偶尔把两个 JSON 粘在一起，Grok Build 会先抢救，不是一看到格式错就整轮失败。"
      ],
      "limits": [
        "已定位 sampler 与 Responses/Chat Completions 流；报告正文再展开协议差异。",
        "关键并发、安全、恢复测试已定位；完整测试规模待汇总。",
        "当前页面复用既有源码账本；迁移到自研前仍需做部署级验证"
      ],
      "lesson": "它不像一个简单 while 循环，更像一间控制室：用户输入、工具结果、文件变化、后台任务、模型切换都从不同通道进来，由同一个会话 Actor 排队处理。"
    },
    "en": {
      "thesis": "The existing source ledger for Grok Build covers 9 Harness dimensions. This migration reshapes those facts into a single analysis page and ten standalone chapters instead of treating README claims as implementation evidence.",
      "strengths": [
        "Pinned source findings expose the control loop",
        "Context, tools, and policy are separated into reviewable dimensions",
        "Each chapter keeps a file and line-range trail"
      ],
      "limits": [
        "This snapshot reuses the prior source ledger and its pinned commit",
        "Deployment-level behavior still needs a fresh run",
        "Legacy findings should be re-audited when the repository moves"
      ],
      "lesson": "Read the implementation as input, state, tool effect, receipt, and recovery—not as a feature list."
    },
    "anchors": [
      [
        "overview",
        "crates/codegen/xai-grok-shell/src/session/acp_session_impl/run_loop.rs",
        {
          "path": "crates/codegen/xai-grok-shell/src/session/acp_session_impl/run_loop.rs",
          "start": 120,
          "end": 183,
          "snippet": "  120          }\n  121          drop(state);\n  122          xai_grok_telemetry::unified_log::info(\n  123              \"shell.task_wake.actor_admission\",\n  124              Some(self.session_info.id.0.as_ref()),\n  125              Some(serde_json::json!({\n  126                  \"task_id\": task_id,\n  127                  \"gate\": gate_suppressed,\n  128                  \"state\": state_suppressed,\n  129                  \"admitted\": true,\n  130              })),\n  131          );\n  132          Some(fallback)\n  133      }\n  134  }\n  135  async fn shutdown_workflows(session: &SessionActor) {\n  136      if let Err(run_ids) = session\n  137          .workflow_manager\n  138          .lock()\n  139          .await\n  140          .cancel_all_and_drain(std::time::Duration::from_secs(7))\n  141          .await\n  142      {\n  143          tracing::warn!(\n  144              ?run_ids,\n  145              \"workflow shutdown completed with interrupted runs\"\n  146          );\n  147      }\n  148      let (respond_to, ack) = tokio::sync::oneshot::channel();\n  149      if session",
          "findingId": "grok-loop-001",
          "title": "SessionActor 是事件驱动的长期存活 Actor"
        }
      ],
      [
        "architecture",
        "crates/codegen/xai-grok-shell/src/session/acp_session_impl/tool_calls.rs",
        {
          "path": "crates/codegen/xai-grok-shell/src/session/acp_session_impl/tool_calls.rs",
          "start": 355,
          "end": 449,
          "snippet": "  355      pub(super) async fn execute_tool_calls(\n  356          &self,\n  357          tool_calls: Vec<crate::sampling::types::ToolCallResponse>,\n  358      ) -> Result<ToolLoop, acp::Error> {\n  359          if let Some(cfg) = self.chat_state_handle.get_sampling_config().await {\n  360              tracing::Span::current().record(\"model_id\", cfg.model.as_str());\n  361          }\n  362          let mut final_result: Option<ToolLoop> = None;\n  363          let mut deferred_followups: Vec<ConversationItem> = Vec::new();\n  364          if tool_calls.len() > 1 {\n  365              let kind_of = |name: &str| self.agent.borrow().tool_bridge().tool_kind(name);\n  366              let (body, tail) = split_exit_plan_tail(tool_calls, kind_of);\n  367              if !body.is_empty() {\n  368                  self.execute_tool_calls_batch(body, &mut deferred_followups, &mut final_result)\n  369                      .await?;\n  370              }\n  371              if !tail.is_empty() {\n  372                  self.execute_tool_calls_batch(tail, &mut deferred_followups, &mut final_result)\n  373                      .await?;\n  374              }\n  375          } else {\n  376              self.execute_tool_calls_batch(tool_calls, &mut deferred_followups, &mut final_result)\n  377                  .await?;\n  378          }\n  379          {\n  380              let _span = if !deferred_followups.is_empty() {\n  381                  Some(\n  382                      tracing::info_span!(\n  383                          \"tools.deferred_followups\",\n  384                          count = deferred_followups.len()",
          "findingId": "grok-tools-001",
          "title": "工具执行明确拆成 prepare、并发 dispatch、post-flight"
        }
      ],
      [
        "loop",
        "crates/codegen/xai-grok-shell/src/session/acp_session_impl/tool_calls.rs",
        {
          "path": "crates/codegen/xai-grok-shell/src/session/acp_session_impl/tool_calls.rs",
          "start": 355,
          "end": 449,
          "snippet": "  355      pub(super) async fn execute_tool_calls(\n  356          &self,\n  357          tool_calls: Vec<crate::sampling::types::ToolCallResponse>,\n  358      ) -> Result<ToolLoop, acp::Error> {\n  359          if let Some(cfg) = self.chat_state_handle.get_sampling_config().await {\n  360              tracing::Span::current().record(\"model_id\", cfg.model.as_str());\n  361          }\n  362          let mut final_result: Option<ToolLoop> = None;\n  363          let mut deferred_followups: Vec<ConversationItem> = Vec::new();\n  364          if tool_calls.len() > 1 {\n  365              let kind_of = |name: &str| self.agent.borrow().tool_bridge().tool_kind(name);\n  366              let (body, tail) = split_exit_plan_tail(tool_calls, kind_of);\n  367              if !body.is_empty() {\n  368                  self.execute_tool_calls_batch(body, &mut deferred_followups, &mut final_result)\n  369                      .await?;\n  370              }\n  371              if !tail.is_empty() {\n  372                  self.execute_tool_calls_batch(tail, &mut deferred_followups, &mut final_result)\n  373                      .await?;\n  374              }\n  375          } else {\n  376              self.execute_tool_calls_batch(tool_calls, &mut deferred_followups, &mut final_result)\n  377                  .await?;\n  378          }\n  379          {\n  380              let _span = if !deferred_followups.is_empty() {\n  381                  Some(\n  382                      tracing::info_span!(\n  383                          \"tools.deferred_followups\",\n  384                          count = deferred_followups.len()",
          "findingId": "grok-tools-001",
          "title": "工具执行明确拆成 prepare、并发 dispatch、post-flight"
        }
      ],
      [
        "model",
        "crates/codegen/xai-grok-shell/src/session/acp_session_impl/tool_calls.rs",
        {
          "path": "crates/codegen/xai-grok-shell/src/session/acp_session_impl/tool_calls.rs",
          "start": 355,
          "end": 449,
          "snippet": "  355      pub(super) async fn execute_tool_calls(\n  356          &self,\n  357          tool_calls: Vec<crate::sampling::types::ToolCallResponse>,\n  358      ) -> Result<ToolLoop, acp::Error> {\n  359          if let Some(cfg) = self.chat_state_handle.get_sampling_config().await {\n  360              tracing::Span::current().record(\"model_id\", cfg.model.as_str());\n  361          }\n  362          let mut final_result: Option<ToolLoop> = None;\n  363          let mut deferred_followups: Vec<ConversationItem> = Vec::new();\n  364          if tool_calls.len() > 1 {\n  365              let kind_of = |name: &str| self.agent.borrow().tool_bridge().tool_kind(name);\n  366              let (body, tail) = split_exit_plan_tail(tool_calls, kind_of);\n  367              if !body.is_empty() {\n  368                  self.execute_tool_calls_batch(body, &mut deferred_followups, &mut final_result)\n  369                      .await?;\n  370              }\n  371              if !tail.is_empty() {\n  372                  self.execute_tool_calls_batch(tail, &mut deferred_followups, &mut final_result)\n  373                      .await?;\n  374              }\n  375          } else {\n  376              self.execute_tool_calls_batch(tool_calls, &mut deferred_followups, &mut final_result)\n  377                  .await?;\n  378          }\n  379          {\n  380              let _span = if !deferred_followups.is_empty() {\n  381                  Some(\n  382                      tracing::info_span!(\n  383                          \"tools.deferred_followups\",\n  384                          count = deferred_followups.len()",
          "findingId": "grok-tools-001",
          "title": "工具执行明确拆成 prepare、并发 dispatch、post-flight"
        }
      ],
      [
        "tools",
        "crates/codegen/xai-grok-shell/src/session/acp_session_impl/tool_calls.rs",
        {
          "path": "crates/codegen/xai-grok-shell/src/session/acp_session_impl/tool_calls.rs",
          "start": 355,
          "end": 449,
          "snippet": "  355      pub(super) async fn execute_tool_calls(\n  356          &self,\n  357          tool_calls: Vec<crate::sampling::types::ToolCallResponse>,\n  358      ) -> Result<ToolLoop, acp::Error> {\n  359          if let Some(cfg) = self.chat_state_handle.get_sampling_config().await {\n  360              tracing::Span::current().record(\"model_id\", cfg.model.as_str());\n  361          }\n  362          let mut final_result: Option<ToolLoop> = None;\n  363          let mut deferred_followups: Vec<ConversationItem> = Vec::new();\n  364          if tool_calls.len() > 1 {\n  365              let kind_of = |name: &str| self.agent.borrow().tool_bridge().tool_kind(name);\n  366              let (body, tail) = split_exit_plan_tail(tool_calls, kind_of);\n  367              if !body.is_empty() {\n  368                  self.execute_tool_calls_batch(body, &mut deferred_followups, &mut final_result)\n  369                      .await?;\n  370              }\n  371              if !tail.is_empty() {\n  372                  self.execute_tool_calls_batch(tail, &mut deferred_followups, &mut final_result)\n  373                      .await?;\n  374              }\n  375          } else {\n  376              self.execute_tool_calls_batch(tool_calls, &mut deferred_followups, &mut final_result)\n  377                  .await?;\n  378          }\n  379          {\n  380              let _span = if !deferred_followups.is_empty() {\n  381                  Some(\n  382                      tracing::info_span!(\n  383                          \"tools.deferred_followups\",\n  384                          count = deferred_followups.len()",
          "findingId": "grok-tools-001",
          "title": "工具执行明确拆成 prepare、并发 dispatch、post-flight"
        }
      ],
      [
        "context",
        "crates/codegen/xai-grok-shell/src/session/compaction.rs",
        {
          "path": "crates/codegen/xai-grok-shell/src/session/compaction.rs",
          "start": 3,
          "end": 35,
          "snippet": "    3  //! This module contains all compaction-related methods: manual `/compact`,\n    4  //! auto-compact threshold checks, inline auto-compact with auto-continue,\n    5  //! error-recovery compaction, preflight overflow detection, and checkpoint\n    6  //! persistence. These methods form a second `impl SessionActor` block that\n    7  //! lives alongside the primary one in `acp_session.rs`.\n    8  use super::SessionActor;\n    9  use super::is_project_instructions;\n   10  use crate::remote::DEFAULT_CONTEXT_WINDOW;\n   11  use crate::session::compaction_config::{\n   12      AsyncCompactionCache, SUPPRESS_AUTH, SUPPRESS_NONE, SUPPRESS_STICKY, SUPPRESS_TURN,\n   13      SUPPRESS_UNTIL_SUCCESS,\n   14  };\n   15  use crate::session::helpers::CompactionStateContext;\n   16  use crate::session::helpers::compaction_context::CompactionInputs;\n   17  use crate::session::helpers::compaction_context::to_system_reminder;\n   18  use crate::session::helpers::session_compact::{\n   19      CompactOutput, CompactionOutcome, build_two_pass_compaction_prompt, generate_session_compact,\n   20      is_context_length_error,\n   21  };\n   22  use crate::session::persistence::PersistenceMsg;\n   23  use crate::session::two_pass::{\n   24      TWO_PASS_DEFAULT_SPLIT_FRACTION, build_two_pass_pass1_history, build_two_pass_pass2_history,\n   25      note_for_two_pass_pass2, split_conversation_for_two_pass,\n   26  };\n   27  use agent_client_protocol as acp;\n   28  use std::sync::Arc;\n   29  use xai_chat_state::compaction_utils::{\n   30      CompactedHistoryInput, CompactionAttempt, build_compacted_history, is_degenerate_summary,\n   31      prepare_conversation_for_verbatim_summarization, sanitize_compacted_history,\n   32      validate_compacted_history,",
          "findingId": "grok-context-001",
          "title": "压缩是一条带预热、两阶段和恢复梯子的子系统"
        }
      ],
      [
        "security",
        "crates/codegen/xai-grok-shell/src/session/acp_session_impl/tool_calls.rs",
        {
          "path": "crates/codegen/xai-grok-shell/src/session/acp_session_impl/tool_calls.rs",
          "start": 157,
          "end": 205,
          "snippet": "  157          Err(e) if e.kind() == std::io::ErrorKind::NotFound => PlanFileRead::Absent,\n  158          Err(_) => PlanFileRead::Unreadable,\n  159      }\n  160  }\n  161  /// Whether to intercept exit-plan tools for client-side plan approval.\n  162  ///\n  163  /// A mode-switch back to agent with `PlanFileRead::Absent` skips intercept\n  164  /// (leaving without approving is allowed). `Present` / `Unreadable` still intercept\n  165  /// (unreadable = fail-closed, empty approval UI rather than silent exit).\n  166  pub(super) fn should_intercept_exit_plan_approval(\n  167      is_exit_plan_mode: bool,\n  168      is_cursor_switch_to_agent: bool,\n  169      is_cursor_create_plan: bool,\n  170      plan_read: &PlanFileRead,\n  171  ) -> bool {\n  172      if !is_exit_plan_mode && !is_cursor_switch_to_agent && !is_cursor_create_plan {\n  173          return false;\n  174      }\n  175      if is_cursor_switch_to_agent && matches!(plan_read, PlanFileRead::Absent) {\n  176          return false;\n  177      }\n  178      true\n  179  }\n  180  /// Whether this tool call exits file-backed plan mode (not inline plan creation).\n  181  pub(super) fn is_file_backed_exit_plan_input(tool_input: &ToolInput) -> bool {\n  182      if matches!(tool_input, ToolInput::ExitPlanMode(_)) {\n  183          return true;\n  184      }\n  185      false\n  186  }",
          "findingId": "grok-plan-001",
          "title": "Plan Mode 的只读约束独立于 Always Approve"
        }
      ],
      [
        "ecosystem",
        "crates/codegen/xai-grok-agent/src/plugins/manifest.rs",
        {
          "path": "crates/codegen/xai-grok-agent/src/plugins/manifest.rs",
          "start": 103,
          "end": 170,
          "snippet": "  103      match field {\n  104          Some(PathOrInline::Path(p)) => {\n  105              let resolved = plugin_root.join(p);\n  106              if !is_path_contained(&resolved, plugin_root) {\n  107                  tracing::warn!(\n  108                      path = %resolved.display(),\n  109                      plugin_root = %plugin_root.display(),\n  110                      \"{label} path escapes plugin root; skipping\"\n  111                  );\n  112                  return None;\n  113              }\n  114              resolved.is_file().then_some(resolved)\n  115          }\n  116          Some(PathOrInline::Inline(_)) => None,\n  117          None => {\n  118              let default = plugin_root.join(default_file);\n  119              default.is_file().then_some(default)\n  120          }\n  121      }\n  122  }\n  123  \n  124  /// A value that can be either a file path (string) or an inline JSON object.\n  125  #[derive(Debug, Clone, Deserialize)]\n  126  #[serde(untagged)]\n  127  pub enum PathOrInline {\n  128      Path(String),\n  129      Inline(serde_json::Value),\n  130  }\n  131  \n  132  /// Parsed plugin manifest from `plugin.json`.",
          "findingId": "grok-plugin-001",
          "title": "一个插件可同时交付 Skills、Commands、Agents、Hooks、MCP、LSP"
        }
      ],
      [
        "collaboration",
        "crates/codegen/xai-grok-shell/src/session/acp_session_impl/tool_calls.rs",
        {
          "path": "crates/codegen/xai-grok-shell/src/session/acp_session_impl/tool_calls.rs",
          "start": 811,
          "end": 839,
          "snippet": "  811                  )\n  812                  .await;\n  813              let (ext_file_path, ext_parameters) = if xai_grok_telemetry::external::is_active() {\n  814                  let parsed: Option<serde_json::Value> =\n  815                      serde_json::from_str(&prepared.raw_arguments).ok();\n  816                  let file_path = parsed.as_ref().and_then(|v| {\n  817                      [\"file_path\", \"target_file\", \"filePath\", \"path\"]\n  818                          .iter()\n  819                          .find_map(|k| v.get(*k).and_then(|p| p.as_str()))\n  820                          .map(str::to_owned)\n  821                  });\n  822                  (file_path, parsed)\n  823              } else {\n  824                  (None, None)\n  825              };\n  826              xai_grok_telemetry::session_ctx::log_event(\n  827                  xai_grok_telemetry::events::ToolCallCompleted {\n  828                      tool_name: prepared.tool_name.clone(),\n  829                      outcome: tool_outcome,\n  830                      duration_ms,\n  831                      file_path: ext_file_path,\n  832                      parameters: ext_parameters,\n  833                  },\n  834              );\n  835              if let Some(artifact) = compaction_artifact_read(&prepared.parsed_args) {\n  836                  tracing::info_span!(\n  837                      \"compaction.segment_read\",\n  838                      session_id = %self.session_info.id.0,\n  839                      tool_name = %prepared.tool_name,",
          "findingId": "grok-subagent-001",
          "title": "子 Agent 支持后台执行、恢复、深度限制与 worktree 隔离"
        }
      ],
      [
        "evidence",
        "crates/codegen/xai-grok-shell/src/session/acp_session_impl/tool_calls.rs",
        {
          "path": "crates/codegen/xai-grok-shell/src/session/acp_session_impl/tool_calls.rs",
          "start": 392,
          "end": 436,
          "snippet": "  392                  self.chat_state_handle.push_user_message(chat);\n  393              }\n  394          }\n  395          self.drain_pending_interjections().await;\n  396          self.flush_pending_skill_reminders().await;\n  397          if let Some(final_result) = final_result {\n  398              return Ok(final_result);\n  399          }\n  400          Ok(ToolLoop::Continue)\n  401      }\n  402      /// Prepare → dispatch → post-flight. Caller owns the outer tail flush.\n  403      async fn execute_tool_calls_batch(\n  404          &self,\n  405          tool_calls: Vec<crate::sampling::types::ToolCallResponse>,\n  406          deferred_followups: &mut Vec<ConversationItem>,\n  407          final_result: &mut Option<ToolLoop>,\n  408      ) -> Result<(), acp::Error> {\n  409          if self.permissions.is_auto_mode() {\n  410              let conversation = self.chat_state_handle.get_conversation().await;\n  411              super::refresh_classifier_transcript(&self.permissions, &conversation);\n  412          }\n  413          let mut approved: Vec<PreparedToolCall> = Vec::new();\n  414          for call in tool_calls.into_iter() {\n  415              if final_result.is_some() {\n  416                  let message = match &*final_result {\n  417                      Some(ToolLoop::PermissionReject { .. }) => {\n  418                          format!(\n  419                              \"Tool execution cancelled due to earlier permission rejection for tool `{}`\",\n  420                              call.function.name\n  421                          )",
          "findingId": "grok-observe-001",
          "title": "工具、权限、压缩和沙箱均产出结构化事件"
        }
      ]
    ]
  },
  {
    "slug": "openinterpreter",
    "name": "Open Interpreter",
    "repo": "openinterpreter/openinterpreter",
    "branch": "main",
    "commit": "984acc698cd038885ecb0b82721402b01e11a5ad",
    "date": "2026-08-08T12:04:43-07:00",
    "language": "Rust / TypeScript / Markdown",
    "kind": "Legacy source-backed harness audit",
    "legacy": true,
    "zh": {
      "thesis": "Open Interpreter 的既有源码账本覆盖 9 个 Harness 维度；这次迁移把原有事实重新排成单页分析和十章教程，不把 README 当作实现证据。",
      "strengths": [
        "它不是在旧 Python 循环上继续打补丁，而是把一套 Codex 级 Rust Harness 换了产品入口，再加入自己的多 Harness 能力。",
        "“还能被 Codex SDK 当成 Codex 用”是 CI 级目标，不是偶然能跑。",
        "同一个底盘能换不同“驾驶舱”：改变系统提示词、消息格式、工具名称与参数，去适配最合适的模型习惯。"
      ],
      "limits": [
        "当前页面复用既有源码账本；迁移到自研前仍需做部署级验证",
        "当前页面复用既有源码账本；迁移到自研前仍需做部署级验证",
        "当前页面复用既有源码账本；迁移到自研前仍需做部署级验证"
      ],
      "lesson": "它不是在旧 Python 循环上继续打补丁，而是把一套 Codex 级 Rust Harness 换了产品入口，再加入自己的多 Harness 能力。"
    },
    "en": {
      "thesis": "The existing source ledger for Open Interpreter covers 9 Harness dimensions. This migration reshapes those facts into a single analysis page and ten standalone chapters instead of treating README claims as implementation evidence.",
      "strengths": [
        "Pinned source findings expose the control loop",
        "Context, tools, and policy are separated into reviewable dimensions",
        "Each chapter keeps a file and line-range trail"
      ],
      "limits": [
        "This snapshot reuses the prior source ledger and its pinned commit",
        "Deployment-level behavior still needs a fresh run",
        "Legacy findings should be re-audited when the repository moves"
      ],
      "lesson": "Read the implementation as input, state, tool effect, receipt, and recovery—not as a feature list."
    },
    "anchors": [
      [
        "overview",
        "codex-rs/core/src/harness/mod.rs",
        {
          "path": "codex-rs/core/src/harness/mod.rs",
          "start": 1,
          "end": 18,
          "snippet": "    1  pub(crate) mod claude_code;\n    2  mod claude_code_prompt;\n    3  pub(crate) mod deepseek_tui;\n    4  pub(crate) mod guidance;\n    5  pub(crate) mod kimi_cli;\n    6  pub(crate) mod kimi_code;\n    7  pub(crate) mod little_coder;\n    8  pub(crate) mod mini_swe_agent;\n    9  pub(crate) mod minimal;\n   10  pub(crate) mod opencode;\n   11  pub(crate) mod pi;\n   12  pub(crate) mod qwen_code;\n   13  pub(crate) mod request;\n   14  pub(crate) mod routing;\n   15  pub(crate) mod session_skills;\n   16  pub(crate) mod swe_agent;\n   17  pub(crate) mod terminus_2;\n   18  pub(crate) mod zcode;",
          "findingId": "oi-harness-001",
          "title": "核心差异是一层多 Harness 仿真目录"
        }
      ],
      [
        "architecture",
        "codex-rs/core/src/session/turn.rs",
        {
          "path": "codex-rs/core/src/session/turn.rs",
          "start": 140,
          "end": 228,
          "snippet": "  140  /// the model replies with either:\n  141  ///\n  142  /// - requested function calls\n  143  /// - an assistant message\n  144  ///\n  145  /// While it is possible for the model to return multiple of these items in a\n  146  /// single sampling request, in practice, we generally one item per sampling request:\n  147  ///\n  148  /// - If the model requests a function call, we execute it and send the output\n  149  ///   back to the model in the next sampling request.\n  150  /// - If the model sends only an assistant message, we record it in the\n  151  ///   conversation history and consider the turn complete.\n  152  ///\n  153  pub(crate) async fn run_turn(\n  154      sess: Arc<Session>,\n  155      turn_context: Arc<TurnContext>,\n  156      turn_extension_data: Arc<codex_extension_api::ExtensionData>,\n  157      input: Vec<TurnInput>,\n  158      prewarmed_client_session: Option<ModelClientSession>,\n  159      cancellation_token: CancellationToken,\n  160  ) -> CodexResult<Option<String>> {\n  161      let mut client_session =\n  162          prewarmed_client_session.unwrap_or_else(|| sess.services.model_client.new_session());\n  163      // TODO(ccunningham): Pre-turn compaction runs before context updates and the\n  164      // new user message are recorded. Estimate pending incoming items (context\n  165      // diffs/full reinjection + user input) and trigger compaction preemptively\n  166      // when they would push the thread over the compaction threshold.\n  167      if let Err(err) = run_pre_sampling_compact(\n  168          &sess,\n  169          &turn_context,",
          "findingId": "oi-loop-001",
          "title": "共享内核仍是 turn 内多 step 的流式工具循环"
        }
      ],
      [
        "loop",
        "codex-rs/app-server-protocol/src/protocol/v2/interpreter.rs",
        {
          "path": "codex-rs/app-server-protocol/src/protocol/v2/interpreter.rs",
          "start": 8,
          "end": 44,
          "snippet": "    8  #[derive(Serialize, Deserialize, Debug, Clone, Copy, PartialEq, Eq, JsonSchema, TS)]\n    9  #[serde(rename_all = \"lowercase\")]\n   10  #[ts(export_to = \"v2/\")]\n   11  pub enum WireApiDto {\n   12      Responses,\n   13      Chat,\n   14      Messages,\n   15  }\n   16  \n   17  #[derive(Serialize, Deserialize, Debug, Clone, PartialEq, Eq, JsonSchema, TS)]\n   18  #[serde(rename_all = \"camelCase\")]\n   19  #[ts(export_to = \"v2/\")]\n   20  pub struct InterpreterProvider {\n   21      pub id: String,\n   22      pub name: String,\n   23      pub description: String,\n   24      pub is_current: bool,\n   25      #[ts(optional)]\n   26      pub base_url: Option<String>,\n   27      #[ts(optional)]\n   28      pub wire_api: Option<WireApiDto>,\n   29      #[ts(optional)]\n   30      pub env_key: Option<String>,\n   31      pub configured: bool,\n   32      pub is_default: bool,\n   33  }\n   34  \n   35  #[derive(Serialize, Deserialize, Debug, Clone, PartialEq, Eq, JsonSchema, TS)]\n   36  #[serde(rename_all = \"camelCase\")]\n   37  #[ts(export_to = \"v2/\")]",
          "findingId": "oi-harness-002",
          "title": "Provider、Wire API、Harness 是三层独立选择"
        }
      ],
      [
        "model",
        "codex-rs/product-info/src/lib.rs",
        {
          "path": "codex-rs/product-info/src/lib.rs",
          "start": 45,
          "end": 79,
          "snippet": "   45  /// Product channel information used by branded package variants.\n   46  #[derive(Debug, Clone, Copy, PartialEq, Eq)]\n   47  pub enum Product {\n   48      Codex,\n   49      OpenInterpreter,\n   50  }\n   51  \n   52  impl Product {\n   53      /// A binary shipped inside an Open Interpreter package is Open\n   54      /// Interpreter unconditionally — identity must never depend on what the\n   55      /// executable happens to be named or aliased to. The argv0 and env-var\n   56      /// checks only exist for development builds run straight out of the\n   57      /// cargo target directory.\n   58      pub fn current() -> Self {\n   59          if std::env::var_os(OPEN_INTERPRETER_BRAND_ENV_VAR).is_some()\n   60              || is_open_interpreter_argv0()\n   61              || is_open_interpreter_install()\n   62          {\n   63              Self::OpenInterpreter\n   64          } else {\n   65              Self::Codex\n   66          }\n   67      }\n   68  \n   69      pub fn display_name(self) -> &'static str {\n   70          match self {\n   71              Product::Codex => \"OpenAI Codex\",\n   72              Product::OpenInterpreter => \"Open Interpreter\",\n   73          }\n   74      }",
          "findingId": "oi-identity-001",
          "title": "当前源码不是经典 Python Open Interpreter，而是 Rust/Codex 兼容分叉"
        }
      ],
      [
        "tools",
        "codex-rs/core/src/tools/spec_plan.rs",
        {
          "path": "codex-rs/core/src/tools/spec_plan.rs",
          "start": 240,
          "end": 268,
          "snippet": "  240              | ToolExposure::Deferred\n  241              | ToolExposure::DirectModelOnly\n  242              | ToolExposure::Hidden => {}\n  243          }\n  244      }\n  245  }\n  246  \n  247  #[instrument(level = \"trace\", skip_all)]\n  248  fn build_model_visible_specs_and_registry(\n  249      turn_context: &TurnContext,\n  250      planned_tools: PlannedTools,\n  251  ) -> (Vec<ToolSpec>, ToolRegistry) {\n  252      let PlannedTools {\n  253          runtimes,\n  254          hosted_specs,\n  255      } = planned_tools;\n  256      let mut specs = Vec::new();\n  257      let mut seen_tool_names = HashSet::new();\n  258      for runtime in &runtimes {\n  259          let tool_name = runtime.tool_name();\n  260          if !seen_tool_names.insert(tool_name.clone()) {\n  261              continue;\n  262          }\n  263          let exposure = runtime.exposure();\n  264          if exposure.is_direct() && !is_hidden_by_code_mode_only(turn_context, &tool_name, exposure)\n  265          {\n  266              let spec = runtime.spec();\n  267              specs.push(spec_for_model_request(\n  268                  turn_context,",
          "findingId": "oi-tools-001",
          "title": "模型可见工具与内部可分发 runtime 分离"
        }
      ],
      [
        "context",
        "codex-rs/core/src/context_manager/history.rs",
        {
          "path": "codex-rs/core/src/context_manager/history.rs",
          "start": 40,
          "end": 186,
          "snippet": "   40  pub(crate) struct ContextManager {\n   41      /// The oldest items are at the beginning of the vector. Snapshots share the vector until a\n   42      /// caller needs to mutate it, avoiding deep copies for read-only history consumers.\n   43      items: Arc<Vec<ResponseItem>>,\n   44      /// Bumped whenever history is rewritten, such as compaction or rollback.\n   45      history_version: u64,\n   46      token_info: Option<TokenUsageInfo>,\n   47      /// Reference context snapshot used for diffing and producing model-visible\n   48      /// settings update items.\n   49      ///\n   50      /// This is the baseline for the next regular model turn, and may already\n   51      /// match the current turn after context updates are persisted.\n   52      ///\n   53      /// When this is `None`, settings diffing treats the next turn as having no\n   54      /// baseline and emits a full reinjection of context state. Rollback may\n   55      /// also clear this when it trims a mixed initial-context developer bundle\n   56      /// whose non-diff fragments no longer exist in the surviving history.\n   57      reference_context_item: Option<TurnContextItem>,\n   58      /// World state most recently appended to model-visible history.\n   59      world_state_baseline: Option<WorldStateSnapshot>,\n   60  }\n   61  \n   62  impl ContextManager {\n   63      pub(crate) fn new() -> Self {\n   64          Self {\n   65              items: Arc::new(Vec::new()),\n   66              history_version: 0,\n   67              token_info: TokenUsageInfo::new_or_append(\n   68                  &None, &None, /*model_context_window*/ None,\n   69              ),",
          "findingId": "oi-context-001",
          "title": "历史管理维护调用配对、多模态能力和可见 token 成本"
        }
      ],
      [
        "security",
        "codex-rs/core/src/tools/handlers/harness_fs.rs",
        {
          "path": "codex-rs/core/src/tools/handlers/harness_fs.rs",
          "start": 39,
          "end": 94,
          "snippet": "   39  pub(crate) fn resolve_model_path(\n   40      invocation: &ToolInvocation,\n   41      path: &str,\n   42  ) -> Result<PathBuf, FunctionCallError> {\n   43      let path = normalize_model_path_text(path);\n   44      let path = PathBuf::from(path);\n   45      if path.is_absolute() {\n   46          Ok(path)\n   47      } else {\n   48          Ok(primary_cwd(invocation).join(path))\n   49      }\n   50  }\n   51  \n   52  pub(crate) fn checked_read_path(\n   53      invocation: &ToolInvocation,\n   54      path: &str,\n   55      operation: &str,\n   56  ) -> Result<PathBuf, FunctionCallError> {\n   57      let path = resolve_model_path(invocation, path)?;\n   58      ensure_read_allowed(invocation, &path, operation)?;\n   59      Ok(path)\n   60  }\n   61  \n   62  pub(crate) fn checked_write_path(\n   63      invocation: &ToolInvocation,\n   64      path: &str,\n   65      operation: &str,\n   66  ) -> Result<PathBuf, FunctionCallError> {\n   67      let path = resolve_model_path(invocation, path)?;\n   68      ensure_write_allowed(invocation, &path, operation)?;",
          "findingId": "oi-security-001",
          "title": "Harness 文件工具先过策略，且同时检查原路径与规范化路径"
        }
      ],
      [
        "ecosystem",
        "codex-rs/core/src/session/turn.rs",
        {
          "path": "codex-rs/core/src/session/turn.rs",
          "start": 546,
          "end": 650,
          "snippet": "  546      let mut display_roots = Vec::new();\n  547      for turn_environment in step_context.environments.turn_environments() {\n  548          let cwd = turn_environment.cwd();\n  549          // A turn cwd is expected to be a directory. If it is a file, the failed `<cwd>/.git` probe\n  550          // is ignored and ancestor search continues from its parent.\n  551          let root = find_nearest_ancestor_with_markers(\n  552              turn_environment.environment.get_filesystem().as_ref(),\n  553              cwd,\n  554              vec![\".git\".to_string()],\n  555              FindUpErrorPolicy::Ignore,\n  556              /*sandbox*/ None,\n  557          )\n  558          .await\n  559          .ok()\n  560          .flatten()\n  561          .unwrap_or_else(|| cwd.clone());\n  562          display_roots.push((turn_environment.environment_id.clone(), root));\n  563      }\n  564      display_roots\n  565  }\n  566  \n  567  #[instrument(level = \"trace\", skip_all)]\n  568  pub(crate) async fn run_hooks_and_record_inputs(\n  569      sess: &Arc<Session>,\n  570      turn_context: &Arc<TurnContext>,\n  571      input: &[TurnInput],\n  572  ) -> bool {\n  573      let mut blocked_input = false;\n  574      let mut accepted_user_input = false;\n  575      for input_item in input {",
          "findingId": "oi-mcp-001",
          "title": "MCP、Apps、Plugins、Extensions 都在 step 工具计划中受快照控制"
        }
      ],
      [
        "collaboration",
        "codex-rs/core/src/agent/control.rs",
        {
          "path": "codex-rs/core/src/agent/control.rs",
          "start": 88,
          "end": 180,
          "snippet": "   88  }\n   89  \n   90  /// Control-plane handle for multi-agent operations.\n   91  /// `AgentControl` is held by each session (via `SessionServices`). It provides capability to\n   92  /// spawn new agents and the inter-agent communication layer.\n   93  /// An `AgentControl` instance is intended to be created at most once per root thread/session\n   94  /// tree. That same `AgentControl` is then shared with every sub-agent spawned from that root,\n   95  /// which keeps the registry scoped to that root thread rather than the entire `ThreadManager`.\n   96  #[derive(Clone, Default)]\n   97  pub(crate) struct AgentControl {\n   98      /// ID shared by the whole agent control session. This means every sub-agents from a common\n   99      /// root share the same session ID.\n  100      session_id: SessionId,\n  101      /// Weak handle back to the global thread registry/state.\n  102      /// This is `Weak` to avoid reference cycles and shadow persistence of the form\n  103      /// `ThreadManagerState -> CodexThread -> Session -> SessionServices -> ThreadManagerState`.\n  104      manager: Weak<ThreadManagerState>,\n  105      state: Arc<AgentRegistry>,\n  106      v2_residency: Arc<V2Residency>,\n  107      agent_execution_limiter: Arc<AgentExecutionLimiter>,\n  108      /// Session-scoped state shared by the root thread and every cloned sub-agent control handle.\n  109      rollout_budget: Arc<RolloutBudget>,\n  110  }\n  111  \n  112  impl AgentControl {\n  113      /// Construct a new `AgentControl` that can spawn/message agents via the given manager state.\n  114      pub(crate) fn new(\n  115          manager: Weak<ThreadManagerState>,\n  116          rollout_budget: Option<RolloutBudgetConfig>,\n  117      ) -> Self {",
          "findingId": "oi-agent-001",
          "title": "多 Agent 是共享控制面的线程树"
        }
      ],
      [
        "evidence",
        "codex-rs/product-info/src/lib.rs",
        {
          "path": "codex-rs/product-info/src/lib.rs",
          "start": 45,
          "end": 79,
          "snippet": "   45  /// Product channel information used by branded package variants.\n   46  #[derive(Debug, Clone, Copy, PartialEq, Eq)]\n   47  pub enum Product {\n   48      Codex,\n   49      OpenInterpreter,\n   50  }\n   51  \n   52  impl Product {\n   53      /// A binary shipped inside an Open Interpreter package is Open\n   54      /// Interpreter unconditionally — identity must never depend on what the\n   55      /// executable happens to be named or aliased to. The argv0 and env-var\n   56      /// checks only exist for development builds run straight out of the\n   57      /// cargo target directory.\n   58      pub fn current() -> Self {\n   59          if std::env::var_os(OPEN_INTERPRETER_BRAND_ENV_VAR).is_some()\n   60              || is_open_interpreter_argv0()\n   61              || is_open_interpreter_install()\n   62          {\n   63              Self::OpenInterpreter\n   64          } else {\n   65              Self::Codex\n   66          }\n   67      }\n   68  \n   69      pub fn display_name(self) -> &'static str {\n   70          match self {\n   71              Product::Codex => \"OpenAI Codex\",\n   72              Product::OpenInterpreter => \"Open Interpreter\",\n   73          }\n   74      }",
          "findingId": "oi-identity-001",
          "title": "当前源码不是经典 Python Open Interpreter，而是 Rust/Codex 兼容分叉"
        }
      ]
    ]
  },
  {
    "slug": "little-coder",
    "name": "Little Coder",
    "repo": "itayinbarr/little-coder",
    "branch": "main",
    "commit": "0b7234031aabe56163e345792ce7a6ea05af321a",
    "date": "2026-07-31T12:56:33+03:00",
    "language": "TypeScript / Markdown / Python",
    "kind": "Legacy source-backed harness audit",
    "legacy": true,
    "zh": {
      "thesis": "Little Coder 的既有源码账本覆盖 9 个 Harness 维度；这次迁移把原有事实重新排成单页分析和十章教程，不把 README 当作实现证据。",
      "strengths": [
        "可以把它理解成给 pi 装了一套“小模型护栏与外挂”，对话循环、会话和基础工具仍由 pi 驱动。",
        "默认追求可预测：装哪些插件是确定的；想接入 pi 大生态可以开开关，但会牺牲冷启动上下文和固定能力面。",
        "模型若连续几十轮调用工具、不把控制权还给用户，原生 pi 可能迟迟不压缩；这个扩展在每一小轮都看油表，快满了就主动整理上下文再接着做。"
      ],
      "limits": [
        "已审计本地 provider 注册与 context probe；流式协议主体继承 pi。",
        "有 UI intervention、子 Agent usage、session evidence 与文件 checkpoint；无统一 trace backend。",
        "当前页面复用既有源码账本；迁移到自研前仍需做部署级验证"
      ],
      "lesson": "可以把它理解成给 pi 装了一套“小模型护栏与外挂”，对话循环、会话和基础工具仍由 pi 驱动。"
    },
    "en": {
      "thesis": "The existing source ledger for Little Coder covers 9 Harness dimensions. This migration reshapes those facts into a single analysis page and ten standalone chapters instead of treating README claims as implementation evidence.",
      "strengths": [
        "Pinned source findings expose the control loop",
        "Context, tools, and policy are separated into reviewable dimensions",
        "Each chapter keeps a file and line-range trail"
      ],
      "limits": [
        "This snapshot reuses the prior source ledger and its pinned commit",
        "Deployment-level behavior still needs a fresh run",
        "Legacy findings should be re-audited when the repository moves"
      ],
      "lesson": "Read the implementation as input, state, tool effect, receipt, and recovery—not as a feature list."
    },
    "anchors": [
      [
        "overview",
        "package.json",
        {
          "path": "package.json",
          "start": 33,
          "end": 43,
          "snippet": "   33    \"scripts\": {\n   34      \"pi\": \"pi\",\n   35      \"test\": \"vitest run\",\n   36      \"test:py\": \"python3 -m pytest benchmarks/test_rpc_client.py -q\",\n   37      \"typecheck\": \"tsc --noEmit\"\n   38    },\n   39    \"dependencies\": {\n   40      \"@earendil-works/pi-coding-agent\": \"^0.83.0\",\n   41      \"@sinclair/typebox\": \"^0.34.49\",\n   42      \"playwright\": \"^1.59.1\"\n   43    },",
          "findingId": "little-architecture-001",
          "title": "它是 pi 的 Harness 增强层，而不是另一套 Agent 内核"
        }
      ],
      [
        "architecture",
        "bin/little-coder.mjs",
        {
          "path": "bin/little-coder.mjs",
          "start": 157,
          "end": 217,
          "snippet": "  157  // ---- 4. Auto-discover bundled extensions ----\n  158  // Load order matters: bundled first, then the env var, then the user\n  159  // directory. pi applies later `--extension` flags after earlier ones, so a\n  160  // user extension can override bundled behavior rather than being shadowed by\n  161  // it. The three sources are recorded in LITTLE_CODER_EXTENSION_MANIFEST below\n  162  // so the `/extensions` command can tell the user where each one came from.\n  163  const extDir = join(pkgRoot, \".pi\", \"extensions\");\n  164  const extArgs = [];\n  165  const loadedBundled = [];\n  166  if (existsSync(extDir)) {\n  167    for (const name of readdirSync(extDir).sort()) {\n  168      const subdir = join(extDir, name);\n  169      const idx = join(subdir, \"index.ts\");\n  170      try {\n  171        if (statSync(subdir).isDirectory() && existsSync(idx)) {\n  172          extArgs.push(\"--extension\", idx);\n  173          loadedBundled.push(idx);\n  174        }\n  175      } catch {\n  176        // skip unreadable entries\n  177      }\n  178    }\n  179  }\n  180  \n  181  // ---- 4b. Third-party extensions via LITTLE_CODER_EXTRA_EXTENSIONS ----\n  182  // Path-delimited list (`:` on POSIX, `;` on Windows — node:path.delimiter)\n  183  // of extra extension paths to load alongside the bundled ones. Each entry can\n  184  // be either a direct file path (e.g. a pi-ponytail-style `extensions/ponytail.js`)\n  185  // or a directory containing `index.ts` / `index.js`. Survives upgrades and\n  186  // avoids the \"fork the installed npm package\" workaround that issue #46 hit.",
          "findingId": "little-extensions-001",
          "title": "扩展来源分层，默认固定集合，pi 生态桥显式 opt-in"
        }
      ],
      [
        "loop",
        "bin/little-coder.mjs",
        {
          "path": "bin/little-coder.mjs",
          "start": 157,
          "end": 217,
          "snippet": "  157  // ---- 4. Auto-discover bundled extensions ----\n  158  // Load order matters: bundled first, then the env var, then the user\n  159  // directory. pi applies later `--extension` flags after earlier ones, so a\n  160  // user extension can override bundled behavior rather than being shadowed by\n  161  // it. The three sources are recorded in LITTLE_CODER_EXTENSION_MANIFEST below\n  162  // so the `/extensions` command can tell the user where each one came from.\n  163  const extDir = join(pkgRoot, \".pi\", \"extensions\");\n  164  const extArgs = [];\n  165  const loadedBundled = [];\n  166  if (existsSync(extDir)) {\n  167    for (const name of readdirSync(extDir).sort()) {\n  168      const subdir = join(extDir, name);\n  169      const idx = join(subdir, \"index.ts\");\n  170      try {\n  171        if (statSync(subdir).isDirectory() && existsSync(idx)) {\n  172          extArgs.push(\"--extension\", idx);\n  173          loadedBundled.push(idx);\n  174        }\n  175      } catch {\n  176        // skip unreadable entries\n  177      }\n  178    }\n  179  }\n  180  \n  181  // ---- 4b. Third-party extensions via LITTLE_CODER_EXTRA_EXTENSIONS ----\n  182  // Path-delimited list (`:` on POSIX, `;` on Windows — node:path.delimiter)\n  183  // of extra extension paths to load alongside the bundled ones. Each entry can\n  184  // be either a direct file path (e.g. a pi-ponytail-style `extensions/ponytail.js`)\n  185  // or a directory containing `index.ts` / `index.js`. Survives upgrades and\n  186  // avoids the \"fork the installed npm package\" workaround that issue #46 hit.",
          "findingId": "little-extensions-001",
          "title": "扩展来源分层，默认固定集合，pi 生态桥显式 opt-in"
        }
      ],
      [
        "model",
        ".pi/extensions/llama-cpp-provider/index.ts",
        {
          "path": ".pi/extensions/llama-cpp-provider/index.ts",
          "start": 13,
          "end": 21,
          "snippet": "   13  // Data-driven provider registration. Reads:\n   14  //   1. <pkgRoot>/models.json                       (shipped default)\n   15  //   2. $LITTLE_CODER_MODELS_FILE (if set), else\n   16  //      $XDG_CONFIG_HOME/little-coder/models.json, else\n   17  //      $HOME/.config/little-coder/models.json     (user override; per-provider replace)\n   18  //   3. LLAMACPP_BASE_URL / OLLAMA_BASE_URL env    (per-provider baseUrl override)\n   19  //\n   20  // Issue #13: previously the model list was hardcoded here and models.json was\n   21  // only documentation, which made any user edit a no-op until they forked.",
          "findingId": "little-provider-001",
          "title": "面向 llama.cpp/Ollama 的 provider 注册会探测真实上下文窗"
        }
      ],
      [
        "tools",
        "bin/little-coder.mjs",
        {
          "path": "bin/little-coder.mjs",
          "start": 157,
          "end": 217,
          "snippet": "  157  // ---- 4. Auto-discover bundled extensions ----\n  158  // Load order matters: bundled first, then the env var, then the user\n  159  // directory. pi applies later `--extension` flags after earlier ones, so a\n  160  // user extension can override bundled behavior rather than being shadowed by\n  161  // it. The three sources are recorded in LITTLE_CODER_EXTENSION_MANIFEST below\n  162  // so the `/extensions` command can tell the user where each one came from.\n  163  const extDir = join(pkgRoot, \".pi\", \"extensions\");\n  164  const extArgs = [];\n  165  const loadedBundled = [];\n  166  if (existsSync(extDir)) {\n  167    for (const name of readdirSync(extDir).sort()) {\n  168      const subdir = join(extDir, name);\n  169      const idx = join(subdir, \"index.ts\");\n  170      try {\n  171        if (statSync(subdir).isDirectory() && existsSync(idx)) {\n  172          extArgs.push(\"--extension\", idx);\n  173          loadedBundled.push(idx);\n  174        }\n  175      } catch {\n  176        // skip unreadable entries\n  177      }\n  178    }\n  179  }\n  180  \n  181  // ---- 4b. Third-party extensions via LITTLE_CODER_EXTRA_EXTENSIONS ----\n  182  // Path-delimited list (`:` on POSIX, `;` on Windows — node:path.delimiter)\n  183  // of extra extension paths to load alongside the bundled ones. Each entry can\n  184  // be either a direct file path (e.g. a pi-ponytail-style `extensions/ponytail.js`)\n  185  // or a directory containing `index.ts` / `index.js`. Survives upgrades and\n  186  // avoids the \"fork the installed npm package\" workaround that issue #46 hit.",
          "findingId": "little-extensions-001",
          "title": "扩展来源分层，默认固定集合，pi 生态桥显式 opt-in"
        }
      ],
      [
        "context",
        ".pi/extensions/context-watchdog/index.ts",
        {
          "path": ".pi/extensions/context-watchdog/index.ts",
          "start": 3,
          "end": 29,
          "snippet": "    3  // Mid-run context watchdog (issue #59).\n    4  //\n    5  // pi only evaluates auto-compaction at a *user-turn boundary* — its\n    6  // `_checkCompaction` runs inside `_handlePostAgentRun`, which fires only after\n    7  // `agent.prompt()` has fully returned (i.e. once the model stops requesting\n    8  // tools and goes idle). During one long autonomous run this boundary is never\n    9  // reached: little-coder's small models routinely chain dozens of tool-call\n   10  // turns before yielding, so context grows unchecked and can blow straight past\n   11  // the window — pi then only reacts to the *overflow error* after the fact.\n   12  // charly1r reproduced exactly this: context climbing 34k → 40k → … → 64k across\n   13  // many `slot release` turns with no compaction until the request overflowed.\n   14  //\n   15  // pi does expose the levers to fix this from an extension: `ctx.getContextUsage()`\n   16  // reports live token usage against the active model's window, and `ctx.compact()`\n   17  // triggers pi's own compaction without awaiting it. This extension watches usage\n   18  // at every turn boundary and, once it crosses a threshold, proactively kicks off\n   19  // compaction — so a long single run compacts *before* it overflows, at roughly\n   20  // the same point pi would have if the model had yielded.\n   21  //\n   22  // Tuning / opt-out:\n   23  //   LITTLE_CODER_COMPACT_AT_PERCENT   trigger threshold, percent of the context\n   24  //                                     window (default 80). <=0 or >=100 disables.\n   25  //   LITTLE_CODER_NO_COMPACT_WATCHDOG=1  hard off.\n   26  //\n   27  // This is complementary to pi's end-of-run compaction, not a replacement — the\n   28  // `compacting` guard below keeps us from re-firing while a compaction is already\n   29  // in flight, and pi's own threshold/overflow paths still run at run boundaries.",
          "findingId": "little-context-001",
          "title": "80% 中途压缩 watchdog 补上 pi 的长自主运行缺口"
        }
      ],
      [
        "security",
        ".pi/extensions/permission-gate/index.ts",
        {
          "path": ".pi/extensions/permission-gate/index.ts",
          "start": 11,
          "end": 58,
          "snippet": "   11  //   LITTLE_CODER_PERMISSION_MODE=auto|accept-all|manual\n   12  //   LITTLE_CODER_BASH_ALLOW=\"cmd1,cmd2 sub,...\"  extra allow-prefixes,\n   13  //                                                merged with the built-in list.\n   14  //\n   15  // Issue #70: the gate used to match only `bash`/`Bash`, so a model that hit a\n   16  // refusal could re-run the same thing through the `ShellSession` tool and land\n   17  // in an execSync with no gate at all. Every shell-executing tool is listed in\n   18  // SHELL_TOOLS now, and they all go through the same whitelist.\n   19  \n   20  const BUILTIN_SAFE_PREFIXES: readonly string[] = [\n   21    \"ls\", \"cat\", \"head\", \"tail\", \"wc\", \"pwd\", \"echo\", \"printf\", \"date\",\n   22    \"which\", \"type\", \"env\", \"printenv\", \"uname\", \"whoami\", \"id\",\n   23    \"git log\", \"git status\", \"git diff\", \"git show\", \"git branch\",\n   24    \"git remote\", \"git stash list\", \"git tag\",\n   25    \"find \", \"grep \", \"rg \", \"ag \", \"fd \", \"sed \",\n   26    \"python \", \"python3 \", \"node \", \"ruby \", \"perl \",\n   27    \"pip show\", \"pip list\", \"npm list\", \"cargo metadata\",\n   28    \"df \", \"du \", \"free \", \"top -bn\", \"ps \",\n   29    \"curl -I\", \"curl --head\",\n   30    // Routine filesystem scaffolding. Trailing space = word boundary, so\n   31    // \"cp \" matches \"cp a b\" but not \"cpufetch\". rm stays off the list by\n   32    // design; use LITTLE_CODER_BASH_ALLOW=rm if a deployment needs it.\n   33    \"cp \", \"mv \", \"mkdir \", \"touch \",\n   34  ];\n   35  \n   36  // Trailing whitespace is meaningful — it acts as a word boundary in startsWith\n   37  // matching (\"find \" refuses \"findbug\"). We only strip leading whitespace so\n   38  // callers retain control over that boundary.\n   39  export function parseExtraPrefixes(raw: string | undefined): string[] {\n   40    if (!raw) return [];",
          "findingId": "little-permission-001",
          "title": "shell 权限是分段白名单，并显式检测写重定向"
        }
      ],
      [
        "ecosystem",
        ".pi/extensions/read-guard/index.ts",
        {
          "path": ".pi/extensions/read-guard/index.ts",
          "start": 4,
          "end": 27,
          "snippet": "    4  // Harness intervention: trim a `read` result that would overflow the context window.\n    5  //\n    6  // little-coder drives SMALL local models with small context windows (the\n    7  // model's registered contextWindow, read live below via getContextUsage()).\n    8  // pi's built-in `read` returns up to ~2000 lines in a single tool result\n    9  // — for a small model that one result can blow past the remaining budget, evict\n   10  // earlier conversation, and wreck the run. That's exactly the class of failure\n   11  // the harness-intervention layer exists to catch (cf. thinking-budget cap,\n   12  // write-guard redirect, turn-cap).\n   13  //\n   14  // When a read result would push context usage past the window, we replace it\n   15  // with only the file's first HEAD_LINES lines plus a message telling the model\n   16  // why it was trimmed and to use those lines to understand the structure, then\n   17  // locate what it needs with grep/find or a targeted read (offset/limit) — rather\n   18  // than re-reading the whole file. The user sees one uniform \"harness\n   19  // intervention: …\" line, like every other intervention.\n   20  //\n   21  // Why `tool_result`, not `tool_call`: a `tool_call` handler can only `block`\n   22  // with a `reason` string (no file content) or mutate `input.limit` (lines but no\n   23  // message). Delivering BOTH the first 30 lines AND an explanation in one result\n   24  // requires `tool_result`, whose return value replaces the content the model sees\n   25  // (ToolResultEventResult.content). The full file is still read from disk (pi\n   26  // already caps that at ~2000 lines) but the oversized text never reaches the LLM\n   27  // context because we swap it out before it lands.",
          "findingId": "little-context-002",
          "title": "超大 Read 结果在进入 LLM 前缩成 30 行"
        }
      ],
      [
        "collaboration",
        ".pi/extensions/subagent/index.ts",
        {
          "path": ".pi/extensions/subagent/index.ts",
          "start": 12,
          "end": 20,
          "snippet": "   12  // The `dispatch` tool: the main little-coder spawns isolated child little-coder\n   13  // sessions (\"sub-coders\") to research a focused question — they read the repo\n   14  // and browse online, then return a CONCISE report. The full child transcript\n   15  // lives in the tool's `details` (UI-only); only the short report enters the\n   16  // parent model's context. A live panel above the input tracks them while they\n   17  // run. See spawn.ts for the engine and the read-only constraints.\n   18  \n   19  const MAX_PARALLEL = 4;\n   20  ",
          "findingId": "little-subagent-001",
          "title": "子 Agent 是独立 little-coder 进程，父上下文只收短报告"
        }
      ],
      [
        "evidence",
        ".pi/extensions/evidence/index.ts",
        {
          "path": ".pi/extensions/evidence/index.ts",
          "start": 5,
          "end": 42,
          "snippet": "    5  // Port of local/tools/evidence.py. Per-session in-memory store of evidence\n    6  // entries. GAIA requires cite-before-answer, and these entries survive\n    7  // compaction (Phase 10's evidence-compact extension preserves them).\n    8  \n    9  const SNIPPET_CAP = 1024;\n   10  \n   11  interface EvidenceEntry {\n   12    id: string;\n   13    source: string;\n   14    note: string;\n   15    snippet: string;\n   16  }\n   17  \n   18  // Map<sessionId, entries[]>\n   19  const stores = new Map<string, EvidenceEntry[]>();\n   20  \n   21  function sessionKey(): string {\n   22    return process.env.LITTLE_CODER_SESSION_ID || \"default\";\n   23  }\n   24  \n   25  function bucket(): EvidenceEntry[] {\n   26    const key = sessionKey();\n   27    let b = stores.get(key);\n   28    if (!b) {\n   29      b = [];\n   30      stores.set(key, b);\n   31    }\n   32    return b;\n   33  }\n   34  ",
          "findingId": "little-evidence-001",
          "title": "证据是 session-scoped 结构化对象，并显式跨压缩"
        }
      ]
    ]
  },
  {
    "slug": "monkeycode",
    "name": "MonkeyCode",
    "repo": "chaitin/MonkeyCode",
    "branch": "main",
    "commit": "fcc5320b15a10dfec4d5891ce44d9d1470e10c2b",
    "date": "2026-08-13T11:10:53+08:00",
    "language": "Go / TypeScript / Markdown",
    "kind": "Legacy source-backed harness audit",
    "legacy": true,
    "zh": {
      "thesis": "MonkeyCode 的既有源码账本覆盖 7 个 Harness 维度；这次迁移把原有事实重新排成单页分析和十章教程，不把 README 当作实现证据。",
      "strengths": [
        "MonkeyCode 更像机场塔台：它决定哪架飞机、在哪个跑道、带什么配置起飞，但不会替 Codex 或 Claude 亲自驾驶。",
        "先把工单和工作间登记好，再等工作间真的上线，最后才把任务交给里面的 Agent。",
        "工单已经盖了“处理中”，但真正开工失败后只记了一条日志，状态机可能还以为工作在继续。"
      ],
      "limits": [
        "平台保存轮次日志并生成 UI 摘要；内层 context/compaction 由所选 CLI 负责。",
        "可证平台申请独立 VirtualMachine；底层 VM enforcement 不在仓库，且 Codex 内层 sandbox 被显式关闭。",
        "当前页面复用既有源码账本；迁移到自研前仍需做部署级验证"
      ],
      "lesson": "MonkeyCode 更像机场塔台：它决定哪架飞机、在哪个跑道、带什么配置起飞，但不会替 Codex 或 Claude 亲自驾驶。"
    },
    "en": {
      "thesis": "The existing source ledger for MonkeyCode covers 7 Harness dimensions. This migration reshapes those facts into a single analysis page and ten standalone chapters instead of treating README claims as implementation evidence.",
      "strengths": [
        "Pinned source findings expose the control loop",
        "Context, tools, and policy are separated into reviewable dimensions",
        "Each chapter keeps a file and line-range trail"
      ],
      "limits": [
        "This snapshot reuses the prior source ledger and its pinned commit",
        "Deployment-level behavior still needs a fresh run",
        "Legacy findings should be re-audited when the repository moves"
      ],
      "lesson": "Read the implementation as input, state, tool effect, receipt, and recovery—not as a feature list."
    },
    "anchors": [
      [
        "overview",
        "backend/pkg/taskflow/types.go",
        {
          "path": "backend/pkg/taskflow/types.go",
          "start": 554,
          "end": 587,
          "snippet": "  554  // ==================== CreateTask 类型 ====================\n  555  \n  556  // CodingAgent 编码代理类型\n  557  type CodingAgent int\n  558  \n  559  const (\n  560  \tCodingAgentCodex CodingAgent = iota + 1\n  561  \tCodingAgentClaude\n  562  \tCodingAgentMCAIReview\n  563  \tCodingAgentOpenCode\n  564  )\n  565  \n  566  // LLM 模型配置\n  567  type LLM struct {\n  568  \tApiKey      string   `json:\"api_key\"`\n  569  \tBaseURL     string   `json:\"base_url\"`\n  570  \tModel       string   `json:\"model\"`\n  571  \tApiType     string   `json:\"api_type,omitempty\"` // 接口类型 anthropic | openai\n  572  \tTemperature *float32 `json:\"temperature,omitempty\"`\n  573  }\n  574  \n  575  // ConfigFile 配置文件\n  576  type ConfigFile struct {\n  577  \tPath    string  `json:\"path\"`\n  578  \tContent string  `json:\"content\"`\n  579  \tMode    *uint32 `json:\"mode,omitempty\"`\n  580  }\n  581  \n  582  // TaskExecutionConfig 任务运行配置\n  583  type TaskExecutionConfig struct {",
          "findingId": "monkey-architecture-001",
          "title": "它是多 CLI 的任务控制平面，不是第四套 Agent loop"
        }
      ],
      [
        "architecture",
        "backend/biz/task/usecase/task.go",
        {
          "path": "backend/biz/task/usecase/task.go",
          "start": 556,
          "end": 617,
          "snippet": "  556  \n  557  \tlimit, err := a.resolveTaskConcurrencyLimit(ctx, user.ID)\n  558  \tif err != nil {\n  559  \t\treturn nil, err\n  560  \t}\n  561  \tctx = entx.WithTaskConcurrencyLimit(ctx, limit)\n  562  \n  563  \tvmID := fmt.Sprintf(\"agent_%s\", uuid.NewString())\n  564  \tprepared, err := a.repo.PrepareCreate(ctx, user, req, token, vmID)\n  565  \tif err != nil {\n  566  \t\ta.logger.With(\"error\", err, \"req\", req).ErrorContext(ctx, \"failed to create task\")\n  567  \t\treturn nil, err\n  568  \t}\n  569  \tif prepared == nil || prepared.ProjectTask == nil || prepared.Model == nil || prepared.Image == nil {\n  570  \t\treturn nil, fmt.Errorf(\"failed to prepare task\")\n  571  \t}\n  572  \tpt := prepared.ProjectTask\n  573  \tm := prepared.Model\n  574  \ti := prepared.Image\n  575  \tt := pt.Edges.Task\n  576  \tif t == nil {\n  577  \t\treturn nil, fmt.Errorf(\"task edge is nil\")\n  578  \t}\n  579  \tif git.URL == \"\" {\n  580  \t\tgit.URL = pt.RepoURL\n  581  \t}\n  582  \t// Codeup 仓库 URL 必须带 .git 后缀才能 clone，做一次兜底归一化\n  583  \t// （覆盖用户手输仓库地址未带后缀的场景）\n  584  \tgit.URL = giturl.NormalizeCloneURL(git.URL)\n  585  ",
          "findingId": "monkey-lifecycle-001",
          "title": "任务创建拆成数据库预登记、VM 创建、Redis 交接、运行态启动"
        }
      ],
      [
        "loop",
        "backend/pkg/lifecycle/taskhook.go",
        {
          "path": "backend/pkg/lifecycle/taskhook.go",
          "start": 104,
          "end": 123,
          "snippet": "  104  \t\treqKey := fmt.Sprintf(\"task:create_req:%s\", id.String())\n  105  \t\tval, err := h.redis.Get(ctx, reqKey).Result()\n  106  \t\tif err != nil {\n  107  \t\t\th.logger.With(\"task_id\", id, \"error\", err).ErrorContext(ctx, \"failed to get CreateTaskReq from redis\")\n  108  \t\t\treturn fmt.Errorf(\"failed to get CreateTaskReq from Redis: %w\", err)\n  109  \t\t}\n  110  \n  111  \t\tdefer h.redis.Del(ctx, reqKey)\n  112  \n  113  \t\tif err := h.repo.Update(ctx, &domain.User{}, id, func(up *db.TaskUpdateOne) error {\n  114  \t\t\tup.SetStatus(consts.TaskStatusProcessing)\n  115  \t\t\treturn nil\n  116  \t\t}); err != nil {\n  117  \t\t\treturn fmt.Errorf(\"failed to update task status: %w\", err)\n  118  \t\t}\n  119  \n  120  \t\tvar createReq taskflow.CreateTaskReq\n  121  \t\tif err := json.Unmarshal([]byte(val), &createReq); err != nil {\n  122  \t\t\th.logger.With(\"task_id\", id, \"error\", err).ErrorContext(ctx, \"failed to unmarshal CreateTaskReq\")\n  123  \t\t\treturn fmt.Errorf(\"failed to unmarshal CreateTaskReq: %w\", err)",
          "findingId": "monkey-lifecycle-002",
          "title": "Taskflow Create 失败被记录但吞掉，任务可能滞留 processing"
        }
      ],
      [
        "model",
        "backend/biz/task/usecase/task.go",
        {
          "path": "backend/biz/task/usecase/task.go",
          "start": 585,
          "end": 590,
          "snippet": "  585  \n  586  \tvar runtimeToken string\n  587  \tif keys := m.Edges.Apikeys; len(keys) > 0 {\n  588  \t\tm.APIKey = keys[0].APIKey\n  589  \t\tm.BaseURL = a.cfg.LLMProxy.BaseURL + \"/v1\"\n  590  \t\truntimeToken = keys[0].APIKey",
          "findingId": "monkey-provider-001",
          "title": "LLM proxy 用 VM 绑定临时密钥隐藏真实上游凭据"
        }
      ],
      [
        "tools",
        "backend/biz/agentresource/types.go",
        {
          "path": "backend/biz/agentresource/types.go",
          "start": 99,
          "end": 126,
          "snippet": "   99  // ScopeFilter constrains a listing or dispatch query to a subset of the\n  100  // three scope tiers. Used by the *Scoped Repo methods.\n  101  //\n  102  // Semantic: rows whose scope_type is \"global\" are included when\n  103  // IncludeGlobal is true; rows whose scope is \"team\" are included when\n  104  // TeamID != nil and matches; same for user. Multiple flags may be set —\n  105  // the result is the union, with name-based override (user > team > global)\n  106  // applied by the call sites that need overrides (Listing / dispatch).\n  107  type ScopeFilter struct {\n  108  \tIncludeGlobal bool\n  109  \tTeamID        *uuid.UUID\n  110  \tUserID        *uuid.UUID\n  111  }\n  112  \n  113  // GlobalOnlyScope is the default scope for back-compat call sites that\n  114  // haven't migrated to ScopeFilter yet. Matches the historical \"global only\"\n  115  // behavior of the unsuffixed Repo methods.\n  116  func GlobalOnlyScope() ScopeFilter {\n  117  \treturn ScopeFilter{IncludeGlobal: true}\n  118  }\n  119  \n  120  // SkillSelection bundles a ScopeFilter with the user-picked skill IDs for\n  121  // the dispatch path. ListActiveSkillsScoped takes this so the same struct\n  122  // flows from the task usecase down to the SQL.\n  123  type SkillSelection struct {\n  124  \tScope           ScopeFilter\n  125  \tUserSelectedIDs []uuid.UUID\n  126  }",
          "findingId": "monkey-resource-002",
          "title": "资源按 global/team/user 合并，同名 user 覆盖 team 覆盖 global"
        }
      ],
      [
        "context",
        "backend/biz/task/usecase/task.go",
        {
          "path": "backend/biz/task/usecase/task.go",
          "start": 788,
          "end": 792,
          "snippet": "  788  \n  789  func modelRuntimeDefaults(m *db.Model) (thinking bool, contextLimit int, outputLimit int) {\n  790  \tthinking = m.ThinkingEnabled\n  791  \tcontextLimit = cmp.Or(m.ContextLimit, 200000)\n  792  \toutputLimit = cmp.Or(m.OutputLimit, 32000)",
          "findingId": "monkey-context-001",
          "title": "平台知道模型窗口上限，但不管理内层 compaction"
        }
      ],
      [
        "security",
        "backend/pkg/taskflow/types.go",
        {
          "path": "backend/pkg/taskflow/types.go",
          "start": 72,
          "end": 92,
          "snippet": "   72  // VirtualMachine 虚拟机信息\n   73  type VirtualMachine struct {\n   74  \tID            string               `json:\"id\"`\n   75  \tAccessToken   string               `json:\"access_token,omitempty\"`\n   76  \tEnvironmentID string               `json:\"environment_id\"`\n   77  \tHostID        string               `json:\"host_id\"`\n   78  \tHostname      string               `json:\"hostname\"`\n   79  \tArch          string               `json:\"arch\"`\n   80  \tOS            string               `json:\"os\"`\n   81  \tName          string               `json:\"name\"`\n   82  \tRepository    string               `json:\"repository\"`\n   83  \tStatus        VirtualMachineStatus `json:\"status\"`\n   84  \tStatusMessage string               `json:\"status_message\"`\n   85  \tCores         int32                `json:\"cores\"`\n   86  \tMemory        uint64               `json:\"memory\"`\n   87  \tDisk          uint64               `json:\"disk\"`\n   88  \tTTL           TTL                  `json:\"ttl\"`\n   89  \tExternalIP    string               `json:\"external_ip\"`\n   90  \tCreatedAt     int64                `json:\"created_at\"`\n   91  \tVersion       string               `json:\"version\"`\n   92  }",
          "findingId": "monkey-sandbox-001",
          "title": "隔离边界主要依赖仓库外 VM，Codex 内层 sandbox 明确关闭"
        }
      ],
      [
        "ecosystem",
        "backend/biz/task/usecase/task.go",
        {
          "path": "backend/biz/task/usecase/task.go",
          "start": 741,
          "end": 767,
          "snippet": "  741  \n  742  func (a *TaskUsecase) buildMCPConfigs(taskID uuid.UUID, token string) []taskflow.McpServerConfig {\n  743  \tmcps := []taskflow.McpServerConfig{\n  744  \t\t{\n  745  \t\t\tType: \"http\",\n  746  \t\t\tName: \"mcaiBuiltin\",\n  747  \t\t\tUrl:  proto.String(fmt.Sprintf(\"http://127.0.0.1:65510/mcp?task_id=%s\", taskID.String())),\n  748  \t\t},\n  749  \t}\n  750  \n  751  \tif token != \"\" {\n  752  \t\tmcps = append(mcps, taskflow.McpServerConfig{\n  753  \t\t\tType: \"http\",\n  754  \t\t\tName: \"monkeycode-ai\",\n  755  \t\t\tUrl:  proto.String(fmt.Sprintf(\"%s/mcp\", strings.TrimRight(a.cfg.Server.BaseURL, \"/\"))),\n  756  \t\t\tHeaders: []*taskflow.McpHttpHeader{\n  757  \t\t\t\t{\n  758  \t\t\t\t\tName:  \"Authorization\",\n  759  \t\t\t\t\tValue: fmt.Sprintf(\"Bearer %s\", token),\n  760  \t\t\t\t},\n  761  \t\t\t},\n  762  \t\t\tCommand: new(string),\n  763  \t\t\tArgs:    []string{},\n  764  \t\t\tEnv:     map[string]string{},\n  765  \t\t})\n  766  \t}\n  767  ",
          "findingId": "monkey-mcp-001",
          "title": "MCP Hub 把工具身份绑定到具体 user、task 和 VM"
        }
      ],
      [
        "collaboration",
        "backend/biz/task/handler/v1/task.go",
        {
          "path": "backend/biz/task/handler/v1/task.go",
          "start": 323,
          "end": 384,
          "snippet": "  323  // Stream 任务数据流 WebSocket\n  324  //\n  325  //\t@Summary\t\t任务数据流 WebSocket\n  326  //\t@Description\t功能定位：该接口通过 WebSocket 转发任务运行数据。任务对话继续输入使用 `type=user-input`。\n  327  //\t@Description\t数据格式约定：当前仅支持文本帧透传。服务端将 Agent 的原始文本数据包装为如下结构返回给前端（对应 domain.TaskStream）：\n  328  //\t@Description\t```json\n  329  //\t@Description\t{ \"type\": \"string\", \"data\": \"string\", \"kind\": \"string\", \"timestamp\": 0 }\n  330  //\t@Description\t```\n  331  //\t@Description\tuser-input 上行新格式：\n  332  //\t@Description\t```json\n  333  //\t@Description\t{ \"type\": \"user-input\", \"data\": \"{\\\"content\\\":\\\"57un57ut5aSE55CG6L+Z5Liq6Zeu6aKY\\\",\\\"attachments\\\":[{\\\"url\\\":\\\"https://example-bucket.oss-cn-hangzhou.aliyuncs.com/temp/a.txt\\\",\\\"filename\\\":\\\"a.txt\\\"}]}\" }\n  334  //\t@Description\t```\n  335  //\t@Description\tuser-input 上行旧格式仍兼容：\n  336  //\t@Description\t```json\n  337  //\t@Description\t{ \"type\": \"user-input\", \"data\": \"继续处理这个问题\" }\n  338  //\t@Description\t```\n  339  //\t@Description\tuser-input 下行和历史返回统一使用新 JSON payload 字符串：\n  340  //\t@Description\t```json\n  341  //\t@Description\t{ \"type\": \"user-input\", \"data\": \"{\\\"content\\\":\\\"57un57ut5aSE55CG6L+Z5Liq6Zeu6aKY\\\",\\\"attachments\\\":[]}\", \"timestamp\": 0 }\n  342  //\t@Description\t```\n  343  //\t@Description\t`attachments` 为可选附件列表，最多 10 个；每项包含 `url` 和 `filename`，URL 需要匹配后端配置的附件白名单前缀。\n  344  //\t@Description\ttype 字段说明：\n  345  //\t@Description\t- task-started: 本轮任务启动\n  346  //\t@Description\t- task-ended: 本轮任务结束\n  347  //\t@Description\t- task-error: 本轮任务发生错误\n  348  //\t@Description\t- task-running: 任务正在运行\n  349  //\t@Description\t- task-event: 任务临时事件, 不持久化\n  350  //\t@Description\t- file-change: 文件变动事件\n  351  //\t@Description\t- permission-resp: 用户的权限响应\n  352  //\t@Description\t- auto-approve: 开启自动批准",
          "findingId": "monkey-remote-001",
          "title": "远程协作以 owner write gate、历史回放和实时流为核心"
        }
      ],
      [
        "evidence",
        "backend/biz/llmproxy/proxy.go",
        {
          "path": "backend/biz/llmproxy/proxy.go",
          "start": 246,
          "end": 264,
          "snippet": "  246  \n  247  var LLMAllowPaths []string = []string{\n  248  \t\"/v1/messages\",\n  249  \t\"/chat/completions\",\n  250  \t\"/responses\",\n  251  }\n  252  \n  253  func fetchAllowPath(path string) string {\n  254  \tfor _, v := range LLMAllowPaths {\n  255  \t\tif strings.HasSuffix(path, v) {\n  256  \t\t\treturn v\n  257  \t\t}\n  258  \t}\n  259  \treturn \"\"\n  260  }\n  261  \n  262  func (p *Proxy) rewrite(r *httputil.ProxyRequest) {\n  263  \tpath := r.In.URL.Path\n  264  \tp.logger.With(\"path\", path).DebugContext(r.In.Context(), \"new rewrite request\")",
          "findingId": "monkey-observe-001",
          "title": "模型流被旁路解析，用量归因到 task/user/VM"
        }
      ]
    ]
  },
  {
    "slug": "opencode",
    "name": "OpenCode",
    "repo": "anomalyco/opencode",
    "branch": "dev",
    "commit": "cc4b45612974f735ddec46009ede07729511fba4",
    "date": "2026-08-13T01:15:01Z",
    "language": "TypeScript / Markdown / JavaScript",
    "kind": "Legacy source-backed harness audit",
    "legacy": true,
    "zh": {
      "thesis": "OpenCode 的既有源码账本覆盖 10 个 Harness 维度；这次迁移把原有事实重新排成单页分析和十章教程，不把 README 当作实现证据。",
      "strengths": [
        "它每一轮都重新看账本决定“接下来做什么”，所以进程中断、工具异步完成和压缩都能落在统一状态机里。",
        "不是开会前一次性发完所有资料；每走一步都按当前身份、模型和权限重新整理桌面。",
        "模型的思考、文字、每次工具起止和文件变化都不是终端里一闪而过，而是独立可回放的事件。"
      ],
      "limits": [
        "大量单元/集成/recorded stream 测试；仓库未见统一 Coding Agent 成功率 benchmark。",
        "当前页面复用既有源码账本；迁移到自研前仍需做部署级验证",
        "当前页面复用既有源码账本；迁移到自研前仍需做部署级验证"
      ],
      "lesson": "它每一轮都重新看账本决定“接下来做什么”，所以进程中断、工具异步完成和压缩都能落在统一状态机里。"
    },
    "en": {
      "thesis": "The existing source ledger for OpenCode covers 10 Harness dimensions. This migration reshapes those facts into a single analysis page and ten standalone chapters instead of treating README claims as implementation evidence.",
      "strengths": [
        "Pinned source findings expose the control loop",
        "Context, tools, and policy are separated into reviewable dimensions",
        "Each chapter keeps a file and line-range trail"
      ],
      "limits": [
        "This snapshot reuses the prior source ledger and its pinned commit",
        "Deployment-level behavior still needs a fresh run",
        "Legacy findings should be re-audited when the repository moves"
      ],
      "lesson": "Read the implementation as input, state, tool effect, receipt, and recovery—not as a feature list."
    },
    "anchors": [
      [
        "overview",
        "packages/opencode/src/session/prompt.ts",
        {
          "path": "packages/opencode/src/session/prompt.ts",
          "start": 1081,
          "end": 1130,
          "snippet": " 1081      const runLoop: (sessionID: SessionID) => Effect.Effect<SessionV1.WithParts> = Effect.fn(\"SessionPrompt.run\")(\n 1082        function* (sessionID: SessionID) {\n 1083          const ctx = yield* InstanceState.context\n 1084          let structured: unknown\n 1085          let step = 0\n 1086          const session = yield* sessions.get(sessionID).pipe(Effect.orDie)\n 1087  \n 1088          while (true) {\n 1089            yield* status.set(sessionID, { type: \"busy\" })\n 1090            yield* Effect.logInfo(\"loop\", { \"session.id\": sessionID, step })\n 1091  \n 1092            let msgs = yield* MessageV2.filterCompactedEffect(sessionID).pipe(\n 1093              Effect.provideService(Database.Service, database),\n 1094            )\n 1095  \n 1096            const { user: lastUser, assistant: lastAssistant, finished: lastFinished, tasks } = MessageV2.latest(msgs)\n 1097  \n 1098            if (!lastUser) throw new Error(\"No user message found in stream. This should never happen.\")\n 1099  \n 1100            const lastAssistantMsg = msgs.findLast(\n 1101              (msg) => msg.info.role === \"assistant\" && msg.info.id === lastAssistant?.id,\n 1102            )\n 1103            // Some providers return \"stop\" even when the assistant message contains\n 1104            // tool calls. Keep the loop running so tool results can be sent back to\n 1105            // the model, but ignore cleanup-marked interrupted orphans.\n 1106            const hasToolCalls =\n 1107              lastAssistantMsg?.parts.some(\n 1108                (part) => part.type === \"tool\" && !part.metadata?.providerExecuted && !isOrphanedInterruptedTool(part),\n 1109              ) ?? false\n 1110  ",
          "findingId": "opencode-loop-001",
          "title": "主循环由持久化消息状态驱动，而不是一次性的 while(tool_call)"
        }
      ],
      [
        "architecture",
        "packages/opencode/src/session/prompt.ts",
        {
          "path": "packages/opencode/src/session/prompt.ts",
          "start": 1170,
          "end": 1241,
          "snippet": " 1170            const agent = yield* agents.get(lastUser.agent)\n 1171            if (!agent) {\n 1172              const available = (yield* agents.list()).filter((a) => !a.hidden).map((a) => a.name)\n 1173              const hint = available.length ? ` Available agents: ${available.join(\", \")}` : \"\"\n 1174              const error = new NamedError.Unknown({ message: `Agent not found: \"${lastUser.agent}\".${hint}` })\n 1175              yield* events.publish(Session.Event.Error, { sessionID, error: error.toObject() })\n 1176              throw error\n 1177            }\n 1178            const maxSteps = agent.steps ?? Infinity\n 1179            const isLastStep = step >= maxSteps\n 1180            msgs = yield* SessionReminders.apply({ messages: msgs, agent, session }).pipe(\n 1181              Effect.provideService(RuntimeFlags.Service, flags),\n 1182              Effect.provideService(FSUtil.Service, fsys),\n 1183              Effect.provideService(Session.Service, sessions),\n 1184            )\n 1185  \n 1186            const msg: SessionV1.Assistant = {\n 1187              id: MessageID.ascending(),\n 1188              parentID: lastUser.id,\n 1189              role: \"assistant\",\n 1190              mode: agent.name,\n 1191              agent: agent.name,\n 1192              variant: lastUser.model.variant,\n 1193              path: { cwd: ctx.directory, root: ctx.worktree },\n 1194              cost: 0,\n 1195              tokens: { input: 0, output: 0, reasoning: 0, cache: { read: 0, write: 0 } },\n 1196              modelID: model.id,\n 1197              providerID: model.providerID,\n 1198              time: { created: Date.now() },\n 1199              sessionID,",
          "findingId": "opencode-loop-002",
          "title": "每一步动态重建 Agent、工具、系统上下文和模型请求"
        }
      ],
      [
        "loop",
        "packages/opencode/src/session/processor.ts",
        {
          "path": "packages/opencode/src/session/processor.ts",
          "start": 539,
          "end": 597,
          "snippet": "  539        const cleanup = Effect.fn(\"SessionProcessor.cleanup\")(function* () {\n  540          if (ctx.snapshot) {\n  541            const patch = yield* snapshot.patch(ctx.snapshot)\n  542            if (patch.files.length) {\n  543              yield* session.updatePart({\n  544                id: PartID.ascending(),\n  545                messageID: ctx.assistantMessage.id,\n  546                sessionID: ctx.sessionID,\n  547                type: \"patch\",\n  548                hash: patch.hash,\n  549                files: patch.files,\n  550              })\n  551            }\n  552            ctx.snapshot = undefined\n  553          }\n  554  \n  555          if (ctx.currentText) {\n  556            const end = Date.now()\n  557            ctx.currentText.time = { start: ctx.currentText.time?.start ?? end, end }\n  558            yield* session.updatePart(ctx.currentText)\n  559            ctx.currentText = undefined\n  560          }\n  561  \n  562          for (const part of Object.values(ctx.reasoningMap)) {\n  563            const end = Date.now()\n  564            yield* session.updatePart({\n  565              ...part,\n  566              time: { start: part.time.start ?? end, end },\n  567            })\n  568          }",
          "findingId": "opencode-retry-001",
          "title": "重试、拒绝、上下文溢出和中断有不同终态"
        }
      ],
      [
        "model",
        "packages/opencode/src/session/processor.ts",
        {
          "path": "packages/opencode/src/session/processor.ts",
          "start": 315,
          "end": 413,
          "snippet": "  315            case \"tool-input-start\":\n  316              if (ctx.assistantMessage.summary) {\n  317                throw new Error(`Tool call not allowed while generating summary: ${value.name}`)\n  318              }\n  319              yield* ensureToolCall(value)\n  320              return\n  321  \n  322            case \"tool-input-delta\":\n  323              yield* ensureToolCall(value)\n  324              return\n  325  \n  326            case \"tool-input-end\": {\n  327              yield* ensureToolCall(value)\n  328              return\n  329            }\n  330  \n  331            case \"tool-call\": {\n  332              if (ctx.assistantMessage.summary) {\n  333                throw new Error(`Tool call not allowed while generating summary: ${value.name}`)\n  334              }\n  335              yield* ensureToolCall(value)\n  336              const input = isRecord(value.input) ? value.input : { value: value.input }\n  337              yield* updateToolCall(value.id, (match) => ({\n  338                ...match,\n  339                tool: value.name,\n  340                state:\n  341                  match.state.status === \"running\"\n  342                    ? { ...match.state, input }\n  343                    : {\n  344                        status: \"running\",",
          "findingId": "opencode-stream-001",
          "title": "stream processor 把 reasoning、text、tool、usage、patch 全部事件化持久"
        }
      ],
      [
        "tools",
        "packages/opencode/src/tool/shell.ts",
        {
          "path": "packages/opencode/src/tool/shell.ts",
          "start": 257,
          "end": 291,
          "snippet": "  257  const parse = Effect.fn(\"ShellTool.parse\")(function* (command: string, ps: boolean) {\n  258    const tree = yield* Effect.promise(() => parser().then((p) => (ps ? p.ps : p.bash).parse(command)))\n  259    if (!tree) throw new Error(\"Failed to parse command\")\n  260    return tree\n  261  })\n  262  \n  263  const ask = Effect.fn(\"ShellTool.ask\")(function* (ctx: Tool.Context, scan: Scan, input: { command: string }) {\n  264    if (scan.dirs.size > 0) {\n  265      const directories = Array.from(scan.dirs)\n  266      const globs = directories.map((dir) => {\n  267        if (process.platform === \"win32\") return FSUtil.normalizePathPattern(path.join(dir, \"*\"))\n  268        return path.join(dir, \"*\")\n  269      })\n  270      yield* ctx.ask({\n  271        permission: \"external_directory\",\n  272        patterns: globs,\n  273        always: globs,\n  274        metadata: {\n  275          command: input.command,\n  276          directories,\n  277          patterns: globs,\n  278        },\n  279      })\n  280    }\n  281  \n  282    if (scan.patterns.size === 0) return\n  283    yield* ctx.ask({\n  284      permission: ShellID.ToolID,\n  285      patterns: Array.from(scan.patterns),\n  286      always: Array.from(scan.always),",
          "findingId": "opencode-shell-001",
          "title": "shell 权限不是简单字符串前缀，而是 Bash/PowerShell 语法树扫描"
        }
      ],
      [
        "context",
        "packages/opencode/src/session/overflow.ts",
        {
          "path": "packages/opencode/src/session/overflow.ts",
          "start": 8,
          "end": 33,
          "snippet": "    8  const COMPACTION_BUFFER = 20_000\n    9  \n   10  export function usable(input: { cfg: ConfigV1.Info; model: Provider.Model; outputTokenMax?: number }) {\n   11    const context = input.model.limit.context\n   12    if (context === 0) return 0\n   13  \n   14    const reserved =\n   15      input.cfg.compaction?.reserved ??\n   16      Math.min(COMPACTION_BUFFER, ProviderTransform.maxOutputTokens(input.model, input.outputTokenMax))\n   17    return input.model.limit.input\n   18      ? Math.max(0, input.model.limit.input - reserved)\n   19      : Math.max(0, context - ProviderTransform.maxOutputTokens(input.model, input.outputTokenMax))\n   20  }\n   21  \n   22  export function isOverflow(input: {\n   23    cfg: ConfigV1.Info\n   24    tokens: SessionV1.Assistant[\"tokens\"]\n   25    model: Provider.Model\n   26    outputTokenMax?: number\n   27  }) {\n   28    if (input.cfg.compaction?.auto === false) return false\n   29    if (input.model.limit.context === 0) return false\n   30  \n   31    const count =\n   32      input.tokens.total || input.tokens.input + input.tokens.output + input.tokens.cache.read + input.tokens.cache.write\n   33    return count >= usable(input)",
          "findingId": "opencode-context-001",
          "title": "overflow 阈值为可用输入窗口，而非模型总窗口"
        }
      ],
      [
        "security",
        "packages/opencode/src/permission/index.ts",
        {
          "path": "packages/opencode/src/permission/index.ts",
          "start": 28,
          "end": 37,
          "snippet": "   28  export function evaluate(permission: string, pattern: string, ...rulesets: PermissionV1.Ruleset[]): PermissionV1.Rule {\n   29    return (\n   30      rulesets\n   31        .flat()\n   32        .findLast((rule) => Wildcard.match(permission, rule.permission) && Wildcard.match(pattern, rule.pattern)) ?? {\n   33        action: \"ask\",\n   34        permission,\n   35        pattern: \"*\",\n   36      }\n   37    )",
          "findingId": "opencode-permission-001",
          "title": "权限采用 last-match wildcard 规则，默认 ask 而非默认 allow"
        }
      ],
      [
        "ecosystem",
        "packages/opencode/src/mcp/index.ts",
        {
          "path": "packages/opencode/src/mcp/index.ts",
          "start": 164,
          "end": 198,
          "snippet": "  164  export interface Interface {\n  165    readonly status: () => Effect.Effect<Record<string, Status>>\n  166    readonly clients: () => Effect.Effect<Record<string, MCPClient>>\n  167    readonly instructions: () => Effect.Effect<ServerInstructions[]>\n  168    readonly tools: () => Effect.Effect<Record<string, McpTool>>\n  169    readonly prompts: () => Effect.Effect<Record<string, PromptInfo & { client: string }>>\n  170    readonly resources: (clientName?: string) => Effect.Effect<Record<string, ResourceInfo & { client: string }>>\n  171    readonly resourceTemplates: (\n  172      clientName?: string,\n  173    ) => Effect.Effect<Record<string, ResourceTemplateInfo & { client: string }>>\n  174    readonly add: (name: string, mcp: ConfigMCPV1.Info) => Effect.Effect<{ status: Record<string, Status> | Status }>\n  175    readonly connect: (name: string) => Effect.Effect<void, NotFoundError>\n  176    readonly disconnect: (name: string) => Effect.Effect<void, NotFoundError>\n  177    readonly getPrompt: (\n  178      clientName: string,\n  179      name: string,\n  180      args?: Record<string, string>,\n  181    ) => Effect.Effect<Awaited<ReturnType<MCPClient[\"getPrompt\"]>> | undefined>\n  182    readonly readResource: (\n  183      clientName: string,\n  184      resourceUri: string,\n  185    ) => Effect.Effect<Awaited<ReturnType<MCPClient[\"readResource\"]>> | undefined>\n  186    readonly startAuth: (\n  187      mcpName: string,\n  188    ) => Effect.Effect<{ authorizationUrl: string; oauthState: string }, NotFoundError>\n  189    readonly authenticate: (\n  190      mcpName: string,\n  191      onAuthorization?: (authorizationUrl: string) => void,\n  192    ) => Effect.Effect<Status, NotFoundError>\n  193    readonly finishAuth: (mcpName: string, authorizationCode: string) => Effect.Effect<Status, NotFoundError>",
          "findingId": "opencode-mcp-001",
          "title": "MCP 同时支持 stdio、Streamable HTTP、SSE、OAuth、prompts 和 resources"
        }
      ],
      [
        "collaboration",
        "packages/opencode/src/agent/subagent-permissions.ts",
        {
          "path": "packages/opencode/src/agent/subagent-permissions.ts",
          "start": 4,
          "end": 26,
          "snippet": "    4  /**\n    5   * Build the `permission` ruleset for a subagent's session when it's spawned\n    6   * via the task tool. Combines:\n    7   *\n    8   * 1. The parent session's deny rules and external_directory rules.\n    9   *    Parent agent restrictions only govern that agent; the subagent's own\n   10   *    permissions determine its capabilities.\n   11   * 2. Default `todowrite` and `task` denies if the subagent's own ruleset\n   12   *    doesn't already permit them.\n   13   */\n   14  export function deriveSubagentSessionPermission(input: {\n   15    parentSessionPermission: PermissionV1.Ruleset\n   16    subagent: Agent.Info\n   17  }): PermissionV1.Ruleset {\n   18    const canTask = input.subagent.permission.some((rule) => rule.permission === \"task\")\n   19    const canTodo = input.subagent.permission.some((rule) => rule.permission === \"todowrite\")\n   20    return [\n   21      ...input.parentSessionPermission.filter(\n   22        (rule) => rule.permission === \"external_directory\" || rule.action === \"deny\",\n   23      ),\n   24      ...(canTodo ? [] : [{ permission: \"todowrite\" as const, pattern: \"*\" as const, action: \"deny\" as const }]),\n   25      ...(canTask ? [] : [{ permission: \"task\" as const, pattern: \"*\" as const, action: \"deny\" as const }]),\n   26    ]",
          "findingId": "opencode-subagent-001",
          "title": "子 Agent 是独立持久 session，可恢复、限深度并继承关键 deny"
        }
      ],
      [
        "evidence",
        "packages/opencode/src/session/session.ts",
        {
          "path": "packages/opencode/src/session/session.ts",
          "start": 120,
          "end": 158,
          "snippet": "  120  export function toRow(info: Info) {\n  121    return {\n  122      id: info.id,\n  123      project_id: info.projectID,\n  124      workspace_id: info.workspaceID,\n  125      parent_id: info.parentID,\n  126      slug: info.slug,\n  127      directory: info.directory,\n  128      path: info.path,\n  129      title: info.title,\n  130      agent: info.agent,\n  131      model: info.model,\n  132      version: info.version,\n  133      share_url: info.share?.url,\n  134      summary_additions: info.summary?.additions,\n  135      summary_deletions: info.summary?.deletions,\n  136      summary_files: info.summary?.files,\n  137      summary_diffs: info.summary?.diffs,\n  138      metadata: info.metadata,\n  139      cost: info.cost ?? 0,\n  140      tokens_input: (info.tokens ?? EmptyTokens).input,\n  141      tokens_output: (info.tokens ?? EmptyTokens).output,\n  142      tokens_reasoning: (info.tokens ?? EmptyTokens).reasoning,\n  143      tokens_cache_read: (info.tokens ?? EmptyTokens).cache.read,\n  144      tokens_cache_write: (info.tokens ?? EmptyTokens).cache.write,\n  145      revert: info.revert\n  146        ? {\n  147            messageID: SessionMessage.ID.make(info.revert.messageID),\n  148            partID: info.revert.partID,\n  149            snapshot: info.revert.snapshot,",
          "findingId": "opencode-observe-001",
          "title": "session 持久化 agent/model/permission/cost/tokens/summary/revert 与 parent"
        }
      ]
    ]
  },
  {
    "slug": "oh-my-pi",
    "name": "Oh My Pi",
    "repo": "can1357/oh-my-pi",
    "branch": "main",
    "commit": "a53e4e790d3939a08708bf0d3c912d0763237a2d",
    "date": "2026-08-13T05:09:58+02:00",
    "language": "TypeScript / Markdown / Rust",
    "kind": "Legacy source-backed harness audit",
    "legacy": true,
    "zh": {
      "thesis": "Oh My Pi 的既有源码账本覆盖 9 个 Harness 维度；这次迁移把原有事实重新排成单页分析和十章教程，不把 README 当作实现证据。",
      "strengths": [
        "内层发动机负责每一步，外层管家负责一步结束后判断要不要重试、压缩、换模型、继续目标或等待后台工作。",
        "用户插话时，纯等待可以立刻停；正在改文件的工具不会粗暴半路杀死，而是完成到安全边界再让模型听新指令。",
        "先把所有施工单审核、改好并固化，再按“可并行/独占”排程，日志看到的参数就是实际执行参数。"
      ],
      "limits": [
        "当前页面复用既有源码账本；迁移到自研前仍需做部署级验证",
        "当前页面复用既有源码账本；迁移到自研前仍需做部署级验证",
        "当前页面复用既有源码账本；迁移到自研前仍需做部署级验证"
      ],
      "lesson": "内层发动机负责每一步，外层管家负责一步结束后判断要不要重试、压缩、换模型、继续目标或等待后台工作。"
    },
    "en": {
      "thesis": "The existing source ledger for Oh My Pi covers 9 Harness dimensions. This migration reshapes those facts into a single analysis page and ten standalone chapters instead of treating README claims as implementation evidence.",
      "strengths": [
        "Pinned source findings expose the control loop",
        "Context, tools, and policy are separated into reviewable dimensions",
        "Each chapter keeps a file and line-range trail"
      ],
      "limits": [
        "This snapshot reuses the prior source ledger and its pinned commit",
        "Deployment-level behavior still needs a fresh run",
        "Legacy findings should be re-audited when the repository moves"
      ],
      "lesson": "Read the implementation as input, state, tool effect, receipt, and recovery—not as a feature list."
    },
    "anchors": [
      [
        "overview",
        "packages/agent/src/agent-loop.ts",
        {
          "path": "packages/agent/src/agent-loop.ts",
          "start": 879,
          "end": 918,
          "snippet": "  879  \tif (typeof intent === \"function\") return \"omit\";\n  880  \tif (intent === \"optional\" || intent === \"omit\") return intent;\n  881  \treturn \"require\";\n  882  }\n  883  \n  884  function extractIntent(args: Record<string, unknown>): { intent?: string; strippedArgs: Record<string, unknown> } {\n  885  \tconst { [INTENT_FIELD]: intent, ...strippedArgs } = args;\n  886  \tif (typeof intent !== \"string\") {\n  887  \t\treturn { strippedArgs };\n  888  \t}\n  889  \tconst trimmed = intent.trim();\n  890  \treturn { intent: trimmed.length > 0 ? trimmed : undefined, strippedArgs };\n  891  }\n  892  \n  893  /**\n  894   * Main loop logic shared by agentLoop and agentLoopContinue.\n  895   */\n  896  async function runLoop(\n  897  \tcurrentContext: AgentContext,\n  898  \tnewMessages: AgentMessage[],\n  899  \tconfig: AgentLoopConfig,\n  900  \tsignal: AbortSignal | undefined,\n  901  \tstream: EventStream<AgentEvent, AgentMessage[]>,\n  902  \tstreamFn?: StreamFn,\n  903  \tinitialMessages: AgentMessage[] = [],\n  904  ): Promise<void> {\n  905  \tconst telemetry = resolveTelemetry(config.telemetry, config.sessionId);\n  906  \tconst invokeAgentSpan = startInvokeAgentSpan(telemetry, config.model);\n  907  \tconst stepCounter = { count: 0 };\n  908  \tlet caughtError: unknown;",
          "findingId": "omp-architecture-001",
          "title": "核心是强化 Agent loop，产品层再叠加大型 Session maintenance 状态机"
        }
      ],
      [
        "architecture",
        "packages/agent/src/agent-loop.ts",
        {
          "path": "packages/agent/src/agent-loop.ts",
          "start": 999,
          "end": 1048,
          "snippet": "  999  \tlet deadlineTimer: Timer | undefined;\n 1000  \tif (config.deadline !== undefined) {\n 1001  \t\tconst deadlineAbortController = new AbortController();\n 1002  \t\tconst deadlineReason = new DOMException(\"Deadline exceeded\", \"TimeoutError\");\n 1003  \t\tconst delay = config.deadline - Date.now();\n 1004  \t\tif (delay <= 0) {\n 1005  \t\t\tdeadlineAbortController.abort(deadlineReason);\n 1006  \t\t} else {\n 1007  \t\t\tdeadlineTimer = setTimeout(() => {\n 1008  \t\t\t\tdeadlineAbortController.abort(deadlineReason);\n 1009  \t\t\t}, delay);\n 1010  \t\t}\n 1011  \t\tsignal = signal ? AbortSignal.any([signal, deadlineAbortController.signal]) : deadlineAbortController.signal;\n 1012  \t}\n 1013  \n 1014  \tconst softRequirementState = config.softToolRequirementState ?? { escalations: 0 };\n 1015  \tlet preserveSoftRequirementState = false;\n 1016  \n 1017  \tlet pendingMessages: AgentMessage[] = [];\n 1018  \ttry {\n 1019  \t\tlet messagesToEmit = [...initialMessages];\n 1020  \t\tif (isDeadlineExceeded(config.deadline)) {\n 1021  \t\t\temitInputMessages(stream, messagesToEmit);\n 1022  \t\t\tendAgentStream(stream, newMessages, telemetry, stepCounter.count);\n 1023  \t\t\treturn;\n 1024  \t\t}\n 1025  \t\t// Check for steering messages at start (user may have typed while waiting).\n 1026  \t\t// Skip when the run is already externally aborted — dequeuing would strand\n 1027  \t\t// the messages in a run that is about to die.\n 1028  \t\ttry {",
          "findingId": "omp-loop-001",
          "title": "steering 不只在轮间排队，还能在工具执行中协作中断"
        }
      ],
      [
        "loop",
        "packages/agent/src/agent-loop.ts",
        {
          "path": "packages/agent/src/agent-loop.ts",
          "start": 2067,
          "end": 2200,
          "snippet": " 2067  \t\t\t\t\tcacheRead: 0,\n 2068  \t\t\t\t\tcacheWrite: 0,\n 2069  \t\t\t\t\ttotalTokens: 0,\n 2070  \t\t\t\t\tcost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, total: 0 },\n 2071  \t\t\t\t},\n 2072  \t\t\t\tstopReason: \"aborted\",\n 2073  \t\t\t\terrorMessage,\n 2074  \t\t\t\terrorId,\n 2075  \t\t\t\ttimestamp: Date.now(),\n 2076  \t\t\t};\n 2077  \t// Only tool calls that reached `toolcall_end` survive abort/error replay. A\n 2078  \t// labeled user interrupt still surfaces through `errorMessage`, but partial\n 2079  \t// tool arguments are unsafe to keep and can carry incomplete provider IDs.\n 2080  \tconst retained = retainCompletedToolCalls(base, completedToolCallIds);\n 2081  \tconst scopedAbort = toolScopedAbortReason(requestSignal);\n 2082  \tconst toolCallAbortMessages = scopedAbort ? buildToolCallAbortMessages(retained, scopedAbort) : undefined;\n 2083  \tif (toolCallAbortMessages) {\n 2084  \t\tretained.toolCallAbortMessages = toolCallAbortMessages;\n 2085  \t}\n 2086  \tconst abortedMessage = snapshotAssistantMessage(retained);\n 2087  \tif (addedPartial) {\n 2088  \t\tcontext.messages[context.messages.length - 1] = abortedMessage;\n 2089  \t} else {\n 2090  \t\tcontext.messages.push(abortedMessage);\n 2091  \t\tstream.push({ type: \"message_start\", message: snapshotAssistantMessage(abortedMessage) });\n 2092  \t}\n 2093  \tstream.push({ type: \"message_end\", message: snapshotAssistantMessage(abortedMessage) });\n 2094  \treturn abortedMessage;\n 2095  }\n 2096  ",
          "findingId": "omp-loop-002",
          "title": "工具调度支持 shared/exclusive 并发和完整 pre-dispatch 改写"
        }
      ],
      [
        "model",
        "packages/agent/src/agent-loop.ts",
        {
          "path": "packages/agent/src/agent-loop.ts",
          "start": 26,
          "end": 45,
          "snippet": "   26  import {\n   27  \ttype Dialect,\n   28  \tencodeInbandToolHistory,\n   29  \trenderInbandToolPrompt,\n   30  \trenderToolExamples,\n   31  \twrapInbandToolStream,\n   32  } from \"@oh-my-pi/pi-ai/dialect\";\n   33  import * as AIError from \"@oh-my-pi/pi-ai/error\";\n   34  import {\n   35  \ttype CursorExecResolvedCarrier,\n   36  \tcopyCursorExecResolved,\n   37  \tkCursorExecResolved,\n   38  } from \"@oh-my-pi/pi-ai/utils/block-symbols\";\n   39  import {\n   40  \tcreateHarmonyAuditEvent,\n   41  \tdetectHarmonyLeakInAssistantMessage,\n   42  \textractHarmonyRemoved,\n   43  \ttype HarmonyDetection,\n   44  \ttype HarmonyRecoveredToolCall,\n   45  \tisHarmonyLeakMitigationTarget,",
          "findingId": "omp-dialect-001",
          "title": "原生 tool calling 之外还有多种 in-band 方言和 Harmony 泄漏修复"
        }
      ],
      [
        "tools",
        "packages/coding-agent/src/tools/index.ts",
        {
          "path": "packages/coding-agent/src/tools/index.ts",
          "start": 38,
          "end": 105,
          "snippet": "   38  import type { WorkspaceTree } from \"../workspace-tree\";\n   39  import { AskTool } from \"./ask\";\n   40  import { AstEditTool } from \"./ast-edit\";\n   41  import { AstGrepTool } from \"./ast-grep\";\n   42  import { BashTool } from \"./bash\";\n   43  import { BrowserTool } from \"./browser\";\n   44  import { type BuiltinToolName, type HiddenToolName, normalizeToolNames } from \"./builtin-names\";\n   45  import { type CheckpointState, CheckpointTool, type CompletedRewindState, RewindTool } from \"./checkpoint\";\n   46  import { ComputerTool } from \"./computer\";\n   47  import { DebugTool } from \"./debug\";\n   48  import { EvalTool } from \"./eval\";\n   49  import { resolveEvalBackends } from \"./eval-backends\";\n   50  import { GithubTool } from \"./gh\";\n   51  import { GlobTool } from \"./glob\";\n   52  import { GrepTool } from \"./grep\";\n   53  import { HubTool, isIrcEnabled } from \"./hub\";\n   54  import { InspectImageTool } from \"./inspect-image\";\n   55  import { LearnTool } from \"./learn\";\n   56  import { ManageSkillTool } from \"./manage-skill\";\n   57  import { MemoryEditTool } from \"./memory-edit\";\n   58  import { MemoryRecallTool } from \"./memory-recall\";\n   59  import { MemoryReflectTool } from \"./memory-reflect\";\n   60  import { MemoryRetainTool } from \"./memory-retain\";\n   61  import { wrapToolWithMetaNotice } from \"./output-meta\";\n   62  import { ReadTool } from \"./read\";\n   63  import type { PlanProposalHandler } from \"./resolve\";\n   64  import { SecurityScanTool } from \"./security-scan\";\n   65  import { supportsExternalThinking, ThinkTool } from \"./think\";\n   66  import { type TodoPhase, TodoTool } from \"./todo\";\n   67  import { WriteTool } from \"./write\";",
          "findingId": "omp-tools-001",
          "title": "内建工具面远超文件与 shell"
        }
      ],
      [
        "context",
        "packages/agent/src/compaction/compaction.ts",
        {
          "path": "packages/agent/src/compaction/compaction.ts",
          "start": 148,
          "end": 189,
          "snippet": "  148  /** Result from compact() - SessionManager adds uuid/parentUuid when saving */\n  149  export interface CompactionResult<T = unknown> {\n  150  \tsummary: string;\n  151  \t/** Short PR-style summary for display purposes. */\n  152  \tshortSummary?: string;\n  153  \tfirstKeptEntryId: string;\n  154  \ttokensBefore: number;\n  155  \t/** Hook-specific data (e.g., ArtifactIndex, version markers for structured compaction) */\n  156  \tdetails?: T;\n  157  \t/** Hook-provided data to persist alongside compaction entry. */\n  158  \tpreserveData?: Record<string, unknown>;\n  159  }\n  160  \n  161  // ============================================================================\n  162  // Types\n  163  // ============================================================================\n  164  \n  165  export interface CompactionSettings {\n  166  \tenabled: boolean;\n  167  \tstrategy?: \"context-full\" | \"handoff\" | \"shake\" | \"snapcompact\" | \"off\";\n  168  \tthresholdPercent?: number;\n  169  \tthresholdTokens?: number;\n  170  \tmidTurnEnabled?: boolean;\n  171  \t/**\n  172  \t * Tokens reserved below the context window for the next prompt + response.\n  173  \t *\n  174  \t * Leave unset to use {@link DEFAULT_RESERVE_TOKENS}; the unset state is the\n  175  \t * provenance signal that lets small-window recovery replace the default with\n  176  \t * a proportional reserve (see {@link resolveBudgetReserveTokens}). An\n  177  \t * explicit value — even one equal to the default — is always honored.",
          "findingId": "omp-context-001",
          "title": "压缩不是单一摘要，而是 context-full/handoff/shake/snapcompact 多策略"
        }
      ],
      [
        "security",
        "packages/catalog/src/provider-models/descriptors.ts",
        {
          "path": "packages/catalog/src/provider-models/descriptors.ts",
          "start": 1,
          "end": 66,
          "snippet": "    1  /**\n    2   * The provider catalog table: one entry per chat-model provider, carrying the\n    3   * catalog half of what used to live in `@oh-my-pi/pi-ai`'s registry definitions\n    4   * (default model, runtime model-manager factory, discovery wiring). The auth\n    5   * half (env keys, OAuth login/refresh) stays in the pi-ai registry, which\n    6   * type-checks itself against `KnownProvider` from this table.\n    7   */\n    8  import type { ModelManagerConfig, ProviderCatalogEntry, ProviderDescriptor } from \"./descriptor-types\";\n    9  import { googleModelManagerOptions, googleVertexModelManagerOptions } from \"./google\";\n   10  import { ollamaCloudModelManagerOptions } from \"./ollama\";\n   11  import {\n   12  \taiandModelManagerOptions,\n   13  \taimlApiModelManagerOptions,\n   14  \talibabaCodingPlanModelManagerOptions,\n   15  \talibabaTokenPlanModelManagerOptions,\n   16  \tanthropicModelManagerOptions,\n   17  \tbasetenModelManagerOptions,\n   18  \tbedrockMantleModelManagerOptions,\n   19  \tcerebrasModelManagerOptions,\n   20  \tcloudflareAiGatewayModelManagerOptions,\n   21  \tcoreWeaveModelManagerOptions,\n   22  \tdeepseekModelManagerOptions,\n   23  \tfirepassModelManagerOptions,\n   24  \tfireworksModelManagerOptions,\n   25  \tgithubCopilotModelManagerOptions,\n   26  \tgmiCloudModelManagerOptions,\n   27  \tgroqModelManagerOptions,\n   28  \thuggingfaceModelManagerOptions,\n   29  \tkiloModelManagerOptions,\n   30  \tkimiCodeModelManagerOptions,",
          "findingId": "omp-provider-001",
          "title": "模型目录和协议实现分离，Provider 覆盖极广"
        }
      ],
      [
        "ecosystem",
        "packages/coding-agent/src/mcp/manager.ts",
        {
          "path": "packages/coding-agent/src/mcp/manager.ts",
          "start": 282,
          "end": 380,
          "snippet": "  282  \t\t\t\t}\n  283  \t\t\t}\n  284  \t\t}\n  285  \n  286  \t\treturn () => {\n  287  \t\t\tthis.#notificationListeners.delete(listener);\n  288  \t\t};\n  289  \t}\n  290  \n  291  \t/**\n  292  \t * Set a callback to fire when any server's tools change.\n  293  \t *\n  294  \t * May return a Promise; if so, {@link refreshServerTools} awaits it so that\n  295  \t * downstream consumers (e.g. `mcp_notification` listeners for\n  296  \t * `notifications/tools/list_changed`) observe not just the manager's\n  297  \t * refreshed tool set but also any session-level rebind driven by the\n  298  \t * handler (`session.refreshMCPTools`). Other callsites (initial connect,\n  299  \t * disconnect, reconnect) invoke the handler synchronously — their downstream\n  300  \t * chains don't need to serialize on the rebind.\n  301  \t */\n  302  \tsetOnToolsChanged(handler: (tools: CustomTool<TSchema, MCPToolDetails>[]) => void | Promise<void>): void {\n  303  \t\tthis.#onToolsChanged = handler;\n  304  \t}\n  305  \n  306  \t/**\n  307  \t * Set a callback to fire when any server's resources change.\n  308  \t */\n  309  \tsetOnResourcesChanged(handler: (serverName: string, uri: string) => void): void {\n  310  \t\tthis.#onResourcesChanged = handler;\n  311  \t}",
          "findingId": "omp-mcp-001",
          "title": "MCP 是完整内建连接器，不是插件样例"
        }
      ],
      [
        "collaboration",
        "packages/coding-agent/src/task/index.ts",
        {
          "path": "packages/coding-agent/src/task/index.ts",
          "start": 1,
          "end": 53,
          "snippet": "    1  /**\n    2   * Task tool - Delegate tasks to specialized agents.\n    3   *\n    4   * Discovers agent definitions from:\n    5   *   - Bundled agents (shipped with omp-coding-agent)\n    6   *   - ~/.omp/agent/agents/*.md (user-level)\n    7   *   - .omp/agents/*.md (project-level)\n    8   *\n    9   * Supports:\n   10   *   - Single agent spawn per call (parallelism = parallel task calls)\n   11   *   - Batch spawning + shared context per call when `task.batch` is enabled\n   12   *   - Background execution through AsyncJobManager when `async.enabled` is enabled\n   13   *   - Progress tracking via JSON events\n   14   *   - Session artifacts for debugging\n   15   */\n   16  import path from \"node:path\";\n   17  import type { AgentTool, AgentToolResult, AgentToolUpdateCallback } from \"@oh-my-pi/pi-agent-core\";\n   18  import type { Usage } from \"@oh-my-pi/pi-ai\";\n   19  import { $env, logger, prompt } from \"@oh-my-pi/pi-utils\";\n   20  import type { ToolSession } from \"..\";\n   21  import type { Theme } from \"../modes/theme/theme\";\n   22  import subagentUserPromptTemplate from \"../prompts/system/subagent-user-prompt.md\" with { type: \"text\" };\n   23  import taskDescriptionTemplate from \"../prompts/tools/task.md\" with { type: \"text\" };\n   24  import taskAsyncContractTemplate from \"../prompts/tools/task-async-contract.md\" with { type: \"text\" };\n   25  import taskSummaryTemplate from \"../prompts/tools/task-summary.md\" with { type: \"text\" };\n   26  import { TASK_EFFORTS, type TaskEffort } from \"../thinking\";\n   27  import { truncateForPrompt } from \"../tools/approval\";\n   28  import { isIrcEnabled } from \"../tools/hub\";\n   29  import { formatBytes, formatDuration } from \"../tools/render-utils\";\n   30  import { isReadOnlyAgent } from \"./read-only-policy\";",
          "findingId": "omp-subagent-001",
          "title": "Task 是内建多 Agent 调度器，支持 batch、async 与结构化 yield"
        }
      ],
      [
        "evidence",
        "packages/coding-agent/src/session/session-storage.ts",
        {
          "path": "packages/coding-agent/src/session/session-storage.ts",
          "start": 1,
          "end": 260,
          "snippet": "    1  import * as fs from \"node:fs\";\n    2  import * as fsp from \"node:fs/promises\";\n    3  import * as path from \"node:path\";\n    4  import { hasFsCode, isEnoent, logger, peekFileEnds, Snowflake, toError } from \"@oh-my-pi/pi-utils\";\n    5  import { overlayTitleSlotContent, type SessionTitleUpdate, serializeTitleSlot } from \"./session-title-slot\";\n    6  \n    7  const utf8Decoder = new TextDecoder(\"utf-8\");\n    8  \n    9  export interface SessionStorageStat {\n   10  \tsize: number;\n   11  \tmtimeMs: number;\n   12  \tmtime: Date;\n   13  }\n   14  \n   15  export interface SessionStorageWriter {\n   16  \t/**\n   17  \t * Append one newline-terminated line.\n   18  \t *\n   19  \t * File and memory storage apply the line synchronously before the returned\n   20  \t * promise settles, so a software crash after `append` returns (or after a\n   21  \t * fire-and-forget call begins) still sees the entry on disk / in body. No\n   22  \t * `fsync` — power loss may still drop the last page. Indexed backends update\n   23  \t * the local index immediately and queue the remote publish in call order.\n   24  \t *\n   25  \t * `line` MUST include the trailing newline.\n   26  \t */\n   27  \tappend(line: string): Promise<void>;\n   28  \t/**\n   29  \t * Synchronous append when the backend can apply the line before return.\n   30  \t * File and memory implement this so {@link SessionManager} can latch the",
          "findingId": "omp-session-001",
          "title": "会话是树形事件账本，存储层可替换"
        }
      ]
    ]
  },
  {
    "slug": "claude-code",
    "name": "Claude Code（复原）",
    "repo": "claude-code-best/claude-code",
    "branch": "main",
    "commit": "3bb6b5746238c418138eb96d57765d79012edd96",
    "date": "2026-08-10T00:07:54Z",
    "language": "TypeScript / Markdown / JavaScript",
    "kind": "Legacy source-backed harness audit",
    "legacy": true,
    "zh": {
      "thesis": "Claude Code（复原） 的既有源码账本覆盖 10 个 Harness 维度；这次迁移把原有事实重新排成单页分析和十章教程，不把 README 当作实现证据。",
      "strengths": [
        "它像依据成品拆机后复原出的工程图，能研究结构，但不能把每一处细节当成原厂图纸。",
        "每一轮不是“问一次模型就结束”，而是先整理行李、调用模型、执行动作、把结果记账，再决定继续还是停。",
        "模型还在吐后续内容时，已经完整的工具参数可以先开工；账本缺一张回执时，系统会补一张失败回执，避免下一轮 API 拒绝整段对话。"
      ],
      "limits": [
        "当前页面复用既有源码账本；迁移到自研前仍需做部署级验证",
        "当前页面复用既有源码账本；迁移到自研前仍需做部署级验证",
        "当前页面复用既有源码账本；迁移到自研前仍需做部署级验证"
      ],
      "lesson": "它像依据成品拆机后复原出的工程图，能研究结构，但不能把每一处细节当成原厂图纸。"
    },
    "en": {
      "thesis": "The existing source ledger for Claude Code（复原） covers 10 Harness dimensions. This migration reshapes those facts into a single analysis page and ten standalone chapters instead of treating README claims as implementation evidence.",
      "strengths": [
        "Pinned source findings expose the control loop",
        "Context, tools, and policy are separated into reviewable dimensions",
        "Each chapter keeps a file and line-range trail"
      ],
      "limits": [
        "This snapshot reuses the prior source ledger and its pinned commit",
        "Deployment-level behavior still needs a fresh run",
        "Legacy findings should be re-audited when the repository moves"
      ],
      "lesson": "Read the implementation as input, state, tool effect, receipt, and recovery—not as a feature list."
    },
    "anchors": [
      [
        "overview",
        "src/query.ts",
        {
          "path": "src/query.ts",
          "start": 460,
          "end": 666,
          "snippet": "  460    while (true) {\n  461      // Destructure state at the top of each iteration. toolUseContext alone\n  462      // is reassigned within an iteration (queryTracking, messages updates);\n  463      // the rest are read-only between continue sites.\n  464      let { toolUseContext } = state\n  465      const {\n  466        messages,\n  467        autoCompactTracking,\n  468        maxOutputTokensRecoveryCount,\n  469        hasAttemptedReactiveCompact,\n  470        maxOutputTokensOverride,\n  471        pendingToolUseSummary,\n  472        stopHookActive,\n  473        turnCount,\n  474      } = state\n  475  \n  476      // Skill discovery prefetch — per-iteration (uses findWritePivot guard\n  477      // that returns early on non-write iterations). Discovery runs while the\n  478      // model streams and tools execute; awaited post-tools alongside the\n  479      // memory prefetch consume. Replaces the blocking assistant_turn path\n  480      // that ran inside getAttachmentMessages (97% of those calls found\n  481      // nothing in prod). Turn-0 user-input discovery still blocks in\n  482      // userInputAttachments — that's the one signal where there's no prior\n  483      // work to hide under.\n  484      const pendingSkillPrefetch = skillPrefetch?.startSkillDiscoveryPrefetch(\n  485        null,\n  486        messages,\n  487        toolUseContext,\n  488      )\n  489      const pendingToolPrefetch =",
          "findingId": "claude-code-loop-001",
          "title": "主 Harness 是一个持续循环的消息变换与工具执行流水线"
        }
      ],
      [
        "architecture",
        "src/query.ts",
        {
          "path": "src/query.ts",
          "start": 971,
          "end": 1124,
          "snippet": "  971                // Discard pending results from the failed streaming attempt and create\n  972                // a fresh executor. This prevents orphan tool_results (with old tool_use_ids)\n  973                // from being yielded after the fallback response arrives.\n  974                if (streamingToolExecutor) {\n  975                  streamingToolExecutor.discard()\n  976                  streamingToolExecutor = new StreamingToolExecutor(\n  977                    toolUseContext.options.tools,\n  978                    canUseTool,\n  979                    toolUseContext,\n  980                  )\n  981                }\n  982              }\n  983              // Backfill tool_use inputs on a cloned message before yield so\n  984              // SDK stream output and transcript serialization see legacy/derived\n  985              // fields. The original `message` is left untouched for\n  986              // assistantMessages.push below — it flows back to the API and\n  987              // mutating it would break prompt caching (byte mismatch).\n  988              let yieldMessage: typeof message = message\n  989              if (message.type === 'assistant') {\n  990                const assistantMsg = message as AssistantMessage\n  991                const contentArr = Array.isArray(assistantMsg.message?.content)\n  992                  ? (assistantMsg.message.content as unknown as Array<{\n  993                      type: string\n  994                      input?: unknown\n  995                      name?: string\n  996                      [key: string]: unknown\n  997                    }>)\n  998                  : []\n  999                let clonedContent: typeof contentArr | undefined\n 1000                for (let i = 0; i < contentArr.length; i++) {",
          "findingId": "claude-code-loop-002",
          "title": "工具可以随流式响应提前启动，并补齐协议不完整的 tool result"
        }
      ],
      [
        "loop",
        "AGENTS.md",
        {
          "path": "AGENTS.md",
          "start": 1,
          "end": 8,
          "snippet": "    1  # CLAUDE.md\n    2  \n    3  This file provides guidance to Claude Code (claude.ai/code) and other AI coding agents when working with code in this repository.\n    4  \n    5  ## Project Overview\n    6  \n    7  This is a **reverse-engineered / decompiled** version of Anthropic's official Claude Code CLI tool. The goal is to restore core functionality while trimming secondary capabilities. Many modules are stubbed or feature-flagged off. TypeScript strict mode is enforced — **`bunx tsc --noEmit` must pass with zero errors**.\n    8  ",
          "findingId": "claude-code-provenance-001",
          "title": "这是反编译/复原仓库，不是 Anthropic 官方 Claude Code 源码"
        }
      ],
      [
        "model",
        "src/services/api/claude.ts",
        {
          "path": "src/services/api/claude.ts",
          "start": 1282,
          "end": 1338,
          "snippet": " 1282    // Normalize messages before building system prompt (needed for fingerprinting)\n 1283    // Instrumentation: Track message count before normalization\n 1284    logEvent('tengu_api_before_normalize', {\n 1285      preNormalizedMessageCount: messages.length,\n 1286    })\n 1287  \n 1288    queryCheckpoint('query_message_normalization_start')\n 1289    let messagesForAPI = normalizeMessagesForAPI(messages, filteredTools)\n 1290    queryCheckpoint('query_message_normalization_end')\n 1291  \n 1292    // Model-specific post-processing: strip tool-search-specific fields if the\n 1293    // selected model doesn't support tool search.\n 1294    //\n 1295    // Why is this needed in addition to normalizeMessagesForAPI?\n 1296    // - normalizeMessagesForAPI uses isSearchExtraToolsEnabledNoModelCheck() because it's\n 1297    //   called from ~20 places (analytics, feedback, sharing, etc.), many of which\n 1298    //   don't have model context. Adding model to its signature would be a large refactor.\n 1299    // - This post-processing uses the model-aware isSearchExtraToolsEnabled() check\n 1300    // - This handles mid-conversation model switching (e.g., Sonnet → Haiku) where\n 1301    //   stale tool-search fields from the previous model would cause 400 errors\n 1302    //\n 1303    // Note: For assistant messages, normalizeMessagesForAPI already normalized the\n 1304    // tool inputs, so stripCallerFieldFromAssistantMessage only needs to remove the\n 1305    // 'caller' field (not re-normalize inputs).\n 1306    if (!useSearchExtraTools) {\n 1307      messagesForAPI = messagesForAPI.map(msg => {\n 1308        switch (msg.type) {\n 1309          case 'user':\n 1310            // Strip tool_reference blocks from tool_result content\n 1311            return stripToolReferenceBlocksFromUserMessage(msg)",
          "findingId": "claude-code-provider-001",
          "title": "共享预处理之后按 Provider 分流，Anthropic 仍是最深的主路径"
        }
      ],
      [
        "tools",
        "src/tools.ts",
        {
          "path": "src/tools.ts",
          "start": 378,
          "end": 420,
          "snippet": "  378  export function assembleToolPool(\n  379    permissionContext: ToolPermissionContext,\n  380    mcpTools: Tools,\n  381  ): Tools {\n  382    const builtInTools = getTools(permissionContext)\n  383  \n  384    // Filter out MCP tools that are in the deny list\n  385    const allowedMcpTools = filterToolsByDenyRules(mcpTools, permissionContext)\n  386  \n  387    // Sort each partition for prompt-cache stability, keeping built-ins as a\n  388    // contiguous prefix. The server's claude_code_system_cache_policy places a\n  389    // global cache breakpoint after the last prefix-matched built-in tool; a flat\n  390    // sort would interleave MCP tools into built-ins and invalidate all downstream\n  391    // cache keys whenever an MCP tool sorts between existing built-ins. uniqBy\n  392    // preserves insertion order, so built-ins win on name conflict.\n  393    // Avoid Array.toSorted (Node 20+) — we support Node 18. builtInTools is\n  394    // readonly so copy-then-sort; allowedMcpTools is a fresh .filter() result.\n  395    const byName = (a: Tool, b: Tool) => a.name.localeCompare(b.name)\n  396    return uniqBy(\n  397      [...builtInTools].sort(byName).concat(allowedMcpTools.sort(byName)),\n  398      'name',\n  399    )\n  400  }\n  401  \n  402  /**\n  403   * Get all tools including both built-in tools and MCP tools.\n  404   *\n  405   * This is the preferred function when you need the complete tools list for:\n  406   * - Tool search threshold calculations (isSearchExtraToolsEnabled)\n  407   * - Token counting that includes MCP tools",
          "findingId": "claude-code-tools-001",
          "title": "工具池合并内建与 MCP，并为 prompt cache 做确定性排序"
        }
      ],
      [
        "context",
        "src/services/compact/snipCompact.ts",
        {
          "path": "src/services/compact/snipCompact.ts",
          "start": 60,
          "end": 147,
          "snippet": "   60  /**\n   61   * Scan the message array for the last `snip_boundary` system message and,\n   62   * if found, remove all messages whose UUIDs appear in its\n   63   * `snipMetadata.removedUuids`.\n   64   *\n   65   * This is the core memory-saving function. When a snip boundary exists:\n   66   * 1. All messages listed in `removedUuids` are filtered out.\n   67   * 2. The boundary message itself is kept (it records what was removed).\n   68   * 3. Messages not in `removedUuids` (including post-boundary messages)\n   69   *    are preserved.\n   70   *\n   71   * Called from:\n   72   * - `query.ts` — strips snipped messages from the model-facing array\n   73   *   before sending to the API.\n   74   * - `QueryEngine.ts` `snipReplay` — trims `mutableMessages` so the\n   75   *   in-memory store does not grow without bound in long SDK sessions.\n   76   *\n   77   * @param messages  Full message array (may contain a snip_boundary).\n   78   * @param options   `force` — if true, always execute when a boundary is\n   79   *                  present. Without `force`, the function still executes\n   80   *                  if a boundary is found (the \"if needed\" refers to\n   81   *                  whether a boundary exists, not a token threshold).\n   82   */\n   83  export function snipCompactIfNeeded(\n   84    messages: Message[],\n   85    _options?: { force?: boolean },\n   86  ): {\n   87    messages: Message[]\n   88    executed: boolean\n   89    tokensFreed: number",
          "findingId": "claude-code-context-001",
          "title": "上下文不是单层摘要，而是 snip、工具结果瘦身、session memory 与 autocompact 的阶梯"
        }
      ],
      [
        "security",
        "src/utils/permissions/permissions.ts",
        {
          "path": "src/utils/permissions/permissions.ts",
          "start": 1179,
          "end": 1281,
          "snippet": " 1179  async function hasPermissionsToUseToolInner(\n 1180    tool: Tool,\n 1181    input: { [key: string]: unknown },\n 1182    context: ToolUseContext,\n 1183  ): Promise<PermissionDecision> {\n 1184    if (context.abortController.signal.aborted) {\n 1185      throw new AbortError()\n 1186    }\n 1187  \n 1188    let appState = context.getAppState()\n 1189  \n 1190    // 1. Check if the tool is denied\n 1191    // 1a. Entire tool is denied\n 1192    const denyRule = getDenyRuleForTool(appState.toolPermissionContext, tool)\n 1193    if (denyRule) {\n 1194      return {\n 1195        behavior: 'deny',\n 1196        decisionReason: {\n 1197          type: 'rule',\n 1198          rule: denyRule,\n 1199        },\n 1200        message: `Permission to use ${tool.name} has been denied.`,\n 1201      }\n 1202    }\n 1203  \n 1204    // 1b. Check if the entire tool should always ask for permission\n 1205    const askRule = getAskRuleForTool(appState.toolPermissionContext, tool)\n 1206    if (askRule) {\n 1207      // When autoAllowBashIfSandboxed is on, sandboxed commands skip the ask rule and\n 1208      // auto-allow via Bash's checkPermissions. Commands that won't be sandboxed (excluded",
          "findingId": "claude-code-permission-001",
          "title": "权限是“规则 → 工具自检 → 安全检查 → 模式 → 用户/自动判定”的有序流水线"
        }
      ],
      [
        "ecosystem",
        "src/services/mcp/client.ts",
        {
          "path": "src/services/mcp/client.ts",
          "start": 596,
          "end": 678,
          "snippet": "  596  export const connectToServer = memoize(\n  597    async (\n  598      name: string,\n  599      serverRef: ScopedMcpServerConfig,\n  600      serverStats?: {\n  601        totalServers: number\n  602        stdioCount: number\n  603        sseCount: number\n  604        httpCount: number\n  605        sseIdeCount: number\n  606        wsIdeCount: number\n  607      },\n  608    ): Promise<MCPServerConnection> => {\n  609      const connectStartTime = Date.now()\n  610      let inProcessServer:\n  611        | { connect(t: Transport): Promise<void>; close(): Promise<void> }\n  612        | undefined\n  613      try {\n  614        let transport\n  615  \n  616        // If we have the session ingress JWT, we will connect via the session ingress rather than\n  617        // to remote MCP's directly.\n  618        const sessionIngressToken = getSessionIngressAuthToken()\n  619  \n  620        if (serverRef.type === 'sse') {\n  621          // Create an auth provider for this server\n  622          const authProvider = new ClaudeAuthProvider(name, serverRef)\n  623  \n  624          // Get combined headers (static + dynamic)\n  625          const combinedHeaders = await getMcpServerHeaders(name, serverRef)",
          "findingId": "claude-code-mcp-001",
          "title": "MCP 是完整连接层：stdio、SSE、Streamable HTTP、WebSocket 和 claude.ai proxy"
        }
      ],
      [
        "collaboration",
        "packages/builtin-tools/src/tools/AgentTool/loadAgentsDir.ts",
        {
          "path": "packages/builtin-tools/src/tools/AgentTool/loadAgentsDir.ts",
          "start": 58,
          "end": 132,
          "snippet": "   58  export type AgentMcpServerSpec =\n   59    | string // Reference to existing server by name (e.g., \"slack\")\n   60    | { [name: string]: McpServerConfig } // Inline definition as { name: config }\n   61  \n   62  // Zod schema for agent MCP server specs\n   63  const AgentMcpServerSpecSchema = lazySchema(() =>\n   64    z.union([\n   65      z.string(), // Reference by name\n   66      z.record(z.string(), McpServerConfigSchema()), // Inline as { name: config }\n   67    ]),\n   68  )\n   69  \n   70  // Zod schemas for JSON agent validation\n   71  // Note: HooksSchema is lazy so the circular chain AppState -> loadAgentsDir -> settings/types\n   72  // is broken at module load time\n   73  const AgentJsonSchema = lazySchema(() =>\n   74    z.object({\n   75      description: z.string().min(1, 'Description cannot be empty'),\n   76      tools: z.array(z.string()).optional(),\n   77      disallowedTools: z.array(z.string()).optional(),\n   78      prompt: z.string().min(1, 'Prompt cannot be empty'),\n   79      model: z\n   80        .string()\n   81        .trim()\n   82        .min(1, 'Model cannot be empty')\n   83        .transform(m => (m.toLowerCase() === 'inherit' ? 'inherit' : m))\n   84        .optional(),\n   85      effort: z.union([z.enum(EFFORT_LEVELS), z.number().int()]).optional(),\n   86      permissionMode: z.enum(PERMISSION_MODES).optional(),\n   87      mcpServers: z.array(AgentMcpServerSpecSchema()).optional(),",
          "findingId": "claude-code-agent-001",
          "title": "子 Agent 是独立 query 运行时，可定制模型、工具、权限、MCP、hooks、skills、memory 和 isolation"
        }
      ],
      [
        "evidence",
        "AGENTS.md",
        {
          "path": "AGENTS.md",
          "start": 1,
          "end": 8,
          "snippet": "    1  # CLAUDE.md\n    2  \n    3  This file provides guidance to Claude Code (claude.ai/code) and other AI coding agents when working with code in this repository.\n    4  \n    5  ## Project Overview\n    6  \n    7  This is a **reverse-engineered / decompiled** version of Anthropic's official Claude Code CLI tool. The goal is to restore core functionality while trimming secondary capabilities. Many modules are stubbed or feature-flagged off. TypeScript strict mode is enforced — **`bunx tsc --noEmit` must pass with zero errors**.\n    8  ",
          "findingId": "claude-code-provenance-001",
          "title": "这是反编译/复原仓库，不是 Anthropic 官方 Claude Code 源码"
        }
      ]
    ]
  },
  {
    "slug": "pi",
    "name": "Pi",
    "repo": "earendil-works/pi",
    "branch": "main",
    "commit": "581d75a89cea21e50d6a26df840352f94427f633",
    "date": "2026-08-13T00:53:22+02:00",
    "language": "TypeScript / Markdown / Shell",
    "kind": "Legacy source-backed harness audit",
    "legacy": true,
    "zh": {
      "thesis": "Pi 的既有源码账本覆盖 10 个 Harness 维度；这次迁移把原有事实重新排成单页分析和十章教程，不把 README 当作实现证据。",
      "strengths": [
        "一边是可嵌入任何产品的发动机，一边是已经带 CLI、会话、扩展和交互界面的整车；当前两套代码有重叠，不能把发动机的新接口直接当成整车每条路径都已采用。",
        "用户中途插话会先纠偏当前工作，排队的新任务则等当前回合稳定后再接着做。",
        "模型半句话里拼出的命令不会贸然执行；同时下一轮可以换模型、换工具或换说明书。"
      ],
      "limits": [
        "机制测试密集；仓库行为 eval 目前只有 smoke 与 extension 两个 suite，未见统一 coding benchmark。",
        "当前页面复用既有源码账本；迁移到自研前仍需做部署级验证",
        "当前页面复用既有源码账本；迁移到自研前仍需做部署级验证"
      ],
      "lesson": "一边是可嵌入任何产品的发动机，一边是已经带 CLI、会话、扩展和交互界面的整车；当前两套代码有重叠，不能把发动机的新接口直接当成整车每条路径都已采用。"
    },
    "en": {
      "thesis": "The existing source ledger for Pi covers 10 Harness dimensions. This migration reshapes those facts into a single analysis page and ten standalone chapters instead of treating README claims as implementation evidence.",
      "strengths": [
        "Pinned source findings expose the control loop",
        "Context, tools, and policy are separated into reviewable dimensions",
        "Each chapter keeps a file and line-range trail"
      ],
      "limits": [
        "This snapshot reuses the prior source ledger and its pinned commit",
        "Deployment-level behavior still needs a fresh run",
        "Legacy findings should be re-audited when the repository moves"
      ],
      "lesson": "Read the implementation as input, state, tool effect, receipt, and recovery—not as a feature list."
    },
    "anchors": [
      [
        "overview",
        "packages/agent/src/harness/agent-harness.ts",
        {
          "path": "packages/agent/src/harness/agent-harness.ts",
          "start": 171,
          "end": 223,
          "snippet": "  171  \toperation: LaneInfo[\"operation\"];\n  172  \tqueues: { steer: QueuedItem[]; followUp: QueuedItem[]; nextRun: QueuedItem[] };\n  173  \tpendingWrites: { id: string; entry: ProvisionedEntry }[];\n  174  \tfaulted: boolean;\n  175  }\n  176  \n  177  export interface SessionSnapshot {\n  178  \tlanes: (LaneInfo & { suspended?: SuspendedOperation })[];\n  179  \tfaulted: boolean;\n  180  }\n  181  \n  182  export type ActionInfo =\n  183  \t| { kind: \"append_entry\"; entryType: Entry[\"type\"]; entryId: string }\n  184  \t| { kind: \"append_record\"; recordType: string }\n  185  \t| { kind: \"move_lane\"; to: string | null }\n  186  \t| { kind: \"set_fact\"; fact: \"name\" | \"label\" }\n  187  \t| { kind: \"try_finish_run\"; outcome: \"completed\" | \"failed\" }\n  188  \t| { kind: \"finish_operation\"; outcome: \"completed\" | \"declined\" | \"failed\" | \"aborted\" }\n  189  \t| { kind: \"commit_follow_up\" }\n  190  \t| { kind: \"consume_queue_item\"; queue: \"steer\" | \"followUp\"; entryId: string }\n  191  \t| { kind: \"apply_pending_write\"; entryId: string }\n  192  \t| { kind: \"stream_assistant\"; step: \"assistant\" | \"compaction\" | \"branch_summary\"; attempt: number }\n  193  \t| { kind: \"execute_tool\"; toolCallId: string; toolName: string }\n  194  \t| { kind: \"fetch_deferred\" | \"cancel_deferred\"; provider: string; id: string }\n  195  \t| { kind: \"hook\"; name: HookName }\n  196  \t| { kind: \"sleep\"; delayMs: number };\n  197  \n  198  export type HookName =\n  199  \t| \"before_run\"\n  200  \t| \"before_resume\"",
          "findingId": "pi-architecture-001",
          "title": "仓库是“通用 Harness 内核 + 完整 Coding Agent 产品层”的双轨架构"
        }
      ],
      [
        "architecture",
        "packages/agent/src/agent-loop.ts",
        {
          "path": "packages/agent/src/agent-loop.ts",
          "start": 155,
          "end": 275,
          "snippet": "  155  async function runLoop(\n  156  \tinitialContext: AgentContext,\n  157  \tnewMessages: AgentMessage[],\n  158  \tinitialConfig: AgentLoopConfig,\n  159  \tsignal: AbortSignal | undefined,\n  160  \temit: AgentEventSink,\n  161  \tstreamFunction: StreamFn,\n  162  ): Promise<void> {\n  163  \tlet currentContext = initialContext;\n  164  \tlet config = initialConfig;\n  165  \tlet firstTurn = true;\n  166  \t// Check for steering messages at start (user may have typed while waiting)\n  167  \tlet pendingMessages: AgentMessage[] = (await config.getSteeringMessages?.()) || [];\n  168  \n  169  \t// Outer loop: continues when queued follow-up messages arrive after agent would stop\n  170  \twhile (true) {\n  171  \t\tlet hasMoreToolCalls = true;\n  172  \n  173  \t\t// Inner loop: process tool calls and steering messages\n  174  \t\twhile (hasMoreToolCalls || pendingMessages.length > 0) {\n  175  \t\t\tif (!firstTurn) {\n  176  \t\t\t\tawait emit({ type: \"turn_start\" });\n  177  \t\t\t} else {\n  178  \t\t\t\tfirstTurn = false;\n  179  \t\t\t}\n  180  \n  181  \t\t\t// Process pending messages (inject before next assistant response)\n  182  \t\t\tif (pendingMessages.length > 0) {\n  183  \t\t\t\tfor (const message of pendingMessages) {\n  184  \t\t\t\t\tawait emit({ type: \"message_start\", message });",
          "findingId": "pi-loop-001",
          "title": "低层循环把 steering、工具执行和 follow-up 分成内外两层"
        }
      ],
      [
        "loop",
        "packages/agent/src/agent-loop.ts",
        {
          "path": "packages/agent/src/agent-loop.ts",
          "start": 208,
          "end": 245,
          "snippet": "  208  \t\t\t\t// A \"length\" stop means the output was cut off by the token limit, so\n  209  \t\t\t\t// every tool call in the message may carry truncated arguments. Fail\n  210  \t\t\t\t// them all instead of executing potentially borked calls.\n  211  \t\t\t\tconst executedToolBatch =\n  212  \t\t\t\t\tmessage.stopReason === \"length\"\n  213  \t\t\t\t\t\t? await failToolCallsFromTruncatedMessage(toolCalls, emit)\n  214  \t\t\t\t\t\t: await executeToolCalls(currentContext, message, config, signal, emit);\n  215  \t\t\t\ttoolResults.push(...executedToolBatch.messages);\n  216  \t\t\t\thasMoreToolCalls = !executedToolBatch.terminate;\n  217  \n  218  \t\t\t\tfor (const result of toolResults) {\n  219  \t\t\t\t\tcurrentContext.messages.push(result);\n  220  \t\t\t\t\tnewMessages.push(result);\n  221  \t\t\t\t}\n  222  \t\t\t}\n  223  \n  224  \t\t\tawait emit({ type: \"turn_end\", message, toolResults });\n  225  \n  226  \t\t\tconst nextTurnContext = {\n  227  \t\t\t\tmessage,\n  228  \t\t\t\ttoolResults,\n  229  \t\t\t\tcontext: currentContext,\n  230  \t\t\t\tnewMessages,\n  231  \t\t\t};\n  232  \t\t\tconst nextTurnSnapshot = await config.prepareNextTurn?.(nextTurnContext);\n  233  \t\t\tif (nextTurnSnapshot) {\n  234  \t\t\t\tcurrentContext = nextTurnSnapshot.context ?? currentContext;\n  235  \t\t\t\tconfig = {\n  236  \t\t\t\t\t...config,\n  237  \t\t\t\t\tmodel: nextTurnSnapshot.model ?? config.model,",
          "findingId": "pi-loop-002",
          "title": "截断响应禁止执行工具；每回合可热刷新完整运行状态"
        }
      ],
      [
        "model",
        "packages/ai/src/providers/all.ts",
        {
          "path": "packages/ai/src/providers/all.ts",
          "start": 5,
          "end": 44,
          "snippet": "    5  import { amazonBedrockProvider } from \"./amazon-bedrock.ts\";\n    6  import { antLingProvider } from \"./ant-ling.ts\";\n    7  import { anthropicProvider } from \"./anthropic.ts\";\n    8  import { azureOpenAIResponsesProvider } from \"./azure-openai-responses.ts\";\n    9  import { basetenProvider } from \"./baseten.ts\";\n   10  import { cerebrasProvider } from \"./cerebras.ts\";\n   11  import { cloudflareAIGatewayProvider } from \"./cloudflare-ai-gateway.ts\";\n   12  import { cloudflareWorkersAIProvider } from \"./cloudflare-workers-ai.ts\";\n   13  import modelDataManifest from \"./data/.manifest.json\" with { type: \"json\" };\n   14  import { deepseekProvider } from \"./deepseek.ts\";\n   15  import { fireworksProvider } from \"./fireworks.ts\";\n   16  import { githubCopilotProvider } from \"./github-copilot.ts\";\n   17  import { googleProvider } from \"./google.ts\";\n   18  import { googleVertexProvider } from \"./google-vertex.ts\";\n   19  import { groqProvider } from \"./groq.ts\";\n   20  import { huggingfaceProvider } from \"./huggingface.ts\";\n   21  import { kimiCodingProvider } from \"./kimi-coding.ts\";\n   22  import { minimaxProvider } from \"./minimax.ts\";\n   23  import { minimaxCnProvider } from \"./minimax-cn.ts\";\n   24  import { mistralProvider } from \"./mistral.ts\";\n   25  import { moonshotaiProvider } from \"./moonshotai.ts\";\n   26  import { moonshotaiCnProvider } from \"./moonshotai-cn.ts\";\n   27  import { nvidiaProvider } from \"./nvidia.ts\";\n   28  import { openaiProvider } from \"./openai.ts\";\n   29  import { openaiCodexProvider } from \"./openai-codex.ts\";\n   30  import { opencodeProvider } from \"./opencode.ts\";\n   31  import { opencodeGoProvider } from \"./opencode-go.ts\";\n   32  import { openrouterProvider } from \"./openrouter.ts\";\n   33  import { openrouterImagesProvider } from \"./openrouter-images.ts\";\n   34  import { qwenTokenPlanProvider } from \"./qwen-token-plan.ts\";",
          "findingId": "pi-provider-001",
          "title": "Provider 不是单一 OpenAI 兼容层，而是多协议适配矩阵"
        }
      ],
      [
        "tools",
        "packages/agent/src/agent-loop.ts",
        {
          "path": "packages/agent/src/agent-loop.ts",
          "start": 411,
          "end": 553,
          "snippet": "  411  async function executeToolCalls(\n  412  \tcurrentContext: AgentContext,\n  413  \tassistantMessage: AssistantMessage,\n  414  \tconfig: AgentLoopConfig,\n  415  \tsignal: AbortSignal | undefined,\n  416  \temit: AgentEventSink,\n  417  ): Promise<ExecutedToolCallBatch> {\n  418  \tconst toolCalls = assistantMessage.content.filter((c) => c.type === \"toolCall\");\n  419  \tconst hasSequentialToolCall = toolCalls.some(\n  420  \t\t(tc) => currentContext.tools?.find((t) => t.name === tc.name)?.executionMode === \"sequential\",\n  421  \t);\n  422  \tif (config.toolExecution === \"sequential\" || hasSequentialToolCall) {\n  423  \t\treturn executeToolCallsSequential(currentContext, assistantMessage, toolCalls, config, signal, emit);\n  424  \t}\n  425  \treturn executeToolCallsParallel(currentContext, assistantMessage, toolCalls, config, signal, emit);\n  426  }\n  427  \n  428  type ExecutedToolCallBatch = {\n  429  \tmessages: ToolResultMessage[];\n  430  \tterminate: boolean;\n  431  };\n  432  \n  433  async function executeToolCallsSequential(\n  434  \tcurrentContext: AgentContext,\n  435  \tassistantMessage: AssistantMessage,\n  436  \ttoolCalls: AgentToolCall[],\n  437  \tconfig: AgentLoopConfig,\n  438  \tsignal: AbortSignal | undefined,\n  439  \temit: AgentEventSink,\n  440  ): Promise<ExecutedToolCallBatch> {",
          "findingId": "pi-tool-dispatch-001",
          "title": "工具默认可并行，声明 sequential 或全局策略才串行"
        }
      ],
      [
        "context",
        "packages/coding-agent/src/core/compaction/compaction.ts",
        {
          "path": "packages/coding-agent/src/core/compaction/compaction.ts",
          "start": 190,
          "end": 237,
          "snippet": "  190  function getLastAssistantUsageInfo(messages: AgentMessage[]): { usage: Usage; index: number } | undefined {\n  191  \tfor (let i = messages.length - 1; i >= 0; i--) {\n  192  \t\tconst usage = getAssistantUsage(messages[i]);\n  193  \t\tif (usage) return { usage, index: i };\n  194  \t}\n  195  \treturn undefined;\n  196  }\n  197  \n  198  /**\n  199   * Estimate context tokens from messages, using the last assistant usage when available.\n  200   * If there are messages after the last usage, estimate their tokens with estimateTokens.\n  201   */\n  202  export function estimateContextTokens(messages: AgentMessage[]): ContextUsageEstimate {\n  203  \tconst usageInfo = getLastAssistantUsageInfo(messages);\n  204  \n  205  \tif (!usageInfo) {\n  206  \t\tlet estimated = 0;\n  207  \t\tfor (const message of messages) {\n  208  \t\t\testimated += estimateTokens(message);\n  209  \t\t}\n  210  \t\treturn {\n  211  \t\t\ttokens: estimated,\n  212  \t\t\tusageTokens: 0,\n  213  \t\t\ttrailingTokens: estimated,\n  214  \t\t\tlastUsageIndex: null,\n  215  \t\t};\n  216  \t}\n  217  \n  218  \tconst usageTokens = calculateContextTokens(usageInfo.usage);\n  219  \tlet trailingTokens = 0;",
          "findingId": "pi-context-001",
          "title": "压缩阈值给输出预留固定预算，并尽量使用真实 usage"
        }
      ],
      [
        "security",
        "packages/coding-agent/src/core/tools/bash.ts",
        {
          "path": "packages/coding-agent/src/core/tools/bash.ts",
          "start": 82,
          "end": 148,
          "snippet": "   82  /**\n   83   * Create bash operations using pi's built-in local shell execution backend.\n   84   *\n   85   * This is useful for extensions that intercept user_bash and still want pi's\n   86   * standard local shell behavior while wrapping or rewriting commands.\n   87   */\n   88  export function createLocalBashOperations(options?: { shellPath?: string }): BashOperations {\n   89  \treturn {\n   90  \t\texec: async (command, cwd, { onData, signal, timeout, env }) => {\n   91  \t\t\tconst timeoutMs = resolveTimeoutMs(timeout);\n   92  \t\t\tif (signal?.aborted) {\n   93  \t\t\t\tthrow new Error(\"aborted\");\n   94  \t\t\t}\n   95  \t\t\tconst shellConfig = getShellConfig(options?.shellPath);\n   96  \t\t\ttry {\n   97  \t\t\t\tawait fsAccess(cwd, constants.F_OK);\n   98  \t\t\t} catch {\n   99  \t\t\t\tthrow new Error(`Working directory does not exist: ${cwd}\\nCannot execute bash commands.`);\n  100  \t\t\t}\n  101  \n  102  \t\t\tconst commandFromStdin = shellConfig.commandTransport === \"stdin\";\n  103  \t\t\tconst child = spawn(shellConfig.shell, commandFromStdin ? shellConfig.args : [...shellConfig.args, command], {\n  104  \t\t\t\tcwd,\n  105  \t\t\t\tdetached: process.platform !== \"win32\",\n  106  \t\t\t\tenv: env ?? getShellEnv(),\n  107  \t\t\t\tstdio: [commandFromStdin ? \"pipe\" : \"ignore\", \"pipe\", \"pipe\"],\n  108  \t\t\t\twindowsHide: true,\n  109  \t\t\t});\n  110  \t\t\tif (commandFromStdin) {\n  111  \t\t\t\tchild.stdin?.on(\"error\", () => {});",
          "findingId": "pi-execution-001",
          "title": "默认 CLI 在宿主 shell/filesystem 执行，不是沙箱"
        }
      ],
      [
        "ecosystem",
        "packages/coding-agent/src/core/system-prompt.ts",
        {
          "path": "packages/coding-agent/src/core/system-prompt.ts",
          "start": 28,
          "end": 71,
          "snippet": "   28  export function buildSystemPrompt(options: BuildSystemPromptOptions): string {\n   29  \tconst {\n   30  \t\tcustomPrompt,\n   31  \t\tselectedTools,\n   32  \t\ttoolSnippets,\n   33  \t\tpromptGuidelines,\n   34  \t\tappendSystemPrompt,\n   35  \t\tcwd,\n   36  \t\tcontextFiles: providedContextFiles,\n   37  \t\tskills: providedSkills,\n   38  \t} = options;\n   39  \tconst promptCwd = cwd.replace(/\\\\/g, \"/\");\n   40  \n   41  \tconst appendSection = appendSystemPrompt ? `\\n\\n${appendSystemPrompt}` : \"\";\n   42  \n   43  \tconst contextFiles = providedContextFiles ?? [];\n   44  \tconst skills = providedSkills ?? [];\n   45  \n   46  \tif (customPrompt) {\n   47  \t\tlet prompt = customPrompt;\n   48  \n   49  \t\tif (appendSection) {\n   50  \t\t\tprompt += appendSection;\n   51  \t\t}\n   52  \n   53  \t\t// Append project context files\n   54  \t\tif (contextFiles.length > 0) {\n   55  \t\t\tprompt += \"\\n\\n<project_context>\\n\\n\";\n   56  \t\t\tprompt += \"Project-specific instructions and guidelines:\\n\\n\";\n   57  \t\t\tfor (const { path: filePath, content } of contextFiles) {",
          "findingId": "pi-instructions-001",
          "title": "系统指令由 tool、context files、skills、custom/append prompt 多层拼装"
        }
      ],
      [
        "collaboration",
        "packages/coding-agent/examples/extensions/subagent/index.ts",
        {
          "path": "packages/coding-agent/examples/extensions/subagent/index.ts",
          "start": 1,
          "end": 36,
          "snippet": "    1  /**\n    2   * Subagent Tool - Delegate tasks to specialized agents\n    3   *\n    4   * Spawns a separate `pi` process for each subagent invocation,\n    5   * giving it an isolated context window.\n    6   *\n    7   * Supports three modes:\n    8   *   - Single: { agent: \"name\", task: \"...\" }\n    9   *   - Parallel: { tasks: [{ agent: \"name\", task: \"...\" }, ...] }\n   10   *   - Chain: { chain: [{ agent: \"name\", task: \"... {previous} ...\" }, ...] }\n   11   *\n   12   * Uses JSON mode to capture structured output from subagents.\n   13   */\n   14  \n   15  import { spawn } from \"node:child_process\";\n   16  import * as fs from \"node:fs\";\n   17  import * as os from \"node:os\";\n   18  import * as path from \"node:path\";\n   19  import type { AgentToolResult, ThinkingLevel } from \"@earendil-works/pi-agent-core\";\n   20  import type { Message } from \"@earendil-works/pi-ai\";\n   21  import { StringEnum } from \"@earendil-works/pi-ai\";\n   22  import {\n   23  \tCONFIG_DIR_NAME,\n   24  \ttype ExtensionAPI,\n   25  \tgetAgentDir,\n   26  \tgetMarkdownTheme,\n   27  \twithFileMutationQueue,\n   28  } from \"@earendil-works/pi-coding-agent\";\n   29  import { Container, Markdown, Spacer, Text } from \"@earendil-works/pi-tui\";\n   30  import { Type } from \"typebox\";",
          "findingId": "pi-subagent-001",
          "title": "子 Agent 是独立 pi 进程示例，不是内建调度控制平面"
        }
      ],
      [
        "evidence",
        "packages/coding-agent/src/core/session-manager.ts",
        {
          "path": "packages/coding-agent/src/core/session-manager.ts",
          "start": 30,
          "end": 153,
          "snippet": "   30  export const CURRENT_SESSION_VERSION = 3;\n   31  \n   32  export interface SessionHeader {\n   33  \ttype: \"session\";\n   34  \tversion?: number; // v1 sessions don't have this\n   35  \tid: string;\n   36  \ttimestamp: string;\n   37  \tcwd: string;\n   38  \tparentSession?: string;\n   39  }\n   40  \n   41  export interface NewSessionOptions {\n   42  \tid?: string;\n   43  \tparentSession?: string;\n   44  }\n   45  \n   46  export interface SessionEntryBase {\n   47  \ttype: string;\n   48  \tid: string;\n   49  \tparentId: string | null;\n   50  \ttimestamp: string;\n   51  }\n   52  \n   53  export interface SessionMessageEntry extends SessionEntryBase {\n   54  \ttype: \"message\";\n   55  \tmessage: AgentMessage;\n   56  }\n   57  \n   58  export interface ThinkingLevelChangeEntry extends SessionEntryBase {\n   59  \ttype: \"thinking_level_change\";",
          "findingId": "pi-session-001",
          "title": "会话是 append-only JSONL 树，可移动叶子、fork 和保存扩展状态"
        }
      ]
    ]
  },
  {
    "slug": "codex",
    "name": "OpenAI Codex",
    "repo": "openai/codex",
    "branch": "main",
    "commit": "902bd9e06b3ecb32cbf7f8e64cd23b956be3e7fe",
    "date": "2026-08-13T04:08:23Z",
    "language": "Rust / TypeScript / Markdown",
    "kind": "Legacy source-backed harness audit",
    "legacy": true,
    "zh": {
      "thesis": "OpenAI Codex 的既有源码账本覆盖 10 个 Harness 维度；这次迁移把原有事实重新排成单页分析和十章教程，不把 README 当作实现证据。",
      "strengths": [
        "一轮任务可以问模型很多次，但每一次“想一想并行动”的小步都先拍一张现场快照，避免工具清单和提示词在同一步里前后不一致。",
        "模型说到一个完整动作就能开工，不必等整段回答结束；用户中途补充信息时，系统也能在安全位置收住并接新指令。",
        "同一轮尽量复用连接和粘性状态；行李箱塞不下不会盲目重拨网络，而是交给压缩逻辑处理。"
      ],
      "limits": [
        "当前页面复用既有源码账本；迁移到自研前仍需做部署级验证",
        "当前页面复用既有源码账本；迁移到自研前仍需做部署级验证",
        "当前页面复用既有源码账本；迁移到自研前仍需做部署级验证"
      ],
      "lesson": "一轮任务可以问模型很多次，但每一次“想一想并行动”的小步都先拍一张现场快照，避免工具清单和提示词在同一步里前后不一致。"
    },
    "en": {
      "thesis": "The existing source ledger for OpenAI Codex covers 10 Harness dimensions. This migration reshapes those facts into a single analysis page and ten standalone chapters instead of treating README claims as implementation evidence.",
      "strengths": [
        "Pinned source findings expose the control loop",
        "Context, tools, and policy are separated into reviewable dimensions",
        "Each chapter keeps a file and line-range trail"
      ],
      "limits": [
        "This snapshot reuses the prior source ledger and its pinned commit",
        "Deployment-level behavior still needs a fresh run",
        "Legacy findings should be re-audited when the repository moves"
      ],
      "lesson": "Read the implementation as input, state, tool effect, receipt, and recovery—not as a feature list."
    },
    "anchors": [
      [
        "overview",
        "codex-rs/core/src/session/turn.rs",
        {
          "path": "codex-rs/core/src/session/turn.rs",
          "start": 153,
          "end": 274,
          "snippet": "  153  pub(crate) async fn run_turn(\n  154      sess: Arc<Session>,\n  155      turn_context: Arc<TurnContext>,\n  156      input: Vec<TurnInput>,\n  157      prewarmed_client_session: Option<ModelClientSession>,\n  158      cancellation_token: CancellationToken,\n  159  ) -> CodexResult<Option<String>> {\n  160      // Record results from hooks that finished after the previous turn before this turn's user prompt.\n  161      drain_async_hook_results(&sess, &turn_context, /*before_user_prompt*/ true).await;\n  162  \n  163      let mut client_session =\n  164          prewarmed_client_session.unwrap_or_else(|| sess.services.model_client.new_session());\n  165      // TODO(ccunningham): Pre-turn compaction runs before context updates and the\n  166      // new user message are recorded. Estimate pending incoming items (context\n  167      // diffs/full reinjection + user input) and trigger compaction preemptively\n  168      // when they would push the thread over the compaction threshold.\n  169      if let Err(err) = run_pre_sampling_compact(\n  170          &sess,\n  171          &turn_context,\n  172          &mut client_session,\n  173          &cancellation_token,\n  174      )\n  175      .await\n  176      {\n  177          if matches!(err.details(), CodexErrorDetails::TurnAborted) {\n  178              run_hooks_and_record_inputs(&sess, &turn_context, &input, PersistContext::Standard)\n  179                  .await;\n  180              return Err(err);\n  181          }\n  182          if matches!(err.details(), CodexErrorDetails::ToolCollision(_)) {",
          "findingId": "codex-loop-001",
          "title": "每个 turn 由多个 step 组成，step 内共享一次不可漂移的上下文快照"
        }
      ],
      [
        "architecture",
        "codex-rs/core/src/session/turn.rs",
        {
          "path": "codex-rs/core/src/session/turn.rs",
          "start": 2034,
          "end": 2168,
          "snippet": " 2034      turn_item: TurnItem,\n 2035      previously_active_item: Option<&TurnItem>,\n 2036      state: &mut PlanModeStreamState,\n 2037  ) {\n 2038      match turn_item {\n 2039          TurnItem::AgentMessage(agent_message) => {\n 2040              emit_agent_message_in_plan_mode(sess, turn_context, agent_message, state).await;\n 2041          }\n 2042          _ => {\n 2043              if previously_active_item.is_none() {\n 2044                  sess.emit_turn_item_started(turn_context, &turn_item).await;\n 2045              }\n 2046              sess.emit_turn_item_completed(turn_context, turn_item).await;\n 2047          }\n 2048      }\n 2049  }\n 2050  \n 2051  /// Handle a completed assistant response item in plan mode, returning true if handled.\n 2052  async fn handle_assistant_item_done_in_plan_mode(\n 2053      sess: &Session,\n 2054      turn_context: &TurnContext,\n 2055      turn_store: &codex_extension_api::ExtensionData,\n 2056      item: &ResponseItem,\n 2057      state: &mut PlanModeStreamState,\n 2058      previously_active_item: Option<&TurnItem>,\n 2059      last_agent_message: &mut Option<String>,\n 2060  ) -> bool {\n 2061      if let ResponseItem::Message { role, .. } = item\n 2062          && role == \"assistant\"\n 2063      {",
          "findingId": "codex-loop-002",
          "title": "流式采样与工具 Future 同时推进，并可被新消息抢占"
        }
      ],
      [
        "loop",
        "codex-rs/core/src/session/turn.rs",
        {
          "path": "codex-rs/core/src/session/turn.rs",
          "start": 1176,
          "end": 1273,
          "snippet": " 1176          // instead of consuming a pending `new_context` tool request.\n 1177          crate::compact_token_budget::run_inline_auto_compact_task(\n 1178              Arc::clone(sess),\n 1179              step_context,\n 1180              initial_context_injection,\n 1181          )\n 1182          .await?;\n 1183          return Ok(());\n 1184      }\n 1185  \n 1186      match turn_context.provider.capabilities().remote_compaction {\n 1187          RemoteCompactionSupport::V2\n 1188              if turn_context\n 1189                  .config\n 1190                  .features\n 1191                  .enabled(Feature::RemoteCompactionV2) =>\n 1192          {\n 1193              emit_compact_metric(\n 1194                  &sess.services.session_telemetry,\n 1195                  \"remote_v2\",\n 1196                  /*manual*/ false,\n 1197              );\n 1198              run_inline_remote_auto_compact_task_v2(\n 1199                  Arc::clone(sess),\n 1200                  step_context,\n 1201                  fallback_step_context,\n 1202                  client_session,\n 1203                  initial_context_injection,\n 1204                  reason,\n 1205                  phase,",
          "findingId": "codex-loop-003",
          "title": "重试预算属于 turn-scoped client session，窗口超限不当作普通网络错误重试"
        }
      ],
      [
        "model",
        "codex-rs/model-provider-info/src/lib.rs",
        {
          "path": "codex-rs/model-provider-info/src/lib.rs",
          "start": 54,
          "end": 84,
          "snippet": "   54  #[derive(Debug, Clone, Copy, Default, PartialEq, Eq, Serialize, JsonSchema)]\n   55  #[serde(rename_all = \"lowercase\")]\n   56  pub enum WireApi {\n   57      /// The Responses API exposed by OpenAI at `/v1/responses`.\n   58      #[default]\n   59      Responses,\n   60  }\n   61  \n   62  impl fmt::Display for WireApi {\n   63      fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {\n   64          let value = match self {\n   65              Self::Responses => \"responses\",\n   66          };\n   67          f.write_str(value)\n   68      }\n   69  }\n   70  \n   71  impl<'de> Deserialize<'de> for WireApi {\n   72      fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>\n   73      where\n   74          D: serde::Deserializer<'de>,\n   75      {\n   76          let value = String::deserialize(deserializer)?;\n   77          match value.as_str() {\n   78              \"responses\" => Ok(Self::Responses),\n   79              \"chat\" => Err(serde::de::Error::custom(CHAT_WIRE_API_REMOVED_ERROR)),\n   80              _ => Err(serde::de::Error::unknown_variant(&value, &[\"responses\"])),\n   81          }\n   82      }\n   83  }",
          "findingId": "codex-provider-001",
          "title": "模型协议只保留 Responses API，但 Provider 端点与认证可扩展"
        }
      ],
      [
        "tools",
        "codex-rs/core/src/tools/registry.rs",
        {
          "path": "codex-rs/core/src/tools/registry.rs",
          "start": 48,
          "end": 149,
          "snippet": "   48  \n   49  /// Typed runtime contract for locally executed tools.\n   50  ///\n   51  /// Implementers provide the shared `ToolExecutor` behavior plus optional\n   52  /// core-owned metadata for hooks, telemetry, tool search, and argument diffs.\n   53  pub(crate) trait CoreToolRuntime: ToolExecutor<ToolInvocation> {\n   54      /// Returns a shared spec when both the spec and search metadata are immutable.\n   55      fn immutable_spec(&self) -> Option<&Arc<ToolSpec>> {\n   56          None\n   57      }\n   58  \n   59      /// Returns lazily cached Code Mode definitions owned by this runtime.\n   60      fn cached_code_mode_definitions(&self) -> Option<&[codex_code_mode::ToolDefinition]> {\n   61          None\n   62      }\n   63  \n   64      /// Returns a readiness wait for this exact tool before taking the execution gate.\n   65      fn wait_until_ready<'a>(&'a self, _session: &'a Arc<Session>) -> Option<BoxFuture<'a, ()>> {\n   66          None\n   67      }\n   68  \n   69      /// Returns the owning server only for MCP-backed tool runtimes.\n   70      fn mcp_server_name(&self) -> Option<&str> {\n   71          None\n   72      }\n   73  \n   74      fn matches_kind(&self, payload: &ToolPayload) -> bool {\n   75          matches!(\n   76              payload,\n   77              ToolPayload::Function { .. } | ToolPayload::ToolSearch { .. }",
          "findingId": "codex-tools-001",
          "title": "工具有统一 typed runtime 契约，hooks、观测和流式参数 diff 都是一级能力"
        }
      ],
      [
        "context",
        "codex-rs/core/src/context_manager/history.rs",
        {
          "path": "codex-rs/core/src/context_manager/history.rs",
          "start": 38,
          "end": 60,
          "snippet": "   38  use std::ops::Deref;\n   39  use std::sync::Arc;\n   40  use std::sync::LazyLock;\n   41  \n   42  /// Transcript of thread history\n   43  #[derive(Debug, Clone, Default)]\n   44  pub(crate) struct ContextManager {\n   45      /// The oldest items are at the beginning of the vector. Snapshots share the vector until a\n   46      /// caller needs to mutate it, avoiding deep copies for read-only history consumers.\n   47      items: Arc<Vec<ResponseItemEnvelope>>,\n   48      /// Bumped whenever history is rewritten, such as compaction or rollback.\n   49      history_version: u64,\n   50      token_info: Option<TokenUsageInfo>,\n   51      /// Reference context snapshot used for diffing and producing model-visible\n   52      /// settings update items.\n   53      ///\n   54      /// This is the baseline for the next regular model turn, and may already\n   55      /// match the current turn after context updates are persisted.\n   56      ///\n   57      /// When this is `None`, settings diffing treats the next turn as having no\n   58      /// baseline and emits a full reinjection of context state. Rollback may\n   59      /// also clear this when it trims a mixed initial-context developer bundle\n   60      /// whose non-diff fragments no longer exist in the surviving history.",
          "findingId": "codex-context-001",
          "title": "历史是带版本号的 Copy-on-Write 账本，不是随手拼接的消息数组"
        }
      ],
      [
        "security",
        "codex-rs/protocol/src/protocol.rs",
        {
          "path": "codex-rs/protocol/src/protocol.rs",
          "start": 890,
          "end": 932,
          "snippet": "  890              Self::RunUserShellCommand { .. } => \"run_user_shell_command\",\n  891          }\n  892      }\n  893  }\n  894  \n  895  /// Determines the conditions under which the user is consulted to approve\n  896  /// running the command proposed by Codex.\n  897  #[derive(\n  898      Debug,\n  899      Clone,\n  900      Copy,\n  901      Default,\n  902      PartialEq,\n  903      Eq,\n  904      Hash,\n  905      Serialize,\n  906      Deserialize,\n  907      Display,\n  908      JsonSchema,\n  909      TS,\n  910  )]\n  911  #[serde(rename_all = \"kebab-case\")]\n  912  #[strum(serialize_all = \"kebab-case\")]\n  913  pub enum AskForApproval {\n  914      /// Under this policy, only \"known safe\" commands—as determined by\n  915      /// `is_safe_command()`—that **only read files** are auto‑approved.\n  916      /// Everything else will ask the user to approve.\n  917      #[serde(rename = \"untrusted\")]\n  918      #[strum(serialize = \"untrusted\")]\n  919      UnlessTrusted,",
          "findingId": "codex-permission-001",
          "title": "审批策略把“何时问”与“允许做什么”分成两条轴"
        }
      ],
      [
        "ecosystem",
        "codex-rs/codex-mcp/src/connection_manager.rs",
        {
          "path": "codex-rs/codex-mcp/src/connection_manager.rs",
          "start": 66,
          "end": 117,
          "snippet": "   66  use codex_protocol::protocol::McpStartupFailure;\n   67  use codex_protocol::protocol::McpStartupFailureReason;\n   68  use codex_protocol::protocol::McpStartupStatus;\n   69  use codex_protocol::protocol::McpStartupUpdateEvent;\n   70  use codex_rmcp_client::determine_streamable_http_auth_status_from_credentials;\n   71  use tokio::sync::Mutex;\n   72  use tokio::sync::RwLock;\n   73  use tokio::sync::watch;\n   74  use tokio::task::JoinSet;\n   75  use tracing::warn;\n   76  \n   77  static LIVE_CONNECTIONS: Gauge = Gauge::new(\"mcp.connections.live\");\n   78  \n   79  pub(crate) struct McpServerConnection {\n   80      identity: Option<McpServerConnectionIdentity>,\n   81      client: AsyncManagedClient,\n   82      startup_trigger: Option<watch::Sender<bool>>,\n   83      _diagnostics_guard: GaugeGuard,\n   84  }\n   85  \n   86  impl McpServerConnection {\n   87      async fn reusable_client(\n   88          &self,\n   89          desired: &McpServerConnectionIdentity,\n   90      ) -> Option<ManagedClient> {\n   91          let current = self.identity.as_ref()?;\n   92          if !current.has_same_connection_config(desired) {\n   93              return None;\n   94          }\n   95          if !self.client.startup_complete.load(Ordering::Acquire) {",
          "findingId": "codex-mcp-001",
          "title": "MCP 是带复用、认证、required gate 和 catalog revision 的运行时"
        }
      ],
      [
        "collaboration",
        "codex-rs/core/src/agent/control.rs",
        {
          "path": "codex-rs/core/src/agent/control.rs",
          "start": 70,
          "end": 111,
          "snippet": "   70      FullHistory,\n   71      LastNTurns(usize),\n   72  }\n   73  \n   74  #[derive(Clone, Debug, Default)]\n   75  pub(crate) struct SpawnAgentOptions {\n   76      pub(crate) fork_parent_spawn_call_id: Option<String>,\n   77      pub(crate) fork_mode: Option<SpawnAgentForkMode>,\n   78      pub(crate) parent_thread_id: Option<ThreadId>,\n   79      pub(crate) parent_turn_id: Option<String>,\n   80      pub(crate) root_turn_id: Option<String>,\n   81      pub(crate) environments: Option<Vec<TurnEnvironmentSelection>>,\n   82  }\n   83  \n   84  #[derive(Clone, Debug)]\n   85  pub(crate) struct LiveAgent {\n   86      pub(crate) thread_id: ThreadId,\n   87      pub(crate) metadata: AgentMetadata,\n   88      pub(crate) status: AgentStatus,\n   89  }\n   90  \n   91  #[derive(Clone, Debug, Serialize, PartialEq, Eq)]\n   92  pub(crate) struct ListedAgent {\n   93      pub(crate) agent_name: String,\n   94      pub(crate) agent_status: AgentStatus,\n   95  }\n   96  \n   97  /// Control-plane handle for multi-agent operations.\n   98  /// `AgentControl` is held by each session (via `SessionServices`). It provides capability to\n   99  /// spawn new agents and the inter-agent communication layer.",
          "findingId": "codex-agent-001",
          "title": "多 Agent 是共享控制面的线程树，不是主循环里的递归函数"
        }
      ],
      [
        "evidence",
        "codex-rs/rollout/src/recorder.rs",
        {
          "path": "codex-rs/rollout/src/recorder.rs",
          "start": 93,
          "end": 171,
          "snippet": "   93  #[derive(Clone)]\n   94  #[allow(clippy::large_enum_variant)]\n   95  pub enum RolloutRecorderParams {\n   96      Create {\n   97          session_id: SessionId,\n   98          conversation_id: ThreadId,\n   99          /// Overrides the rollout ID encoded in the filename.\n  100          ///\n  101          /// Normally this is `None`, so the filename is\n  102          /// `rollout-<timestamp>-<conversation_id>.jsonl`. `thread/revert` sets it, producing\n  103          /// `rollout-<timestamp>-<conversation_id>_<rollout_id>.jsonl`, because revert keeps the\n  104          /// thread ID stable while creating a new immutable rollout file.\n  105          rollout_id_override: Option<RolloutId>,\n  106          forked_from_id: Option<ThreadId>,\n  107          parent_thread_id: Option<ThreadId>,\n  108          source: Box<SessionSource>,\n  109          thread_source: Option<ThreadSource>,\n  110          originator: String,\n  111          base_instructions: BaseInstructions,\n  112          dynamic_tools: Vec<DynamicToolSpec>,\n  113          selected_capability_roots: Vec<SelectedCapabilityRoot>,\n  114          multi_agent_version: Option<MultiAgentVersion>,\n  115          history_mode: ThreadHistoryMode,\n  116          history_base: Option<HistoryPosition>,\n  117          subagent_history_start_ordinal: Option<u64>,\n  118          initial_window_id: Option<String>,\n  119      },\n  120      Resume {\n  121          path: PathBuf,\n  122      },",
          "findingId": "codex-persistence-001",
          "title": "会话采用 JSONL rollout 作为事件事实源，后台 writer 支持 persist、flush 与失败记忆"
        }
      ]
    ]
  },
  {
    "slug": "gemini-cli",
    "name": "Gemini CLI",
    "repo": "google-gemini/gemini-cli",
    "branch": "main",
    "commit": "1ac3377395868295e128b96726d605a900b5946b",
    "date": "2026-08-12T16:21:42Z",
    "language": "TypeScript / Markdown / JavaScript",
    "kind": "Legacy source-backed harness audit",
    "legacy": true,
    "zh": {
      "thesis": "Gemini CLI 的既有源码账本覆盖 8 个 Harness 维度；这次迁移把原有事实重新排成单页分析和十章教程，不把 README 当作实现证据。",
      "strengths": [
        "一次用户请求可以连续让模型说、用工具、再说；但最多转 100 圈，避免无尽自言自语。",
        "开口前先整理历史、确认装得下、保证工具回执不被编辑器消息插队，然后才选本轮模型和工具箱。",
        "第一次怀疑绕圈会给模型一次纠偏机会，第二次还绕就停。"
      ],
      "limits": [
        "当前页面复用既有源码账本；迁移到自研前仍需做部署级验证",
        "当前页面复用既有源码账本；迁移到自研前仍需做部署级验证",
        "当前页面复用既有源码账本；迁移到自研前仍需做部署级验证"
      ],
      "lesson": "一次用户请求可以连续让模型说、用工具、再说；但最多转 100 圈，避免无尽自言自语。"
    },
    "en": {
      "thesis": "The existing source ledger for Gemini CLI covers 8 Harness dimensions. This migration reshapes those facts into a single analysis page and ten standalone chapters instead of treating README claims as implementation evidence.",
      "strengths": [
        "Pinned source findings expose the control loop",
        "Context, tools, and policy are separated into reviewable dimensions",
        "Each chapter keeps a file and line-range trail"
      ],
      "limits": [
        "This snapshot reuses the prior source ledger and its pinned commit",
        "Deployment-level behavior still needs a fresh run",
        "Legacy findings should be re-audited when the repository moves"
      ],
      "lesson": "Read the implementation as input, state, tool effect, receipt, and recovery—not as a feature list."
    },
    "anchors": [
      [
        "overview",
        "packages/core/src/core/client.ts",
        {
          "path": "packages/core/src/core/client.ts",
          "start": 79,
          "end": 111,
          "snippet": "   79  const MAX_TURNS = 100;\n   80  \n   81  type BeforeAgentHookReturn =\n   82    | {\n   83        type: GeminiEventType.AgentExecutionStopped;\n   84        value: { reason: string; systemMessage?: string };\n   85      }\n   86    | {\n   87        type: GeminiEventType.AgentExecutionBlocked;\n   88        value: { reason: string; systemMessage?: string };\n   89      }\n   90    | { additionalContext: string | undefined }\n   91    | undefined;\n   92  \n   93  export class GeminiClient {\n   94    private chat?: GeminiChat;\n   95    private sessionTurnCount = 0;\n   96  \n   97    private readonly loopDetector: LoopDetectionService;\n   98    private readonly compressionService: ChatCompressionService;\n   99    private readonly agentHistoryProvider: AgentHistoryProvider;\n  100    private readonly toolOutputMaskingService: ToolOutputMaskingService;\n  101    private contextManager?: ContextManager;\n  102    private lastPromptId: string;\n  103    private currentSequenceModel: string | null = null;\n  104    private lastSentIdeContext: IdeContext | undefined;\n  105    private forceFullIdeContext = true;\n  106  \n  107    /**\n  108     * At any point in this conversation, was compression triggered without",
          "findingId": "gemini-loop-001",
          "title": "主 Harness 用递归 sendMessageStream 驱动多 turn，硬上限为 100"
        }
      ],
      [
        "architecture",
        "packages/core/src/core/client.ts",
        {
          "path": "packages/core/src/core/client.ts",
          "start": 614,
          "end": 715,
          "snippet": "  614    private async *processTurn(\n  615      request: PartListUnion,\n  616      signal: AbortSignal,\n  617      prompt_id: string,\n  618      boundedTurns: number,\n  619      displayContent?: PartListUnion,\n  620    ): AsyncGenerator<ServerGeminiStreamEvent, Turn> {\n  621      // Re-initialize turn (it was empty before if in loop, or new instance)\n  622      let turn = new Turn(this.getChat(), prompt_id);\n  623  \n  624      this.sessionTurnCount++;\n  625      if (\n  626        this.config.getMaxSessionTurns() > 0 &&\n  627        this.sessionTurnCount > this.config.getMaxSessionTurns()\n  628      ) {\n  629        yield { type: GeminiEventType.MaxSessionTurns };\n  630        return turn;\n  631      }\n  632  \n  633      if (!boundedTurns) {\n  634        return turn;\n  635      }\n  636  \n  637      // Check for context window overflow\n  638      const modelForLimitCheck = this._getActiveModelForCurrentTurn();\n  639  \n  640      let currentBaseUnits = 0;\n  641      let apiHistoryOverride: Content[] | undefined = undefined;\n  642  \n  643      if (this.config.getContextManagementConfig().enabled) {",
          "findingId": "gemini-loop-002",
          "title": "每轮先做上下文、溢出、IDE 配对和 loop 检测，再锁定模型与工具"
        }
      ],
      [
        "loop",
        "packages/core/src/core/client.ts",
        {
          "path": "packages/core/src/core/client.ts",
          "start": 744,
          "end": 763,
          "snippet": "  744      // Re-initialize turn with fresh history\n  745      turn = new Turn(this.getChat(), prompt_id);\n  746  \n  747      const loopResult = await this.loopDetector.turnStarted(signal);\n  748      if (loopResult.count > 1) {\n  749        yield { type: GeminiEventType.LoopDetected };\n  750        return turn;\n  751      } else if (loopResult.count === 1) {\n  752        if (boundedTurns <= 1) {\n  753          yield { type: GeminiEventType.MaxSessionTurns };\n  754          return turn;\n  755        }\n  756        return yield* this._recoverFromLoop(\n  757          loopResult,\n  758          signal,\n  759          prompt_id,\n  760          boundedTurns,\n  761          displayContent,\n  762        );\n  763      }",
          "findingId": "gemini-loop-003",
          "title": "循环检测能先恢复一次，再判定硬循环"
        }
      ],
      [
        "model",
        "packages/core/src/core/contentGenerator.ts",
        {
          "path": "packages/core/src/core/contentGenerator.ts",
          "start": 35,
          "end": 70,
          "snippet": "   35  \n   36  /**\n   37   * Interface abstracting the core functionalities for generating content and counting tokens.\n   38   */\n   39  export interface ContentGenerator {\n   40    generateContent(\n   41      request: GenerateContentParameters,\n   42      userPromptId: string,\n   43      role: LlmRole,\n   44    ): Promise<GenerateContentResponse>;\n   45  \n   46    generateContentStream(\n   47      request: GenerateContentParameters,\n   48      userPromptId: string,\n   49      role: LlmRole,\n   50    ): Promise<AsyncGenerator<GenerateContentResponse>>;\n   51  \n   52    countTokens(request: CountTokensParameters): Promise<CountTokensResponse>;\n   53  \n   54    embedContent(request: EmbedContentParameters): Promise<EmbedContentResponse>;\n   55  \n   56    userTier?: UserTierId;\n   57  \n   58    userTierName?: string;\n   59  \n   60    paidTier?: GeminiUserTier;\n   61  }\n   62  \n   63  export enum AuthType {\n   64    LOGIN_WITH_GOOGLE = 'oauth-personal',",
          "findingId": "gemini-provider-001",
          "title": "统一 ContentGenerator 契约覆盖流式、非流式、计数与 embedding"
        }
      ],
      [
        "tools",
        "packages/core/src/core/turn.ts",
        {
          "path": "packages/core/src/core/turn.ts",
          "start": 236,
          "end": 320,
          "snippet": "  236    | ServerGeminiContentEvent\n  237    | ServerGeminiErrorEvent\n  238    | ServerGeminiFinishedEvent\n  239    | ServerGeminiLoopDetectedEvent\n  240    | ServerGeminiMaxSessionTurnsEvent\n  241    | ServerGeminiThoughtEvent\n  242    | ServerGeminiToolCallConfirmationEvent\n  243    | ServerGeminiToolCallRequestEvent\n  244    | ServerGeminiToolCallResponseEvent\n  245    | ServerGeminiUserCancelledEvent\n  246    | ServerGeminiRetryEvent\n  247    | ServerGeminiContextWindowWillOverflowEvent\n  248    | ServerGeminiInvalidStreamEvent\n  249    | ServerGeminiModelInfoEvent\n  250    | ServerGeminiAgentExecutionStoppedEvent\n  251    | ServerGeminiAgentExecutionBlockedEvent;\n  252  \n  253  // A turn manages the agentic loop turn within the server context.\n  254  export class Turn {\n  255    private callCounter = 0;\n  256  \n  257    readonly pendingToolCalls: ToolCallRequestInfo[] = [];\n  258    private debugResponses: GenerateContentResponse[] = [];\n  259    private pendingCitations = new Set<string>();\n  260    private cachedResponseText: string | undefined = undefined;\n  261    finishReason: FinishReason | undefined = undefined;\n  262    private hasLoggedRagTrace = false;\n  263  \n  264    constructor(\n  265      private readonly chat: GeminiChat,",
          "findingId": "gemini-tools-001",
          "title": "Turn 只解析模型流，工具执行交给独立 event-driven Scheduler"
        }
      ],
      [
        "context",
        "packages/core/src/context/chatCompressionService.ts",
        {
          "path": "packages/core/src/context/chatCompressionService.ts",
          "start": 37,
          "end": 52,
          "snippet": "   37  /**\n   38   * Default threshold for compression token count as a fraction of the model's\n   39   * token limit. If the chat history exceeds this threshold, it will be compressed.\n   40   */\n   41  const DEFAULT_COMPRESSION_TOKEN_THRESHOLD = 0.5;\n   42  \n   43  /**\n   44   * The fraction of the latest chat history to keep. A value of 0.3\n   45   * means that only the last 30% of the chat history will be kept after compression.\n   46   */\n   47  const COMPRESSION_PRESERVE_THRESHOLD = 0.3;\n   48  \n   49  /**\n   50   * The budget for function response tokens in the preserved history.\n   51   */\n   52  const COMPRESSION_FUNCTION_RESPONSE_TOKEN_BUDGET = 50_000;",
          "findingId": "gemini-context-001",
          "title": "Legacy 压缩默认在 50% 窗口触发，并保留最近约 30%"
        }
      ],
      [
        "security",
        "packages/core/src/policy/policy-engine.ts",
        {
          "path": "packages/core/src/policy/policy-engine.ts",
          "start": 49,
          "end": 195,
          "snippet": "   49  function isWildcardPattern(name: string): boolean {\n   50    return name === '*' || name.includes('*');\n   51  }\n   52  \n   53  /**\n   54   * Checks if a tool call matches a wildcard pattern.\n   55   * Supports global (*) and the explicit MCP (*mcp_serverName_**) format.\n   56   */\n   57  function matchesWildcard(\n   58    pattern: string,\n   59    toolName: string,\n   60    serverName: string | undefined,\n   61  ): boolean {\n   62    if (pattern === '*') {\n   63      return true;\n   64    }\n   65  \n   66    if (pattern === `${MCP_TOOL_PREFIX}*`) {\n   67      return serverName !== undefined;\n   68    }\n   69  \n   70    if (pattern.startsWith(MCP_TOOL_PREFIX) && pattern.endsWith('_*')) {\n   71      const expectedServerName = pattern.slice(MCP_TOOL_PREFIX.length, -2);\n   72      // 1. Must be an MCP tool call (has serverName)\n   73      // 2. Server name must match\n   74      // 3. Tool name must be properly qualified by that server\n   75      if (serverName === undefined || serverName !== expectedServerName) {\n   76        return false;\n   77      }\n   78      return toolName.startsWith(`${MCP_TOOL_PREFIX}${expectedServerName}_`);",
          "findingId": "gemini-policy-001",
          "title": "PolicyEngine 按优先级匹配工具、参数、MCP 身份、annotations、模式、交互状态和 subagent"
        }
      ],
      [
        "ecosystem",
        "packages/core/src/tools/mcp-client.ts",
        {
          "path": "packages/core/src/tools/mcp-client.ts",
          "start": 188,
          "end": 292,
          "snippet": "  188    async connect(): Promise<void> {\n  189      if (this.status !== MCPServerStatus.DISCONNECTED) {\n  190        throw new Error(\n  191          `Can only connect when the client is disconnected, current state is ${this.status}`,\n  192        );\n  193      }\n  194      this.updateStatus(MCPServerStatus.CONNECTING);\n  195      try {\n  196        this.client = await connectToMcpServer(\n  197          this.clientVersion,\n  198          this.serverName,\n  199          this.serverConfig,\n  200          this.debugMode,\n  201          this.workspaceContext,\n  202          this.cliConfig,\n  203        );\n  204  \n  205        this.registerNotificationHandlers();\n  206  \n  207        const originalOnError = this.client.onerror;\n  208        this.client.onerror = (error) => {\n  209          if (this.status !== MCPServerStatus.CONNECTED) {\n  210            return;\n  211          }\n  212          if (originalOnError) originalOnError(error);\n  213          this.cliConfig.emitMcpDiagnostic(\n  214            'error',\n  215            `MCP ERROR (${this.serverName})`,\n  216            error,\n  217            this.serverName,",
          "findingId": "gemini-mcp-001",
          "title": "MCP 支持 stdio、Streamable HTTP、SSE fallback、OAuth、动态目录刷新和 progress"
        }
      ],
      [
        "collaboration",
        "packages/core/src/agent/agent-session.ts",
        {
          "path": "packages/core/src/agent/agent-session.ts",
          "start": 14,
          "end": 69,
          "snippet": "   14  /**\n   15   * AgentSession is a wrapper around AgentProtocol that provides a more\n   16   * convenient API for consuming agent activity as an AsyncIterable.\n   17   */\n   18  export class AgentSession implements AgentProtocol {\n   19    private _protocol: AgentProtocol;\n   20  \n   21    constructor(protocol: AgentProtocol) {\n   22      this._protocol = protocol;\n   23    }\n   24  \n   25    async send(payload: AgentSend): Promise<{ streamId: string | null }> {\n   26      return this._protocol.send(payload);\n   27    }\n   28  \n   29    subscribe(callback: (event: AgentEvent) => void): Unsubscribe {\n   30      return this._protocol.subscribe(callback);\n   31    }\n   32  \n   33    async abort(): Promise<void> {\n   34      return this._protocol.abort();\n   35    }\n   36  \n   37    get events(): readonly AgentEvent[] {\n   38      return this._protocol.events;\n   39    }\n   40  \n   41    /**\n   42     * Sends a payload to the agent and returns an AsyncIterable that yields\n   43     * events for the resulting stream.",
          "findingId": "gemini-agent-001",
          "title": "子 Agent 统一为可订阅、可重放、可中止的 AgentProtocol"
        }
      ],
      [
        "evidence",
        "packages/core/src/services/chatRecordingService.ts",
        {
          "path": "packages/core/src/services/chatRecordingService.ts",
          "start": 150,
          "end": 203,
          "snippet": "  150    try {\n  151      const fileStream = fs.createReadStream(filePath);\n  152      const rl = readline.createInterface({\n  153        input: fileStream,\n  154        crlfDelay: Infinity,\n  155      });\n  156  \n  157      let metadata: Partial<ConversationRecord> = {};\n  158      const messagesMap = new Map<string, MessageRecord>();\n  159      const messageIds: string[] = [];\n  160      const messageKinds = new Map<\n  161        string,\n  162        { isUser: boolean; isResumable: boolean }\n  163      >();\n  164      let isTrackingMemoryScratchpadFreshness = false;\n  165      let memoryScratchpadIsStale = false;\n  166      let firstUserMessageStr: string | undefined;\n  167  \n  168      for await (const line of rl) {\n  169        if (!line.trim()) continue;\n  170        try {\n  171          const record = JSON.parse(line) as unknown;\n  172          if (isRewindRecord(record)) {\n  173            if (isTrackingMemoryScratchpadFreshness) {\n  174              memoryScratchpadIsStale = true;\n  175            }\n  176            const rewindId = record.$rewindTo;\n  177            if (options?.metadataOnly) {\n  178              const idx = messageIds.indexOf(rewindId);\n  179              if (idx !== -1) {",
          "findingId": "gemini-persistence-001",
          "title": "会话记录是增量 JSONL，支持 rewind、metadata patch 和完整 checkpoint"
        }
      ]
    ]
  },
  {
    "slug": "jcode",
    "name": "JCode",
    "repo": "1jehuang/jcode",
    "branch": "master",
    "commit": "71fa60c4dc875ebdaf089e6e84b29cbd61cbb478",
    "date": "2026-08-12T17:42:03-07:00",
    "language": "Rust / Python / Markdown",
    "kind": "Legacy source-backed harness audit",
    "legacy": true,
    "zh": {
      "thesis": "JCode 的既有源码账本覆盖 9 个 Harness 维度；这次迁移把原有事实重新排成单页分析和十章教程，不把 README 当作实现证据。",
      "strengths": [
        "模型还没开口，用户输入已经落账；即使后面 API 或工具出错，恢复时也不会连问题本身都丢掉。",
        "每次再问模型前先查账：工具有没有开单不回执、旧历史是否已折叠、这一轮工具箱和提示词是否稳定。",
        "网络半路断了，不把前半句和前半个工具调用留在账上；先橡皮擦掉，再从头重放。"
      ],
      "limits": [
        "当前页面复用既有源码账本；迁移到自研前仍需做部署级验证",
        "当前页面复用既有源码账本；迁移到自研前仍需做部署级验证",
        "当前页面复用既有源码账本；迁移到自研前仍需做部署级验证"
      ],
      "lesson": "模型还没开口，用户输入已经落账；即使后面 API 或工具出错，恢复时也不会连问题本身都丢掉。"
    },
    "en": {
      "thesis": "The existing source ledger for JCode covers 9 Harness dimensions. This migration reshapes those facts into a single analysis page and ten standalone chapters instead of treating README claims as implementation evidence.",
      "strengths": [
        "Pinned source findings expose the control loop",
        "Context, tools, and policy are separated into reviewable dimensions",
        "Each chapter keeps a file and line-range trail"
      ],
      "limits": [
        "This snapshot reuses the prior source ledger and its pinned commit",
        "Deployment-level behavior still needs a fresh run",
        "Legacy findings should be re-audited when the repository moves"
      ],
      "lesson": "Read the implementation as input, state, tool effect, receipt, and recovery—not as a feature list."
    },
    "anchors": [
      [
        "overview",
        "crates/jcode-app-core/src/agent/turn_execution.rs",
        {
          "path": "crates/jcode-app-core/src/agent/turn_execution.rs",
          "start": 4,
          "end": 35,
          "snippet": "    4  impl Agent {\n    5      /// Run a single turn with the given user message\n    6      pub async fn run_once(&mut self, user_message: &str) -> Result<()> {\n    7          self.add_message(\n    8              Role::User,\n    9              vec![ContentBlock::Text {\n   10                  text: user_message.to_string(),\n   11                  cache_control: None,\n   12              }],\n   13          );\n   14          self.session.save()?;\n   15          if trace_enabled() {\n   16              eprintln!(\"[trace] session_id {}\", self.session.id);\n   17          }\n   18          let _ = self.run_turn(true).await?;\n   19          Ok(())\n   20      }\n   21  \n   22      pub async fn run_once_capture(&mut self, user_message: &str) -> Result<String> {\n   23          self.run_once_capture_with_display_role(user_message, None)\n   24              .await\n   25      }\n   26  \n   27      pub(crate) async fn run_once_capture_with_display_role(\n   28          &mut self,\n   29          user_message: &str,\n   30          display_role: Option<crate::session::StoredDisplayRole>,\n   31      ) -> Result<String> {\n   32          self.add_message_with_display_role(\n   33              Role::User,",
          "findingId": "jcode-loop-001",
          "title": "每个用户 turn 先写盘，再进入可恢复的流式循环"
        }
      ],
      [
        "architecture",
        "crates/jcode-app-core/src/agent/turn_loops.rs",
        {
          "path": "crates/jcode-app-core/src/agent/turn_loops.rs",
          "start": 17,
          "end": 68,
          "snippet": "   17      const BATCH_NUDGE: &str = \"<system-reminder>Several tool calls have been made one at a time. If the next independent operations can run concurrently, use the batch tool instead of making more sequential calls. Keep sequential calls when one result is required to decide the next operation.</system-reminder>\";\n   18  \n   19      fn update_sequential_tool_rounds(current: u32, tool_count: usize, used_batch: bool) -> u32 {\n   20          if tool_count == 1 && !used_batch {\n   21              current.saturating_add(1)\n   22          } else {\n   23              0\n   24          }\n   25      }\n   26  \n   27      fn should_inject_batch_nudge(pending: bool, batch_available: bool) -> bool {\n   28          pending && batch_available\n   29      }\n   30  \n   31      pub(super) async fn run_turn(&mut self, print_output: bool) -> Result<String> {\n   32          self.set_log_context();\n   33          crate::session_metrics::record_turn(&self.session.id);\n   34          // Mark this session as actively streaming for presence UIs (e.g. the\n   35          // macOS menu bar indicator). Cleared automatically on every exit path.\n   36          let _streaming_guard = crate::session::StreamingGuard::new(self.session.id.clone());\n   37          // Register this turn's cancel signal so session-level cancels reach\n   38          // this in-flight turn even through stale control handles (issue #428).\n   39          let _turn_cancel_guard = crate::turn_cancel_registry::register_active_turn(\n   40              &self.session.id,\n   41              self.graceful_shutdown.clone(),\n   42          );\n   43          let mut final_text = String::new();\n   44          let trace = trace_enabled();\n   45          let mut context_limit_retries = 0u32;\n   46          let mut incomplete_continuations = 0u32;",
          "findingId": "jcode-loop-002",
          "title": "循环在每次请求前修复工具配对并重建稳定快照"
        }
      ],
      [
        "loop",
        "crates/jcode-app-core/src/agent/turn_loops.rs",
        {
          "path": "crates/jcode-app-core/src/agent/turn_loops.rs",
          "start": 455,
          "end": 484,
          "snippet": "  455                                  usage_cache_read,\n  456                                  usage_cache_creation,\n  457                              );\n  458                          }\n  459                          if trace {\n  460                              eprintln!(\n  461                                  \"[trace] token_usage input={} output={} cache_read={} cache_write={}\",\n  462                                  usage_input.unwrap_or(0),\n  463                                  usage_output.unwrap_or(0),\n  464                                  usage_cache_read.unwrap_or(0),\n  465                                  usage_cache_creation.unwrap_or(0)\n  466                              );\n  467                          }\n  468                      }\n  469                      StreamEvent::ConnectionType { connection } => {\n  470                          if trace {\n  471                              eprintln!(\"[trace] connection_type={}\", connection);\n  472                          }\n  473                          crate::telemetry::record_connection_type(&connection);\n  474                          self.last_connection_type = Some(connection);\n  475                      }\n  476                      StreamEvent::ConnectionPhase { phase } => {\n  477                          if trace {\n  478                              eprintln!(\"[trace] connection_phase={}\", phase);\n  479                          }\n  480                      }\n  481                      StreamEvent::StatusDetail { detail } => {\n  482                          if trace {\n  483                              eprintln!(\"[trace] status_detail={}\", detail);\n  484                          }",
          "findingId": "jcode-loop-003",
          "title": "中途断流先撤销半截状态再完整重播"
        }
      ],
      [
        "model",
        "crates/jcode-provider-core/src/lib.rs",
        {
          "path": "crates/jcode-provider-core/src/lib.rs",
          "start": 76,
          "end": 126,
          "snippet": "   76  pub trait Provider: Send + Sync {\n   77      /// Send messages and get a streaming response.\n   78      /// resume_session_id: Optional session ID to resume a previous conversation (provider-specific).\n   79      async fn complete(\n   80          &self,\n   81          messages: &[Message],\n   82          tools: &[ToolDefinition],\n   83          system: &str,\n   84          resume_session_id: Option<&str>,\n   85      ) -> Result<EventStream>;\n   86  \n   87      /// Send messages with split system prompt for better caching.\n   88      async fn complete_split(\n   89          &self,\n   90          messages: &[Message],\n   91          tools: &[ToolDefinition],\n   92          system_static: &str,\n   93          system_dynamic: &str,\n   94          resume_session_id: Option<&str>,\n   95      ) -> Result<EventStream> {\n   96          let dynamic_messages = messages_with_dynamic_system_context(messages, system_dynamic);\n   97          self.complete(&dynamic_messages, tools, system_static, resume_session_id)\n   98              .await\n   99      }\n  100  \n  101      /// Get the provider name.\n  102      ///\n  103      /// This is the stable, machine-facing identifier (e.g. `\"openrouter\"`,\n  104      /// `\"claude\"`). Several surfaces key billing and routing decisions off this\n  105      /// value, so it must stay constant for a given provider class even when the",
          "findingId": "jcode-provider-001",
          "title": "Provider 契约不仅抽象生成，还抽象认证、路由、transport 与原生能力"
        }
      ],
      [
        "tools",
        "crates/jcode-tool-core/src/lib.rs",
        {
          "path": "crates/jcode-tool-core/src/lib.rs",
          "start": 9,
          "end": 65,
          "snippet": "    9  pub const TOOL_INTENT_DESCRIPTION: &str =\n   10      \"Required short label shown in the UI: why this call is being made.\";\n   11  \n   12  /// Input key a caller sets to accept the token cost of an oversized result.\n   13  ///\n   14  /// The context guard withholds any tool result too large for the remaining\n   15  /// context and states its token cost. Setting this repeats the call and spends\n   16  /// that cost deliberately. Kept in sync with the registry constant of the same\n   17  /// name, which reads the flag off raw tool input.\n   18  pub const ACCEPT_LARGE_OUTPUT_KEY: &str = \"accept_large_output\";\n   19  \n   20  /// Deliberately terse: this rides on every tool schema on every request, so\n   21  /// each word is paid forever. The full explanation lives in the refusal\n   22  /// message, which is only ever shown when it is actually relevant.\n   23  pub const ACCEPT_LARGE_OUTPUT_DESCRIPTION: &str =\n   24      \"Re-run accepting the stated token cost of a withheld result.\";\n   25  \n   26  pub fn intent_schema_property() -> Value {\n   27      serde_json::json!({\n   28          \"type\": \"string\",\n   29          \"description\": TOOL_INTENT_DESCRIPTION,\n   30      })\n   31  }\n   32  \n   33  pub fn accept_large_output_schema_property() -> Value {\n   34      serde_json::json!({\n   35          \"type\": \"boolean\",\n   36          \"description\": ACCEPT_LARGE_OUTPUT_DESCRIPTION,\n   37      })\n   38  }",
          "findingId": "jcode-tools-001",
          "title": "工具是 typed registry，定义顺序与 intent 字段集中标准化"
        }
      ],
      [
        "context",
        "crates/jcode-base/src/prompt.rs",
        {
          "path": "crates/jcode-base/src/prompt.rs",
          "start": 451,
          "end": 557,
          "snippet": "  451          info.memory_chars = memory.len();\n  452          parts.push(memory.to_string());\n  453      }\n  454  \n  455      // Add available skills list\n  456      if !available_skills.is_empty() {\n  457          let mut skills_section = \"# Available Skills\\n\\nYou have access to the following skills that the user can invoke with `/skillname`:\\n\".to_string();\n  458          for skill in available_skills {\n  459              skills_section.push_str(&format!(\"\\n- `/{} ` - {}\", skill.name, skill.description));\n  460          }\n  461          skills_section.push_str(\n  462              \"\\n\\nWhen a user asks about available skills or capabilities, mention these skills.\",\n  463          );\n  464          info.skills_chars = skills_section.len();\n  465          parts.push(skills_section);\n  466      }\n  467  \n  468      // Add active skill prompt\n  469      if let Some(skill) = skill_prompt {\n  470          parts.push(format!(\"# Active Skill\\n\\n{}\", skill));\n  471      }\n  472  \n  473      let prompt = parts.join(\"\\n\\n\");\n  474      info.total_chars = prompt.len();\n  475  \n  476      (prompt, info)\n  477  }\n  478  \n  479  /// Build system prompt split into static (cacheable) and dynamic parts\n  480  /// This improves cache hit rate by keeping frequently-changing content separate",
          "findingId": "jcode-context-001",
          "title": "静态前缀与每轮动态上下文分离，memory 放尾部保缓存"
        }
      ],
      [
        "security",
        "crates/jcode-app-core/src/tool/mod.rs",
        {
          "path": "crates/jcode-app-core/src/tool/mod.rs",
          "start": 543,
          "end": 601,
          "snippet": "  543                      ));\n  544                  }\n  545              }\n  546          }\n  547  \n  548          fields\n  549      }\n  550  \n  551      /// Maximum fraction of context budget a single tool output may consume.\n  552      /// Outputs that would push total context beyond this are truncated.\n  553      const CONTEXT_GUARD_THRESHOLD: f32 = 0.90;\n  554  \n  555      /// Fire the `post_tool` observer hook with tool outcome metadata.\n  556      /// No-op (without building the payload) when the hook is not configured.\n  557      fn fire_post_tool_hook(\n  558          resolved_name: &str,\n  559          ctx: &ToolContext,\n  560          result: &Result<ToolOutput>,\n  561          latency_ms: u64,\n  562      ) {\n  563          if !crate::hooks::hook_configured(\"post_tool\") {\n  564              return;\n  565          }\n  566          let mut event = crate::hooks::HookEvent::new(\"post_tool\")\n  567              .session_id(ctx.session_id.clone())\n  568              .field(\"TOOL_NAME\", resolved_name)\n  569              .field(\"STATUS\", if result.is_ok() { \"ok\" } else { \"error\" })\n  570              .field(\"DURATION_MS\", latency_ms.to_string());\n  571          if let Some(dir) = &ctx.working_dir {\n  572              event = event.cwd(dir.display().to_string());",
          "findingId": "jcode-security-001",
          "title": "工具边界由 session allow/disable 与外部 pre_tool gate 双层控制"
        }
      ],
      [
        "ecosystem",
        "crates/jcode-base/src/mcp/manager.rs",
        {
          "path": "crates/jcode-base/src/mcp/manager.rs",
          "start": 1,
          "end": 59,
          "snippet": "    1  //! MCP Manager - manages MCP server connections for a single session.\n    2  //!\n    3  //! In daemon mode with a shared pool, servers marked `shared: true` (the default)\n    4  //! are managed by the pool and reused across sessions. Servers marked `shared: false`\n    5  //! (e.g., Playwright with browser state) are spawned per-session.\n    6  \n    7  use super::client::{McpClient, McpHandle};\n    8  use super::pool::SharedMcpPool;\n    9  use super::protocol::{McpConfig, McpServerConfig, McpToolDef, ToolCallResult};\n   10  use anyhow::{Context, Result};\n   11  use serde::Serialize;\n   12  use std::collections::HashMap;\n   13  use std::sync::Arc;\n   14  use tokio::sync::RwLock;\n   15  \n   16  /// Bound on how long a tool call will wait for a not-yet-connected MCP server\n   17  /// to come up before failing with a clean tool error. Keeps a slow/hanging\n   18  /// server from blocking a single tool call forever (and never blocks spawn).\n   19  const CONNECT_ON_CALL_TIMEOUT: std::time::Duration = std::time::Duration::from_secs(30);\n   20  \n   21  /// Meter a completed tool call for partner-discovery provenance. No-op for\n   22  /// servers without discovery provenance (the overwhelmingly common case) and\n   23  /// whenever `sponsors.enabled` is false. Counts only; never content.\n   24  fn meter_provenance_call(server: &str, result: &Result<ToolCallResult>) {\n   25      let is_error = match result {\n   26          Ok(res) => res.is_error,\n   27          Err(_) => true,\n   28      };\n   29      crate::sponsors::provenance::on_tool_call(server, is_error);\n   30  }",
          "findingId": "jcode-mcp-001",
          "title": "MCP 区分共享池与 session-owned client"
        }
      ],
      [
        "collaboration",
        "crates/jcode-app-core/src/server/swarm.rs",
        {
          "path": "crates/jcode-app-core/src/server/swarm.rs",
          "start": 1528,
          "end": 1613,
          "snippet": " 1528  pub(super) async fn run_swarm_task(\n 1529      agent: Arc<Mutex<Agent>>,\n 1530      description: &str,\n 1531      subagent_type: &str,\n 1532      prompt: &str,\n 1533  ) -> Result<String> {\n 1534      let started = Instant::now();\n 1535      let (provider, registry, session_id, working_dir, coordinator_model, provider_key, route) = {\n 1536          let agent = agent.lock().await;\n 1537          (\n 1538              agent.provider_fork(),\n 1539              agent.registry(),\n 1540              agent.session_id().to_string(),\n 1541              agent.working_dir().map(PathBuf::from),\n 1542              agent.provider_model(),\n 1543              agent.session_provider_key(),\n 1544              agent.session_route_api_method(),\n 1545          )\n 1546      };\n 1547      let parent_session_id = session_id.clone();\n 1548      let mut session = Session::create(\n 1549          Some(session_id),\n 1550          Some(format!(\"{} (@{} swarm)\", description, subagent_type)),\n 1551      );\n 1552      let child_session_id = session.id.clone();\n 1553      session.model = Some(coordinator_model);\n 1554      // Inherit the coordinator's exact auth identity so the forked worker keeps\n 1555      // the same provider/auth route (OAuth vs API, openai-compatible profile)\n 1556      // instead of silently falling back to the config default on persistence.\n 1557      session.provider_key = provider_key;",
          "findingId": "jcode-collab-001",
          "title": "轻量 swarm 先让协调者规划 2–4 个任务，再并发 fork Provider"
        }
      ],
      [
        "evidence",
        "crates/jcode-base/src/session/persistence.rs",
        {
          "path": "crates/jcode-base/src/session/persistence.rs",
          "start": 307,
          "end": 395,
          "snippet": "  307      /// This intentionally skips heavyweight transcript vectors so the remote\n  308      /// client can paint quickly while the server performs the authoritative\n  309      /// session restore + history bootstrap.\n  310      pub fn load_startup_stub(session_id: &str) -> Result<Self> {\n  311          let path = session_path(session_id)?;\n  312          let reader = BufReader::new(std::fs::File::open(&path)?);\n  313          let stub: SessionStartupStub = serde_json::from_reader(reader)?;\n  314          Ok(Self::session_from_startup_stub(stub))\n  315      }\n  316  \n  317      pub fn load_for_remote_startup(session_id: &str) -> Result<Self> {\n  318          let path = session_path(session_id)?;\n  319          let load_start = Instant::now();\n  320          let snapshot_bytes = file_len_or_zero(&path);\n  321          let snapshot_start = Instant::now();\n  322          let reader = BufReader::new(std::fs::File::open(&path)?);\n  323          let snapshot: RemoteStartupSessionSnapshot = serde_json::from_reader(reader)?;\n  324          let snapshot_ms = snapshot_start.elapsed().as_millis();\n  325          let mut session = Self::session_from_remote_startup_snapshot(snapshot);\n  326          let journal_path = session_journal_path_from_snapshot(&path);\n  327          let journal_bytes = file_len_or_zero(&journal_path);\n  328          let journal_start = Instant::now();\n  329          let mut journal_entries = 0usize;\n  330          replay_journal_lines(&journal_path, |entry| {\n  331              journal_entries += 1;\n  332              session.apply_journal_meta(entry.meta);\n  333              session.messages.extend(entry.append_messages);\n  334              session.replay_events.extend(entry.append_replay_events);\n  335          })?;\n  336          let journal_ms = journal_start.elapsed().as_millis();",
          "findingId": "jcode-persist-001",
          "title": "Session 用完整 snapshot 加 append-only JSONL journal"
        }
      ]
    ]
  },
  {
    "slug": "kimi-cli",
    "name": "Kimi CLI",
    "repo": "MoonshotAI/kimi-cli",
    "branch": "main",
    "commit": "cbc15c076d17f70fec9f89c90c0502e68657f505",
    "date": "2026-08-03T07:58:11Z",
    "language": "Python / TypeScript / Markdown",
    "kind": "Legacy source-backed harness audit",
    "legacy": true,
    "zh": {
      "thesis": "Kimi CLI 的既有源码账本覆盖 9 个 Harness 维度；这次迁移把原有事实重新排成单页分析和十章教程，不把 README 当作实现证据。",
      "strengths": [
        "一次用户输入可能触发多次“模型思考—调工具—看结果—再思考”，每一步前都留存档点。",
        "模型每次再开口前都会先收新通知和当前模式规则；工具可以边生成边启动，结果到齐后才记账。",
        "用户插话是在当前路线后追加新指令；D-Mail 则像读档，把对话回到旧存档再塞入一张“未来经验”纸条。"
      ],
      "limits": [
        "当前页面复用既有源码账本；迁移到自研前仍需做部署级验证",
        "当前页面复用既有源码账本；迁移到自研前仍需做部署级验证",
        "当前页面复用既有源码账本；迁移到自研前仍需做部署级验证"
      ],
      "lesson": "一次用户输入可能触发多次“模型思考—调工具—看结果—再思考”，每一步前都留存档点。"
    },
    "en": {
      "thesis": "The existing source ledger for Kimi CLI covers 9 Harness dimensions. This migration reshapes those facts into a single analysis page and ten standalone chapters instead of treating README claims as implementation evidence.",
      "strengths": [
        "Pinned source findings expose the control loop",
        "Context, tools, and policy are separated into reviewable dimensions",
        "Each chapter keeps a file and line-range trail"
      ],
      "limits": [
        "This snapshot reuses the prior source ledger and its pinned commit",
        "Deployment-level behavior still needs a fresh run",
        "Legacy findings should be re-audited when the repository moves"
      ],
      "lesson": "Read the implementation as input, state, tool effect, receipt, and recovery—not as a feature list."
    },
    "anchors": [
      [
        "overview",
        "src/kimi_cli/soul/kimisoul.py",
        {
          "path": "src/kimi_cli/soul/kimisoul.py",
          "start": 659,
          "end": 742,
          "snippet": "  659      async def run(\n  660          self,\n  661          user_input: str | list[ContentPart],\n  662          *,\n  663          skip_user_prompt_hook: bool = False,\n  664      ):\n  665          approval_source_token = None\n  666          created_approval_source: ApprovalSource | None = None\n  667          turn_started = False\n  668          turn_finished = False\n  669          interrupt_reason: str | None = None\n  670          turn_t0 = time.monotonic()\n  671          self._set_trace_id(None)\n  672          if get_current_approval_source_or_none() is None:\n  673              created_approval_source = ApprovalSource(kind=\"foreground_turn\", id=uuid.uuid4().hex)\n  674              approval_source_token = set_current_approval_source(created_approval_source)\n  675          try:\n  676              # Refresh OAuth tokens on each turn to avoid idle-time expirations.\n  677              await self._runtime.oauth.ensure_fresh(self._runtime)\n  678  \n  679              # Set session_id ContextVar for toolset hooks\n  680              from kimi_cli.soul.toolset import set_session_id\n  681  \n  682              set_session_id(self._runtime.session.id)\n  683  \n  684              from kimi_cli.hooks import events\n  685  \n  686              # --- UserPromptSubmit hook ---\n  687              # Synthetic internal prompts (e.g. background-task notification\n  688              # follow-ups injected by ``Print`` after a bg task finishes or",
          "findingId": "kimi-loop-001",
          "title": "每轮是带检查点的多步状态机，不是单次聊天请求"
        }
      ],
      [
        "architecture",
        "src/kimi_cli/soul/kimisoul.py",
        {
          "path": "src/kimi_cli/soul/kimisoul.py",
          "start": 1132,
          "end": 1194,
          "snippet": " 1132          # ═══════════════════════════════════════════════════════════════════════\n 1133          # 2e.1. NOTIFICATION DELIVERY (root role only)\n 1134          # ═══════════════════════════════════════════════════════════════════════\n 1135          if self.is_root:\n 1136  \n 1137              async def _append_notification(view: NotificationView) -> None:\n 1138                  await self._context.append_message(build_notification_message(view, self._runtime))\n 1139                  # --- Notification hook ---\n 1140                  from kimi_cli.hooks import events\n 1141  \n 1142                  _hook_task = asyncio.create_task(\n 1143                      self._hook_engine.trigger(\n 1144                          \"Notification\",\n 1145                          matcher_value=view.event.type,\n 1146                          input_data=events.notification(\n 1147                              session_id=self._runtime.session.id,\n 1148                              cwd=str(Path.cwd()),\n 1149                              sink=\"llm\",\n 1150                              notification_type=view.event.type,\n 1151                              title=view.event.title,\n 1152                              body=view.event.body,\n 1153                              severity=view.event.severity,\n 1154                          ),\n 1155                      )\n 1156                  )\n 1157                  _hook_task.add_done_callback(lambda t: t.exception() if not t.cancelled() else None)\n 1158  \n 1159              await self._runtime.notifications.deliver_pending(\n 1160                  \"llm\",\n 1161                  limit=4,",
          "findingId": "kimi-loop-002",
          "title": "每 step 先注入通知/动态约束，再一次生成并等待并发工具"
        }
      ],
      [
        "loop",
        "src/kimi_cli/soul/kimisoul.py",
        {
          "path": "src/kimi_cli/soul/kimisoul.py",
          "start": 622,
          "end": 653,
          "snippet": "  622      def steer(self, content: str | list[ContentPart]) -> None:\n  623          \"\"\"Queue a steer message for injection into the current turn.\"\"\"\n  624          self._steer_queue.put_nowait(content)\n  625  \n  626      async def _consume_pending_steers(self) -> bool:\n  627          \"\"\"Drain the steer queue and inject as follow-up user messages.\n  628  \n  629          Returns True if any steers were consumed.\n  630  \n  631          Note: /btw is intercepted at the UI layer (``classify_input``) before\n  632          reaching the steer queue, so it never appears here.\n  633          \"\"\"\n  634          consumed = False\n  635          while not self._steer_queue.empty():\n  636              content = self._steer_queue.get_nowait()\n  637              await self._inject_steer(content)\n  638              wire_send(SteerInput(user_input=content))\n  639              consumed = True\n  640          return consumed\n  641  \n  642      async def _inject_steer(self, content: str | list[ContentPart]) -> None:\n  643          \"\"\"Inject a single steer as a regular follow-up user message.\"\"\"\n  644          parts = cast(\n  645              list[ContentPart],\n  646              [TextPart(text=content)] if isinstance(content, str) else list(content),\n  647          )\n  648          message = Message(role=\"user\", content=parts)\n  649          if self._runtime.llm is None:\n  650              raise LLMNotSet()\n  651          if missing_caps := check_message(message, self._runtime.llm.capabilities):",
          "findingId": "kimi-loop-003",
          "title": "steer 与 D-Mail 提供两种中途改道机制"
        }
      ],
      [
        "model",
        "packages/kosong/src/kosong/_generate.py",
        {
          "path": "packages/kosong/src/kosong/_generate.py",
          "start": 52,
          "end": 103,
          "snippet": "   52      message = Message(role=\"assistant\", content=[])\n   53      pending_part: StreamedMessagePart | None = None  # message part that is currently incomplete\n   54  \n   55      logger.trace(\"Generating with history: {history}\", history=history)\n   56      stream = await chat_provider.generate(system_prompt, tools, history)\n   57      if on_trace_id:\n   58          # getattr for robustness against third-party StreamedMessage\n   59          # implementations that predate the trace_id property.\n   60          await callback(on_trace_id, getattr(stream, \"trace_id\", None))\n   61      async for part in stream:\n   62          logger.trace(\"Received part: {part}\", part=part)\n   63          if on_message_part:\n   64              await callback(on_message_part, part.model_copy(deep=True))\n   65  \n   66          if pending_part is None:\n   67              pending_part = part\n   68          elif not pending_part.merge_in_place(part):  # try merge into the pending part\n   69              # unmergeable part must push the pending part to the buffer\n   70              _message_append(message, pending_part)\n   71              if isinstance(pending_part, ToolCall) and on_tool_call:\n   72                  await callback(on_tool_call, pending_part)\n   73              pending_part = part\n   74  \n   75      # end of message\n   76      if pending_part is not None:\n   77          _message_append(message, pending_part)\n   78          if isinstance(pending_part, ToolCall) and on_tool_call:\n   79              await callback(on_tool_call, pending_part)\n   80  \n   81      if not message.content and not message.tool_calls:",
          "findingId": "kimi-provider-001",
          "title": "Kosong 把流式生成和工具调度拆成两层契约"
        }
      ],
      [
        "tools",
        "src/kimi_cli/soul/agent.py",
        {
          "path": "src/kimi_cli/soul/agent.py",
          "start": 411,
          "end": 451,
          "snippet": "  411      # Register built-in subagent types before loading tools because some tools render\n  412      # descriptions from the labor market on initialization.\n  413      for subagent_name, subagent_spec in agent_spec.subagents.items():\n  414          logger.debug(\n  415              \"Registering builtin subagent type: {subagent_name}\", subagent_name=subagent_name\n  416          )\n  417          builtin_spec = load_agent_spec(subagent_spec.path)\n  418          tool_policy = (\n  419              ToolPolicy(mode=\"allowlist\", tools=tuple(builtin_spec.allowed_tools))\n  420              if builtin_spec.allowed_tools is not None\n  421              else ToolPolicy(mode=\"inherit\")\n  422          )\n  423          runtime.labor_market.add_builtin_type(\n  424              AgentTypeDefinition(\n  425                  name=subagent_name,\n  426                  description=subagent_spec.description,\n  427                  agent_file=subagent_spec.path,\n  428                  when_to_use=builtin_spec.when_to_use,\n  429                  default_model=builtin_spec.model,\n  430                  tool_policy=tool_policy,\n  431              )\n  432          )\n  433  \n  434      toolset = KimiToolset()\n  435      tool_deps = {\n  436          KimiToolset: toolset,\n  437          Runtime: runtime,\n  438          # TODO: remove all the following dependencies and use Runtime instead\n  439          Config: runtime.config,\n  440          BuiltinSystemPromptArgs: runtime.builtin_args,",
          "findingId": "kimi-tools-001",
          "title": "工具表由 agent spec 动态装配，插件和 MCP 追加进入同一 Toolset"
        }
      ],
      [
        "context",
        "src/kimi_cli/soul/context.py",
        {
          "path": "src/kimi_cli/soul/context.py",
          "start": 20,
          "end": 65,
          "snippet": "   20  class Context:\n   21      def __init__(self, file_backend: Path):\n   22          self._file_backend = file_backend\n   23          self._history: list[Message] = []\n   24          self._token_count: int = 0\n   25          self._pending_token_estimate: int = 0\n   26          self._next_checkpoint_id: int = 0\n   27          \"\"\"The ID of the next checkpoint, starting from 0, incremented after each checkpoint.\"\"\"\n   28          self._system_prompt: str | None = None\n   29  \n   30      async def restore(self) -> bool:\n   31          logger.debug(\"Restoring context from file: {file_backend}\", file_backend=self._file_backend)\n   32          if self._history:\n   33              logger.error(\"The context storage is already modified\")\n   34              raise RuntimeError(\"The context storage is already modified\")\n   35          if not self._file_backend.exists():\n   36              logger.debug(\"No context file found, skipping restoration\")\n   37              return False\n   38          if self._file_backend.stat().st_size == 0:\n   39              logger.debug(\"Empty context file, skipping restoration\")\n   40              return False\n   41  \n   42          messages_after_last_usage: list[Message] = []\n   43          async with aiofiles.open(self._file_backend, encoding=\"utf-8\", errors=\"replace\") as f:\n   44              line_no = 0\n   45              async for line in f:\n   46                  line_no += 1\n   47                  if not line.strip():\n   48                      continue\n   49                  line_json = self._parse_context_line(",
          "findingId": "kimi-context-001",
          "title": "上下文是可增量恢复的 JSONL 事件账本"
        }
      ],
      [
        "security",
        "src/kimi_cli/soul/approval.py",
        {
          "path": "src/kimi_cli/soul/approval.py",
          "start": 130,
          "end": 199,
          "snippet": "  130  class Approval:\n  131      def __init__(\n  132          self,\n  133          yolo: bool = False,\n  134          *,\n  135          state: ApprovalState | None = None,\n  136          runtime: ApprovalRuntime | None = None,\n  137      ):\n  138          self._state = state or ApprovalState(yolo=yolo)\n  139          self._runtime = runtime or ApprovalRuntime()\n  140  \n  141      def share(self) -> Approval:\n  142          \"\"\"Create a new approval queue that shares approval state.\"\"\"\n  143          return Approval(state=self._state, runtime=self._runtime)\n  144  \n  145      def set_runtime(self, runtime: ApprovalRuntime) -> None:\n  146          self._runtime = runtime\n  147  \n  148      @property\n  149      def runtime(self) -> ApprovalRuntime:\n  150          return self._runtime\n  151  \n  152      def set_yolo(self, yolo: bool) -> None:\n  153          self._state.yolo = yolo\n  154          self._state.notify_change()\n  155  \n  156      def set_afk(self, afk: bool) -> None:\n  157          \"\"\"Toggle persisted afk (away-from-keyboard) mode.\n  158  \n  159          Turning it off also clears any invocation-only afk overlay so an",
          "findingId": "kimi-security-001",
          "title": "统一审批支持单次、整会话、拒绝反馈、YOLO 与 AFK"
        }
      ],
      [
        "ecosystem",
        "src/kimi_cli/hooks/engine.py",
        {
          "path": "src/kimi_cli/hooks/engine.py",
          "start": 65,
          "end": 91,
          "snippet": "   65  class HookEngine:\n   66      \"\"\"Loads hook definitions and executes matching hooks in parallel.\n   67  \n   68      Supports two hook sources:\n   69      - Server-side (config.toml): shell commands executed locally\n   70      - Client-side (wire subscriptions): forwarded to client via HookRequest\n   71      \"\"\"\n   72  \n   73      def __init__(\n   74          self,\n   75          hooks: list[HookDef] | None = None,\n   76          cwd: str | None = None,\n   77          *,\n   78          on_triggered: OnTriggered | None = None,\n   79          on_resolved: OnResolved | None = None,\n   80          on_wire_hook: OnWireHookRequest | None = None,\n   81      ):\n   82          self._hooks: list[HookDef] = list(hooks) if hooks else []\n   83          self._wire_subs: list[WireHookSubscription] = []\n   84          self._cwd = cwd\n   85          self._on_triggered = on_triggered\n   86          self._on_resolved = on_resolved\n   87          self._on_wire_hook = on_wire_hook\n   88          self._by_event: dict[str, list[HookDef]] = {}\n   89          self._wire_by_event: dict[str, list[WireHookSubscription]] = {}\n   90          self._pending_fire_and_forget: set[asyncio.Task[Any]] = set()\n   91          self._rebuild_index()",
          "findingId": "kimi-hooks-001",
          "title": "Hook 同时支持本地命令与客户端 wire subscription"
        }
      ],
      [
        "collaboration",
        "src/kimi_cli/soul/agent.py",
        {
          "path": "src/kimi_cli/soul/agent.py",
          "start": 411,
          "end": 431,
          "snippet": "  411      # Register built-in subagent types before loading tools because some tools render\n  412      # descriptions from the labor market on initialization.\n  413      for subagent_name, subagent_spec in agent_spec.subagents.items():\n  414          logger.debug(\n  415              \"Registering builtin subagent type: {subagent_name}\", subagent_name=subagent_name\n  416          )\n  417          builtin_spec = load_agent_spec(subagent_spec.path)\n  418          tool_policy = (\n  419              ToolPolicy(mode=\"allowlist\", tools=tuple(builtin_spec.allowed_tools))\n  420              if builtin_spec.allowed_tools is not None\n  421              else ToolPolicy(mode=\"inherit\")\n  422          )\n  423          runtime.labor_market.add_builtin_type(\n  424              AgentTypeDefinition(\n  425                  name=subagent_name,\n  426                  description=subagent_spec.description,\n  427                  agent_file=subagent_spec.path,\n  428                  when_to_use=builtin_spec.when_to_use,\n  429                  default_model=builtin_spec.model,\n  430                  tool_policy=tool_policy,\n  431              )",
          "findingId": "kimi-subagent-001",
          "title": "内建 coder/explore/plan 用代码级工具白名单切分角色"
        }
      ],
      [
        "evidence",
        "src/kimi_cli/soul/kimisoul.py",
        {
          "path": "src/kimi_cli/soul/kimisoul.py",
          "start": 1009,
          "end": 1076,
          "snippet": " 1009              # ── 2b. Step Begin ──────────────────────────────────────────────────\n 1010              wire_send(StepBegin(n=step_no))\n 1011              back_to_the_future: BackToTheFuture | None = None\n 1012              step_outcome: StepOutcome | None = None\n 1013  \n 1014              try:\n 1015                  # ── 2c. Context Compaction ──────────────────────────────────────\n 1016                  if should_auto_compact(\n 1017                      self._context.token_count_with_pending,\n 1018                      self._runtime.llm.max_context_size,\n 1019                      trigger_ratio=self._loop_control.compaction_trigger_ratio,\n 1020                      reserved_context_size=self._loop_control.reserved_context_size,\n 1021                  ):\n 1022                      logger.info(\"Context too long, compacting...\")\n 1023                      try:\n 1024                          await self.compact_context()\n 1025                      except Exception as compact_err:\n 1026                          logger.error(\n 1027                              \"Context compaction failed at step {step_no}: {error_type}: {error}\",\n 1028                              step_no=step_no,\n 1029                              error_type=type(compact_err).__name__,\n 1030                              error=compact_err,\n 1031                          )\n 1032                          raise\n 1033  \n 1034                  # ── 2d. Checkpoint ──────────────────────────────────────────────\n 1035                  logger.debug(\"Beginning step {step_no}\", step_no=step_no)\n 1036                  await self._checkpoint()\n 1037                  self._denwa_renji.set_n_checkpoints(self._context.n_checkpoints)\n 1038  ",
          "findingId": "kimi-observe-001",
          "title": "Wire 事件与 trace id 贯穿 turn、step、tool、approval、MCP、compaction"
        }
      ]
    ]
  },
  {
    "slug": "deepseek-reasonix",
    "name": "DeepSeek-Reasonix",
    "repo": "esengine/DeepSeek-Reasonix",
    "branch": "main-v2",
    "commit": "9aaf8d381a214cd2cb6df774d3b207a646ddd651",
    "date": "2026-08-13T12:59:58+08:00",
    "language": "Go / TypeScript / Markdown",
    "kind": "Legacy source-backed harness audit",
    "legacy": true,
    "zh": {
      "thesis": "DeepSeek-Reasonix 的既有源码账本覆盖 12 个 Harness 维度；这次迁移把原有事实重新排成单页分析和十章教程，不把 README 当作实现证据。",
      "strengths": [
        "终端、桌面和服务端不是各写一套 Agent，而是都插到同一个“总电闸”上，所以权限、工具和生命周期不会因为换界面而变一套。",
        "它允许长任务一直做，但每个工具输出和“最后确认”都有保险丝；只要交付模式缺验收或验证，主机就不会让它假装完成。",
        "用户连按几次发送不会把同一个会话撕成两半：新消息要么排队，要么明确被拒；切换会话时也不会恰好换掉正在用的那份上下文。"
      ],
      "limits": [
        "当前页面复用既有源码账本；迁移到自研前仍需做部署级验证",
        "当前页面复用既有源码账本；迁移到自研前仍需做部署级验证",
        "当前页面复用既有源码账本；迁移到自研前仍需做部署级验证"
      ],
      "lesson": "终端、桌面和服务端不是各写一套 Agent，而是都插到同一个“总电闸”上，所以权限、工具和生命周期不会因为换界面而变一套。"
    },
    "en": {
      "thesis": "The existing source ledger for DeepSeek-Reasonix covers 12 Harness dimensions. This migration reshapes those facts into a single analysis page and ten standalone chapters instead of treating README claims as implementation evidence.",
      "strengths": [
        "Pinned source findings expose the control loop",
        "Context, tools, and policy are separated into reviewable dimensions",
        "Each chapter keeps a file and line-range trail"
      ],
      "limits": [
        "This snapshot reuses the prior source ledger and its pinned commit",
        "Deployment-level behavior still needs a fresh run",
        "Legacy findings should be re-audited when the repository moves"
      ],
      "lesson": "Read the implementation as input, state, tool effect, receipt, and recovery—not as a feature list."
    },
    "anchors": [
      [
        "overview",
        "internal/boot/boot.go",
        {
          "path": "internal/boot/boot.go",
          "start": 1,
          "end": 8,
          "snippet": "    1  // Package boot assembles a ready-to-drive control.Controller from configuration:\n    2  // it loads config, resolves the model(s), builds the tool registry (built-ins +\n    3  // plugins), wires the permission gate, and constructs the executor — optionally\n    4  // wrapping it in a two-model Coordinator. It is the one place that turns \"what the\n    5  // user configured\" into \"a Controller a frontend can drive\", so every frontend —\n    6  // the terminal TUI, the HTTP/SSE server, the desktop webview — shares the exact\n    7  // same assembly instead of each re-deriving it. Frontends pass only a sink and a\n    8  // couple of run knobs; everything else comes from config.",
          "findingId": "reasonix-arch-001",
          "title": "Boot 是唯一装配根，所有前端共享同一套 Harness"
        }
      ],
      [
        "architecture",
        "internal/agent/agent.go",
        {
          "path": "internal/agent/agent.go",
          "start": 33,
          "end": 62,
          "snippet": "   33  \t\"reasonix/internal/shellparse\"\n   34  \t\"reasonix/internal/taskpolicy\"\n   35  \t\"reasonix/internal/tool\"\n   36  \t\"reasonix/internal/workspacelease\"\n   37  )\n   38  \n   39  // maxToolOutputBytes caps a single tool result before it goes into the model's\n   40  // context. ~32KB is roughly 8K tokens — enough for a full file read or a busy\n   41  // grep, while preventing one accidental \"read this 5 MB log\" from blowing the\n   42  // window before the next compaction runs.\n   43  const maxToolOutputBytes = 32 * 1024\n   44  \n   45  const maxEmptyFinalBlocks = 3\n   46  \n   47  // maxStreamRecoveries is the number of body-phase stream retries after the\n   48  // initial sampling attempt (Codex-aligned default: 1 + 5 = 6 attempts total).\n   49  const maxStreamRecoveries = 5\n   50  const maxSamplingAttempts = maxStreamRecoveries + 1\n   51  const maxExecutorHandoffNudges = 1\n   52  \n   53  const defaultReasoningByteLimit = 128 * 1024\n   54  \n   55  const finishReasonClientReasoningLimit = \"client_reasoning_limit\"\n   56  \n   57  var errReasoningByteLimitExceeded = errors.New(\"reasoning output exceeded client byte limit\")\n   58  \n   59  // DeliveryRuntimeMarker is the delivery-mode contract block appended to user\n   60  // turns (withTurnPreferences). Exported as the single source of truth for the\n   61  // byte-exact suffix strip in preview derivation and for cross-package tests;\n   62  // its text is cache-frozen — changing it breaks steer replay matching and the",
          "findingId": "reasonix-arch-002",
          "title": "主循环以模型自然结束为主，额外叠加多种止损护栏"
        }
      ],
      [
        "loop",
        "internal/control/controller.go",
        {
          "path": "internal/control/controller.go",
          "start": 60,
          "end": 76,
          "snippet": "   60  \t\"reasonix/internal/taskmonitor\"\n   61  \t\"reasonix/internal/tool\"\n   62  \t\"reasonix/internal/workspacelease\"\n   63  )\n   64  \n   65  // ErrTurnRunning reports that a caller tried to start a second foreground turn\n   66  // while one is already active in the same Controller.\n   67  var ErrTurnRunning = errors.New(\"turn already running\")\n   68  \n   69  // ErrRuntimeDraining reports that a caller targeted a controller generation\n   70  // superseded by a successful rebuild.\n   71  var ErrRuntimeDraining = errors.New(\"runtime is draining after rebuild\")\n   72  \n   73  // errTurnRunningRotation and errRotationInProgress are returned by the\n   74  // session-rotation gate (beginRotation) when a rotation cannot proceed: a turn\n   75  // is in flight, or another rotation already holds the gate.\n   76  var (",
          "findingId": "reasonix-arch-003",
          "title": "Controller 对并发 turn、旋转、收尾和自动保存有明确状态机"
        }
      ],
      [
        "model",
        "internal/provider/provider.go",
        {
          "path": "internal/provider/provider.go",
          "start": 40,
          "end": 75,
          "snippet": "   40  \tLocalOnlyToolName = \"__reasonix_local_only__\"\n   41  \tLocalOnlyToolID   = \"__reasonix_local_only__\"\n   42  )\n   43  \n   44  // Message is a single conversation message.\n   45  type Message struct {\n   46  \tRole Role `json:\"role\"`\n   47  \t// Content is the provider-visible conversation content. Keeping this legacy\n   48  \t// field provider-visible preserves replay for older CLI/Desktop releases.\n   49  \tContent string `json:\"content,omitempty\"`\n   50  \t// RawContent holds the full original when it differs from Content:\n   51  \t// for user turns, the user-authored text before host-injected context;\n   52  \t// for tool turns, the complete tool result when first-visible Content was\n   53  \t// bounded. ModelMessages always clears it so provider serialization, prompt\n   54  \t// cache hashes, and projection hashes never include it.\n   55  \tRawContent string `json:\"raw_content,omitempty\"`\n   56  \t// ProviderContent is a transitional field written by early Context Engine v2\n   57  \t// builds. Loaders migrate it into Content/RawContent before normal use.\n   58  \tProviderContent  string   `json:\"provider_content,omitempty\"`\n   59  \tImages           []string `json:\"images,omitempty\"`            // data URLs (data:<mime>;base64,…) on user (attachments) and tool (MCP image results) messages; embedded only for vision-capable models\n   60  \tReasoningContent string   `json:\"reasoning_content,omitempty\"` // assistant: thinking-mode chain-of-thought, round-tripped on multi-turn\n   61  \t// ReasoningID is the provider-issued reasoning-item id (OpenAI Responses:\n   62  \t// Reasoning.id is required on input items), captured from the streamed\n   63  \t// output item and round-tripped back into later inputs.\n   64  \tReasoningID string `json:\"reasoning_id,omitempty\"`\n   65  \t// ReasoningStatus is the final status of the reasoning item\n   66  \t// (\"in_progress\" | \"completed\") as issued by the server's done event,\n   67  \t// round-tripped back into the input alongside ReasoningID.\n   68  \tReasoningStatus string `json:\"reasoning_status,omitempty\"`\n   69  \t// ReasoningSignature is an opaque, provider-issued proof that ReasoningContent",
          "findingId": "reasonix-provider-001",
          "title": "Provider 消息对象把模型内容与本地显示元数据分开"
        }
      ],
      [
        "tools",
        "internal/agent/execute_one.go",
        {
          "path": "internal/agent/execute_one.go",
          "start": 20,
          "end": 80,
          "snippet": "   20  \n   21  // executeOne runs a single tool call. It is pure with respect to the event sink\n   22  // — the caller emits ToolDispatch/ToolResult — so it is safe to invoke from\n   23  // parallel goroutines. Stages: parse → policy → prepare → finish.\n   24  func (a *Agent) executeOne(ctx context.Context, turn *turnRuntime, call provider.ToolCall) (out toolOutcome) {\n   25  \tctx = a.withAgentContext(ctx)\n   26  \tplan := &toolCallPlan{call: call}\n   27  \tdefer func() {\n   28  \t\tif plan.mutationObserved && !plan.mutationAfterDone {\n   29  \t\t\ta.observeAfterMutation(plan)\n   30  \t\t}\n   31  \t\tif plan.releaseMutationWrite != nil {\n   32  \t\t\tplan.releaseMutationWrite()\n   33  \t\t}\n   34  \t\tif plan.releaseParentWrite != nil {\n   35  \t\t\tplan.releaseParentWrite()\n   36  \t\t}\n   37  \t\tif plan.resolvedMeta == nil {\n   38  \t\t\treturn\n   39  \t\t}\n   40  \t\tout.resolved = true\n   41  \t\tout.resolvedName = plan.resolvedMeta.TargetName\n   42  \t\tout.capabilityID = plan.resolvedMeta.CapabilityID\n   43  \t\tout.resolvedReadOnly = plan.resolvedMeta.ReadOnly\n   44  \t}()\n   45  \tdefer finalizeWorkspaceMutationOutcome(&out, plan)\n   46  \n   47  \tif blocked, early := a.parseToolCall(ctx, plan); early {\n   48  \t\treturn blocked\n   49  \t}",
          "findingId": "reasonix-tools-001",
          "title": "每个工具调用固定经过 parse→policy→prepare→finish 四阶段"
        }
      ],
      [
        "context",
        "internal/agent/compact.go",
        {
          "path": "internal/agent/compact.go",
          "start": 19,
          "end": 36,
          "snippet": "   19  // Compaction is a low-frequency cache-reset point: the prompt grows append-only\n   20  // until compactRatio of the window is crossed, then one content-driven summary\n   21  // checkpoint is installed (stable prefix + one structured digest + recent tail).\n   22  // 50% is only the normal acceptance ceiling — candidates are never padded up to it.\n   23  const (\n   24  \tdefaultCompactRatio        = 0.85 // sole automatic maintenance trigger (new configs)\n   25  \tcheckpointCeilingRatio     = 0.50 // normal auto-checkpoint acceptance ceiling\n   26  \trecentTailBudgetRatio      = 0.10 // recent verbatim tail as a fraction of the window\n   27  \tminRecentTailTokens        = 32 * 1024\n   28  \tmaxRecentTailTokens        = 96 * 1024\n   29  \tsummaryOutputMaxTokens     = 16 * 1024 // max digest output; further clipped by remaining candidate space\n   30  \texceptionalMinSavingsRatio = 0.25      // when fixed prefix alone exceeds 50%, require at least this savings\n   31  \tminRecentKeep              = 2         // never keep fewer recent messages than this\n   32  \tminCompactMessages         = 2         // skip compaction below this many compactable messages\n   33  \tfallbackTokPerChar         = 0.25      // ~4 chars/token, used before any usage is available to calibrate\n   34  \tmaxPinnedFirstUserTokens   = 1500      // ceiling on pinning the first user turn verbatim\n   35  \tpinnedFirstUserWindowFrac  = 0.15      // and never pin a first turn worth more than this fraction of the window\n   36  \tmaxKeptUserTurnTokens      = 1500      // ceiling on carrying one folded user turn verbatim",
          "findingId": "reasonix-context-001",
          "title": "上下文维护是 0.5/0.6/0.8/0.9 多级管道"
        }
      ],
      [
        "security",
        "internal/sandbox/sandbox.go",
        {
          "path": "internal/sandbox/sandbox.go",
          "start": 1,
          "end": 14,
          "snippet": "    1  // Package sandbox wraps a shell command in an OS-level jail so the model's\n    2  // `bash` calls are confined: it may read almost freely but write only inside\n    3  // the writable roots (workspace, configured extras, plus temp and toolchain\n    4  // caches), with optional forbid-read roots, and reach the network only when\n    5  // allowed. This is the *enforcement* layer beneath the permission rules\n    6  // (*policy*): a permitted command still cannot escape the box.\n    7  //\n    8  // macOS uses Seatbelt via sandbox-exec and Linux uses bubblewrap when available.\n    9  // Windows does not currently provide an OS-level bash sandbox and resolves the\n   10  // product setting to off. When enforce is requested but no OS sandbox backend\n   11  // is available, the bash tool fails closed instead of running the command\n   12  // unwrapped.\n   13  // Confining the in-process file-writer built-ins is handled separately, in\n   14  // package tool/builtin.",
          "findingId": "reasonix-sandbox-001",
          "title": "Bash 沙箱是独立于 permission 的 OS enforcement 层"
        }
      ],
      [
        "ecosystem",
        "internal/plugin/plugin.go",
        {
          "path": "internal/plugin/plugin.go",
          "start": 1,
          "end": 7,
          "snippet": "    1  // Package plugin is Reasonix's MCP client. It connects to external MCP servers and\n    2  // adapts their tools to the tool.Tool interface, so the agent treats plugin\n    3  // tools and built-ins uniformly. The wire protocol is JSON-RPC 2.0 in every\n    4  // case; only the transport differs (stdio subprocess, Streamable HTTP, or the\n    5  // legacy HTTP+SSE). A transport interface hides that difference so the MCP-level\n    6  // logic — handshake, tools/list, tools/call — is written once.\n    7  package plugin",
          "findingId": "reasonix-mcp-001",
          "title": "MCP 以统一 JSON-RPC 适配 stdio、Streamable HTTP 和 legacy SSE"
        }
      ],
      [
        "collaboration",
        "internal/agent/coordinator.go",
        {
          "path": "internal/agent/coordinator.go",
          "start": 36,
          "end": 81,
          "snippet": "   36  have enough evidence. Do not write full implementations or attempt side effects.\n   37  Do not ask the user how to trigger the executor and do not say you are waiting\n   38  for the executor. Output executor-ready instructions: what to do, which files or\n   39  commands are relevant, expected blockers, and key decisions. Keep it short and\n   40  actionable.\n   41  \n   42  Deliver the plan by calling submit_plan. The plan is data, not prose: the host\n   43  renders it for the user and hands it to the executor, so do not also write the\n   44  plan out in your reply. Fill the fields you actually have — a step's title is\n   45  required, everything else is there so the plan can say what free text only\n   46  implies. Record read paths as verified_files and inferred ones as\n   47  candidate_files; never present an unread path as verified. Set requires_approval\n   48  when execution should stop for the user; the host owns the final decision.\n   49  \n   50  A host-authored <planner-turn> block at the end of the user turn selects the\n   51  planning depth. For depth=light, submit a compact objective with 1-4 steps,\n   52  likely touchpoints, and the main verification. For depth=full, inspect enough\n   53  evidence to separate verified touchpoints from candidates, then also fill\n   54  non-goals, per-step risks, acceptance criteria, and command-level verification.\n   55  Label anything unproven in assumptions rather than stating it as fact.\n   56  \n   57  If execution needs a user-owned decision or a missing user-provided value\n   58  before it can be safe, call ask and let the answer shape the plan; never ask in\n   59  prose and never plan around a guess you could have settled.\n   60  \n   61  If submit_plan is unavailable to you, fall back to writing the plan as your\n   62  reply, and end it with a final line containing exactly\n   63  [planner_requires_approval] when execution must stop for user approval.\n   64  \n   65  Crucial: You only have research tools plus the stable use_capability proxy for",
          "findingId": "reasonix-collab-001",
          "title": "Planner 与 Executor 是两份独立 session，显式审批路线 fail-closed"
        }
      ],
      [
        "evidence",
        "internal/agent/save.go",
        {
          "path": "internal/agent/save.go",
          "start": 26,
          "end": 74,
          "snippet": "   26  \t\"reasonix/internal/provider\"\n   27  \t\"reasonix/internal/store\"\n   28  )\n   29  \n   30  const (\n   31  \tcleanupPendingExt             = \".cleanup-pending.json\"\n   32  \tmaxRecoveryParentStemBytes    = 80\n   33  \tsessionLockSidecarSuffix      = \".jsonl.lock\"\n   34  \tsessionLeaseLockSidecarSuffix = \".jsonl.lease.lock\"\n   35  \tsessionLeaseInfoSidecarSuffix = \".jsonl.lease.json\"\n   36  \tguardianSidecarSuffix         = \".guardian.jsonl\"\n   37  \t// nameMaxBytes is the single-component filename limit shared by the\n   38  \t// filesystems Reasonix targets (APFS, ext4, NTFS all cap at 255).\n   39  \tnameMaxBytes = 255\n   40  \t// maxSessionBasenameBytes bounds transcript basenames that reconciliation\n   41  \t// leaves in place. Sidecars append up to ~16 bytes to the transcript name\n   42  \t// or its stem (\".lease.lock\", \".cleanup-pending.json\", \".guardian.jsonl\"),\n   43  \t// so 224 keeps every sidecar comfortably under nameMaxBytes with headroom\n   44  \t// for future suffixes. Names past this bound come from the pre-bounded\n   45  \t// recovery cascade and get renamed by reconcileOverlongSessionFilenames.\n   46  \tmaxSessionBasenameBytes = 224\n   47  )\n   48  \n   49  var (\n   50  \tsessionSaveLocks sync.Map\n   51  \t// sessionFileLockWait bounds cross-process save-lock acquisition. Session\n   52  \t// leases normally prevent competing writers, but CLI/legacy writers and a\n   53  \t// stalled process can still hold the compatibility .lock file. Navigation\n   54  \t// and desktop shutdown snapshot synchronously; waiting forever here wedges\n   55  \t// the UI and keeps the session lease (and WebView) alive indefinitely.",
          "findingId": "reasonix-persist-001",
          "title": "会话持久化是带 revision/CAS 的 append-only event log"
        }
      ]
    ]
  },
  {
    "slug": "codewhale",
    "name": "CodeWhale",
    "repo": "Hmbown/CodeWhale",
    "branch": "main",
    "commit": "cfc2f2b13c070e900ee10dbeffb07028d3beaebd",
    "date": "2026-08-12T06:54:09-07:00",
    "language": "Rust / Markdown / TypeScript",
    "kind": "Legacy source-backed harness audit",
    "legacy": true,
    "zh": {
      "thesis": "CodeWhale 的既有源码账本覆盖 12 个 Harness 维度；这次迁移把原有事实重新排成单页分析和十章教程，不把 README 当作实现证据。",
      "strengths": [
        "终端画面只是一个事件消费者；真正决定模型、工具和会话怎么走的是 Core Engine。这样换成 Web、ACP 或测试宿主时，不必再复制一套 Agent Loop。",
        "CodeWhale 不是把安全、长任务和扩展散落在命令行参数里，而是先形成一份“本次会话的有效配置”，后面的 turn、工具和子 Agent 都从这份配置派生。",
        "它先把“这次请求到底用哪个模型、哪些工具、什么权限”钉住，再让模型开跑；失败不会把会话炸掉，也不会误判成完成。"
      ],
      "limits": [
        "当前页面复用既有源码账本；迁移到自研前仍需做部署级验证",
        "当前页面复用既有源码账本；迁移到自研前仍需做部署级验证",
        "当前页面复用既有源码账本；迁移到自研前仍需做部署级验证"
      ],
      "lesson": "终端画面只是一个事件消费者；真正决定模型、工具和会话怎么走的是 Core Engine。这样换成 Web、ACP 或测试宿主时，不必再复制一套 Agent Loop。"
    },
    "en": {
      "thesis": "The existing source ledger for CodeWhale covers 12 Harness dimensions. This migration reshapes those facts into a single analysis page and ten standalone chapters instead of treating README claims as implementation evidence.",
      "strengths": [
        "Pinned source findings expose the control loop",
        "Context, tools, and policy are separated into reviewable dimensions",
        "Each chapter keeps a file and line-range trail"
      ],
      "limits": [
        "This snapshot reuses the prior source ledger and its pinned commit",
        "Deployment-level behavior still needs a fresh run",
        "Legacy findings should be re-audited when the repository moves"
      ],
      "lesson": "Read the implementation as input, state, tool effect, receipt, and recovery—not as a feature list."
    },
    "anchors": [
      [
        "overview",
        "crates/tui/src/core/mod.rs",
        {
          "path": "crates/tui/src/core/mod.rs",
          "start": 1,
          "end": 15,
          "snippet": "    1  //! Core engine module for `DeepSeek` CLI.\n    2  //!\n    3  //! This module provides the event-driven architecture that separates\n    4  //! the UI from the AI interaction logic:\n    5  //!\n    6  //! - `engine`: The main engine that processes operations\n    7  //! - `events`: Events emitted by the engine to the UI\n    8  //! - `ops`: Operations submitted by the UI to the engine\n    9  //! - `session`: Session state management\n   10  //! - `turn`: Turn context and tracking\n   11  \n   12  // Engine code runs inside the TUI alt-screen — see `runtime_log` for why\n   13  // raw stdio prints must not appear here. Use `tracing::*` instead.\n   14  #![deny(clippy::print_stdout)]\n   15  #![deny(clippy::print_stderr)]",
          "findingId": "codewhale-arch-001",
          "title": "Core 把 UI 与 AI 交互拆成事件驱动的控制面"
        }
      ],
      [
        "architecture",
        "crates/tui/src/core/engine.rs",
        {
          "path": "crates/tui/src/core/engine.rs",
          "start": 221,
          "end": 298,
          "snippet": "  221  #[derive(Debug, Clone)]\n  222  pub struct EngineConfig {\n  223      /// Model identifier to use for responses.\n  224      pub model: String,\n  225      /// Route/offering limits for the active provider+model, when the runtime\n  226      /// route resolver had concrete catalog facts.\n  227      pub active_route_limits: Option<codewhale_config::route::RouteLimits>,\n  228      /// Workspace root for tool execution and file operations.\n  229      pub workspace: PathBuf,\n  230      /// Optional host-owned root for delegated-agent runtime state.\n  231      ///\n  232      /// When unset, the worker ledger, complete transcript artifacts and\n  233      /// coordination lock retain their historical location under\n  234      /// `workspace/.codewhale/state`. Embedders may set a session-scoped root\n  235      /// to separate that control-plane state from the execution workspace.\n  236      /// Child cwd and file authority still derive from `workspace`; hosts using\n  237      /// distinct state roots for the same workspace must coordinate conflicting\n  238      /// writes themselves or isolate writers with worktrees.\n  239      pub subagent_state_root: Option<PathBuf>,\n  240      /// Allow shell tool execution when true.\n  241      pub allow_shell: bool,\n  242      /// Enable trust mode (skip approvals) when true.\n  243      pub trust_mode: bool,\n  244      /// Path to the notes file used by the notes tool.\n  245      pub notes_path: PathBuf,\n  246      /// Path to the MCP configuration file.\n  247      pub mcp_config_path: PathBuf,\n  248      /// Directory containing discoverable skills.\n  249      pub skills_dir: PathBuf,\n  250      /// Restrict skill discovery to CodeWhale-owned roots plus explicit",
          "findingId": "codewhale-arch-002",
          "title": "EngineConfig 是把能力、预算和权限拧在一起的运行时总闸"
        }
      ],
      [
        "loop",
        "crates/tui/src/core/engine.rs",
        {
          "path": "crates/tui/src/core/engine.rs",
          "start": 1920,
          "end": 1942,
          "snippet": " 1920          }\n 1921          let route = match self.current_runtime_route() {\n 1922              Ok(route) => route,\n 1923              Err(err) => {\n 1924                  // No route, no turn. Claim the once-only completion now so a\n 1925                  // dead route cannot re-arm the wake into the same error every\n 1926                  // poll tick; the user sees what finished and where the output\n 1927                  // lives, and the next healthy turn proceeds normally.\n 1928                  let finished = self\n 1929                      .shell_manager\n 1930                      .lock()\n 1931                      .map(|mut manager| manager.drain_finished_jobs_with_evidence().len())\n 1932                      .unwrap_or(0);\n 1933                  let _ = self\n 1934                      .tx_event\n 1935                      .send(Event::error(ErrorEnvelope::fatal_auth(format!(\n 1936                          \"{finished} background shell task(s) finished, but the turn cannot resume because the provider route is no longer valid: {err}. Their output stays available via /jobs.\"\n 1937                      ))))\n 1938                      .await;\n 1939                  return;\n 1940              }\n 1941          };\n 1942          let _ = self",
          "findingId": "codewhale-arch-003",
          "title": "Turn 运行前冻结事实，运行后再做持久化与继续决策"
        }
      ],
      [
        "model",
        "crates/tui/src/core/engine/turn_loop.rs",
        {
          "path": "crates/tui/src/core/engine/turn_loop.rs",
          "start": 364,
          "end": 412,
          "snippet": "  364          let tool_registry = Some(&tool_policy.registry);\n  365          // #4415: the turn's tool-call admission counter. It lives here —\n  366          // across every model step and batch of this turn — never in the\n  367          // catalog; the policy only carries the declared limit, and `None`\n  368          // (no declared budget) leaves the gate below inert.\n  369          let mut tool_call_budget = ToolCallBudget::new(tool_policy.max_tool_calls);\n  370          let mut goal_continuations_this_turn = 0u32;\n  371          // Turn-scoped empty REPL guard (NOTE-turn-loop-wrongness §2): persists\n  372          // across model steps so 3 consecutive empty blocks end the turn, not\n  373          // just 3 blocks inside one message.\n  374          let mut consecutive_empty_repl_rounds: u32 = 0;\n  375          // Outer stream-retry counter: when the chunked-transfer connection\n  376          // dies mid-stream and either nothing useful was streamed (#103\n  377          // Phase 3), the host slept mid-turn (#2990), or a headless host hit\n  378          // a mid-stream network drop (v0.9.4 Terminal-Bench P0), we silently\n  379          // re-issue the SAME request up to MAX_STREAM_RETRIES times before\n  380          // surfacing the failure to the user.\n  381          let mut stream_retry_attempts: u32 = 0;\n  382  \n  383          loop {\n  384              if self.cancel_token.is_cancelled() {\n  385                  let _ = self.tx_event.send(Event::status(\"Request cancelled\")).await;\n  386                  return (TurnOutcomeStatus::Interrupted, None);\n  387              }\n  388  \n  389              if self.apply_pending_runtime_authority().await {\n  390                  mode = self.current_mode;\n  391                  questions_allowed = crate::core::authority::permission_posture_allows_questions(\n  392                      self.session.approval_mode,\n  393                  );",
          "findingId": "codewhale-provider-001",
          "title": "单轮流式循环有取消、steer、工具预算和子 Agent 结果注入"
        }
      ],
      [
        "tools",
        "crates/tui/src/tools/spec.rs",
        {
          "path": "crates/tui/src/tools/spec.rs",
          "start": 1158,
          "end": 1217,
          "snippet": " 1158          }\n 1159  \n 1160          Ok(canonical)\n 1161      }\n 1162  \n 1163      /// Whether `path` is under any of the user-trusted external roots. The\n 1164      /// caller should pass an already-canonicalized (or normalized) path.\n 1165      fn is_trusted_external_path(&self, path: &Path) -> bool {\n 1166          self.trusted_external_paths\n 1167              .iter()\n 1168              .any(|trusted| path.starts_with(trusted))\n 1169      }\n 1170  \n 1171      /// Set the trust mode.\n 1172      #[allow(dead_code)]\n 1173      pub fn with_trust_mode(mut self, trust: bool) -> Self {\n 1174          self.trust_mode = trust;\n 1175          self\n 1176      }\n 1177  \n 1178      /// Set the sandbox policy.\n 1179      #[allow(dead_code)]\n 1180      pub fn with_sandbox_policy(mut self, policy: SandboxPolicy) -> Self {\n 1181          self.sandbox_policy = policy;\n 1182          self\n 1183      }\n 1184  \n 1185      /// Set feature flags for tool execution.\n 1186      pub fn with_features(mut self, features: Features) -> Self {\n 1187          self.features = features;",
          "findingId": "codewhale-tools-001",
          "title": "ToolSpec 把能力、审批、只读、并行和资源声明放到同一输入特化接口"
        }
      ],
      [
        "context",
        "crates/tui/src/context_budget.rs",
        {
          "path": "crates/tui/src/context_budget.rs",
          "start": 1,
          "end": 32,
          "snippet": "    1  //! Unified context-budget math for the TUI.\n    2  //!\n    3  //! Given a model's context window, the current input token estimate, and a\n    4  //! configured output cap, [`ContextBudget`] derives the four numbers the rest\n    5  //! of the app needs to reason about a turn:\n    6  //!\n    7  //!   * **available input budget** — how many input tokens may still be spent\n    8  //!     after reserving room for the model's output;\n    9  //!   * **output token cap** — the output reservation actually used to compute\n   10  //!     that budget (clamped so it never starves the window);\n   11  //!   * **compaction trigger** — the input-token level at which compaction\n   12  //!     should be suggested (default: ~75% of the full window, clamped to the\n   13  //!     spendable input ceiling);\n   14  //!   * **[`PressureLevel`]** — a coarse Low/Medium/High/Critical signal the UI\n   15  //!     can render without re-deriving thresholds.\n   16  //!\n   17  //! This module is the budget-math *foundation*. It is intentionally pure (no\n   18  //! I/O, no clock, no engine/config types) so it can be unit-tested in isolation.\n   19  //! Its consumers live outside it and call in, never the reverse: `route_budget`\n   20  //! and `core::engine::context` for [`ContextBudget`], `context_report` for\n   21  //! [`PressureLevel`].\n   22  //!\n   23  //! ### Why the output reservation is window-dependent\n   24  //!\n   25  //! The engine's existing input-budget helper\n   26  //! (`core::engine::context::context_input_budget_for_window`) computes\n   27  //! `window - reserved_output - headroom` and learned the hard way that\n   28  //! reserving a large fixed output (262K for V4-class interleaved thinking) on a\n   29  //! *small* self-hosted window (e.g. a 256K vLLM deployment) underflows to a\n   30  //! negative budget and silently disables every preflight/recovery path. We",
          "findingId": "codewhale-context-001",
          "title": "ContextBudget 用饱和数学先给输出留空间，再决定压缩"
        }
      ],
      [
        "security",
        "crates/tui/src/sandbox/policy.rs",
        {
          "path": "crates/tui/src/sandbox/policy.rs",
          "start": 17,
          "end": 87,
          "snippet": "   17  /// Determines execution restrictions for shell commands.\n   18  ///\n   19  /// The sandbox policy controls filesystem access, network access, and other\n   20  /// system resources for executed commands. Choose the most restrictive policy\n   21  /// that still allows your command to function.\n   22  #[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]\n   23  #[serde(tag = \"type\", rename_all = \"kebab-case\")]\n   24  pub enum SandboxPolicy {\n   25      /// No restrictions whatsoever. Use with extreme caution.\n   26      ///\n   27      /// This policy disables all sandboxing and allows full system access.\n   28      /// Only use this when absolutely necessary and the command source is trusted.\n   29      #[serde(rename = \"danger-full-access\")]\n   30      DangerFullAccess,\n   31  \n   32      /// Read-only access to the entire filesystem.\n   33      ///\n   34      /// The process can read any file but cannot write anywhere.\n   35      /// Useful for analysis tools that need broad read access.\n   36      #[serde(rename = \"read-only\")]\n   37      ReadOnly,\n   38  \n   39      /// Indicates the process is already running in an external sandbox.\n   40      ///\n   41      /// Use this when CodeWhale is itself running inside a container,\n   42      /// VM, or other sandboxed environment. This avoids double-sandboxing\n   43      /// which can cause issues.\n   44      #[serde(rename = \"external-sandbox\")]\n   45      ExternalSandbox {\n   46          /// Whether network access is allowed in the external sandbox.",
          "findingId": "codewhale-sandbox-001",
          "title": "默认 sandbox policy 是 workspace-write，但所有政策仍允许全盘读"
        }
      ],
      [
        "ecosystem",
        "crates/tui/src/mcp.rs",
        {
          "path": "crates/tui/src/mcp.rs",
          "start": 1,
          "end": 37,
          "snippet": "    1  //! Async MCP (Model Context Protocol) Implementation\n    2  //!\n    3  //! This module provides full async support for MCP servers with:\n    4  //! - Connection pooling for server reuse\n    5  //! - Automatic tool discovery via `tools/list`\n    6  //! - Configurable timeouts per-server and globally\n    7  \n    8  use std::collections::{HashMap, HashSet};\n    9  use std::ffi::{OsStr, OsString};\n   10  use std::fs;\n   11  use std::future::Future;\n   12  use std::io::{Read, Seek};\n   13  use std::path::{Component, Path, PathBuf};\n   14  use std::sync::Arc;\n   15  use std::sync::atomic::{AtomicU64, Ordering};\n   16  use std::time::Duration;\n   17  \n   18  use anyhow::{Context, Result};\n   19  use parking_lot::RwLock;\n   20  use serde::{Deserialize, Serialize};\n   21  use sha2::Digest as _;\n   22  \n   23  pub mod external_import;\n   24  mod headers;\n   25  mod http;\n   26  pub mod oauth;\n   27  mod sse;\n   28  mod stdio;\n   29  mod streamable_http;\n   30  mod wire;",
          "findingId": "codewhale-mcp-001",
          "title": "MCP 连接器覆盖 stdio、Streamable HTTP、SSE 和 OAuth，并有连接池"
        }
      ],
      [
        "collaboration",
        "crates/tui/src/tools/subagent/mod.rs",
        {
          "path": "crates/tui/src/tools/subagent/mod.rs",
          "start": 1,
          "end": 11,
          "snippet": "    1  //! Sub-agent spawning system.\n    2  //!\n    3  //! Provides tools to spawn background sub-agents, query their status,\n    4  //! and retrieve results. Sub-agents run with a filtered toolset and\n    5  //! inherit the workspace configuration from the main session.\n    6  //!\n    7  //! The model-facing creation surface is the `agent` tool. Narrow coordination\n    8  //! tools (`agents/list`, `agents/message`, `agents/followup`,\n    9  //! `agents/interrupt`, `agents/coordinate`, `agents/wait`) wrap the same runtime without restoring\n   10  //! the retired lifecycle theater. Older manager helpers remain executable for\n   11  //! persisted records and internal recovery.",
          "findingId": "codewhale-collab-001",
          "title": "agent 是模型可见的创建面，coordination tools 复用同一 mailbox/checkpoint machinery"
        }
      ],
      [
        "evidence",
        "crates/tui/src/session_manager.rs",
        {
          "path": "crates/tui/src/session_manager.rs",
          "start": 26,
          "end": 40,
          "snippet": "   26  \n   27  /// Maximum number of sessions to retain\n   28  const MAX_SESSIONS: usize = 50;\n   29  /// Maximum session title length, in `char`s. Matches the bound the session\n   30  /// picker's rename prompt has always enforced.\n   31  pub const MAX_SESSION_TITLE_CHARS: usize = 100;\n   32  const WORK_GRAPH_IMPORT_ARCHIVE_DIR: &str = \".work-graph-import-archive\";\n   33  const CURRENT_SESSION_SCHEMA_VERSION: u32 = 1;\n   34  const CURRENT_QUEUE_SCHEMA_VERSION: u32 = 1;\n   35  \n   36  const fn default_session_schema_version() -> u32 {\n   37      CURRENT_SESSION_SCHEMA_VERSION\n   38  }\n   39  \n   40  const fn default_queue_schema_version() -> u32 {",
          "findingId": "codewhale-persistence-001",
          "title": "Session 保存是原子写，恢复会校验 schema 并修复 tool history"
        }
      ]
    ]
  },
  {
    "slug": "prime-agent",
    "name": "Prime Agent",
    "repo": "PrimeIntellect-ai/prime-agent",
    "branch": "main",
    "commit": "7787f07415d843b9a800f6a4720e0c739bd608e5",
    "date": "2026-08-12T21:01:27-07:00",
    "language": "TypeScript / Markdown / Python",
    "kind": "Legacy source-backed harness audit",
    "legacy": true,
    "zh": {
      "thesis": "Prime Agent 的既有源码账本覆盖 10 个 Harness 维度；这次迁移把原有事实重新排成单页分析和十章教程，不把 README 当作实现证据。",
      "strengths": [
        "Prime Agent 把“模型怎么流式回答、什么时候执行工具、用户插话后是否继续”抽成一个不依赖 TUI 的小内核，上层入口只负责喂配置和消费事件。",
        "上下文不会在会话开始时被一次性拍扁，长任务中每次请求都可以重新裁剪、换系统提示和刷新短期 token。",
        "用户正在打断时是一种消息，用户等 Agent 停下来再追加是另一种消息，系统为了长目标自动继续又是第三种消息，三者不会混成一个 pending 数组。"
      ],
      "limits": [
        "bash 默认 spawn 宿主 shell；BashOperations 可换远端执行器，但本包没有默认 OS sandbox。",
        "当前页面复用既有源码账本；迁移到自研前仍需做部署级验证",
        "当前页面复用既有源码账本；迁移到自研前仍需做部署级验证"
      ],
      "lesson": "Prime Agent 把“模型怎么流式回答、什么时候执行工具、用户插话后是否继续”抽成一个不依赖 TUI 的小内核，上层入口只负责喂配置和消费事件。"
    },
    "en": {
      "thesis": "The existing source ledger for Prime Agent covers 10 Harness dimensions. This migration reshapes those facts into a single analysis page and ten standalone chapters instead of treating README claims as implementation evidence.",
      "strengths": [
        "Pinned source findings expose the control loop",
        "Context, tools, and policy are separated into reviewable dimensions",
        "Each chapter keeps a file and line-range trail"
      ],
      "limits": [
        "This snapshot reuses the prior source ledger and its pinned commit",
        "Deployment-level behavior still needs a fresh run",
        "Legacy findings should be re-audited when the repository moves"
      ],
      "lesson": "Read the implementation as input, state, tool effect, receipt, and recovery—not as a feature list."
    },
    "anchors": [
      [
        "overview",
        "packages/agent/src/agent-loop.ts",
        {
          "path": "packages/agent/src/agent-loop.ts",
          "start": 178,
          "end": 205,
          "snippet": "  178   * Start an agent loop with a new prompt message.\n  179   * The prompt is added to the context and events are emitted for it.\n  180   */\n  181  export function agentLoop(\n  182  \tprompts: AgentMessage[],\n  183  \tcontext: AgentContext,\n  184  \tconfig: AgentLoopConfig,\n  185  \tsignal?: AbortSignal,\n  186  \tstreamFn?: StreamFn,\n  187  ): EventStream<AgentEvent, AgentMessage[]> {\n  188  \tconst stream = createAgentStream();\n  189  \n  190  \tendAgentStreamOnError(\n  191  \t\tstream,\n  192  \t\trunAgentLoop(\n  193  \t\t\tprompts,\n  194  \t\t\tcontext,\n  195  \t\t\tconfig,\n  196  \t\t\tasync (event) => {\n  197  \t\t\t\tstream.push(event);\n  198  \t\t\t},\n  199  \t\t\tsignal,\n  200  \t\t\tstreamFn,\n  201  \t\t),\n  202  \t);\n  203  \n  204  \treturn stream;\n  205  }",
          "findingId": "prime-arch-001",
          "title": "低层 Agent Loop 是可复用的 provider-neutral 状态机"
        }
      ],
      [
        "architecture",
        "packages/agent/src/agent-loop.ts",
        {
          "path": "packages/agent/src/agent-loop.ts",
          "start": 317,
          "end": 345,
          "snippet": "  317  \t// Check for steering messages at start (user may have typed while waiting)\n  318  \tlet pendingMessages: AgentMessage[] = await pollMessagesUnlessAborted(config.getSteeringMessages, signal);\n  319  \n  320  \tconst shouldStopBeforeTurn = (): boolean => !firstTurn && (config.shouldStopBeforeTurn?.() ?? false);\n  321  \n  322  \t// Outer loop: continues when queued follow-up messages arrive after agent would stop\n  323  \twhile (true) {\n  324  \t\tthrowIfAborted(signal);\n  325  \t\tlet hasMoreToolCalls = true;\n  326  \n  327  \t\t// Inner loop: process tool calls and steering messages\n  328  \t\twhile (hasMoreToolCalls || pendingMessages.length > 0) {\n  329  \t\t\tthrowIfAborted(signal);\n  330  \t\t\tif (!firstTurn) {\n  331  \t\t\t\tawait emit({ type: \"turn_start\" });\n  332  \t\t\t} else {\n  333  \t\t\t\tfirstTurn = false;\n  334  \t\t\t}\n  335  \n  336  \t\t\t// Process pending messages (inject before next assistant response)\n  337  \t\t\tif (pendingMessages.length > 0) {\n  338  \t\t\t\tfor (const message of pendingMessages) {\n  339  \t\t\t\t\tawait emit({ type: \"message_start\", message });\n  340  \t\t\t\t\tawait emit({ type: \"message_end\", message });\n  341  \t\t\t\t\tcurrentContext.messages.push(message);\n  342  \t\t\t\t\tnewMessages.push(message);\n  343  \t\t\t\t}\n  344  \t\t\t\tpendingMessages = [];\n  345  \t\t\t}",
          "findingId": "prime-loop-003",
          "title": "Steering、follow-up、continuation 是三个不同的队列语义"
        }
      ],
      [
        "loop",
        "packages/coding-agent/src/core/agent-session.ts",
        {
          "path": "packages/coding-agent/src/core/agent-session.ts",
          "start": 1,
          "end": 13,
          "snippet": "    1  /**\n    2   * AgentSession - Core abstraction for agent lifecycle and session management.\n    3   *\n    4   * This class is shared between all run modes (interactive, print, rpc).\n    5   * It encapsulates:\n    6   * - Agent state access\n    7   * - Event subscription with automatic session persistence\n    8   * - Model and thinking level management\n    9   * - Compaction (manual and auto)\n   10   * - Bash execution\n   11   * - Session switching and branching\n   12   *\n   13   * Modes use this class and add their own I/O layer on top.",
          "findingId": "prime-recommend-001",
          "title": "最值得借鉴的是“纯 loop + coding host + extension bus”三层分离"
        }
      ],
      [
        "model",
        "packages/agent/src/agent-loop.ts",
        {
          "path": "packages/agent/src/agent-loop.ts",
          "start": 467,
          "end": 521,
          "snippet": "  467  async function streamAssistantResponse(\n  468  \tcontext: AgentContext,\n  469  \tconfig: AgentLoopConfig,\n  470  \tsignal: AbortSignal | undefined,\n  471  \temit: AgentEventSink,\n  472  \tstreamFn?: StreamFn,\n  473  ): Promise<AssistantMessage> {\n  474  \tlet partialMessage: AssistantMessage | null = null;\n  475  \tlet addedPartial = false;\n  476  \tconst finishAbortedMessage = async () => {\n  477  \t\tconst finalMessage = createAbortedAssistantMessage(config, partialMessage);\n  478  \t\tif (addedPartial) {\n  479  \t\t\tcontext.messages[context.messages.length - 1] = finalMessage;\n  480  \t\t} else {\n  481  \t\t\tcontext.messages.push(finalMessage);\n  482  \t\t\tawait emit({ type: \"message_start\", message: { ...finalMessage } });\n  483  \t\t}\n  484  \t\tawait emit({ type: \"message_end\", message: finalMessage });\n  485  \t\treturn finalMessage;\n  486  \t};\n  487  \n  488  \ttry {\n  489  \t\tthrowIfAborted(signal);\n  490  \t\t// Apply context transform if configured (AgentMessage[] → AgentMessage[])\n  491  \t\tlet messages = context.messages;\n  492  \t\tif (config.transformContext) {\n  493  \t\t\tmessages = await maybePromiseWithAbort(config.transformContext(messages, signal), signal);\n  494  \t\t}\n  495  \n  496  \t\t// Convert to LLM-compatible messages (AgentMessage[] → Message[])",
          "findingId": "prime-arch-002",
          "title": "Provider 边界前才做上下文变换和密钥解析"
        }
      ],
      [
        "tools",
        "packages/agent/src/agent-loop.ts",
        {
          "path": "packages/agent/src/agent-loop.ts",
          "start": 608,
          "end": 623,
          "snippet": "  608  async function executeToolCalls(\n  609  \tcurrentContext: AgentContext,\n  610  \tassistantMessage: AssistantMessage,\n  611  \tconfig: AgentLoopConfig,\n  612  \tsignal: AbortSignal | undefined,\n  613  \temit: AgentEventSink,\n  614  ): Promise<ExecutedToolCallBatch> {\n  615  \tconst toolCalls = assistantMessage.content.filter((c) => c.type === \"toolCall\");\n  616  \tconst hasSequentialToolCall = toolCalls.some(\n  617  \t\t(tc) => currentContext.tools?.find((t) => t.name === tc.name)?.executionMode === \"sequential\",\n  618  \t);\n  619  \tif (config.toolExecution === \"sequential\" || hasSequentialToolCall) {\n  620  \t\treturn executeToolCallsSequential(currentContext, assistantMessage, toolCalls, config, signal, emit);\n  621  \t}\n  622  \treturn executeToolCallsParallel(currentContext, assistantMessage, toolCalls, config, signal, emit);\n  623  }",
          "findingId": "prime-tools-001",
          "title": "工具调用先预检再执行，支持串行和并行两条路径"
        }
      ],
      [
        "context",
        "packages/coding-agent/src/core/compaction/compaction.ts",
        {
          "path": "packages/coding-agent/src/core/compaction/compaction.ts",
          "start": 122,
          "end": 132,
          "snippet": "  122  export interface CompactionSettings {\n  123  \tenabled: boolean;\n  124  \treserveTokens: number;\n  125  \tkeepRecentTokens: number;\n  126  }\n  127  \n  128  export const DEFAULT_COMPACTION_SETTINGS: CompactionSettings = {\n  129  \tenabled: true,\n  130  \treserveTokens: 16384,\n  131  \tkeepRecentTokens: 20000,\n  132  };",
          "findingId": "prime-context-001",
          "title": "默认压缩预留 16384 token，尾部保留 20000 token"
        }
      ],
      [
        "security",
        "packages/agent/src/agent-loop.ts",
        {
          "path": "packages/agent/src/agent-loop.ts",
          "start": 795,
          "end": 848,
          "snippet": "  795  async function prepareToolCall(\n  796  \tcurrentContext: AgentContext,\n  797  \tassistantMessage: AssistantMessage,\n  798  \ttoolCall: AgentToolCall,\n  799  \tconfig: AgentLoopConfig,\n  800  \tsignal: AbortSignal | undefined,\n  801  ): Promise<PreparedToolCall | ImmediateToolCallOutcome> {\n  802  \tconst tool = currentContext.tools?.find((t) => t.name === toolCall.name);\n  803  \tif (!tool) {\n  804  \t\treturn {\n  805  \t\t\tkind: \"immediate\",\n  806  \t\t\tresult: createErrorToolResult(`Tool ${toolCall.name} not found`),\n  807  \t\t\tisError: true,\n  808  \t\t};\n  809  \t}\n  810  \n  811  \ttry {\n  812  \t\tconst preparedToolCall = prepareToolCallArguments(tool, toolCall);\n  813  \t\tconst validatedArgs = validateToolArguments(tool, preparedToolCall);\n  814  \t\tif (config.beforeToolCall) {\n  815  \t\t\tconst beforeResult = await maybePromiseWithAbort(\n  816  \t\t\t\tconfig.beforeToolCall(\n  817  \t\t\t\t\t{\n  818  \t\t\t\t\t\tassistantMessage,\n  819  \t\t\t\t\t\ttoolCall,\n  820  \t\t\t\t\t\targs: validatedArgs,\n  821  \t\t\t\t\t\tcontext: currentContext,\n  822  \t\t\t\t\t},\n  823  \t\t\t\t\tsignal,\n  824  \t\t\t\t),",
          "findingId": "prime-tools-002",
          "title": "before/after tool hook 是可编程的策略门"
        }
      ],
      [
        "ecosystem",
        "packages/coding-agent/src/core/resource-loader.ts",
        {
          "path": "packages/coding-agent/src/core/resource-loader.ts",
          "start": 23,
          "end": 39,
          "snippet": "   23  export interface ResourceExtensionPaths {\n   24  \tskillPaths?: Array<{ path: string; metadata: PathMetadata }>;\n   25  \tpromptPaths?: Array<{ path: string; metadata: PathMetadata }>;\n   26  \tthemePaths?: Array<{ path: string; metadata: PathMetadata }>;\n   27  }\n   28  \n   29  export interface ResourceLoader {\n   30  \tgetExtensions(): LoadExtensionsResult;\n   31  \tgetSkills(): { skills: Skill[]; diagnostics: ResourceDiagnostic[] };\n   32  \tgetPrompts(): { prompts: PromptTemplate[]; diagnostics: ResourceDiagnostic[] };\n   33  \tgetThemes(): { themes: Theme[]; diagnostics: ResourceDiagnostic[] };\n   34  \tgetAgentsFiles(): { agentsFiles: Array<{ path: string; content: string }> };\n   35  \tgetSystemPrompt(): string | undefined;\n   36  \tgetAppendSystemPrompt(): string[];\n   37  \textendResources(paths: ResourceExtensionPaths): void;\n   38  \treload(): Promise<void>;\n   39  }",
          "findingId": "prime-resources-001",
          "title": "ResourceLoader 统一管理 skills、prompts、themes、extensions 和 AGENTS 文件"
        }
      ],
      [
        "collaboration",
        "packages/coding-agent/src/core/rlm-runtime.ts",
        {
          "path": "packages/coding-agent/src/core/rlm-runtime.ts",
          "start": 14,
          "end": 39,
          "snippet": "   14  export interface RlmSpawnHandle {\n   15  \trlm_child_id: string;\n   16  \tname: string;\n   17  \tsession_dir: string;\n   18  \tmodel: string;\n   19  }\n   20  \n   21  export type RlmSubagentRegistryStatus = \"running\" | \"completed\" | \"error\";\n   22  \n   23  export interface RlmSubagentRegistryEntry {\n   24  \trlm_child_id: string;\n   25  \tactive_session_id: string | null;\n   26  \tsession_id: string | null;\n   27  \tsession_name: string;\n   28  \tsession_dir: string;\n   29  \tstatus: RlmSubagentRegistryStatus;\n   30  }\n   31  \n   32  export interface RlmListSubagentsResult {\n   33  \tsubagents: RlmSubagentRegistryEntry[];\n   34  }\n   35  \n   36  export interface RlmDeleteSubagentResult {\n   37  \tsubagent: RlmSubagentRegistryEntry;\n   38  \toutcome?: \"deleted\" | \"skipped_running\";\n   39  }",
          "findingId": "prime-collab-001",
          "title": "RLM child runtime 有显式 registry、深度和完成释放协议"
        }
      ],
      [
        "evidence",
        "packages/coding-agent/src/core/session-manager.ts",
        {
          "path": "packages/coding-agent/src/core/session-manager.ts",
          "start": 33,
          "end": 54,
          "snippet": "   33  export const CURRENT_SESSION_VERSION = 3;\n   34  const SESSION_LIST_SEARCH_TEXT_MAX_CHARS = 64 * 1024;\n   35  const SESSION_LIST_PARSE_MAX_LINE_CHARS = 1024 * 1024;\n   36  const SESSION_LIST_LARGE_MESSAGE_PREVIEW_MAX_CHARS = 256;\n   37  const SESSION_STREAMING_LOAD_THRESHOLD_BYTES = 128 * 1024 * 1024;\n   38  const SESSION_ASYNC_PARSE_YIELD_BYTES = 4 * 1024 * 1024;\n   39  \n   40  // Entry types that can represent user intent (vs. daemon bookkeeping like\n   41  // session_state/agent_status/git_state/child_usage_attributed). Used by\n   42  // hasUserContent to decide whether a message-less draft is safe to discard.\n   43  const CONTENT_ENTRY_TYPES = new Set([\n   44  \t\"message\",\n   45  \t\"custom_message\",\n   46  \t\"custom\",\n   47  \t\"model_change\",\n   48  \t\"thinking_level_change\",\n   49  \t\"service_tier_change\",\n   50  \t\"session_info\",\n   51  \t\"label\",\n   52  \t\"compaction\",\n   53  \t\"branch_summary\",\n   54  ]);",
          "findingId": "prime-persistence-001",
          "title": "SessionManager 用带 parentId 的 JSONL 树表达分支、压缩和扩展状态"
        }
      ]
    ]
  },
  {
    "slug": "deepagents",
    "name": "DeepAgents",
    "repo": "langchain-ai/deepagents",
    "branch": "main",
    "commit": "217b9eb372fa51b0439434f31abc3ac22e6cd7f2",
    "date": "2026-08-12T17:47:00-07:00",
    "language": "Python / Markdown / Shell",
    "kind": "Legacy source-backed harness audit",
    "legacy": true,
    "zh": {
      "thesis": "DeepAgents 的既有源码账本覆盖 11 个 Harness 维度；这次迁移把原有事实重新排成单页分析和十章教程，不把 README 当作实现证据。",
      "strengths": [
        "DeepAgents 把 Agent 看成一张可配置的 LangGraph：模型、文件工具、子 Agent、压缩、记忆和审批都作为中间件节点组合。",
        "顺序不是装饰：先把文件/任务工具放进去，再做压缩和 prompt cache，最后把 memory 与审批接在尾部；核心骨架不能被 profile 随意删掉。",
        "它不会给所有模型硬塞同一个消息数量，而是尽量按模型实际输入窗口比例决定何时压缩和保留多少。"
      ],
      "limits": [
        "first-match filesystem rules/HITL 很清晰，但 permissions 对能 execute 的 backend 明确暂不支持通用 tool-level gate。",
        "当前页面复用既有源码账本；迁移到自研前仍需做部署级验证",
        "当前页面复用既有源码账本；迁移到自研前仍需做部署级验证"
      ],
      "lesson": "DeepAgents 把 Agent 看成一张可配置的 LangGraph：模型、文件工具、子 Agent、压缩、记忆和审批都作为中间件节点组合。"
    },
    "en": {
      "thesis": "The existing source ledger for DeepAgents covers 11 Harness dimensions. This migration reshapes those facts into a single analysis page and ten standalone chapters instead of treating README claims as implementation evidence.",
      "strengths": [
        "Pinned source findings expose the control loop",
        "Context, tools, and policy are separated into reviewable dimensions",
        "Each chapter keeps a file and line-range trail"
      ],
      "limits": [
        "This snapshot reuses the prior source ledger and its pinned commit",
        "Deployment-level behavior still needs a fresh run",
        "Legacy findings should be re-audited when the repository moves"
      ],
      "lesson": "Read the implementation as input, state, tool effect, receipt, and recovery—not as a feature list."
    },
    "anchors": [
      [
        "overview",
        "libs/deepagents/deepagents/graph.py",
        {
          "path": "libs/deepagents/deepagents/graph.py",
          "start": 268,
          "end": 300,
          "snippet": "  268  def create_deep_agent(  # noqa: C901, PLR0912, PLR0915  # Complex graph assembly logic with many conditional branches\n  269      model: str | BaseChatModel | None = None,\n  270      tools: Sequence[BaseTool | Callable | dict[str, Any]] | None = None,\n  271      *,\n  272      system_prompt: str | SystemMessage | None = None,\n  273      middleware: Sequence[AgentMiddleware[StateT_co, ContextT]] = (),\n  274      subagents: Sequence[SubAgent | CompiledSubAgent | AsyncSubAgent] | None = None,\n  275      skills: list[str] | None = None,\n  276      memory: list[str] | None = None,\n  277      permissions: list[FilesystemPermission] | None = None,\n  278      backend: BackendProtocol | None = None,\n  279      interrupt_on: dict[str, bool | InterruptOnConfig] | None = None,\n  280      response_format: ResponseFormat[ResponseT] | type[ResponseT] | dict[str, Any] | None = None,\n  281      state_schema: type[DeepAgentState] | None = None,\n  282      context_schema: type[ContextT] | None = None,\n  283      checkpointer: Checkpointer | None = None,\n  284      store: BaseStore | None = None,\n  285      debug: bool = False,\n  286      name: str | None = None,\n  287      cache: BaseCache | None = None,\n  288  ) -> CompiledStateGraph[AgentState[ResponseT], ContextT, InputAgentState, OutputAgentState[ResponseT]]:  # ty: ignore[invalid-type-arguments]  # ty can't verify generic TypedDicts satisfy StateLike bound\n  289      r\"\"\"Create a deep agent.\n  290  \n  291      By default, this agent has access to the following tools:\n  292  \n  293      - `ls`, `read_file`, `write_file`, `edit_file`, `glob`, `grep`: file operations\n  294      - `execute`: run shell commands\n  295      - `task`: call subagents\n  296  \n  297      The `execute` tool allows running shell commands if the backend implements",
          "findingId": "deep-arch-001",
          "title": "create_deep_agent 是 middleware graph builder，不是单一巨大 Agent 类"
        }
      ],
      [
        "architecture",
        "libs/deepagents/deepagents/graph.py",
        {
          "path": "libs/deepagents/deepagents/graph.py",
          "start": 361,
          "end": 401,
          "snippet": "  361          middleware: Additional middleware to apply after the base stack\n  362              but before the tail middleware. The full ordering is:\n  363  \n  364              Base stack:\n  365  \n  366              - [`SkillsMiddleware`][deepagents.middleware.skills.SkillsMiddleware] (if `skills` is provided)\n  367              - [`FilesystemMiddleware`][deepagents.middleware.filesystem.FilesystemMiddleware]\n  368              - [`SubAgentMiddleware`][deepagents.middleware.subagents.SubAgentMiddleware]\n  369                  (if any inline subagents — declarative\n  370                  [`SubAgent`][deepagents.middleware.subagents.SubAgent] or\n  371                  [`CompiledSubAgent`][deepagents.middleware.subagents.CompiledSubAgent]\n  372                  — are available)\n  373              - [`SummarizationMiddleware`][langchain.agents.middleware.SummarizationMiddleware]\n  374              - [`PatchToolCallsMiddleware`][deepagents.middleware.patch_tool_calls.PatchToolCallsMiddleware]\n  375              - [`AsyncSubAgentMiddleware`][deepagents.middleware.async_subagents.AsyncSubAgentMiddleware] (if async `subagents` are provided)\n  376  \n  377              *User middleware is inserted here.*\n  378  \n  379              Tail stack:\n  380  \n  381              - Harness profile `extra_middleware` (if any)\n  382              - `_ToolExclusionMiddleware` (if profile has `excluded_tools`)\n  383              - [`AnthropicPromptCachingMiddleware`][langchain_anthropic.middleware.AnthropicPromptCachingMiddleware] (unconditional; no-ops for\n  384                  non-Anthropic models)\n  385              - [`BedrockPromptCachingMiddleware`](https://reference.langchain.com/python/langchain-aws/middleware/prompt_caching/BedrockPromptCachingMiddleware)\n  386                  when `langchain-aws` is installed (no-ops for non-Bedrock models)\n  387              - [`FireworksPromptCachingMiddleware`](https://reference.langchain.com/python/integrations/langchain_fireworks/middleware/prompt_caching/FireworksPromptCachingMiddleware)\n  388                  when `langchain-fireworks` is installed (no-ops for non-Fireworks models)\n  389              - [`MemoryMiddleware`][deepagents.middleware.memory.MemoryMiddleware] (if `memory` is provided)\n  390              - [`HumanInTheLoopMiddleware`][langchain.agents.middleware.HumanInTheLoopMiddleware] (if `interrupt_on` is provided)",
          "findingId": "deep-arch-002",
          "title": "核心 middleware 有受保护的顺序和排除校验"
        }
      ],
      [
        "loop",
        "libs/deepagents/deepagents/middleware/summarization.py",
        {
          "path": "libs/deepagents/deepagents/middleware/summarization.py",
          "start": 249,
          "end": 289,
          "snippet": "  249  def compute_summarization_defaults(model: BaseChatModel) -> SummarizationDefaults:\n  250      \"\"\"Compute default summarization settings based on model profile.\n  251  \n  252      Args:\n  253          model: A resolved chat model instance.\n  254  \n  255      Returns:\n  256          Default settings for trigger, keep, and truncate_args_settings.\n  257              If the model has a profile with `max_input_tokens`, uses\n  258              fraction-based settings. Otherwise, uses fixed token/message counts.\n  259      \"\"\"\n  260      has_profile = (\n  261          model.profile is not None\n  262          and isinstance(model.profile, dict)\n  263          and \"max_input_tokens\" in model.profile\n  264          and isinstance(model.profile[\"max_input_tokens\"], int)\n  265      )\n  266  \n  267      if has_profile:\n  268          return {\n  269              \"trigger\": (\"fraction\", 0.85),\n  270              \"keep\": (\"fraction\", 0.10),\n  271              \"truncate_args_settings\": {\n  272                  \"trigger\": (\"fraction\", 0.85),\n  273                  \"keep\": (\"fraction\", 0.10),\n  274              },\n  275          }\n  276  \n  277      # Defaults for models without profile info are more conservative to avoid\n  278      # overshooting context limits.",
          "findingId": "deep-context-001",
          "title": "摘要默认按模型窗口的 85% 触发、保留 10%"
        }
      ],
      [
        "model",
        "libs/deepagents/deepagents/middleware/summarization.py",
        {
          "path": "libs/deepagents/deepagents/middleware/summarization.py",
          "start": 249,
          "end": 289,
          "snippet": "  249  def compute_summarization_defaults(model: BaseChatModel) -> SummarizationDefaults:\n  250      \"\"\"Compute default summarization settings based on model profile.\n  251  \n  252      Args:\n  253          model: A resolved chat model instance.\n  254  \n  255      Returns:\n  256          Default settings for trigger, keep, and truncate_args_settings.\n  257              If the model has a profile with `max_input_tokens`, uses\n  258              fraction-based settings. Otherwise, uses fixed token/message counts.\n  259      \"\"\"\n  260      has_profile = (\n  261          model.profile is not None\n  262          and isinstance(model.profile, dict)\n  263          and \"max_input_tokens\" in model.profile\n  264          and isinstance(model.profile[\"max_input_tokens\"], int)\n  265      )\n  266  \n  267      if has_profile:\n  268          return {\n  269              \"trigger\": (\"fraction\", 0.85),\n  270              \"keep\": (\"fraction\", 0.10),\n  271              \"truncate_args_settings\": {\n  272                  \"trigger\": (\"fraction\", 0.85),\n  273                  \"keep\": (\"fraction\", 0.10),\n  274              },\n  275          }\n  276  \n  277      # Defaults for models without profile info are more conservative to avoid\n  278      # overshooting context limits.",
          "findingId": "deep-context-001",
          "title": "摘要默认按模型窗口的 85% 触发、保留 10%"
        }
      ],
      [
        "tools",
        "libs/deepagents/deepagents/backends/protocol.py",
        {
          "path": "libs/deepagents/deepagents/backends/protocol.py",
          "start": 473,
          "end": 530,
          "snippet": "  473      def grep(\n  474          self,\n  475          pattern: str,\n  476          path: str | None = None,\n  477          glob: str | None = None,\n  478          *,\n  479          max_count: int | None = None,\n  480      ) -> \"GrepResult\":\n  481          \"\"\"Search for a literal text pattern in files.\n  482  \n  483          Args:\n  484              pattern: Literal string to search for (NOT regex).\n  485  \n  486                  Performs exact substring matching within file content.\n  487  \n  488                  Example: `\"TODO\"` matches any line containing `\"TODO\"`\n  489  \n  490              path: Optional directory path to search in.\n  491  \n  492                  If `None`, searches in current working directory.\n  493  \n  494                  Example: `'/workspace/src'`\n  495  \n  496              glob: Optional glob pattern to filter which FILES to search.\n  497  \n  498                  Filters by filename/path, not content.\n  499  \n  500                  Supports standard glob wildcards:\n  501  \n  502                  - `*` matches any characters in filename",
          "findingId": "deep-backend-002",
          "title": "搜索和编辑工具是结构化 API，不是原始 grep/sed 字符串"
        }
      ],
      [
        "context",
        "libs/deepagents/deepagents/middleware/summarization.py",
        {
          "path": "libs/deepagents/deepagents/middleware/summarization.py",
          "start": 249,
          "end": 289,
          "snippet": "  249  def compute_summarization_defaults(model: BaseChatModel) -> SummarizationDefaults:\n  250      \"\"\"Compute default summarization settings based on model profile.\n  251  \n  252      Args:\n  253          model: A resolved chat model instance.\n  254  \n  255      Returns:\n  256          Default settings for trigger, keep, and truncate_args_settings.\n  257              If the model has a profile with `max_input_tokens`, uses\n  258              fraction-based settings. Otherwise, uses fixed token/message counts.\n  259      \"\"\"\n  260      has_profile = (\n  261          model.profile is not None\n  262          and isinstance(model.profile, dict)\n  263          and \"max_input_tokens\" in model.profile\n  264          and isinstance(model.profile[\"max_input_tokens\"], int)\n  265      )\n  266  \n  267      if has_profile:\n  268          return {\n  269              \"trigger\": (\"fraction\", 0.85),\n  270              \"keep\": (\"fraction\", 0.10),\n  271              \"truncate_args_settings\": {\n  272                  \"trigger\": (\"fraction\", 0.85),\n  273                  \"keep\": (\"fraction\", 0.10),\n  274              },\n  275          }\n  276  \n  277      # Defaults for models without profile info are more conservative to avoid\n  278      # overshooting context limits.",
          "findingId": "deep-context-001",
          "title": "摘要默认按模型窗口的 85% 触发、保留 10%"
        }
      ],
      [
        "security",
        "libs/deepagents/deepagents/backends/state.py",
        {
          "path": "libs/deepagents/deepagents/backends/state.py",
          "start": 37,
          "end": 47,
          "snippet": "   37  class StateBackend(BackendProtocol):\n   38      \"\"\"Backend that stores files in agent state (ephemeral).\n   39  \n   40      Uses LangGraph's state management and checkpointing. Files persist within\n   41      a conversation thread but not across threads. State is automatically\n   42      checkpointed after each agent step.\n   43  \n   44      Reads and writes go through LangGraph's `CONFIG_KEY_READ` /\n   45      `CONFIG_KEY_SEND` so that state updates are applied as channel writes\n   46      to the `files` state key.\n   47      \"\"\"",
          "findingId": "deep-backend-003",
          "title": "SDK 默认 StateBackend 是会话内临时存储，execute 只对 sandbox backend 出现"
        }
      ],
      [
        "ecosystem",
        "libs/deepagents/deepagents/middleware/skills.py",
        {
          "path": "libs/deepagents/deepagents/middleware/skills.py",
          "start": 721,
          "end": 761,
          "snippet": "  721  SKILLS_SYSTEM_PROMPT = \"\"\"## Skills System\n  722  \n  723  You have access to a skills library that provides specialized capabilities and domain knowledge.\n  724  \n  725  {skills_locations}{skills_load_warnings}\n  726  \n  727  Sources labeled \"Deepagents\" are specific to this agent tool; sources labeled \"Agents\" are shared across all agent tools on this machine.\n  728  \n  729  **Available Skills:**\n  730  \n  731  {skills_list}\n  732  \n  733  **How to Use Skills (Progressive Disclosure):**\n  734  \n  735  Skills follow a **progressive disclosure** pattern - you see their name and description above, but only read full instructions when needed:\n  736  \n  737  1. **Recognize when a skill applies**: Check if the user's task matches a skill's description\n  738  2. **Read the skill's full instructions**: Use `read_file` on the path shown in the skill list above.\n  739      Pass `limit=1000` since the default of 100 lines is too small for most skill files.\n  740  3. **Follow the skill's instructions**: SKILL.md contains step-by-step workflows, best practices, and examples\n  741  4. **Access supporting files**: Skills may include helper scripts, configs, or reference docs - use absolute paths\n  742  \n  743  **When to Use Skills:**\n  744  \n  745  - User's request matches a skill's domain (e.g., \"research X\" -> web-research skill)\n  746  - You need specialized knowledge or structured workflows\n  747  - A skill provides proven patterns for complex tasks\n  748  \n  749  **Executing Skill Scripts:**\n  750  Skills may contain Python scripts or other executable files. Always use absolute paths from the skill list.",
          "findingId": "deep-skills-001",
          "title": "Skills 使用 progressive disclosure，先给索引再按需读 SKILL.md"
        }
      ],
      [
        "collaboration",
        "libs/deepagents/deepagents/middleware/subagents.py",
        {
          "path": "libs/deepagents/deepagents/middleware/subagents.py",
          "start": 402,
          "end": 420,
          "snippet": "  402  def _build_task_tool(  # noqa: C901, PLR0915\n  403      subagents: Sequence[SubAgent | CompiledSubAgent],\n  404      task_description: str | None = None,\n  405      *,\n  406      private_state_keys: frozenset[str] = frozenset(),\n  407      state_schema: type | None = None,\n  408  ) -> BaseTool:\n  409      \"\"\"Create a task tool from subagent specs.\n  410  \n  411      Args:\n  412          subagents: List of raw or compiled subagent specs.\n  413          task_description: Custom description for the task tool. If `None`,\n  414              uses default template. Supports `{available_agents}` placeholder.\n  415          private_state_keys: State keys marked with `PrivateStateAttr` that\n  416              should be stripped from parent state before invoking subagents.\n  417          state_schema: Base graph state schema forwarded to raw subagent specs.\n  418  \n  419      Returns:\n  420          A StructuredTool that can invoke subagents by type.",
          "findingId": "deep-collab-001",
          "title": "task 子 Agent 只拿到新的 HumanMessage，并过滤 private state"
        }
      ],
      [
        "evidence",
        "libs/code/deepagents_code/agent.py",
        {
          "path": "libs/code/deepagents_code/agent.py",
          "start": 2807,
          "end": 2849,
          "snippet": " 2807      # Set up composite backend with routing.\n 2808      if sandbox is None:\n 2809          # Local mode normally lets large results fall through to the default\n 2810          # backend at the real, hardened `artifacts_root`, so filesystem tools and\n 2811          # `execute` receive the same host path. If that predictable directory is\n 2812          # unusable, `_artifacts_root` supplies a stable virtual root plus private\n 2813          # temporary storage, and `large_tool_results` is routed there explicitly.\n 2814          # Conversation history always has a dedicated route to persistent storage.\n 2815          # The fallback alias remains installed even after the predictable directory\n 2816          # recovers, so archive paths saved during fallback stay resolvable.\n 2817          artifacts_storage = _artifacts_root()\n 2818          artifacts_root = artifacts_storage.root\n 2819          conversation_history_backend = FilesystemBackend(\n 2820              root_dir=_offload_fallback_root() / CONVERSATION_HISTORY_DIRNAME,\n 2821              virtual_mode=True,\n 2822          )\n 2823          fallback_history_root = (\n 2824              f\"{_FALLBACK_ARTIFACTS_ROOT}/{CONVERSATION_HISTORY_DIRNAME}/\"\n 2825          )\n 2826          artifact_routes: dict[str, BackendProtocol] = {\n 2827              f\"{artifacts_root}/{CONVERSATION_HISTORY_DIRNAME}/\": (\n 2828                  conversation_history_backend\n 2829              ),\n 2830              fallback_history_root: conversation_history_backend,\n 2831          }\n 2832          if artifacts_storage.large_results_dir is not None:\n 2833              artifact_routes[f\"{artifacts_root}/large_tool_results/\"] = (\n 2834                  FilesystemBackend(\n 2835                      root_dir=artifacts_storage.large_results_dir,\n 2836                      virtual_mode=True,",
          "findingId": "deep-runtime-002",
          "title": "CLI 用 CompositeBackend 把 conversation history 和 large results 路由到 artifact 根"
        }
      ]
    ]
  }
];
