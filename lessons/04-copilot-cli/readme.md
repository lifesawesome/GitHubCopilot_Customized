# Lesson 4: Copilot CLI

## Overview

| Aspect | Detail |
|--------|--------|
| **Duration** | 60 minutes (40 min instruction + 20 min hands-on) |
| **Level** | Intermediate |
| **Prerequisites** | Copilot license, terminal access |
| **Outcome** | Use the standalone `copilot` CLI for terminal-based AI assistance |

---

## Why This Matters

Not everything happens in VS Code. When you're in the terminal — deploying, debugging, scripting, or managing git — Copilot CLI brings an **agentic AI assistant** directly to your command line. It can read files, run shell commands, search code, create PRs, and even work autonomously — all without switching context.

---

## Installation

### 1. Install Copilot CLI

```powershell
# Windows (winget)
winget install GitHub.copilot-cli

# macOS (Homebrew)
brew install gh-copilot

# Or update an existing installation
copilot update
```

### 2. Authenticate

```powershell
copilot login
```

### 3. Verify

```powershell
copilot version
```

---

## Core Concepts

### The Interactive Interface

Launch the interactive TUI with a single command:

```powershell
copilot
```

This opens a rich terminal UI where you chat with Copilot, ask questions, and let it execute tasks. You can also run a one-shot prompt:

```powershell
copilot -p "list all TypeScript files in the api directory"
```

### Three Modes

Toggle between modes with **Shift+Tab**:

| Mode | Behavior |
|------|----------|
| **Standard** | Copilot asks for confirmation before running commands or editing files |
| **Plan** | Copilot creates an implementation plan before making changes |
| **Autopilot** | Copilot works autonomously, executing tools without confirmation |

### File References with `@`

Reference files directly in your prompts:

```
@ api/src/routes/branch.ts explain this route handler
```

### Shell Escape with `!`

Run shell commands directly without leaving Copilot:

```
! npm test --workspace=api
```

### Working Directory & Trusted Directories

When you launch `copilot`, it asks you to confirm that you **trust** the files in the current folder. Copilot may read, modify, and execute files in and below that directory.

| Option | Meaning |
|--------|---------|
| **Yes, proceed** | Trust this folder for the current session only |
| **Yes, and remember** | Trust this folder permanently (future sessions too) |
| **No, exit (Esc)** | End the session |

> **Security note**: Only remember a folder if you are certain it will always be safe for Copilot to execute code there.

**Adding trusted directories mid-session:**

```
/add-dir /path/to/directory
```

**Switching working directory without restarting:**

```
/cwd /path/to/directory
```

---

## Slash Commands

Slash commands control the CLI from within the interactive interface:

| Command | Purpose |
|---------|---------|
| `/plan [PROMPT]` | Create an implementation plan before coding |
| `/delegate [PROMPT]` | Delegate changes to Copilot cloud agent (opens a draft PR) |
| `/fleet [PROMPT]` | Run parts of a task in parallel via subagents |
| `/review [PROMPT]` | Run the code review agent to analyze changes |
| `/diff` | Review changes made in the current directory |
| `/model [MODEL]` | Select the AI model to use |
| `/agent` | Browse and select from available agents |
| `/mcp [show\|add\|edit\|delete]` | Manage MCP server configuration |
| `/context` | Show context window token usage |
| `/compact` | Manually compress conversation history to free context space |
| `/usage` | View session stats: AI credits used, duration, lines edited, token breakdown |
| `/session` | Show session info and workspace summary |
| `/share [file\|gist]` | Share session to a Markdown file or GitHub gist |
| `/resume` | Select and resume a previous interactive session |
| `/clear` | Clear conversation history |
| `/add-dir PATH` | Add a trusted directory for the current session |
| `/cwd PATH` | Change current working directory without restarting |
| `/every INTERVAL PROMPT` | Schedule a prompt to run repeatedly (e.g., `/every 1h run tests`) |
| `/after DELAY PROMPT` | Schedule a one-shot prompt to run after a delay |
| `/undo` / `/rewind` | Open the rewind picker to roll back to a previous snapshot |
| `/tasks` | View and manage background subagent tasks (used with `/fleet`) |
| `/chronicle [SUBCOMMAND]` | Session insights: standup, tips, cost tips, search, improve, reindex |
| `/rename NAME` | Rename the current session for easier retrieval |
| `/allow-all` / `/yolo` | Allow all tool permissions for the rest of this session |
| `/reset-allowed-tools` | Revoke all permissions granted during this session |
| `/sandbox [enable\|disable]` | Toggle local sandbox to restrict filesystem/network access |
| `/feedback` | Submit feedback, bug report, or feature request |
| `/login` | Authenticate with GitHub |
| `/exit` | Exit the CLI |

For a full list, type `?` in the prompt box or run `copilot help` in your terminal.

---

## Built-in Custom Agents

Copilot CLI ships with a default set of specialized agents you can invoke via `/agent` or by name in a prompt. The AI model may also delegate to these automatically.

| Agent | Purpose |
|-------|---------|
| **Explore** | Quick codebase analysis — ask questions without affecting your main context |
| **Task** | Executes commands (tests, builds) — brief summaries on success, full output on failure |
| **General purpose** | Complex multi-step tasks requiring the full toolset and high-quality reasoning |
| **Code review** | Reviews changes with a focus on genuine issues, minimizing noise |
| **Research** | Deep research across codebase, related repos, and the web — produces a cited report |
| **Rubber duck** | Constructive critic for complex tasks — consulted automatically by Copilot |

**Invoking an agent:**

```
/agent                                      # Browse and select from the list
Use the code review agent to check my PR   # Copilot infers the agent
copilot --agent=explore -p "How does auth work in this repo?"  # CLI flag
```

**Custom agents** can be defined at user (`~/.copilot/agents/`), repository (`.github/agents/`), or org (`.github-private/agents/`) level using Markdown profile files.

---

## Keyboard Shortcuts

| Shortcut | Purpose |
|----------|---------|
| **Shift+Tab** | Cycle between standard, plan, and autopilot mode |
| **Ctrl+C** | Cancel operation / clear input (press twice to exit) |
| **Ctrl+D** | Shutdown |
| **Ctrl+L** | Clear the screen |
| **Ctrl+O** | Expand recent items in response timeline |
| **Ctrl+T** | Expand/collapse reasoning in responses |
| **Esc** | Cancel current operation |

---

## OctoCAT Workflow Examples

### Project Setup

```powershell
copilot -p "install dependencies for this npm monorepo and build the API"
```

### Build & Test

```powershell
copilot -i "run tests only in the api workspace with coverage"
```

```powershell
copilot -p "build both api and frontend workspaces"
```

### Git Operations

```powershell
copilot -i "create a new branch called feature/add-cart and push it"
```

### Autonomous Mode

```powershell
copilot --autopilot -p "find and fix all TypeScript compiler errors in the api workspace"
```

### Plan Mode

Inside the interactive interface:

```
/plan add vitest tests for the order route covering all CRUD endpoints and error paths
```

### Code Review

```
/review check for missing Swagger docs in all route files
```

### Parallel Execution

```
/fleet run linting on frontend and API tests simultaneously
```

---

## Speeding Up Tasks with `/fleet`

Where a task involves multiple operations that can be worked on in parallel, `/fleet` assigns separate parts of the work to subagents — reducing wall-clock time for complex implementations.

### Typical Workflow

1. Press **Shift+Tab** to enter **plan mode**
2. Describe the feature or change you want to make
3. Collaborate with Copilot to refine the implementation plan
4. Choose one of the two options Copilot presents:

   | Option | Behavior |
   |--------|----------|
   | **Accept plan and build on autopilot + /fleet** | Copilot implements the plan fully autonomously using subagents |
   | **Exit plan mode and prompt myself** | Enter `/fleet implement the plan` manually — Copilot still uses subagents but may ask you questions as it works |

### Monitoring Parallel Tasks

Use `/tasks` to see all background subagent tasks in the current session:

| Key | Action |
|-----|--------|
| `↑` / `↓` | Navigate the task list |
| `Enter` | View details / completion summary for a subtask |
| `k` | Kill the subtask process |
| `r` | Remove completed or killed tasks from the list |
| `Esc` | Return to the main CLI prompt |

---

## Session Data & `/chronicle`

Copilot CLI stores session data locally and syncs it to your GitHub account. This enables session resumption and a set of insight commands via `/chronicle`.

### Resuming Sessions

```powershell
copilot --continue          # Resume the most recent session
copilot --resume            # Open a picker to choose a recent session
copilot --resume SESSION-ID # Jump directly to a specific session
```

Within an interactive session:

```
/resume                     # Open the session picker
/resume SESSION-ID          # Jump to a specific session
/session                    # Show the current session ID and workspace summary
/rename My Feature Work     # Rename the current session for easier retrieval
```

### Sharing a Session

```
/share gist                 # Save session as a private GitHub gist
/share file                 # Save as copilot-session-SESSIONID.md in cwd
/share file path/to/out.md  # Save to a specific file
```

### The `/chronicle` Slash Command

Type `/chronicle` to open a picker, or invoke subcommands directly:

| Subcommand | Purpose |
|------------|--------|
| `/chronicle standup` | Standup report from your sessions in the last 24 hours — branches worked, accomplishments, linked PRs/issues |
| `/chronicle tips` | 3–5 personalized tips based on your actual usage patterns and features you haven't tried |
| `/chronicle cost tips` | Token spend analysis — where credits go and how to reduce costs |
| `/chronicle search KEYWORD` | Full-text search across all session content |
| `/chronicle improve` | Suggests improvements to `.github/copilot-instructions.md` based on where Copilot struggled in your sessions |
| `/chronicle reindex` | Rebuild the local session store and sync to your account |

**Customizing chronicle output:**

```
/chronicle standup for the last 3 days
/chronicle tips for better prompting
```

**`/chronicle improve`** is scoped to the current repository — it finds friction signals (repeated failures, redirected prompts, mismatched tool choices) and proposes specific instructions. After reviewing the suggestions, press `Space` to toggle individual ones and `Enter` to apply them — Copilot will create or update `.github/copilot-instructions.md`.

### Asking Free-Form Questions About Your History

You can ask Copilot directly — it will automatically query your session store:

```
Have I worked on anything related to authentication in the last month?
What time of day am I most effective at getting good results from Copilot?
Based on my previous CLI sessions, how could I prompt you in a way that costs less?
```

---

## Browsing Issues, Pull Requests & Gists

The interactive TUI has four tabs at the top. Press **Tab** / **Shift+Tab** to switch between them.

| Tab | Content |
|-----|---------|
| **Session** | Regular chat experience |
| **Issues** | Open issues in the current GitHub repository that involve you |
| **Pull requests** | Open PRs in the current repository that involve you |
| **Gists** | Your gists (public and secret) — always available regardless of directory |

> The Issues and Pull requests tabs only appear when running inside a GitHub repository.

**Common keyboard controls in Issues / PRs / Gists:**

| Key | Action |
|-----|--------|
| `↑` / `↓` (or `j`/`k`) | Highlight next/previous item |
| `←` / `→` (or `h`/`l`) | Navigate between pages |
| `Enter` | Open detail view for highlighted item |
| `Esc` | Return from detail view to list |
| `o` | Open item in browser |
| `c` | Insert reference into the Session prompt box |
| `a` | Toggle between "involves me" and all open items |

**Pulling an item into chat:**

```
# Press 'c' on issue #1234 to insert it, then type:
#1234 suggest a fix for this bug

# Press 'c' on PR #5678:
#5678 check this out and run tests
```

The tabs are **read-only** — use `c` to let Copilot act on an item, or `o` to open it in the browser.

---

## Delegating Tasks to Copilot

Two options for autonomous execution:

| Mode | Where work happens | How to trigger |
|------|--------------------|----------------|
| **Autopilot** | Locally, in your CLI session | `Shift+Tab` to autopilot mode, or `--autopilot` flag |
| **Cloud Agent (`/delegate`)** | Remotely on GitHub (creates branch + draft PR) | `/delegate PROMPT` or prefix prompt with `&` |

### Autopilot (local)

```powershell
# Fully autonomous, max 10 steps, full permissions
copilot --autopilot --yolo --max-autopilot-continues 10 -p "YOUR PROMPT HERE"
```

### Cloud Agent (remote)

```
/delegate complete the API integration tests and fix any failing edge cases
```

or equivalently:

```
& complete the API integration tests and fix any failing edge cases
```

Copilot will commit any unstaged changes as a checkpoint, create a branch, open a **draft PR**, and work in the background. Use this when you want to hand off a task and continue working (or shut down your machine) while Copilot finishes.

---

## Scheduling Prompts

Run prompts automatically in the future — useful for recurring checks or deferred tasks.

```
# Run every hour — recurring
/every 1h Run frontend tests and report any failures

# Run once after 30 minutes — one-shot
/after 30m Create a summary of today's commits
```

---

## Rolling Back Changes

Copilot CLI takes a **snapshot** of your workspace at the start of each prompt. If the result isn't what you expected, you can rewind.

**Prerequisites**: Must be in a Git repository with at least one commit.

### Triggering a Rewind

| Method | How |
|--------|-----|
| **Double Esc** | Press `Esc` twice when input is empty and Copilot is idle |
| **Slash command** | `/undo` or `/rewind` |

Both open the **rewind picker** — a list of the 10 most recent snapshots (most recent first), showing the beginning of each prompt and when it was submitted.

> **Warning**: Rewinding is permanent and cannot be undone. All snapshots and session history *after* the selected point are removed. New files created after the snapshot are deleted regardless of Git status.

### Verifying After Rollback

Use `!` to run shell commands from within the CLI session:

```
! git status          # Check modified/staged/untracked files
! git log --oneline -1  # Confirm current commit
! git diff            # Review unstaged changes
```

---

## Command-Line Options

| Option | Purpose |
|--------|---------|
| `-p PROMPT` | Execute a prompt programmatically (exits after completion) |
| `-i PROMPT` | Start interactive session and auto-execute prompt |
| `--autopilot` | Enable autonomous mode (no confirmation prompts) |
| `--model MODEL` | Set the AI model |
| `--agent AGENT` | Use a custom agent |
| `--allow-tool TOOL` | Pre-approve specific tools |
| `--allow-all` | Enable all permissions (tools, paths, URLs) |
| `-s, --silent` | Output only agent response (useful for scripting) |
| `--resume SESSION-ID` | Resume a previous session |
| `--continue` | Resume the most recent session |
| `--share PATH` | Save session to Markdown after completion |

---

## Tool Permissions

Copilot CLI uses tools to complete tasks: shell commands, file reads/writes, web search, and sub-agents. **Read-only operations are allowed automatically**, but tools that modify your system require explicit approval before Copilot can use them.

If you haven't pre-granted permission, Copilot prompts you each time it needs to perform a potentially destructive action. You can allow it once, or for the entire session.

### Two Layers of Control

| Layer | Options | Purpose |
|-------|---------|--------|
| **Tool availability** | `--available-tools`, `--excluded-tools` | Restrict which tools the model can even *choose* from |
| **Tool permission** | `--allow-tool`, `--deny-tool` | Allow or deny execution of specific tools |

> **Deny rules always take precedence** over allow rules, even when `--allow-all` is set.

### Restricting Tool Availability

```powershell
# Only allow shell and file read — model won't attempt anything else
copilot --available-tools='shell, read_file'

# Allow everything EXCEPT web access
copilot --excluded-tools='web_fetch, web_search'
```

If a tool isn't in the available set, the model won't attempt to use it at all — preventing wasted interactions.

### Allowing or Denying Permission

```powershell
# Allow all git commands except git push
copilot --allow-tool='shell(git:*)' --deny-tool='shell(git push)'

# Allow a specific MCP server tool
copilot --allow-tool='MyMCP(create_issue)'

# Allow file writes only in src/ — deny everywhere else
copilot --allow-tool='write(src/**)' --deny-tool='write(**)'
```

Permission patterns: `shell(command)`, `write(path)`, `read(path)`, `url(domain)`, `memory`.

### Permissive Options

| Option | Effect | Risk |
|--------|--------|------|
| `--allow-all` | Grants all tool permissions upfront | Agent can run any command without prompting |
| `--autopilot` | Skips confirmation prompts | Combined with `--allow-all` = fully autonomous |

⚠️ **Enterprise guidance**: Never combine `--allow-all` + `--autopilot` on repositories containing proprietary code.

### Resetting Permissions

The `/reset-allowed-tools` slash command revokes all permissions you granted during the current interactive session — including those given in response to prompts and via `/allow-all` or `/yolo`. Permissions reset to the state defined by any `--allow-tool`/`--deny-tool` flags you passed at startup.

Permissions do **not** automatically persist across sessions — each new `copilot` invocation starts clean unless you pass permission flags at startup.

---

## Environment Variables

| Variable | Purpose |
|----------|---------|
| `COPILOT_MODEL` | Set the AI model |
| `COPILOT_ALLOW_ALL` | Set `true` to allow all permissions |
| `COPILOT_HOME` | Override config directory (default: `~/.copilot`) |
| `COPILOT_GITHUB_TOKEN` | Authentication token |

---

## Configuration

Settings cascade: **User** → **Repository** → **Local** (most specific wins).

| Scope | Location |
|-------|----------|
| User | `~/.copilot/config.json` |
| Repository | `.github/copilot/settings.json` (committed) |
| Local | `.github/copilot/settings.local.json` (gitignored) |

---

## Tips

1. **Be specific** — "run API tests with vitest" is better than "run tests"
2. **Use Plan mode** for complex multi-step changes
3. **Use Autopilot mode** for repetitive tasks you trust
4. **Review with `/diff`** after Copilot makes changes
5. **Use `/context`** to monitor token usage in long sessions
6. **Use `--resume`** to continue previous sessions
7. **Use `/fleet`** to parallelize independent tasks
8. **Use `/chronicle standup`** to generate a daily summary of your work
9. **Use `/chronicle improve`** to auto-update `.github/copilot-instructions.md` from session friction signals

---

## Safe & Secure Usage of Copilot CLI

> **This section addresses cybersecurity requirements** for enabling CLI usage in enterprise environments.

### The 5 Security Rules for Copilot CLI

#### 1. Lock Down Tool Permissions — Never Run Wide Open

Use `--deny-tool` and `--excluded-tools` to restrict what the agent can do. **Deny rules always win**, even over `--allow-all`.

```powershell
# Enterprise-safe pattern: allow reads + npm, deny writes and network
copilot --allow-tool='read(**)' --allow-tool='shell(npm:*)' --deny-tool='write(**)' --deny-tool='shell(curl:*)' --deny-tool='shell(git push:*)'

# Remove web tools entirely from the model's choices
copilot --excluded-tools='web_fetch, web_search'
```

⚠️ **Never** combine `--allow-all` + `--autopilot` on repos containing proprietary code.

#### 2. Protect IP — Minimum Context, Maximum Safety

| ❌ Never send to CLI | ✅ Safe alternative |
|---------------------|---------------------|
| `.env` files, secrets, tokens | Reference env var *names* only |
| Internal hostnames/URLs | Use `example.com` placeholders |
| Proprietary algorithms | Describe the pattern generically |
| Private keys or certificates | No safe alternative — never do this |
| Full production logs (may contain PII) | Sanitize before sharing |

**Minimum context principle**: Give the CLI only what it needs. Don't pipe entire files — use snippets or descriptions.

#### 3. Review Before Executing — Every Time

Copilot CLI in Standard mode asks permission before destructive actions. **Always read suggestions before confirming:**

```
CLI suggests a command
  → Check for: destructive flags (--force, -rf, DROP, DELETE)
  → Check for: internal URLs or hardcoded values in output
  → Verify file paths are correct
  → Only then: confirm execution
```

Use `/diff` after changes to review what was modified before committing.

#### 4. Don't Leak Architecture — Sanitize Everything

| Gotcha | Risk | Prevention |
|--------|------|------------|
| Pasting full stack traces | Internal paths & service names leak | Sanitize internal references first |
| Asking about internal APIs by name | Proprietary system names sent to model | Use generic descriptions instead |
| Sharing sessions (`/share gist`) | Session may contain proprietary code | Only share sanitized content |
| Running CLI in CI/CD pipelines | Prompts may be logged in build output | Avoid CLI in automated environments |

**Replace before asking**: Swap internal terms with placeholders before prompting.

#### 5. Use Standard Mode by Default — Autopilot is a Privilege

| Mode | When to use | When NOT to use |
|------|-------------|-----------------|
| **Standard** | Sensitive repos, unfamiliar tasks, production code | — |
| **Plan** | Complex multi-step changes that need review | — |
| **Autopilot** | Non-sensitive, reversible tasks you fully trust | Proprietary code, prod branches, shared infra |

Permissions reset each session — nothing persists across `copilot` invocations unless passed via flags.

### Quick Reference Card

| ✅ DO | ❌ DON'T |
|--------|----------|
| Use `--deny-tool` / `--excluded-tools` for sensitive work | Run `--allow-all --autopilot` on proprietary repos |
| Scope prompts to minimum needed context | Pipe `.env`, keys, or full proprietary files |
| Review every suggestion before confirming | Auto-execute without reading the command |
| Replace internal names with generic placeholders | Reference internal hostnames/URLs/service names |
| Use Standard mode for anything non-trivial | Default to Autopilot in production repos |

---

## Quick Reference

| Task | Command |
|------|---------|
| Launch interactive UI | `copilot` |
| Run a one-shot prompt | `copilot -p "..."` |
| Interactive with prompt | `copilot -i "..."` |
| Autonomous mode | `copilot --autopilot -p "..."` |
| Version check | `copilot version` |
| Update CLI | `copilot update` |
| Login | `copilot login` |
| Get help | `copilot help` |

---

## Next Steps

- [Hands-on Exercises](hands-on-exercises.md) — Practice CLI workflows
- [Lesson 5: Coding Agent](../05-coding-agent/readme.md) — Autonomous task execution
