// Generated from data/legacy/inventory.json and data/legacy/evidence/*/evidence.json.
export const legacyProjects = [
  {
    "slug": "goose",
    "name": "Goose",
    "repo": "aaif-goose/goose",
    "branch": "main",
    "commit": "021b0db8dbee8d6c7e9ffbab580a4143598a3560",
    "date": "2026-07-27T16:41:11-04:00",
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
          "snippet": " 1930          let inner = Box::pin(async_stream::try_stream! {\n 1931              let mut turns_taken = 0u32;\n 1932              let max_turns = session_config.max_turns.unwrap_or_else(|| {\n 1933                  Config::global()\n 1934                      .get_param::<u32>(\"GOOSE_MAX_TURNS\")\n 1935                      .unwrap_or(DEFAULT_MAX_TURNS)\n 1936              });\n 1937              let mut compaction_attempts = 0;\n 1938              let mut empty_turn_retries = 0u32;\n 1939              let mut retrying_after_empty_turn = false;\n 1940              let mut last_assistant_text = String::new();\n 1941              let mut goal_check_pending = false;\n 1942              let mut tool_pair_summarization_done = false;\n 1943              let mut stop_hook_handled_for_exit = false;\n 1944              let mut retrying_after_stop_hook_denial = false;\n 1945              let mut consecutive_stop_hook_blocks = 0u32;\n 1946              let stop_hook_block_cap = self.stop_hook_block_cap();\n 1947              let mut can_drain_pending_steers = false;\n 1948  \n 1949              loop {\n 1950                  if is_token_cancelled(&cancel_token) {\n 1951                      break;\n 1952                  }\n 1953  \n 1954                  if can_drain_pending_steers {\n 1955                      for message in self.drain_pending_steers(&session_config.id).await {\n 1956                          let message_text = agent_visible_message_text(&message);\n 1957                          if self\n 1958                              .hook_manager\n 1959                              .has_hooks(crate::hooks::HookEvent::UserPromptSubmit)",
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
          "snippet": "   67  use tracing::{debug, error, info, instrument, warn};\n   68  \n   69  const DEFAULT_MAX_TURNS: u32 = 1000;\n   70  const DEFAULT_STOP_HOOK_BLOCK_CAP: u32 = 8;\n   71  const COMPACTION_PROGRESS_TEXT: &str = \"goose is compacting the conversation...\";\n   72  const MAX_TURNS_MESSAGE: &str = \"I've reached the maximum number of actions I can do without user input. Would you like me to continue?\";\n   73  const MAX_EMPTY_TURN_RETRIES: u32 = 3;\n   74  const EMPTY_TURN_MESSAGE: &str =\n   75      \"The model returned an empty response. Please resend your message to continue.\";\n   76  const DEFAULT_FRONTEND_INSTRUCTIONS: &str = \"The following tools are provided directly by the frontend and will be executed by the frontend when called.\";\n   77  \n   78  #[derive(Debug, Clone, Copy, PartialEq, Eq)]\n   79  enum ToolCategory {",
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
          "snippet": "  281  /// A message stream yields partial text content but complete tool calls, all within the Message object\n  282  /// So a message with text will contain potentially just a word of a longer response, but tool calls\n  283  /// messages will only be yielded once concatenated.\n  284  pub type MessageStream = Pin<\n  285      Box<dyn Stream<Item = Result<(Option<Message>, Option<ProviderUsage>), ProviderError>> + Send>,\n  286  >;",
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
          "snippet": "  281  /// A message stream yields partial text content but complete tool calls, all within the Message object\n  282  /// So a message with text will contain potentially just a word of a longer response, but tool calls\n  283  /// messages will only be yielded once concatenated.\n  284  pub type MessageStream = Pin<\n  285      Box<dyn Stream<Item = Result<(Option<Message>, Option<ProviderUsage>), ProviderError>> + Send>,\n  286  >;",
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
          "snippet": " 2210                                      // Run all tool inspectors\n 2211                                      let inspection_results = self.tool_inspection_manager\n 2212                                          .inspect_tools(\n 2213                                              &session_config.id,\n 2214                                              &remaining_requests,\n 2215                                              conversation.messages(),\n 2216                                              goose_mode,\n 2217                                          )\n 2218                                          .await?;\n 2219  \n 2220                                      let permission_check_result = self.tool_inspection_manager\n 2221                                          .process_inspection_results_with_permission_inspector(\n 2222                                              &remaining_requests,\n 2223                                              &inspection_results,\n 2224                                          )\n 2225                                          .unwrap_or_else(|| {\n 2226                                              let mut result = PermissionCheckResult {\n 2227                                                  approved: vec![],\n 2228                                                  needs_approval: vec![],\n 2229                                                  denied: vec![],\n 2230                                              };\n 2231                                              result.needs_approval.extend(remaining_requests.iter().cloned());\n 2232                                              result\n 2233                                          });\n 2234  \n 2235                                      // Track extension requests\n 2236                                      let mut enable_extension_request_ids = vec![];\n 2237                                      for request in &remaining_requests {\n 2238                                          if let Ok(tool_call) = &request.tool_call {\n 2239                                              if tool_call.name == MANAGE_EXTENSIONS_TOOL_NAME_COMPLETE {",
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
          "snippet": "   26  pub const DEFAULT_COMPACTION_THRESHOLD: f64 = 0.8;\n   27  \n   28  const TOOLCALL_SUMMARIZATION_BATCH_SIZE: usize = 10;\n   29  \n   30  fn tool_pair_summarization_enabled() -> bool {\n   31      Config::global()\n   32          .get_param::<bool>(\"GOOSE_TOOL_PAIR_SUMMARIZATION\")\n   33          .unwrap_or(true)\n   34  }\n   35  \n   36  const CONVERSATION_CONTINUATION_TEXT: &str =\n   37      \"Your context was compacted. The previous message contains a summary of the conversation so far.\n   38  Do not mention that you read a summary or that conversation summarization occurred.\n   39  Just continue the conversation naturally based on the summarized context.\";\n   40  \n   41  const TOOL_LOOP_CONTINUATION_TEXT: &str =\n   42      \"Your context was compacted. The previous message contains a summary of the conversation so far.\n   43  Do not mention that you read a summary or that conversation summarization occurred.\n   44  Continue calling tools as necessary to complete the task.\";\n   45  \n   46  const MANUAL_COMPACT_CONTINUATION_TEXT: &str =\n   47      \"Your context was compacted at the user's request. The previous message contains a summary of the conversation so far.\n   48  Do not mention that you read a summary or that conversation summarization occurred.\n   49  Just continue the conversation naturally based on the summarized context.\";",
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
          "snippet": "  659      /// Create a tool inspection manager with default inspectors\n  660      fn create_tool_inspection_manager(\n  661          permission_manager: Arc<PermissionManager>,\n  662          provider: SharedProvider,\n  663          session_manager: Arc<SessionManager>,\n  664      ) -> ToolInspectionManager {\n  665          let mut tool_inspection_manager = ToolInspectionManager::new();\n  666  \n  667          // Add security inspector (highest priority - runs first)\n  668          tool_inspection_manager.add_inspector(Box::new(SecurityInspector::new()));\n  669          tool_inspection_manager.add_inspector(Box::new(EgressInspector::new()));\n  670  \n  671          // Add adversary inspector (LLM-based review, enabled by ~/.config/goose/adversary.md)\n  672          tool_inspection_manager.add_inspector(Box::new(AdversaryInspector::new(\n  673              provider.clone(),\n  674              session_manager.clone(),\n  675          )));\n  676  \n  677          // Add permission inspector (medium-high priority)\n  678          tool_inspection_manager.add_inspector(Box::new(PermissionInspector::new(\n  679              permission_manager,\n  680              provider,\n  681              session_manager,\n  682          )));\n  683  \n  684          // Add repetition inspector (lower priority - basic repetition checking)\n  685          tool_inspection_manager.add_inspector(Box::new(RepetitionInspector::new(None)));\n  686  \n  687          tool_inspection_manager\n  688      }",
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
          "snippet": " 1271      /// Get all tools from all clients with proper prefixing\n 1272      pub async fn get_prefixed_tools(\n 1273          &self,\n 1274          session_id: &str,\n 1275          extension_name: Option<String>,\n 1276      ) -> ExtensionResult<Vec<Tool>> {\n 1277          let all_tools = self.get_all_tools_cached(session_id).await?;\n 1278          Ok(self.filter_tools(&all_tools, extension_name.as_deref(), None))\n 1279      }\n 1280  \n 1281      pub async fn get_prefixed_tools_excluding(\n 1282          &self,\n 1283          session_id: &str,\n 1284          exclude: &str,\n 1285      ) -> ExtensionResult<Vec<Tool>> {\n 1286          let all_tools = self.get_all_tools_cached(session_id).await?;\n 1287          Ok(self.filter_tools(&all_tools, None, Some(exclude)))\n 1288      }\n 1289  \n 1290      fn filter_tools(\n 1291          &self,\n 1292          tools: &[Tool],\n 1293          extension_name: Option<&str>,\n 1294          exclude: Option<&str>,\n 1295      ) -> Vec<Tool> {\n 1296          let extension_name_normalized = extension_name.map(name_to_key);\n 1297          let exclude_normalized = exclude.map(name_to_key);\n 1298  \n 1299          tools\n 1300              .iter()",
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
          "snippet": "   45  pub enum SessionType {\n   46      #[default]\n   47      User,\n   48      Scheduled,\n   49      SubAgent,\n   50      Hidden,\n   51      Terminal,\n   52      Gateway,\n   53      Acp,\n   54  }\n   55  \n   56  static SESSION_STORAGE: LazyLock<Arc<SessionStorage>> =\n   57      LazyLock::new(|| Arc::new(SessionStorage::new(Paths::data_dir())));\n   58  \n   59  #[derive(Debug, Clone, Serialize, Deserialize)]\n   60  pub struct Session {\n   61      pub id: String,\n   62      pub working_dir: PathBuf,\n   63      #[serde(alias = \"description\")]\n   64      pub name: String,\n   65      #[serde(default)]\n   66      pub user_set_name: bool,\n   67      #[serde(default)]\n   68      pub session_type: SessionType,\n   69      pub created_at: DateTime<Utc>,\n   70      pub updated_at: DateTime<Utc>,\n   71      pub extension_data: ExtensionData,\n   72      #[serde(default)]\n   73      pub usage: Usage,\n   74      #[serde(default)]",
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
    "commit": "02d9359435d0e9c20a20945679389cdce441e431",
    "date": "2026-07-27T17:54:34Z",
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
          "snippet": "  120  pub(super) async fn run_session(\n  121      session: Arc<SessionActor>,\n  122      mut cmd_rx: mpsc::UnboundedReceiver<SessionCommand>,\n  123      mut chat_state_event_rx: mpsc::UnboundedReceiver<xai_chat_state::ChatStateEvent>,\n  124      mut event_rx: mpsc::UnboundedReceiver<SessionEvent>,\n  125      fs_notify_config: Option<ClientFsConfig>,\n  126      codebase_indexes: std::sync::Arc<parking_lot::Mutex<CodebaseIndexManager>>,\n  127      index_root: std::path::PathBuf,\n  128      fs_watch_caps: fs_watch::FsWatchCapabilities,\n  129  ) {\n  130      let (completion_tx, mut completion_rx) =\n  131          mpsc::unbounded_channel::<(String, PromptTurnResult)>();\n  132      tracing::debug!(\"fs_notify_config: {:?}\", fs_notify_config);\n  133      let mut replay_buffer = ReplayBuffer::new(session.buffering_settings.clone());\n  134      let event_tx_for_flush_timer = session.event_tx.clone();\n  135      let buffering_flush_interval = replay_buffer.max_wait_duration_ms();\n  136      if let Some(buffering_flush_interval) = buffering_flush_interval {\n  137          tokio::task::spawn_local(async move {\n  138              let mut interval = tokio::time::interval(Duration::from_millis(std::cmp::max(\n  139                  20,\n  140                  buffering_flush_interval * 2,\n  141              )));\n  142              loop {\n  143                  interval.tick().await;\n  144                  let _ =\n  145                      event_tx_for_flush_timer.send(SessionEvent::FlushReplay { respond_to: None });\n  146              }\n  147          });\n  148      }\n  149      let _workflow_watch = crate::config::watcher::ProjectDiscoveryWatcher::start(",
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
          "snippet": "  355      /// Prepare → dispatch → post-flight. Caller owns the outer tail flush.\n  356      async fn execute_tool_calls_batch(\n  357          &self,\n  358          tool_calls: Vec<crate::sampling::types::ToolCallResponse>,\n  359          deferred_followups: &mut Vec<ConversationItem>,\n  360          final_result: &mut Option<ToolLoop>,\n  361      ) -> Result<(), acp::Error> {\n  362          let mut approved: Vec<PreparedToolCall> = Vec::new();\n  363          for call in tool_calls.into_iter() {\n  364              if final_result.is_some() {\n  365                  let message = match &*final_result {\n  366                      Some(ToolLoop::PermissionReject { .. }) => {\n  367                          format!(\n  368                              \"Tool execution cancelled due to earlier permission rejection for tool `{}`\",\n  369                              call.function.name\n  370                          )\n  371                      }\n  372                      Some(ToolLoop::Cancelled) => {\n  373                          format!(\n  374                              \"Tool execution cancelled due to earlier user cancellation for tool `{}`\",\n  375                              call.function.name\n  376                          )\n  377                      }\n  378                      Some(ToolLoop::FollowupMessage(_)) => {\n  379                          format!(\n  380                              \"Tool execution cancelled due to earlier user followup message for tool `{}`\",\n  381                              call.function.name\n  382                          )\n  383                      }\n  384                      _ => {",
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
          "snippet": "  355      /// Prepare → dispatch → post-flight. Caller owns the outer tail flush.\n  356      async fn execute_tool_calls_batch(\n  357          &self,\n  358          tool_calls: Vec<crate::sampling::types::ToolCallResponse>,\n  359          deferred_followups: &mut Vec<ConversationItem>,\n  360          final_result: &mut Option<ToolLoop>,\n  361      ) -> Result<(), acp::Error> {\n  362          let mut approved: Vec<PreparedToolCall> = Vec::new();\n  363          for call in tool_calls.into_iter() {\n  364              if final_result.is_some() {\n  365                  let message = match &*final_result {\n  366                      Some(ToolLoop::PermissionReject { .. }) => {\n  367                          format!(\n  368                              \"Tool execution cancelled due to earlier permission rejection for tool `{}`\",\n  369                              call.function.name\n  370                          )\n  371                      }\n  372                      Some(ToolLoop::Cancelled) => {\n  373                          format!(\n  374                              \"Tool execution cancelled due to earlier user cancellation for tool `{}`\",\n  375                              call.function.name\n  376                          )\n  377                      }\n  378                      Some(ToolLoop::FollowupMessage(_)) => {\n  379                          format!(\n  380                              \"Tool execution cancelled due to earlier user followup message for tool `{}`\",\n  381                              call.function.name\n  382                          )\n  383                      }\n  384                      _ => {",
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
          "snippet": "  355      /// Prepare → dispatch → post-flight. Caller owns the outer tail flush.\n  356      async fn execute_tool_calls_batch(\n  357          &self,\n  358          tool_calls: Vec<crate::sampling::types::ToolCallResponse>,\n  359          deferred_followups: &mut Vec<ConversationItem>,\n  360          final_result: &mut Option<ToolLoop>,\n  361      ) -> Result<(), acp::Error> {\n  362          let mut approved: Vec<PreparedToolCall> = Vec::new();\n  363          for call in tool_calls.into_iter() {\n  364              if final_result.is_some() {\n  365                  let message = match &*final_result {\n  366                      Some(ToolLoop::PermissionReject { .. }) => {\n  367                          format!(\n  368                              \"Tool execution cancelled due to earlier permission rejection for tool `{}`\",\n  369                              call.function.name\n  370                          )\n  371                      }\n  372                      Some(ToolLoop::Cancelled) => {\n  373                          format!(\n  374                              \"Tool execution cancelled due to earlier user cancellation for tool `{}`\",\n  375                              call.function.name\n  376                          )\n  377                      }\n  378                      Some(ToolLoop::FollowupMessage(_)) => {\n  379                          format!(\n  380                              \"Tool execution cancelled due to earlier user followup message for tool `{}`\",\n  381                              call.function.name\n  382                          )\n  383                      }\n  384                      _ => {",
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
          "snippet": "  355      /// Prepare → dispatch → post-flight. Caller owns the outer tail flush.\n  356      async fn execute_tool_calls_batch(\n  357          &self,\n  358          tool_calls: Vec<crate::sampling::types::ToolCallResponse>,\n  359          deferred_followups: &mut Vec<ConversationItem>,\n  360          final_result: &mut Option<ToolLoop>,\n  361      ) -> Result<(), acp::Error> {\n  362          let mut approved: Vec<PreparedToolCall> = Vec::new();\n  363          for call in tool_calls.into_iter() {\n  364              if final_result.is_some() {\n  365                  let message = match &*final_result {\n  366                      Some(ToolLoop::PermissionReject { .. }) => {\n  367                          format!(\n  368                              \"Tool execution cancelled due to earlier permission rejection for tool `{}`\",\n  369                              call.function.name\n  370                          )\n  371                      }\n  372                      Some(ToolLoop::Cancelled) => {\n  373                          format!(\n  374                              \"Tool execution cancelled due to earlier user cancellation for tool `{}`\",\n  375                              call.function.name\n  376                          )\n  377                      }\n  378                      Some(ToolLoop::FollowupMessage(_)) => {\n  379                          format!(\n  380                              \"Tool execution cancelled due to earlier user followup message for tool `{}`\",\n  381                              call.function.name\n  382                          )\n  383                      }\n  384                      _ => {",
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
          "snippet": "    3  //! This module contains all compaction-related methods: manual `/compact`,\n    4  //! auto-compact threshold checks, inline auto-compact with auto-continue,\n    5  //! error-recovery compaction, preflight overflow detection, and checkpoint\n    6  //! persistence. These methods form a second `impl SessionActor` block that\n    7  //! lives alongside the primary one in `acp_session.rs`.\n    8  use super::SessionActor;\n    9  use super::is_project_instructions;\n   10  use crate::remote::DEFAULT_CONTEXT_WINDOW;\n   11  use crate::session::compaction_config::{\n   12      AsyncCompactionCache, SUPPRESS_AUTH, SUPPRESS_NONE, SUPPRESS_STICKY, SUPPRESS_TURN,\n   13      SUPPRESS_UNTIL_SUCCESS,\n   14  };\n   15  use crate::session::helpers::CompactionStateContext;\n   16  use crate::session::helpers::compaction_context::CompactionInputs;\n   17  use crate::session::helpers::compaction_context::to_system_reminder;\n   18  use crate::session::helpers::session_compact::{\n   19      CompactOutput, CompactionOutcome, build_compaction_chat_history,\n   20      build_two_pass_compaction_prompt, generate_session_compact, is_context_length_error,\n   21  };\n   22  use crate::session::persistence::PersistenceMsg;\n   23  use crate::session::two_pass::{\n   24      TWO_PASS_DEFAULT_SPLIT_FRACTION, build_two_pass_pass1_history, build_two_pass_pass2_history,\n   25      note_for_two_pass_pass2, split_conversation_for_two_pass,\n   26  };\n   27  use agent_client_protocol as acp;\n   28  use std::sync::Arc;\n   29  use xai_chat_state::compaction_utils::{\n   30      CompactedHistoryInput, CompactionAttempt, build_compacted_history, is_degenerate_summary,\n   31      prepare_conversation_for_verbatim_summarization, sanitize_compacted_history,\n   32      validate_compacted_history,",
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
          "snippet": "  157  /// Verdict for a tool call evaluated against the plan-mode edit gate.\n  158  #[derive(Debug, Clone, Copy, PartialEq, Eq)]\n  159  pub(super) enum PlanEditGate {\n  160      /// Execute normally (plan mode inactive, not an edit, or allowed target).\n  161      Allow,\n  162      /// Grok-toolset edit outside the plan file (plan-file-only rule).\n  163      RejectNonPlanFile,\n  164  }\n  165  /// Gate edit-class tool calls while plan mode is active.\n  166  ///\n  167  /// Plan mode is read-only **in every permission mode, including\n  168  /// always-approve**: the permission manager's YOLO fast path deliberately\n  169  /// knows nothing about plan mode, so this gate — not the permission system —\n  170  /// is what enforces it. Two rules, matching the two toolsets' contracts:\n  171  ///\n  172  /// - **Compat-toolset `Write`/`StrReplace`**: any markdown\n  173  ///   file is editable in plan mode (plan docs are written with these\n  174  ///   same tools); everything else is rejected. Pre-existing behavior.\n  175  /// - **Compat-toolset `Delete`** is **not** on the markdown carve-out: it maps to\n  176  ///   `AccessKind::Edit` and is plan-file-only (same as grok edits). Deleting\n  177  ///   an arbitrary `.md` in plan mode must not pass.\n  178  /// - **Every other edit tool** (`AccessKind::Edit`) is restricted to the plan\n  179  ///   file itself, via the same predicate that auto-approves plan-file edits\n  180  ///   ([`PlanModeTracker::should_auto_approve_edit`]) so the gate and the\n  181  ///   permission bypass can never disagree.\n  182  ///\n  183  /// `apply_patch` maps to a placeholder `AccessKind::Edit(\"apply_patch\")` and\n  184  /// therefore never matches the plan file: it is always rejected in plan mode\n  185  /// (conservative — per-file targets are only known after patch parsing).\n  186  /// Non-edit tools (bash, read, grep, MCP, web) are never gated here; they",
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
          "snippet": "  811          {\n  812              let _span = tracing::info_span!(\"tool.register\").entered();\n  813              let early_raw_input =\n  814                  serde_json::from_str::<serde_json::Value>(&call.function.arguments).ok();\n  815              let subagent_background = matches!(\n  816                  call.function.name.as_str(),\n  817                  \"task\" | \"Task\" | \"spawn_subagent\"\n  818              )\n  819              .then(|| {\n  820                  early_raw_input\n  821                      .as_ref()\n  822                      .and_then(|v| v.get(\"run_in_background\").or_else(|| v.get(\"background\")))\n  823                      .and_then(serde_json::Value::as_bool)\n  824                      .unwrap_or(true)\n  825              });\n  826              let mut meta = self.stamp_tool_meta(None, &call.function.name, None);\n  827              if let Some(bg) = subagent_background {\n  828                  meta.get_or_insert_with(serde_json::Map::new).insert(\n  829                      \"subagentBackground\".to_string(),\n  830                      serde_json::Value::Bool(bg),\n  831                  );\n  832              }\n  833              self.send_update(\n  834                  acp::SessionUpdate::ToolCall(\n  835                      acp::ToolCall::new(tool_call_id.clone(), call.function.name.clone())\n  836                          .kind(acp::ToolKind::Other)\n  837                          .status(acp::ToolCallStatus::Pending)\n  838                          .raw_input(early_raw_input)\n  839                          .meta(meta),",
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
          "snippet": "  392              self.emit_event(crate::session::events::Event::ToolStarted {\n  393                  tool_name: call.function.name.clone(),\n  394              });\n  395              self.observability_bridge\n  396                  .emit(\n  397                      xai_tool_protocol::session_event::SessionEvent::ToolCallStarted {\n  398                          tool_call_id: call.id.clone(),\n  399                          tool_name: call.function.name.clone(),\n  400                          turn_number: self.current_turn_number.get(),\n  401                      },\n  402                  )\n  403                  .await;\n  404              let call_name = call.function.name.clone();\n  405              match self.prepare_tool_call(call, deferred_followups).await? {\n  406                  Ok(prepared) => approved.push(prepared),\n  407                  Err(tool_loop) => {\n  408                      self.events.tool_finished();\n  409                      if let Some((server, tool)) =\n  410                          crate::session::mcp_servers::parse_mcp_tool_name(&call_name)\n  411                      {\n  412                          let error_reason = match &tool_loop {\n  413                              ToolLoop::PermissionReject { reason, .. } => reason.clone(),\n  414                              ToolLoop::Cancelled => \"cancelled\".to_string(),\n  415                              ToolLoop::FollowupMessage(_) => \"followup\".to_string(),\n  416                              ToolLoop::HookDenied { hook_name, .. } => {\n  417                                  format!(\"hook_denied:{hook_name}\")\n  418                              }\n  419                              other => format!(\"{other:?}\"),\n  420                          };\n  421                          self.emit_event(xai_file_utils::events::Event::McpToolCallCompleted {",
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
    "commit": "aaf0aebf8203559711df6ed25b265a3f096bd3ea",
    "date": "2026-07-27T03:34:00-07:00",
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
          "snippet": "  140  ///\n  141  /// - If the model requests a function call, we execute it and send the output\n  142  ///   back to the model in the next sampling request.\n  143  /// - If the model sends only an assistant message, we record it in the\n  144  ///   conversation history and consider the turn complete.\n  145  ///\n  146  pub(crate) async fn run_turn(\n  147      sess: Arc<Session>,\n  148      turn_context: Arc<TurnContext>,\n  149      turn_extension_data: Arc<codex_extension_api::ExtensionData>,\n  150      input: Vec<TurnInput>,\n  151      prewarmed_client_session: Option<ModelClientSession>,\n  152      cancellation_token: CancellationToken,\n  153  ) -> CodexResult<Option<String>> {\n  154      let mut client_session =\n  155          prewarmed_client_session.unwrap_or_else(|| sess.services.model_client.new_session());\n  156      // TODO(ccunningham): Pre-turn compaction runs before context updates and the\n  157      // new user message are recorded. Estimate pending incoming items (context\n  158      // diffs/full reinjection + user input) and trigger compaction preemptively\n  159      // when they would push the thread over the compaction threshold.\n  160      if let Err(err) = run_pre_sampling_compact(&sess, &turn_context, &mut client_session).await {\n  161          if matches!(err, CodexErr::TurnAborted) {\n  162              return Err(err);\n  163          }\n  164          let error = err.to_codex_protocol_error();\n  165          sess.emit_turn_error_lifecycle(turn_context.as_ref(), error.clone())\n  166              .await;\n  167          error!(\"Failed to run pre-sampling compact\");\n  168          return Ok(None);\n  169      }",
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
          "snippet": "  240      let mut seen_tool_names = HashSet::new();\n  241      for runtime in &runtimes {\n  242          let tool_name = runtime.tool_name();\n  243          if !seen_tool_names.insert(tool_name.clone()) {\n  244              continue;\n  245          }\n  246          let exposure = runtime.exposure();\n  247          if exposure.is_direct() && !is_hidden_by_code_mode_only(turn_context, &tool_name, exposure)\n  248          {\n  249              let spec = runtime.spec();\n  250              specs.push(spec_for_model_request(\n  251                  turn_context,\n  252                  exposure,\n  253                  &tool_name,\n  254                  spec,\n  255              ));\n  256          }\n  257      }\n  258      specs.extend(hosted_specs);\n  259  \n  260      let registry = ToolRegistry::from_tools(runtimes);\n  261      let model_visible_specs = merge_into_namespaces(specs)\n  262          .into_iter()\n  263          .filter(|spec| {\n  264              namespace_tools_enabled(turn_context) || !matches!(spec, ToolSpec::Namespace(_))\n  265          })\n  266          .collect();\n  267  \n  268      (model_visible_specs, registry)",
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
          "snippet": "  546      step_context: &StepContext,\n  547      input: &[TurnInput],\n  548      cancellation_token: &CancellationToken,\n  549  ) -> Option<(Vec<ResponseItem>, HashSet<String>)> {\n  550      let turn_context = step_context.turn.as_ref();\n  551      // Guardian input embeds the parent transcript as untrusted evidence. Do not interpret skill or\n  552      // plugin mentions from that generated prompt as requests to inject additional instructions.\n  553      if crate::guardian::is_guardian_reviewer_source(&turn_context.session_source) {\n  554          return Some((Vec::new(), HashSet::new()));\n  555      }\n  556  \n  557      let user_input = input\n  558          .iter()\n  559          .filter_map(|item| match item {\n  560              TurnInput::UserInput { content, .. } => Some(content.as_slice()),\n  561              TurnInput::ResponseItem(_) | TurnInput::InterAgentCommunication(_) => None,\n  562          })\n  563          .flatten()\n  564          .cloned()\n  565          .collect::<Vec<_>>();\n  566      let tracking = build_track_events_context(\n  567          turn_context.model_info.slug.clone(),\n  568          sess.thread_id.to_string(),\n  569          turn_context.sub_id.clone(),\n  570          turn_context.originator.clone(),\n  571      );\n  572      let loaded_plugins = sess\n  573          .services\n  574          .plugins_manager\n  575          .plugins_for_config(&turn_context.config.plugins_config_input())",
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
          "snippet": "   88  \n   89  /// Control-plane handle for multi-agent operations.\n   90  /// `AgentControl` is held by each session (via `SessionServices`). It provides capability to\n   91  /// spawn new agents and the inter-agent communication layer.\n   92  /// An `AgentControl` instance is intended to be created at most once per root thread/session\n   93  /// tree. That same `AgentControl` is then shared with every sub-agent spawned from that root,\n   94  /// which keeps the registry scoped to that root thread rather than the entire `ThreadManager`.\n   95  #[derive(Clone, Default)]\n   96  pub(crate) struct AgentControl {\n   97      /// ID shared by the whole agent control session. This means every sub-agents from a common\n   98      /// root share the same session ID.\n   99      session_id: SessionId,\n  100      /// Weak handle back to the global thread registry/state.\n  101      /// This is `Weak` to avoid reference cycles and shadow persistence of the form\n  102      /// `ThreadManagerState -> CodexThread -> Session -> SessionServices -> ThreadManagerState`.\n  103      manager: Weak<ThreadManagerState>,\n  104      state: Arc<AgentRegistry>,\n  105      v2_residency: Arc<V2Residency>,\n  106      agent_execution_limiter: Arc<AgentExecutionLimiter>,\n  107      /// Session-scoped state shared by the root thread and every cloned sub-agent control handle.\n  108      rollout_budget: Arc<RolloutBudget>,\n  109  }\n  110  \n  111  impl AgentControl {\n  112      /// Construct a new `AgentControl` that can spawn/message agents via the given manager state.\n  113      pub(crate) fn new(\n  114          manager: Weak<ThreadManagerState>,\n  115          rollout_budget: Option<RolloutBudgetConfig>,\n  116      ) -> Self {\n  117          let control = Self {",
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
    "commit": "e758baa38f6f28adefadd567077b05f68a05d6fa",
    "date": "2026-07-25T22:48:12+03:00",
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
          "snippet": "   33    \"scripts\": {\n   34      \"pi\": \"pi\",\n   35      \"test\": \"vitest run\",\n   36      \"test:py\": \"python3 -m pytest benchmarks/test_rpc_client.py -q\",\n   37      \"typecheck\": \"tsc --noEmit\"\n   38    },\n   39    \"dependencies\": {\n   40      \"@earendil-works/pi-coding-agent\": \"^0.79.4\",\n   41      \"@sinclair/typebox\": \"^0.34.49\",\n   42      \"playwright\": \"^1.59.1\"\n   43    },",
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
    "commit": "ddc3794fc31e95b58b1493ab99e96844640bdf40",
    "date": "2026-07-27T20:39:07+08:00",
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
          "snippet": "  556  \tlimit, err := a.resolveTaskConcurrencyLimit(ctx, user.ID)\n  557  \tif err != nil {\n  558  \t\treturn nil, err\n  559  \t}\n  560  \tctx = entx.WithTaskConcurrencyLimit(ctx, limit)\n  561  \n  562  \tvmID := fmt.Sprintf(\"agent_%s\", uuid.NewString())\n  563  \tprepared, err := a.repo.PrepareCreate(ctx, user, req, token, vmID)\n  564  \tif err != nil {\n  565  \t\ta.logger.With(\"error\", err, \"req\", req).ErrorContext(ctx, \"failed to create task\")\n  566  \t\treturn nil, err\n  567  \t}\n  568  \tif prepared == nil || prepared.ProjectTask == nil || prepared.Model == nil || prepared.Image == nil {\n  569  \t\treturn nil, fmt.Errorf(\"failed to prepare task\")\n  570  \t}\n  571  \tpt := prepared.ProjectTask\n  572  \tm := prepared.Model\n  573  \ti := prepared.Image\n  574  \tt := pt.Edges.Task\n  575  \tif t == nil {\n  576  \t\treturn nil, fmt.Errorf(\"task edge is nil\")\n  577  \t}\n  578  \tif git.URL == \"\" {\n  579  \t\tgit.URL = pt.RepoURL\n  580  \t}\n  581  \t// Codeup 仓库 URL 必须带 .git 后缀才能 clone，做一次兜底归一化\n  582  \t// （覆盖用户手输仓库地址未带后缀的场景）\n  583  \tgit.URL = giturl.NormalizeCloneURL(git.URL)\n  584  \n  585  \tvar runtimeToken string",
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
          "snippet": "  585  \tvar runtimeToken string\n  586  \tif keys := m.Edges.Apikeys; len(keys) > 0 {\n  587  \t\tm.APIKey = keys[0].APIKey\n  588  \t\tm.BaseURL = a.cfg.LLMProxy.BaseURL + \"/v1\"\n  589  \t\truntimeToken = keys[0].APIKey\n  590  \t}",
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
          "snippet": "  788  func modelRuntimeDefaults(m *db.Model) (thinking bool, contextLimit int, outputLimit int) {\n  789  \tthinking = m.ThinkingEnabled\n  790  \tcontextLimit = cmp.Or(m.ContextLimit, 200000)\n  791  \toutputLimit = cmp.Or(m.OutputLimit, 32000)\n  792  \treturn thinking, contextLimit, outputLimit",
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
          "snippet": "  741  func (a *TaskUsecase) buildMCPConfigs(taskID uuid.UUID, token string) []taskflow.McpServerConfig {\n  742  \tmcps := []taskflow.McpServerConfig{\n  743  \t\t{\n  744  \t\t\tType: \"http\",\n  745  \t\t\tName: \"mcaiBuiltin\",\n  746  \t\t\tUrl:  proto.String(fmt.Sprintf(\"http://127.0.0.1:65510/mcp?task_id=%s\", taskID.String())),\n  747  \t\t},\n  748  \t}\n  749  \n  750  \tif token != \"\" {\n  751  \t\tmcps = append(mcps, taskflow.McpServerConfig{\n  752  \t\t\tType: \"http\",\n  753  \t\t\tName: \"monkeycode-ai\",\n  754  \t\t\tUrl:  proto.String(fmt.Sprintf(\"%s/mcp\", strings.TrimRight(a.cfg.Server.BaseURL, \"/\"))),\n  755  \t\t\tHeaders: []*taskflow.McpHttpHeader{\n  756  \t\t\t\t{\n  757  \t\t\t\t\tName:  \"Authorization\",\n  758  \t\t\t\t\tValue: fmt.Sprintf(\"Bearer %s\", token),\n  759  \t\t\t\t},\n  760  \t\t\t},\n  761  \t\t\tCommand: new(string),\n  762  \t\t\tArgs:    []string{},\n  763  \t\t\tEnv:     map[string]string{},\n  764  \t\t})\n  765  \t}\n  766  \n  767  \treturn mcps",
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
          "snippet": "  246  func (p *Proxy) modifyResponse(resp *http.Response) error {\n  247  \tif resp == nil || resp.Body == nil {\n  248  \t\treturn nil\n  249  \t}\n  250  \tif resp.StatusCode < http.StatusOK || resp.StatusCode >= http.StatusMultipleChoices {\n  251  \t\treturn nil\n  252  \t}\n  253  \tctx, ok := resp.Request.Context().Value(contextKey{}).(*proxyContext)\n  254  \tif !ok || ctx == nil || ctx.model == nil {\n  255  \t\treturn nil\n  256  \t}\n  257  \tresp.Body = NewUsageCapture(p.logger, resp.Body, &UsageCaptureContext{\n  258  \t\tctx:      resp.Request.Context(),\n  259  \t\tpath:     normalizeUsageCapturePath(resp.Request.URL.Path),\n  260  \t\tstream:   ctx.stream,\n  261  \t\tproxyCtx: ctx,\n  262  \t\tproxy:    p,\n  263  \t})\n  264  \treturn nil",
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
    "commit": "284e97068c987a7a2e863430e07e2f1ad7d4be46",
    "date": "2026-07-28T01:16:18Z",
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
    "commit": "ed4c78bc0faafcc79f61cfd0baca7a8413ba74bf",
    "date": "2026-07-28T02:06:13+02:00",
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
          "snippet": "  879  /**\n  880   * Main loop logic shared by agentLoop and agentLoopContinue.\n  881   */\n  882  async function runLoop(\n  883  \tcurrentContext: AgentContext,\n  884  \tnewMessages: AgentMessage[],\n  885  \tconfig: AgentLoopConfig,\n  886  \tsignal: AbortSignal | undefined,\n  887  \tstream: EventStream<AgentEvent, AgentMessage[]>,\n  888  \tstreamFn?: StreamFn,\n  889  \tinitialMessages: AgentMessage[] = [],\n  890  ): Promise<void> {\n  891  \tconst telemetry = resolveTelemetry(config.telemetry, config.sessionId);\n  892  \tconst invokeAgentSpan = startInvokeAgentSpan(telemetry, config.model);\n  893  \tconst stepCounter = { count: 0 };\n  894  \tlet caughtError: unknown;\n  895  \ttry {\n  896  \t\tawait runInActiveSpan(invokeAgentSpan, () =>\n  897  \t\t\trunLoopBody(\n  898  \t\t\t\tcurrentContext,\n  899  \t\t\t\tnewMessages,\n  900  \t\t\t\tconfig,\n  901  \t\t\t\tsignal,\n  902  \t\t\t\tstream,\n  903  \t\t\t\ttelemetry,\n  904  \t\t\t\tinvokeAgentSpan,\n  905  \t\t\t\tstepCounter,\n  906  \t\t\t\tinitialMessages,\n  907  \t\t\t\tstreamFn,\n  908  \t\t\t),",
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
          "snippet": "  999  \t\t// Check for steering messages at start (user may have typed while waiting).\n 1000  \t\t// Skip when the run is already externally aborted — dequeuing would strand\n 1001  \t\t// the messages in a run that is about to die.\n 1002  \t\tlet pendingMessages: AgentMessage[];\n 1003  \t\ttry {\n 1004  \t\t\tpendingMessages = signal?.aborted ? [] : (await config.getSteeringMessages?.()) || [];\n 1005  \t\t} catch (error) {\n 1006  \t\t\tstream.push({ type: \"turn_start\" });\n 1007  \t\t\temitInputMessages(stream, messagesToEmit);\n 1008  \t\t\tthrow error;\n 1009  \t\t}\n 1010  \t\tlet harmonyRetryAttempt = 0;\n 1011  \t\tlet harmonyTruncateResumeCount = 0;\n 1012  \t\tlet pausedTurnContinuations = 0;\n 1013  \n 1014  \t\t// Soft tool requirement lifecycle (reminder then escalation; see SoftToolRequirement).\n 1015  \t\t// The host-owned state survives only a gate stop between Agent.prompt calls.\n 1016  \t\t// Resolved once per logical turn at the fetch site below and reused across\n 1017  \t\t// Harmony-leak re-samples (which re-enter the same turn) so the consuming\n 1018  \t\t// getToolChoice is never advanced twice; the flag resets at the message boundary.\n 1019  \t\tlet hostToolChoice: ToolChoice | undefined;\n 1020  \t\tlet softRequiredTool: string | undefined;\n 1021  \t\tlet softSatisfies: SoftToolRequirement[\"satisfies\"];\n 1022  \t\tlet directiveResolvedForTurn = false;\n 1023  \t\tlet turnOpen = false;\n 1024  \n 1025  \t\t// Outer loop: continues when queued follow-up messages arrive after agent would stop\n 1026  \t\twhile (true) {\n 1027  \t\t\tlet hasMoreToolCalls = true;\n 1028  ",
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
          "snippet": " 2067  /** Per-call outcome of the pre-dispatch prepare phase (validation + `beforeToolCall`). */\n 2068  interface PreparedToolCall {\n 2069  \ttool: AgentTool<any> | undefined;\n 2070  \t/** Validated (possibly hook-revised) execution args; raw args when validation failed. */\n 2071  \targs: Record<string, unknown>;\n 2072  \tvalidationErrorMessage?: string;\n 2073  \tblocked?: boolean;\n 2074  \tblockReason?: string;\n 2075  \tprepareError?: unknown;\n 2076  }\n 2077  \n 2078  /**\n 2079   * Prepare results computed in the stream-done branch (before `message_start`/\n 2080   * `message_end`) so a `beforeToolCall` args revision is baked into the message\n 2081   * every consumer snapshots. `executeToolCalls` consumes them; a message that\n 2082   * bypassed the streamed path (e.g. Harmony-recovered) is prepared at dispatch\n 2083   * time instead.\n 2084   */\n 2085  const preparedDispatchByMessage = new WeakMap<AssistantMessage, Map<string, PreparedToolCall>>();\n 2086  \n 2087  function resolveToolForCall(\n 2088  \ttools: AgentTool<any>[] | undefined,\n 2089  \ttoolCall: AgentToolCall,\n 2090  \tresolveFallbackTool: AgentLoopConfig[\"resolveFallbackTool\"],\n 2091  ): AgentTool<any> | undefined {\n 2092  \t// Tools emitted via OpenAI's custom-tool path (e.g. `apply_patch` on GPT-5)\n 2093  \t// come back under their wire-level name, which may differ from the\n 2094  \t// harness-internal `name`. Match on either, preferring `name` for\n 2095  \t// determinism if both somehow collide.\n 2096  \treturn (",
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
          "snippet": "   26  import {\n   27  \ttype Dialect,\n   28  \tencodeInbandToolHistory,\n   29  \trenderInbandToolPrompt,\n   30  \trenderToolExamples,\n   31  \twrapInbandToolStream,\n   32  } from \"@oh-my-pi/pi-ai/dialect\";\n   33  import * as AIError from \"@oh-my-pi/pi-ai/error\";\n   34  import { type CursorExecResolvedCarrier, kCursorExecResolved } from \"@oh-my-pi/pi-ai/utils/block-symbols\";\n   35  import {\n   36  \tcreateHarmonyAuditEvent,\n   37  \tdetectHarmonyLeakInAssistantMessage,\n   38  \textractHarmonyRemoved,\n   39  \ttype HarmonyDetection,\n   40  \ttype HarmonyRecoveredToolCall,\n   41  \tisHarmonyLeakMitigationTarget,\n   42  \trecoverHarmonyToolCall,\n   43  \tsignalListLabel,\n   44  } from \"@oh-my-pi/pi-ai/utils/harmony-leak\";\n   45  import { preferredDialect } from \"@oh-my-pi/pi-catalog/identity\";",
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
          "snippet": "   38  import { AskTool } from \"./ask\";\n   39  import { AstEditTool } from \"./ast-edit\";\n   40  import { AstGrepTool } from \"./ast-grep\";\n   41  import { BashTool } from \"./bash\";\n   42  import { BrowserTool } from \"./browser\";\n   43  import { type BuiltinToolName, type HiddenToolName, normalizeToolNames } from \"./builtin-names\";\n   44  import { type CheckpointState, CheckpointTool, type CompletedRewindState, RewindTool } from \"./checkpoint\";\n   45  import { ComputerTool } from \"./computer\";\n   46  import { DebugTool } from \"./debug\";\n   47  import { EvalTool } from \"./eval\";\n   48  import { resolveEvalBackends } from \"./eval-backends\";\n   49  import { GithubTool } from \"./gh\";\n   50  import { GlobTool } from \"./glob\";\n   51  import { GrepTool } from \"./grep\";\n   52  import { HubTool, isIrcEnabled } from \"./hub\";\n   53  import { InspectImageTool } from \"./inspect-image\";\n   54  import { LearnTool } from \"./learn\";\n   55  import { ManageSkillTool } from \"./manage-skill\";\n   56  import { MemoryEditTool } from \"./memory-edit\";\n   57  import { MemoryRecallTool } from \"./memory-recall\";\n   58  import { MemoryReflectTool } from \"./memory-reflect\";\n   59  import { MemoryRetainTool } from \"./memory-retain\";\n   60  import { wrapToolWithMetaNotice } from \"./output-meta\";\n   61  import { ReadTool } from \"./read\";\n   62  import type { PlanProposalHandler } from \"./resolve\";\n   63  import { type TodoPhase, TodoTool } from \"./todo\";\n   64  import { WriteTool } from \"./write\";\n   65  import { isMountableUnderXdev, XdevRegistry } from \"./xdev\";\n   66  import { YieldTool } from \"./yield\";\n   67  ",
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
          "snippet": "  148  \tsummary: string;\n  149  \t/** Short PR-style summary for display purposes. */\n  150  \tshortSummary?: string;\n  151  \tfirstKeptEntryId: string;\n  152  \ttokensBefore: number;\n  153  \t/** Hook-specific data (e.g., ArtifactIndex, version markers for structured compaction) */\n  154  \tdetails?: T;\n  155  \t/** Hook-provided data to persist alongside compaction entry. */\n  156  \tpreserveData?: Record<string, unknown>;\n  157  }\n  158  \n  159  // ============================================================================\n  160  // Types\n  161  // ============================================================================\n  162  \n  163  export interface CompactionSettings {\n  164  \tenabled: boolean;\n  165  \tstrategy?: \"context-full\" | \"handoff\" | \"shake\" | \"snapcompact\" | \"off\";\n  166  \tthresholdPercent?: number;\n  167  \tthresholdTokens?: number;\n  168  \tmidTurnEnabled?: boolean;\n  169  \t/**\n  170  \t * Tokens reserved below the context window for the next prompt + response.\n  171  \t *\n  172  \t * Leave unset to use {@link DEFAULT_RESERVE_TOKENS}; the unset state is the\n  173  \t * provenance signal that lets small-window recovery replace the default with\n  174  \t * a proportional reserve (see {@link resolveBudgetReserveTokens}). An\n  175  \t * explicit value — even one equal to the default — is always honored.\n  176  \t */\n  177  \treserveTokens?: number;",
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
          "snippet": "    1  /**\n    2   * The provider catalog table: one entry per chat-model provider, carrying the\n    3   * catalog half of what used to live in `@oh-my-pi/pi-ai`'s registry definitions\n    4   * (default model, runtime model-manager factory, discovery wiring). The auth\n    5   * half (env keys, OAuth login/refresh) stays in the pi-ai registry, which\n    6   * type-checks itself against `KnownProvider` from this table.\n    7   */\n    8  import type { ModelManagerConfig, ProviderCatalogEntry, ProviderDescriptor } from \"./descriptor-types\";\n    9  import { googleModelManagerOptions, googleVertexModelManagerOptions } from \"./google\";\n   10  import { ollamaCloudModelManagerOptions } from \"./ollama\";\n   11  import {\n   12  \taimlApiModelManagerOptions,\n   13  \talibabaCodingPlanModelManagerOptions,\n   14  \talibabaTokenPlanModelManagerOptions,\n   15  \tanthropicModelManagerOptions,\n   16  \tbasetenModelManagerOptions,\n   17  \tcerebrasModelManagerOptions,\n   18  \tcloudflareAiGatewayModelManagerOptions,\n   19  \tcoreWeaveModelManagerOptions,\n   20  \tdeepseekModelManagerOptions,\n   21  \tfirepassModelManagerOptions,\n   22  \tfireworksModelManagerOptions,\n   23  \tgithubCopilotModelManagerOptions,\n   24  \tgroqModelManagerOptions,\n   25  \thuggingfaceModelManagerOptions,\n   26  \tkiloModelManagerOptions,\n   27  \tkimiCodeModelManagerOptions,\n   28  \tlitellmModelManagerOptions,\n   29  \tlmStudioModelManagerOptions,\n   30  \tmetaModelManagerOptions,",
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
          "snippet": "  282  \tsetNotificationsEnabled(enabled: boolean): void {\n  283  \t\tconst wasEnabled = this.#notificationsEnabled;\n  284  \t\tthis.#notificationsEnabled = enabled;\n  285  \t\tif (enabled === wasEnabled) return;\n  286  \n  287  \t\tthis.#notificationsEpoch += 1;\n  288  \t\tconst notificationEpoch = this.#notificationsEpoch;\n  289  \n  290  \t\tif (enabled) {\n  291  \t\t\t// Subscribe to all connected servers that support it\n  292  \t\t\tfor (const [name, connection] of this.#connections) {\n  293  \t\t\t\tif (connection.capabilities.resources?.subscribe && connection.resources) {\n  294  \t\t\t\t\tconst uris = connection.resources.map(r => r.uri);\n  295  \t\t\t\t\tthis.#subscribeAndTrack(name, connection, uris, notificationEpoch);\n  296  \t\t\t\t}\n  297  \t\t\t}\n  298  \t\t\treturn;\n  299  \t\t}\n  300  \n  301  \t\t// Unsubscribe from all servers\n  302  \t\tfor (const [name, connection] of this.#connections) {\n  303  \t\t\tconst uris = this.#subscribedResources.get(name);\n  304  \t\t\tif (uris && uris.size > 0) {\n  305  \t\t\t\tvoid unsubscribeFromResources(connection, Array.from(uris)).catch(error => {\n  306  \t\t\t\t\tlogger.debug(\"Failed to unsubscribe MCP resources\", { path: `mcp:${name}`, error });\n  307  \t\t\t\t});\n  308  \t\t\t}\n  309  \t\t}\n  310  \t\tthis.#subscribedResources.clear();\n  311  \t}",
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
          "snippet": "    1  /**\n    2   * Task tool - Delegate tasks to specialized agents.\n    3   *\n    4   * Discovers agent definitions from:\n    5   *   - Bundled agents (shipped with omp-coding-agent)\n    6   *   - ~/.omp/agent/agents/*.md (user-level)\n    7   *   - .omp/agents/*.md (project-level)\n    8   *\n    9   * Supports:\n   10   *   - Single agent spawn per call (parallelism = parallel task calls)\n   11   *   - Batch spawning + shared context per call when `task.batch` is enabled\n   12   *   - Background execution through AsyncJobManager when `async.enabled` is enabled\n   13   *   - Progress tracking via JSON events\n   14   *   - Session artifacts for debugging\n   15   */\n   16  import path from \"node:path\";\n   17  import type { AgentTool, AgentToolResult, AgentToolUpdateCallback } from \"@oh-my-pi/pi-agent-core\";\n   18  import type { Usage } from \"@oh-my-pi/pi-ai\";\n   19  import { $env, logger, prompt } from \"@oh-my-pi/pi-utils\";\n   20  import type { ToolSession } from \"..\";\n   21  import type { Theme } from \"../modes/theme/theme\";\n   22  import subagentUserPromptTemplate from \"../prompts/system/subagent-user-prompt.md\" with { type: \"text\" };\n   23  import taskDescriptionTemplate from \"../prompts/tools/task.md\" with { type: \"text\" };\n   24  import taskAsyncContractTemplate from \"../prompts/tools/task-async-contract.md\" with { type: \"text\" };\n   25  import taskSummaryTemplate from \"../prompts/tools/task-summary.md\" with { type: \"text\" };\n   26  import { TASK_EFFORTS, type TaskEffort } from \"../thinking\";\n   27  import { truncateForPrompt } from \"../tools/approval\";\n   28  import { isIrcEnabled } from \"../tools/hub\";\n   29  import { formatBytes, formatDuration } from \"../tools/render-utils\";\n   30  import { resolveSpawnPolicy } from \"./spawn-policy\";",
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
          "snippet": "    1  import * as fs from \"node:fs\";\n    2  import * as fsp from \"node:fs/promises\";\n    3  import * as path from \"node:path\";\n    4  import { hasFsCode, isEnoent, logger, peekFileEnds, Snowflake, toError } from \"@oh-my-pi/pi-utils\";\n    5  import { overlayTitleSlotContent, type SessionTitleUpdate, serializeTitleSlot } from \"./session-title-slot\";\n    6  \n    7  const utf8Decoder = new TextDecoder(\"utf-8\");\n    8  \n    9  export interface SessionStorageStat {\n   10  \tsize: number;\n   11  \tmtimeMs: number;\n   12  \tmtime: Date;\n   13  }\n   14  \n   15  export interface SessionStorageWriter {\n   16  \t/**\n   17  \t * Append one newline-terminated line. File and memory storage perform the\n   18  \t * write synchronously in-body; indexed backends queue in call order.\n   19  \t *\n   20  \t * `line` MUST include the trailing newline.\n   21  \t */\n   22  \tappend(line: string): Promise<void>;\n   23  \t/** Resolve once all queued appends complete. No fsync. */\n   24  \tflush(): Promise<void>;\n   25  \t/** False once close() has begun/finished. */\n   26  \tisOpen(): boolean;\n   27  \tclose(): Promise<void>;\n   28  \tgetError(): Error | undefined;\n   29  }\n   30  ",
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
    "commit": "53f347d34666e847405714095020afdfadb95503",
    "date": "2026-07-27T00:20:42Z",
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
    "commit": "c820aa26fe0907e053e881a957722693fc094c9c",
    "date": "2026-07-28T00:01:51+02:00",
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
          "snippet": "  171  export class AgentHarness<\n  172  \tTContext extends object | undefined = undefined,\n  173  \tTSkill extends Skill = Skill,\n  174  \tTPromptTemplate extends PromptTemplate = PromptTemplate,\n  175  \tTTool extends AgentHarnessTool<TContext> = AgentHarnessTool<TContext>,\n  176  > {\n  177  \tprivate session: Session;\n  178  \treadonly models: Models;\n  179  \tprivate phase: AgentHarnessPhase = \"idle\";\n  180  \tprivate runAbortController?: AbortController;\n  181  \tprivate runPromise?: Promise<void>;\n  182  \tprivate pendingSessionWrites: PendingSessionWrite[] = [];\n  183  \tprivate model: Model<any>;\n  184  \tprivate thinkingLevel: ThinkingLevel;\n  185  \tprivate systemPrompt: AgentHarnessSystemPrompt<TContext, TSkill, TPromptTemplate, TTool> | undefined;\n  186  \tprivate toolContext: AgentHarnessToolContextSource<TContext> | undefined;\n  187  \tprivate streamOptions: AgentHarnessStreamOptions;\n  188  \tprivate retry: RetryPolicy | undefined;\n  189  \tprivate resources: AgentHarnessResources<TSkill, TPromptTemplate>;\n  190  \tprivate tools = new Map<string, TTool>();\n  191  \tprivate activeToolNames: string[];\n  192  \tprivate steerQueue: UserMessage[] = [];\n  193  \tprivate steeringQueueMode: QueueMode;\n  194  \tprivate followUpQueue: UserMessage[] = [];\n  195  \tprivate followUpQueueMode: QueueMode;\n  196  \tprivate nextTurnQueue: AgentMessage[] = [];\n  197  \tprivate handlers = new Map<string, Set<AgentHarnessHandler>>();\n  198  \n  199  \tconstructor(options: AgentHarnessOptions<TContext, TSkill, TPromptTemplate, TTool>) {\n  200  \t\tthis.session = options.session;",
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
          "snippet": "    5  import { amazonBedrockProvider } from \"./amazon-bedrock.ts\";\n    6  import { antLingProvider } from \"./ant-ling.ts\";\n    7  import { anthropicProvider } from \"./anthropic.ts\";\n    8  import { azureOpenAIResponsesProvider } from \"./azure-openai-responses.ts\";\n    9  import { cerebrasProvider } from \"./cerebras.ts\";\n   10  import { cloudflareAIGatewayProvider } from \"./cloudflare-ai-gateway.ts\";\n   11  import { cloudflareWorkersAIProvider } from \"./cloudflare-workers-ai.ts\";\n   12  import modelDataManifest from \"./data/.manifest.json\" with { type: \"json\" };\n   13  import { deepseekProvider } from \"./deepseek.ts\";\n   14  import { fireworksProvider } from \"./fireworks.ts\";\n   15  import { githubCopilotProvider } from \"./github-copilot.ts\";\n   16  import { googleProvider } from \"./google.ts\";\n   17  import { googleVertexProvider } from \"./google-vertex.ts\";\n   18  import { groqProvider } from \"./groq.ts\";\n   19  import { huggingfaceProvider } from \"./huggingface.ts\";\n   20  import { kimiCodingProvider } from \"./kimi-coding.ts\";\n   21  import { minimaxProvider } from \"./minimax.ts\";\n   22  import { minimaxCnProvider } from \"./minimax-cn.ts\";\n   23  import { mistralProvider } from \"./mistral.ts\";\n   24  import { moonshotaiProvider } from \"./moonshotai.ts\";\n   25  import { moonshotaiCnProvider } from \"./moonshotai-cn.ts\";\n   26  import { nvidiaProvider } from \"./nvidia.ts\";\n   27  import { openaiProvider } from \"./openai.ts\";\n   28  import { openaiCodexProvider } from \"./openai-codex.ts\";\n   29  import { opencodeProvider } from \"./opencode.ts\";\n   30  import { opencodeGoProvider } from \"./opencode-go.ts\";\n   31  import { openrouterProvider } from \"./openrouter.ts\";\n   32  import { openrouterImagesProvider } from \"./openrouter-images.ts\";\n   33  import { qwenTokenPlanProvider } from \"./qwen-token-plan.ts\";\n   34  import { qwenTokenPlanCnProvider } from \"./qwen-token-plan-cn.ts\";",
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
          "snippet": "   82  export function createLocalBashOperations(options?: { shellPath?: string }): BashOperations {\n   83  \treturn {\n   84  \t\texec: async (command, cwd, { onData, signal, timeout, env }) => {\n   85  \t\t\tconst timeoutMs = resolveTimeoutMs(timeout);\n   86  \t\t\tif (signal?.aborted) {\n   87  \t\t\t\tthrow new Error(\"aborted\");\n   88  \t\t\t}\n   89  \t\t\tconst shellConfig = getShellConfig(options?.shellPath);\n   90  \t\t\ttry {\n   91  \t\t\t\tawait fsAccess(cwd, constants.F_OK);\n   92  \t\t\t} catch {\n   93  \t\t\t\tthrow new Error(`Working directory does not exist: ${cwd}\\nCannot execute bash commands.`);\n   94  \t\t\t}\n   95  \n   96  \t\t\tconst commandFromStdin = shellConfig.commandTransport === \"stdin\";\n   97  \t\t\tconst child = spawn(shellConfig.shell, commandFromStdin ? shellConfig.args : [...shellConfig.args, command], {\n   98  \t\t\t\tcwd,\n   99  \t\t\t\tdetached: process.platform !== \"win32\",\n  100  \t\t\t\tenv: env ?? getShellEnv(),\n  101  \t\t\t\tstdio: [commandFromStdin ? \"pipe\" : \"ignore\", \"pipe\", \"pipe\"],\n  102  \t\t\t\twindowsHide: true,\n  103  \t\t\t});\n  104  \t\t\tif (commandFromStdin) {\n  105  \t\t\t\tchild.stdin?.on(\"error\", () => {});\n  106  \t\t\t\tchild.stdin?.end(command);\n  107  \t\t\t}\n  108  \t\t\tif (child.pid) trackDetachedChildPid(child.pid);\n  109  \t\t\tlet timedOut = false;\n  110  \t\t\tlet timeoutHandle: NodeJS.Timeout | undefined;\n  111  \t\t\tconst onAbort = () => {",
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
          "snippet": "    1  /**\n    2   * Subagent Tool - Delegate tasks to specialized agents\n    3   *\n    4   * Spawns a separate `pi` process for each subagent invocation,\n    5   * giving it an isolated context window.\n    6   *\n    7   * Supports three modes:\n    8   *   - Single: { agent: \"name\", task: \"...\" }\n    9   *   - Parallel: { tasks: [{ agent: \"name\", task: \"...\" }, ...] }\n   10   *   - Chain: { chain: [{ agent: \"name\", task: \"... {previous} ...\" }, ...] }\n   11   *\n   12   * Uses JSON mode to capture structured output from subagents.\n   13   */\n   14  \n   15  import { spawn } from \"node:child_process\";\n   16  import * as fs from \"node:fs\";\n   17  import * as os from \"node:os\";\n   18  import * as path from \"node:path\";\n   19  import type { AgentToolResult } from \"@earendil-works/pi-agent-core\";\n   20  import type { Message } from \"@earendil-works/pi-ai\";\n   21  import { StringEnum } from \"@earendil-works/pi-ai\";\n   22  import {\n   23  \tCONFIG_DIR_NAME,\n   24  \ttype ExtensionAPI,\n   25  \tgetAgentDir,\n   26  \tgetMarkdownTheme,\n   27  \twithFileMutationQueue,\n   28  } from \"@earendil-works/pi-coding-agent\";\n   29  import { Container, Markdown, Spacer, Text } from \"@earendil-works/pi-tui\";\n   30  import { Type } from \"typebox\";",
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
    "commit": "3418498f01422f5f650ea645d4bd19e05c3a9616",
    "date": "2026-07-28T01:17:52Z",
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
          "snippet": "  153  pub(crate) async fn run_turn(\n  154      sess: Arc<Session>,\n  155      turn_context: Arc<TurnContext>,\n  156      turn_extension_data: Arc<codex_extension_api::ExtensionData>,\n  157      input: Vec<TurnInput>,\n  158      prewarmed_client_session: Option<ModelClientSession>,\n  159      cancellation_token: CancellationToken,\n  160  ) -> CodexResult<Option<String>> {\n  161      let mut client_session =\n  162          prewarmed_client_session.unwrap_or_else(|| sess.services.model_client.new_session());\n  163      // TODO(ccunningham): Pre-turn compaction runs before context updates and the\n  164      // new user message are recorded. Estimate pending incoming items (context\n  165      // diffs/full reinjection + user input) and trigger compaction preemptively\n  166      // when they would push the thread over the compaction threshold.\n  167      if let Err(err) = run_pre_sampling_compact(\n  168          &sess,\n  169          &turn_context,\n  170          &mut client_session,\n  171          &cancellation_token,\n  172      )\n  173      .await\n  174      {\n  175          if matches!(err.details(), CodexErrorDetails::TurnAborted) {\n  176              run_hooks_and_record_inputs(&sess, &turn_context, &input).await;\n  177              return Err(err);\n  178          }\n  179          let error = err.to_codex_protocol_error();\n  180          sess.emit_turn_error_lifecycle(turn_context.as_ref(), error.clone())\n  181              .await;\n  182          error!(\"Failed to run pre-sampling compact\");",
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
          "snippet": " 2034      tool_runtime: ToolCallRuntime,\n 2035      sess: Arc<Session>,\n 2036      turn_context: Arc<TurnContext>,\n 2037      turn_store: Arc<codex_extension_api::ExtensionData>,\n 2038      client_session: &mut ModelClientSession,\n 2039      responses_metadata: &CodexResponsesMetadata,\n 2040      turn_diff_tracker: SharedTurnDiffTracker,\n 2041      prompt: &Prompt,\n 2042      cancellation_token: CancellationToken,\n 2043  ) -> CodexResult<SamplingRequestResult> {\n 2044      feedback_tags!(\n 2045          model = turn_context.model_info.slug.clone(),\n 2046          approval_policy = turn_context.approval_policy.value(),\n 2047          sandbox_policy = &turn_context.sandbox_policy(),\n 2048          effort = turn_context.reasoning_effort,\n 2049          auth_mode = sess.services.auth_manager.auth_mode(),\n 2050          features = sess.features.enabled_features(),\n 2051      );\n 2052      let inference_trace = sess.services.rollout_thread_trace.inference_trace_context(\n 2053          turn_context.sub_id.as_str(),\n 2054          turn_context.model_info.slug.as_str(),\n 2055          turn_context.provider.info().name.as_str(),\n 2056      );\n 2057      let sampling_timing_guard = turn_context.turn_timing_state.begin_sampling();\n 2058      let uses_sequential_cutoff_reasoning_summaries = turn_context\n 2059          .config\n 2060          .features\n 2061          .enabled(Feature::ConcurrentReasoningSummaries)\n 2062          && turn_context.provider.info().is_openai();\n 2063      let mut stream = client_session",
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
          "snippet": " 1176  async fn run_sampling_request(\n 1177      sess: Arc<Session>,\n 1178      step_context: Arc<StepContext>,\n 1179      turn_store: Arc<codex_extension_api::ExtensionData>,\n 1180      turn_diff_tracker: SharedTurnDiffTracker,\n 1181      client_session: &mut ModelClientSession,\n 1182      responses_metadata: &CodexResponsesMetadata,\n 1183      input: Vec<ResponseItem>,\n 1184      cancellation_token: CancellationToken,\n 1185  ) -> CodexResult<(SamplingRequestResult, Vec<ResponseItem>)> {\n 1186      let turn_context = Arc::clone(&step_context.turn);\n 1187      let router = Arc::clone(&step_context.tool_router);\n 1188  \n 1189      let base_instructions = sess.get_base_instructions().await;\n 1190  \n 1191      let tool_runtime = ToolCallRuntime::new(\n 1192          Arc::clone(&router),\n 1193          Arc::clone(&sess),\n 1194          Arc::clone(&step_context),\n 1195          Arc::clone(&turn_diff_tracker),\n 1196      );\n 1197      let _code_mode_worker = sess.services.code_mode_service.start_turn_worker(\n 1198          &sess,\n 1199          Arc::clone(&step_context),\n 1200          Arc::clone(&router),\n 1201          Arc::clone(&turn_diff_tracker),\n 1202      );\n 1203      let max_retries = turn_context.provider.info().stream_max_retries();\n 1204      let mut retries = 0;\n 1205      let mut initial_input = Some(input);",
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
          "snippet": "   54  /// Wire protocol that the provider speaks.\n   55  #[derive(Debug, Clone, Copy, Default, PartialEq, Eq, Serialize, JsonSchema)]\n   56  #[serde(rename_all = \"lowercase\")]\n   57  pub enum WireApi {\n   58      /// The Responses API exposed by OpenAI at `/v1/responses`.\n   59      #[default]\n   60      Responses,\n   61  }\n   62  \n   63  impl fmt::Display for WireApi {\n   64      fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {\n   65          let value = match self {\n   66              Self::Responses => \"responses\",\n   67          };\n   68          f.write_str(value)\n   69      }\n   70  }\n   71  \n   72  impl<'de> Deserialize<'de> for WireApi {\n   73      fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>\n   74      where\n   75          D: serde::Deserializer<'de>,\n   76      {\n   77          let value = String::deserialize(deserializer)?;\n   78          match value.as_str() {\n   79              \"responses\" => Ok(Self::Responses),\n   80              \"chat\" => Err(serde::de::Error::custom(CHAT_WIRE_API_REMOVED_ERROR)),\n   81              _ => Err(serde::de::Error::unknown_variant(&value, &[\"responses\"])),\n   82          }\n   83      }",
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
          "snippet": "   48  /// Typed runtime contract for locally executed tools.\n   49  ///\n   50  /// Implementers provide the shared `ToolExecutor` behavior plus optional\n   51  /// core-owned metadata for hooks, telemetry, tool search, and argument diffs.\n   52  pub(crate) trait CoreToolRuntime: ToolExecutor<ToolInvocation> {\n   53      fn matches_kind(&self, payload: &ToolPayload) -> bool {\n   54          matches!(\n   55              payload,\n   56              ToolPayload::Function { .. } | ToolPayload::ToolSearch { .. }\n   57          )\n   58      }\n   59  \n   60      /// Whether cancellation should let the handler finish teardown before the\n   61      /// host returns an aborted tool response.\n   62      fn waits_for_runtime_cancellation(&self) -> bool {\n   63          false\n   64      }\n   65  \n   66      fn telemetry_tags<'a>(\n   67          &'a self,\n   68          _invocation: &'a ToolInvocation,\n   69      ) -> BoxFuture<'a, ToolTelemetryTags> {\n   70          Box::pin(async { Vec::new() })\n   71      }\n   72  \n   73      fn post_tool_use_payload(\n   74          &self,\n   75          invocation: &ToolInvocation,\n   76          result: &dyn ToolOutput,\n   77      ) -> Option<PostToolUsePayload> {",
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
          "snippet": "   38  /// Transcript of thread history\n   39  #[derive(Debug, Clone, Default)]\n   40  pub(crate) struct ContextManager {\n   41      /// The oldest items are at the beginning of the vector. Snapshots share the vector until a\n   42      /// caller needs to mutate it, avoiding deep copies for read-only history consumers.\n   43      items: Arc<Vec<ResponseItem>>,\n   44      /// Bumped whenever history is rewritten, such as compaction or rollback.\n   45      history_version: u64,\n   46      token_info: Option<TokenUsageInfo>,\n   47      /// Reference context snapshot used for diffing and producing model-visible\n   48      /// settings update items.\n   49      ///\n   50      /// This is the baseline for the next regular model turn, and may already\n   51      /// match the current turn after context updates are persisted.\n   52      ///\n   53      /// When this is `None`, settings diffing treats the next turn as having no\n   54      /// baseline and emits a full reinjection of context state. Rollback may\n   55      /// also clear this when it trims a mixed initial-context developer bundle\n   56      /// whose non-diff fragments no longer exist in the surviving history.\n   57      reference_context_item: Option<TurnContextItem>,\n   58      /// World state most recently appended to model-visible history.\n   59      world_state_baseline: Option<WorldStateSnapshot>,\n   60  }",
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
          "snippet": "  890  /// Determines the conditions under which the user is consulted to approve\n  891  /// running the command proposed by Codex.\n  892  #[derive(\n  893      Debug,\n  894      Clone,\n  895      Copy,\n  896      Default,\n  897      PartialEq,\n  898      Eq,\n  899      Hash,\n  900      Serialize,\n  901      Deserialize,\n  902      Display,\n  903      JsonSchema,\n  904      TS,\n  905  )]\n  906  #[serde(rename_all = \"kebab-case\")]\n  907  #[strum(serialize_all = \"kebab-case\")]\n  908  pub enum AskForApproval {\n  909      /// Under this policy, only \"known safe\" commands—as determined by\n  910      /// `is_safe_command()`—that **only read files** are auto‑approved.\n  911      /// Everything else will ask the user to approve.\n  912      #[serde(rename = \"untrusted\")]\n  913      #[strum(serialize = \"untrusted\")]\n  914      UnlessTrusted,\n  915  \n  916      /// The model decides when to ask the user for approval.\n  917      #[serde(alias = \"on-failure\")]\n  918      #[default]\n  919      OnRequest,",
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
          "snippet": "   66  pub(crate) struct McpServerConnection {\n   67      identity: Option<McpServerConnectionIdentity>,\n   68      client: AsyncManagedClient,\n   69  }\n   70  \n   71  impl McpServerConnection {\n   72      async fn reusable_client(\n   73          &self,\n   74          desired: &McpServerConnectionIdentity,\n   75      ) -> Option<ManagedClient> {\n   76          let current = self.identity.as_ref()?;\n   77          if !current.has_same_connection_config(desired) {\n   78              return None;\n   79          }\n   80          if !self.client.startup_complete.load(Ordering::Acquire) {\n   81              return None;\n   82          }\n   83          let client = self.client.client().await.ok()?;\n   84          if client.client.is_closed().await {\n   85              return None;\n   86          }\n   87          let Ok(desired_credentials) = desired.oauth_credentials() else {\n   88              return Some(client);\n   89          };\n   90          let reusable = match client.client.managed_oauth_credentials().await {\n   91              Some(live_credentials) => &live_credentials == desired_credentials,\n   92              None => current\n   93                  .oauth_credentials()\n   94                  .is_ok_and(|startup_credentials| startup_credentials == desired_credentials),\n   95          };",
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
          "snippet": "   70      pub(crate) fork_parent_spawn_call_id: Option<String>,\n   71      pub(crate) fork_mode: Option<SpawnAgentForkMode>,\n   72      pub(crate) parent_thread_id: Option<ThreadId>,\n   73      pub(crate) environments: Option<Vec<TurnEnvironmentSelection>>,\n   74  }\n   75  \n   76  #[derive(Clone, Debug)]\n   77  pub(crate) struct LiveAgent {\n   78      pub(crate) thread_id: ThreadId,\n   79      pub(crate) metadata: AgentMetadata,\n   80      pub(crate) status: AgentStatus,\n   81  }\n   82  \n   83  #[derive(Clone, Debug, Serialize, PartialEq, Eq)]\n   84  pub(crate) struct ListedAgent {\n   85      pub(crate) agent_name: String,\n   86      pub(crate) agent_status: AgentStatus,\n   87  }\n   88  \n   89  /// Control-plane handle for multi-agent operations.\n   90  /// `AgentControl` is held by each session (via `SessionServices`). It provides capability to\n   91  /// spawn new agents and the inter-agent communication layer.\n   92  /// An `AgentControl` instance is intended to be created at most once per root thread/session\n   93  /// tree. That same `AgentControl` is then shared with every sub-agent spawned from that root,\n   94  /// which keeps the registry scoped to that root thread rather than the entire `ThreadManager`.\n   95  #[derive(Clone, Default)]\n   96  pub(crate) struct AgentControl {\n   97      /// ID shared by the whole agent control session. This means every sub-agents from a common\n   98      /// root share the same session ID.\n   99      session_id: SessionId,",
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
          "snippet": "   93  pub enum RolloutRecorderParams {\n   94      Create {\n   95          session_id: SessionId,\n   96          conversation_id: ThreadId,\n   97          forked_from_id: Option<ThreadId>,\n   98          parent_thread_id: Option<ThreadId>,\n   99          source: Box<SessionSource>,\n  100          thread_source: Option<ThreadSource>,\n  101          originator: String,\n  102          base_instructions: BaseInstructions,\n  103          dynamic_tools: Vec<DynamicToolSpec>,\n  104          selected_capability_roots: Vec<SelectedCapabilityRoot>,\n  105          multi_agent_version: Option<MultiAgentVersion>,\n  106          history_mode: ThreadHistoryMode,\n  107          history_base: Option<HistoryPosition>,\n  108          subagent_history_start_ordinal: Option<u64>,\n  109          initial_window_id: Option<String>,\n  110      },\n  111      Resume {\n  112          path: PathBuf,\n  113      },\n  114  }\n  115  \n  116  enum RolloutCmd {\n  117      AddItems(Vec<RolloutItem>),\n  118      Persist {\n  119          ack: oneshot::Sender<std::io::Result<()>>,\n  120      },\n  121      /// Ensure all prior writes are processed; respond when flushed.\n  122      Flush {",
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
    "commit": "bef6119500b0238ad84f6396d2a6cabda9991554",
    "date": "2026-07-27T17:36:48Z",
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
          "snippet": "  236    | ServerGeminiModelInfoEvent\n  237    | ServerGeminiAgentExecutionStoppedEvent\n  238    | ServerGeminiAgentExecutionBlockedEvent;\n  239  \n  240  // A turn manages the agentic loop turn within the server context.\n  241  export class Turn {\n  242    private callCounter = 0;\n  243  \n  244    readonly pendingToolCalls: ToolCallRequestInfo[] = [];\n  245    private debugResponses: GenerateContentResponse[] = [];\n  246    private pendingCitations = new Set<string>();\n  247    private cachedResponseText: string | undefined = undefined;\n  248    finishReason: FinishReason | undefined = undefined;\n  249    private hasLoggedRagTrace = false;\n  250  \n  251    constructor(\n  252      private readonly chat: GeminiChat,\n  253      private readonly prompt_id: string,\n  254    ) {}\n  255  \n  256    // The run method yields simpler events suitable for server logic\n  257    async *run(\n  258      modelConfigKey: ModelConfigKey,\n  259      req: PartListUnion,\n  260      signal: AbortSignal,\n  261      options: {\n  262        displayContent?: PartListUnion;\n  263        role?: LlmRole;\n  264        apiHistoryOverride?: Content[];\n  265      } = {},",
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
    "commit": "119301ac9d605fc4c50e88dc347a783901e54b73",
    "date": "2026-07-27T18:36:20-07:00",
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
          "snippet": "    4  impl Agent {\n    5      /// Run a single turn with the given user message\n    6      pub async fn run_once(&mut self, user_message: &str) -> Result<()> {\n    7          self.add_message(\n    8              Role::User,\n    9              vec![ContentBlock::Text {\n   10                  text: user_message.to_string(),\n   11                  cache_control: None,\n   12              }],\n   13          );\n   14          self.session.save()?;\n   15          if trace_enabled() {\n   16              eprintln!(\"[trace] session_id {}\", self.session.id);\n   17          }\n   18          let _ = self.run_turn(true).await?;\n   19          Ok(())\n   20      }\n   21  \n   22      pub async fn run_once_capture(&mut self, user_message: &str) -> Result<String> {\n   23          self.add_message(\n   24              Role::User,\n   25              vec![ContentBlock::Text {\n   26                  text: user_message.to_string(),\n   27                  cache_control: None,\n   28              }],\n   29          );\n   30          self.session.save()?;\n   31          if trace_enabled() {\n   32              eprintln!(\"[trace] session_id {}\", self.session.id);\n   33          }",
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
          "snippet": "   17      pub(super) async fn run_turn(&mut self, print_output: bool) -> Result<String> {\n   18          self.set_log_context();\n   19          crate::session_metrics::record_turn(&self.session.id);\n   20          // Mark this session as actively streaming for presence UIs (e.g. the\n   21          // macOS menu bar indicator). Cleared automatically on every exit path.\n   22          let _streaming_guard = crate::session::StreamingGuard::new(self.session.id.clone());\n   23          // Register this turn's cancel signal so session-level cancels reach\n   24          // this in-flight turn even through stale control handles (issue #428).\n   25          let _turn_cancel_guard = crate::turn_cancel_registry::register_active_turn(\n   26              &self.session.id,\n   27              self.graceful_shutdown.clone(),\n   28          );\n   29          let mut final_text = String::new();\n   30          let trace = trace_enabled();\n   31          let mut context_limit_retries = 0u32;\n   32          let mut incomplete_continuations = 0u32;\n   33          let mut empty_post_tool_continuations = 0u32;\n   34  \n   35          loop {\n   36              let repaired = self.repair_missing_tool_outputs();\n   37              if repaired > 0 {\n   38                  logging::warn(&format!(\n   39                      \"Recovered {} missing tool output(s) before API call\",\n   40                      repaired\n   41                  ));\n   42              }\n   43              let (messages, compaction_event) = self.messages_for_provider();\n   44              if let Some(event) = compaction_event {\n   45                  // Reset cache tracker and tool lock on compaction since the message history changes\n   46                  self.cache_tracker.reset();",
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
          "snippet": "  455                      StreamEvent::RetryRollback { attempt, max } => {\n  456                          // Transient transport fault mid-stream; the provider is\n  457                          // replaying the request. Discard this attempt's partial\n  458                          // output so the replay doesn't duplicate it in history.\n  459                          logging::warn(&format!(\n  460                              \"Mid-stream retry rollback (attempt {}/{}): discarding partial output ({} text chars, {} tool calls)\",\n  461                              attempt,\n  462                              max,\n  463                              text_content.len(),\n  464                              tool_calls.len(),\n  465                          ));\n  466                          if print_output && !text_content.is_empty() {\n  467                              // Already-printed text can't be unprinted on a plain\n  468                              // stdout stream; mark the discontinuity instead.\n  469                              println!(\"\\n[connection interrupted, retrying response from the top]\");\n  470                              io::stdout().flush()?;\n  471                          }\n  472                          text_content.clear();\n  473                          tool_calls.clear();\n  474                          current_tool = None;\n  475                          current_tool_input.clear();\n  476                          sdk_tool_results.clear();\n  477                          generated_image_contexts.clear();\n  478                          reasoning_content.clear();\n  479                          reasoning_signature.clear();\n  480                          openai_reasoning_items.clear();\n  481                          openai_native_compaction = None;\n  482                          saw_message_end = false;\n  483                          stop_reason = None;\n  484                      }",
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
          "snippet": "    9  pub const TOOL_INTENT_DESCRIPTION: &str = concat!(\n   10      \"Short natural-language label explaining why this tool call is being made. \",\n   11      \"Used for compact UI display only. Required on every call; do not use this instead of required tool parameters.\"\n   12  );\n   13  \n   14  pub fn intent_schema_property() -> Value {\n   15      serde_json::json!({\n   16          \"type\": \"string\",\n   17          \"description\": TOOL_INTENT_DESCRIPTION,\n   18      })\n   19  }\n   20  \n   21  /// Ensure a tool parameter schema declares the shared `intent` property and\n   22  /// marks it required. Applied centrally when converting tools to provider\n   23  /// definitions so every tool (including MCP proxies) asks the model for an\n   24  /// intent without each tool wiring it manually.\n   25  pub fn ensure_intent_in_schema(mut schema: Value) -> Value {\n   26      let Some(object) = schema.as_object_mut() else {\n   27          return schema;\n   28      };\n   29      // Only touch object-shaped parameter schemas.\n   30      let is_object_schema = object\n   31          .get(\"type\")\n   32          .and_then(|t| t.as_str())\n   33          .map(|t| t == \"object\")\n   34          .unwrap_or_else(|| object.contains_key(\"properties\"));\n   35      if !is_object_schema {\n   36          return schema;\n   37      }\n   38  ",
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
          "snippet": "  451  /// Build system prompt split into static (cacheable) and dynamic parts\n  452  /// This improves cache hit rate by keeping frequently-changing content separate\n  453  pub fn build_system_prompt_split(\n  454      skill_prompt: Option<&str>,\n  455      available_skills: &[SkillInfo],\n  456      is_selfdev: bool,\n  457      memory_prompt: Option<&str>,\n  458      working_dir: Option<&Path>,\n  459  ) -> (SplitSystemPrompt, ContextInfo) {\n  460      build_system_prompt_split_with_capabilities(\n  461          skill_prompt,\n  462          available_skills,\n  463          is_selfdev,\n  464          memory_prompt,\n  465          working_dir,\n  466          PromptCapabilities::current(),\n  467      )\n  468  }\n  469  \n  470  pub fn build_system_prompt_split_with_capabilities(\n  471      skill_prompt: Option<&str>,\n  472      available_skills: &[SkillInfo],\n  473      is_selfdev: bool,\n  474      memory_prompt: Option<&str>,\n  475      working_dir: Option<&Path>,\n  476      capabilities: PromptCapabilities,\n  477  ) -> (SplitSystemPrompt, ContextInfo) {\n  478      let mut static_parts = base_system_prompt_parts(capabilities);\n  479      let mut dynamic_parts = Vec::new();\n  480      let mut info = ContextInfo {",
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
          "snippet": "  543      /// Execute a tool by name\n  544      pub async fn execute(&self, name: &str, input: Value, ctx: ToolContext) -> Result<ToolOutput> {\n  545          let tools = self.tools.read().await;\n  546          let resolved_name = Self::resolve_tool_name(name);\n  547          if let Some(policy) = session_tool_policy(&ctx.session_id) {\n  548              if let Some(allowed) = policy.allowed_tools.as_ref()\n  549                  && !allowed.contains(resolved_name)\n  550              {\n  551                  return Err(anyhow::anyhow!(\"Tool '{}' is not allowed\", resolved_name));\n  552              }\n  553              if policy.disabled_tools.contains(resolved_name) {\n  554                  return Err(anyhow::anyhow!(\"Tool '{}' is disabled\", resolved_name));\n  555              }\n  556          }\n  557          let tool = match tools.get(resolved_name) {\n  558              Some(tool) => tool.clone(),\n  559              None => {\n  560                  // List available tools so the model can recover instead of\n  561                  // spiraling through hallucinated names like \"ToolSearch\" (#104).\n  562                  let mut available: Vec<&str> = tools.keys().map(|k| k.as_str()).collect();\n  563                  available.sort_unstable();\n  564                  let suggestions = Self::closest_tool_names(name, &available);\n  565                  let mut msg = format!(\"Unknown tool: {name}.\");\n  566                  if !suggestions.is_empty() {\n  567                      msg.push_str(&format!(\" Did you mean: {}?\", suggestions.join(\", \")));\n  568                  }\n  569                  msg.push_str(&format!(\" Available tools: {}.\", available.join(\", \")));\n  570                  return Err(anyhow::anyhow!(msg));\n  571              }\n  572          };",
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
          "snippet": "  307      pub fn save(&mut self) -> Result<()> {\n  308          self.updated_at = Utc::now();\n  309          let path = session_path(&self.id)?;\n  310          let journal_path = session_journal_path_from_snapshot(&path);\n  311          let start = std::time::Instant::now();\n  312          let snapshot_bytes_before = file_len_or_zero(&path);\n  313          let journal_bytes_before = file_len_or_zero(&journal_path);\n  314          let current_meta = self.journal_meta();\n  315          let metadata_needs_snapshot = self\n  316              .persist_state\n  317              .last_meta\n  318              .as_ref()\n  319              .is_some_and(|prev| metadata_requires_snapshot(prev, &current_meta));\n  320          let vectors_need_snapshot = !self.persist_state.snapshot_exists\n  321              || self.persist_state.messages_mode == PersistVectorMode::Full\n  322              || self.persist_state.env_snapshots_mode == PersistVectorMode::Full\n  323              || self.persist_state.memory_injections_mode == PersistVectorMode::Full\n  324              || self.persist_state.replay_events_mode == PersistVectorMode::Full\n  325              || self.messages.len() < self.persist_state.messages_len\n  326              || self.env_snapshots.len() < self.persist_state.env_snapshots_len\n  327              || self.memory_injections.len() < self.persist_state.memory_injections_len\n  328              || self.replay_events.len() < self.persist_state.replay_events_len;\n  329  \n  330          let delta_messages = self\n  331              .messages\n  332              .len()\n  333              .saturating_sub(self.persist_state.messages_len);\n  334          let delta_env_snapshots = self\n  335              .env_snapshots\n  336              .len()",
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
    "commit": "4a550effdfcb29a25a5d325bf935296cc50cd417",
    "date": "2026-07-16T10:03:00Z",
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
    "commit": "22e18cafc0dfe27f192e8e303ffae0a0bc548eb0",
    "date": "2026-08-03T06:00:46+08:00",
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
          "snippet": "   33  // maxToolOutputBytes caps a single tool result before it goes into the model's\n   34  // context. ~32KB is roughly 8K tokens — enough for a full file read or a busy\n   35  // grep, while preventing one accidental \"read this 5 MB log\" from blowing the\n   36  // window before the next compaction runs.\n   37  const maxToolOutputBytes = 32 * 1024\n   38  \n   39  const maxFinalReadinessBlocks = 3\n   40  \n   41  // maxFinalReadinessBlocksWithProgress is the hard cap on readiness retries when\n   42  // the model keeps producing new host-observable receipts between blocks. A\n   43  // converging turn (edit → verify → review still catching up to the latest\n   44  // mutation) deserves more nudges than a stuck one; a turn that stalls with no\n   45  // new receipts still fails at maxFinalReadinessBlocks.\n   46  const maxFinalReadinessBlocksWithProgress = 6\n   47  const maxEmptyFinalBlocks = 3\n   48  const maxStreamRecoveries = 3\n   49  const maxExecutorHandoffNudges = 1\n   50  \n   51  // DeliveryRuntimeMarker is the delivery-mode contract block appended to user\n   52  // turns (withTurnPreferences). Exported as the single source of truth for the\n   53  // byte-exact suffix strip in preview derivation and for cross-package tests;\n   54  // its text is cache-frozen — changing it breaks steer replay matching and the\n   55  // prefix stability of every live delivery session.\n   56  const DeliveryRuntimeMarker = `<delivery-runtime>\n   57  This session is in delivery-first mode. Before any state-changing tool call,\n   58  establish concrete, verifiable acceptance criteria with todo_write. After the\n   59  change, inspect the result, run relevant verification, and sign off each step\n   60  with complete_step citing the successful verification command. The host enforces\n   61  these gates and will reject mutation or finalization when evidence is missing.\n   62  </delivery-runtime>`",
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
          "snippet": "   60  // ErrTurnRunning reports that a caller tried to start a second foreground turn\n   61  // while one is already active in the same Controller.\n   62  var ErrTurnRunning = errors.New(\"turn already running\")\n   63  \n   64  // errTurnRunningRotation and errRotationInProgress are returned by the\n   65  // session-rotation gate (beginRotation) when a rotation cannot proceed: a turn\n   66  // is in flight, or another rotation already holds the gate.\n   67  var (\n   68  \terrTurnRunningRotation = errors.New(\"cannot start a new session while a turn is running\")\n   69  \terrRotationInProgress  = errors.New(\"cannot start a new session while another session change is in progress\")\n   70  )\n   71  \n   72  // errNoSessionPath is returned by snapshot when a session has content to persist\n   73  // but no resolved session path — a misconfiguration (e.g. an unresolvable data\n   74  // dir in a bot deployment) that previously dropped conversations silently\n   75  // (#4414). Callers log it and continue; it must never be swallowed quietly.\n   76  var errNoSessionPath = errors.New(\"session has content but no session path; conversation cannot be persisted\")",
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
          "snippet": "   40  // Message is a single conversation message.\n   41  type Message struct {\n   42  \tRole Role `json:\"role\"`\n   43  \t// Content is the provider-visible conversation content. Keeping this legacy\n   44  \t// field provider-visible preserves replay for older CLI/Desktop releases.\n   45  \tContent string `json:\"content,omitempty\"`\n   46  \t// RawContent is the user-authored form of a user turn, when it differs from\n   47  \t// Content because the host added transient context. Older releases ignore\n   48  \t// this field and still replay the provider-visible Content safely.\n   49  \tRawContent string `json:\"raw_content,omitempty\"`\n   50  \t// ProviderContent is a transitional field written by early Context Engine v2\n   51  \t// builds. Loaders migrate it into Content/RawContent before normal use.\n   52  \tProviderContent  string   `json:\"provider_content,omitempty\"`\n   53  \tImages           []string `json:\"images,omitempty\"`            // data URLs (data:<mime>;base64,…) on user (attachments) and tool (MCP image results) messages; embedded only for vision-capable models\n   54  \tReasoningContent string   `json:\"reasoning_content,omitempty\"` // assistant: thinking-mode chain-of-thought, round-tripped on multi-turn\n   55  \t// ReasoningSignature is an opaque, provider-issued proof that ReasoningContent\n   56  \t// is genuine model output. Anthropic requires the signed thinking block be\n   57  \t// replayed on the next turn when a tool call followed thinking; providers\n   58  \t// without signed reasoning (e.g. the openai-compatible ones) leave it empty.\n   59  \t// Round-tripped alongside ReasoningContent.\n   60  \tReasoningSignature string           `json:\"reasoning_signature,omitempty\"`\n   61  \tToolCalls          []ToolCall       `json:\"tool_calls,omitempty\"`      // set by assistant\n   62  \tToolCallID         string           `json:\"tool_call_id,omitempty\"`    // links a tool result to its call\n   63  \tName               string           `json:\"name,omitempty\"`            // tool message: tool name\n   64  \tMemoryCitations    []MemoryCitation `json:\"memoryCitations,omitempty\"` // local UI metadata; provider requests ignore it\n   65  \tWorkDurationMs     int64            `json:\"workDurationMs,omitempty\"`  // local UI metadata; provider requests ignore it\n   66  \tCreatedAt          int64            `json:\"createdAt,omitempty\"`       // local UI metadata; unix milliseconds; stripped before provider requests\n   67  \tEdited             bool             `json:\"edited,omitempty\"`          // local UI metadata; provider requests ignore it\n   68  \tOriginal           string           `json:\"original,omitempty\"`        // user prompt before inline edit\n   69  \t// LocalOnly marks durable transcript content that must never be sent to a",
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
          "snippet": "   20  // toolCallPlan holds the resolved, policy-checked state for one tool call.\n   21  // Package-private; not shared across goroutines beyond the single executeOne\n   22  // invocation that owns it.\n   23  type toolCallPlan struct {\n   24  \tcall          provider.ToolCall\n   25  \ttool          tool.Tool\n   26  \tcanonicalName string\n   27  \n   28  \tpermName     string\n   29  \tpermArgs     json.RawMessage\n   30  \texecTool     tool.Tool\n   31  \texecArgs     json.RawMessage\n   32  \tevidenceName string\n   33  \tevidenceArgs json.RawMessage\n   34  \treadOnly     bool\n   35  \n   36  \tresolved     tool.ResolvedCall\n   37  \tresolvedMeta *tool.ResolvedCall\n   38  \n   39  \tmutates                   bool\n   40  \tverification              bool\n   41  \tplanTransition            bool\n   42  \tplanBefore                string\n   43  \tplanAfter                 string\n   44  \tplanReplacementAuthorized bool\n   45  \trecoveryGen               uint64\n   46  \n   47  \trunTool            tool.Tool\n   48  \trunArgs            json.RawMessage\n   49  \tcctx               context.Context",
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
          "snippet": "   19  // Compaction is a low-frequency cache-reset point: the prompt grows append-only\n   20  // (high cache hits) until a turn nears compactRatio of the window, then it is\n   21  // compacted down to a tail budget. The budget is a fixed token count, not a\n   22  // fraction of the window, so a huge window still compacts rarely while a small\n   23  // one still lands below the trigger (which is what stops the re-compaction loop).\n   24  const (\n   25  \tdefaultSoftCompactRatio    = 0.5   // report growing context here, but keep the cache-stable prefix intact\n   26  \tdefaultToolResultSnipRatio = 0.6   // rewrite stale tool results cheaply before summary compaction\n   27  \tdefaultCompactRatio        = 0.8   // trigger: prompt at this fraction of the window compacts\n   28  \tdefaultCompactForceRatio   = 0.9   // force compaction at this high-water mark even for low-value folds\n   29  \tdefaultCompactTarget       = 0.5   // safety cap: the kept tail never exceeds this fraction of the window\n   30  \tdefaultTailTokens          = 16384 // verbatim recent-tail budget, in tokens\n   31  \tminRecentKeep              = 2     // never keep fewer recent messages than this\n   32  \tminCompactMessages         = 2     // skip compaction below this many compactable messages\n   33  \tfallbackTokPerChar         = 0.25  // ~4 chars/token, used before any usage is available to calibrate\n   34  \tmaxPinnedFirstUserTokens   = 1500  // ceiling on pinning the first user turn verbatim; larger first turns (pasted content) stay foldable\n   35  \tpinnedFirstUserWindowFrac  = 0.15  // and never pin a first turn worth more than this fraction of the window\n   36  )",
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
          "snippet": "   36  // DefaultPlannerPrompt steers the planner toward concise plans, not execution.\n   37  const DefaultPlannerPrompt = `You are the planner in a two-model coding agent.\n   38  Given a task, produce a concise, ordered plan for the executor model to carry out.\n   39  Use the read-only tools available to you when the task needs context from the\n   40  workspace, user rules, or docs; keep that research targeted and stop once you\n   41  have enough evidence. Do not write full implementations or attempt side effects.\n   42  Do not ask the user how to trigger the executor and do not say you are waiting\n   43  for the executor. Output executor-ready instructions: what to do, which files or\n   44  commands are relevant, expected blockers, and key decisions. Keep it short and\n   45  actionable.\n   46  \n   47  A host-authored <planner-turn> block at the end of the user turn selects the\n   48  planning depth. For depth=light, return a compact objective, 1-4 ordered steps,\n   49  likely touchpoints, and the main verification; omit empty boilerplate sections.\n   50  For depth=full, inspect enough evidence to distinguish verified touchpoints from\n   51  candidate touchpoints, then include goal/non-goals when useful, ordered steps,\n   52  risks or blockers, concrete acceptance criteria, command-level verification, and\n   53  rollback only when the change is risky or difficult to reverse. Label assumptions\n   54  instead of presenting inferred paths or commands as verified facts.\n   55  \n   56  If execution must stop for explicit user approval of the plan, end the plan with\n   57  a final line containing exactly [planner_requires_approval]. If execution needs\n   58  a user-owned decision or missing user-provided value before it can be safe, do\n   59  not ask in prose; include one structured block:\n   60  <planner-ask>\n   61  question: the concrete question\n   62  option: recommended safe/default choice\n   63  option: alternative choice\n   64  </planner-ask>\n   65  ",
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
          "snippet": "   26  const (\n   27  \tcleanupPendingExt             = \".cleanup-pending.json\"\n   28  \tmaxRecoveryParentStemBytes    = 80\n   29  \tsessionLockSidecarSuffix      = \".jsonl.lock\"\n   30  \tsessionLeaseLockSidecarSuffix = \".jsonl.lease.lock\"\n   31  \tsessionLeaseInfoSidecarSuffix = \".jsonl.lease.json\"\n   32  \tguardianSidecarSuffix         = \".guardian.jsonl\"\n   33  \t// nameMaxBytes is the single-component filename limit shared by the\n   34  \t// filesystems Reasonix targets (APFS, ext4, NTFS all cap at 255).\n   35  \tnameMaxBytes = 255\n   36  \t// maxSessionBasenameBytes bounds transcript basenames that reconciliation\n   37  \t// leaves in place. Sidecars append up to ~16 bytes to the transcript name\n   38  \t// or its stem (\".lease.lock\", \".cleanup-pending.json\", \".guardian.jsonl\"),\n   39  \t// so 224 keeps every sidecar comfortably under nameMaxBytes with headroom\n   40  \t// for future suffixes. Names past this bound come from the pre-bounded\n   41  \t// recovery cascade and get renamed by reconcileOverlongSessionFilenames.\n   42  \tmaxSessionBasenameBytes = 224\n   43  )\n   44  \n   45  var (\n   46  \tsessionSaveLocks sync.Map\n   47  \t// sessionFileLockWait bounds cross-process save-lock acquisition. Session\n   48  \t// leases normally prevent competing writers, but CLI/legacy writers and a\n   49  \t// stalled process can still hold the compatibility .lock file. Navigation\n   50  \t// and desktop shutdown snapshot synchronously; waiting forever here wedges\n   51  \t// the UI and keeps the session lease (and WebView) alive indefinitely.\n   52  \t// Package vars let focused tests shorten the wait without slowing the suite.\n   53  \tsessionFileLockWait         = 5 * time.Second\n   54  \tsessionFileLockPollInterval = 25 * time.Millisecond\n   55  \tErrSessionSnapshotConflict  = errors.New(\"session snapshot conflicts with newer transcript\")",
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
    "commit": "b63e48331b7d06e0517970cd9b9033a4cbbe6fff",
    "date": "2026-08-04T00:31:42-07:00",
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
          "snippet": "  221  /// Configuration for the engine\n  222  #[derive(Debug, Clone)]\n  223  pub struct EngineConfig {\n  224      /// Model identifier to use for responses.\n  225      pub model: String,\n  226      /// Route/offering limits for the active provider+model, when the runtime\n  227      /// route resolver had concrete catalog facts.\n  228      pub active_route_limits: Option<codewhale_config::route::RouteLimits>,\n  229      /// Workspace root for tool execution and file operations.\n  230      pub workspace: PathBuf,\n  231      /// Allow shell tool execution when true.\n  232      pub allow_shell: bool,\n  233      /// Enable trust mode (skip approvals) when true.\n  234      pub trust_mode: bool,\n  235      /// Path to the notes file used by the notes tool.\n  236      pub notes_path: PathBuf,\n  237      /// Path to the MCP configuration file.\n  238      pub mcp_config_path: PathBuf,\n  239      /// Directory containing discoverable skills.\n  240      pub skills_dir: PathBuf,\n  241      /// Restrict skill discovery to CodeWhale-owned roots plus explicit\n  242      /// `skills_dir` configuration.\n  243      pub skills_scan_codewhale_only: bool,\n  244      /// Immutable plugin authority snapshot scoped to `workspace`. Normal App\n  245      /// hosts provide this explicitly; headless/embed callers that leave it\n  246      /// unset receive a fresh workspace-specific snapshot in [`Engine::new`].\n  247      pub plugin_registry: Option<Arc<crate::plugins::PluginRegistry>>,\n  248      /// Sources injected as `<instructions source=\"…\">` blocks in the system\n  249      /// prompt (#454). Each entry is either a disk path (read at render time)\n  250      /// or an inline string. Loaded in declared order from the user's",
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
          "snippet": " 1920      /// Run the engine event loop\n 1921      #[allow(clippy::too_many_lines)]\n 1922      pub async fn run(mut self) {\n 1923          // RuntimeThreadManager owns durable turn claims and installs a thread\n 1924          // id in runtime services. Only the interactive TUI may autonomously\n 1925          // create a new turn while the engine is otherwise idle; a hosted\n 1926          // engine must wait for its host to claim and explicitly dispatch the\n 1927          // next turn so events cannot be attached to the wrong durable record.\n 1928          let host_managed_turns = self.host_managed_turns();\n 1929  \n 1930          loop {\n 1931              let Some(input) = self.next_run_input(host_managed_turns).await else {\n 1932                  break;\n 1933              };\n 1934  \n 1935              // Runtime posture updates publish through shared typed state\n 1936              // before attempting their best-effort wake-up. If the mailbox was\n 1937              // already full, its next queued operation is the wake-up: apply\n 1938              // the latest authority before doing any work under an obsolete\n 1939              // policy.\n 1940              if matches!(&input, EngineRunInput::Operation(_)) {\n 1941                  self.apply_pending_runtime_authority().await;\n 1942              }",
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
          "snippet": "  364      pub(super) async fn handle_deepseek_turn(\n  365          &mut self,\n  366          turn: &mut TurnContext,\n  367          tool_policy: ToolSurfacePolicy,\n  368          // Out-of-request facts resolved once for this turn. `None` means the\n  369          // caller captured none, and the projection reports every\n  370          // registry-derived field as unknown rather than guessing.\n  371          inspection_surface: Option<crate::tool_inspection::ToolSurfaceContext>,\n  372      ) -> (TurnOutcomeStatus, Option<String>) {\n  373          // Only interactive TUI hosts own terminal chrome. Headless exec,\n  374          // app-server, and stream-json stdout must remain byte-clean.\n  375          if self.config.terminal_chrome_enabled {\n  376              crate::tui::notifications::set_taskbar_progress_busy();\n  377              crate::tui::notifications::start_title_animation(\"Codewhale\");\n  378          }\n  379  \n  380          let client = self\n  381              .model_client\n  382              .clone()\n  383              .expect(\"model client should be configured\");\n  384  \n  385          let mut consecutive_tool_error_steps = 0u32;\n  386          let mut stuck_guard = StuckGuard::default();\n  387          // Scoped to this external user turn: counts survive all model/tool\n  388          // steps below, then reset before the next user prompt.\n  389          let mut read_repeat_guard = ReadRepeatGuard::default();\n  390          let mut turn_error: Option<String> = None;\n  391          let mut context_recovery_attempts = 0u8;\n  392          let mut tool_policy = tool_policy;\n  393          let mut mode = tool_policy.mode;",
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
          "snippet": " 1158  /// The core trait that all tools must implement.\n 1159  #[async_trait]\n 1160  pub trait ToolSpec: Send + Sync {\n 1161      /// Returns the unique name of this tool (used in API calls).\n 1162      fn name(&self) -> &str;\n 1163  \n 1164      /// Returns a human-readable description of what this tool does.\n 1165      fn description(&self) -> &str;\n 1166  \n 1167      /// Returns the JSON Schema for the tool's input parameters.\n 1168      fn input_schema(&self) -> Value;\n 1169  \n 1170      /// Returns the capabilities this tool has.\n 1171      fn capabilities(&self) -> Vec<ToolCapability>;\n 1172  \n 1173      /// Returns the approval requirement for this tool.\n 1174      fn approval_requirement(&self) -> ApprovalRequirement {\n 1175          let caps = self.capabilities();\n 1176          if caps.contains(&ToolCapability::ExecutesCode) {\n 1177              ApprovalRequirement::Required\n 1178          } else if caps.contains(&ToolCapability::WritesFiles) {\n 1179              ApprovalRequirement::Suggest\n 1180          } else {\n 1181              ApprovalRequirement::Auto\n 1182          }\n 1183      }\n 1184  \n 1185      /// Returns the approval requirement for this concrete tool input.\n 1186      fn approval_requirement_for(&self, _input: &Value) -> ApprovalRequirement {\n 1187          self.approval_requirement()",
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
          "snippet": "    1  //! Unified context-budget math for the TUI.\n    2  //!\n    3  //! Given a model's context window, the current input token estimate, and a\n    4  //! configured output cap, [`ContextBudget`] derives the four numbers the rest\n    5  //! of the app needs to reason about a turn:\n    6  //!\n    7  //!   * **available input budget** — how many input tokens may still be spent\n    8  //!     after reserving room for the model's output;\n    9  //!   * **output token cap** — the output reservation actually used to compute\n   10  //!     that budget (clamped so it never starves the window);\n   11  //!   * **compaction trigger** — the input-token level at which compaction\n   12  //!     should be suggested (default: ~75% of the spendable input ceiling);\n   13  //!   * **[`PressureLevel`]** — a coarse Low/Medium/High/Critical signal the UI\n   14  //!     can render without re-deriving thresholds.\n   15  //!\n   16  //! This module is the budget-math *foundation*. It is intentionally pure (no\n   17  //! I/O, no clock, no engine/config types) so it can be unit-tested in isolation\n   18  //! and later consumed by the engine capacity checkpoints and the TUI pressure\n   19  //! indicator. Those consumers are wired in a separate pass; nothing here calls\n   20  //! into them.\n   21  //!\n   22  //! ### Why the output reservation is window-dependent\n   23  //!\n   24  //! The engine's existing input-budget helper\n   25  //! (`core::engine::context::context_input_budget_for_window`) computes\n   26  //! `window - reserved_output - headroom` and learned the hard way that\n   27  //! reserving a large fixed output (262K for V4-class interleaved thinking) on a\n   28  //! *small* self-hosted window (e.g. a 256K vLLM deployment) underflows to a\n   29  //! negative budget and silently disables every preflight/recovery path. We\n   30  //! mirror that lesson here with saturating arithmetic and an output cap that is",
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
          "snippet": "    1  //! Async MCP (Model Context Protocol) Implementation\n    2  //!\n    3  //! This module provides full async support for MCP servers with:\n    4  //! - Connection pooling for server reuse\n    5  //! - Automatic tool discovery via `tools/list`\n    6  //! - Configurable timeouts per-server and globally\n    7  \n    8  use std::collections::{HashMap, HashSet};\n    9  use std::ffi::{OsStr, OsString};\n   10  use std::fs;\n   11  use std::future::Future;\n   12  use std::io::{Read, Seek};\n   13  use std::path::{Component, Path, PathBuf};\n   14  use std::sync::Arc;\n   15  use std::sync::atomic::{AtomicU64, Ordering};\n   16  use std::time::Duration;\n   17  \n   18  use anyhow::{Context, Result};\n   19  use parking_lot::RwLock;\n   20  use serde::{Deserialize, Serialize};\n   21  use sha2::Digest as _;\n   22  \n   23  pub mod external_import;\n   24  mod headers;\n   25  pub mod oauth;\n   26  mod sse;\n   27  mod stdio;\n   28  mod streamable_http;\n   29  \n   30  use self::headers::{apply_safe_custom_headers, with_default_mcp_http_headers};",
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
          "snippet": "   26  /// Maximum number of sessions to retain\n   27  const MAX_SESSIONS: usize = 50;\n   28  /// Maximum session title length, in `char`s. Matches the bound the session\n   29  /// picker's rename prompt has always enforced.\n   30  pub const MAX_SESSION_TITLE_CHARS: usize = 100;\n   31  const WORK_GRAPH_IMPORT_ARCHIVE_DIR: &str = \".work-graph-import-archive\";\n   32  const CURRENT_SESSION_SCHEMA_VERSION: u32 = 1;\n   33  const CURRENT_QUEUE_SCHEMA_VERSION: u32 = 1;\n   34  \n   35  const fn default_session_schema_version() -> u32 {\n   36      CURRENT_SESSION_SCHEMA_VERSION\n   37  }\n   38  \n   39  const fn default_queue_schema_version() -> u32 {\n   40      CURRENT_QUEUE_SCHEMA_VERSION",
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
    "commit": "a3b3e753490d0a6ed180e905200c1a6690d78608",
    "date": "2026-08-11T23:12:36+02:00",
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
    "commit": "4cd21b61592ef0239f59cf4e3f27a2a70d226737",
    "date": "2026-08-11T17:06:38-07:00",
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
