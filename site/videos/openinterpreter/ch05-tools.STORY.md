# M05 · 工具：模型看到的名字不等于内部执行器

## Hook
要兼容十几套工具名，我先看 aliases、runtime 分发和 FileChange lifecycle 怎样收敛。

## Evidence anchors
- oi-tools-001: codex-rs/core/src/tools/spec_plan.rs:240-268 · 模型可见工具与内部可分发 runtime 分离
  - 给模型看的菜单和厨房真正能接的订单不是同一张表；旧别名可以藏在后厨，不污染新模型的菜单。
- oi-tools-002: codex-rs/core/src/tools/handlers/harness_aliases.rs:102-254 · Harness aliases 将十余套工具名收敛到共享执行器
  - Claude 叫 Read、Pi 叫 read、OpenCode 叫 task，都可以落到同一套真实能力上。
- oi-tools-003: codex-rs/core/src/tools/handlers/harness_aliases.rs:1749-1821 · Harness 写文件也进入统一 FileChange lifecycle
  - 即使模型说的是别家 Agent 的 Write/Edit，前端仍能看到正式的文件改动卡片、diff、成功或失败状态。

## Takeaway
兼容多 Harness 时能避免重复工具；隐藏 handler 仍属于攻击面，必须受同一权限检查。
