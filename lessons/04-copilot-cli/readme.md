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

---

## Slash Commands

Slash commands control the CLI from within the interactive interface:

| Command | Purpose |
|---------|---------|
| `/plan [PROMPT]` | Create an implementation plan before coding |
| `/delegate [PROMPT]` | Delegate changes to a remote repo via AI-generated PR |
| `/fleet [PROMPT]` | Run parts of a task in parallel via subagents |
| `/review [PROMPT]` | Run the code review agent to analyze changes |
| `/diff` | Review changes made in the current directory |
| `/model [MODEL]` | Select the AI model to use |
| `/agent` | Browse and select from available agents |
| `/mcp [show\|add\|edit\|delete]` | Manage MCP server configuration |
| `/context` | Show context window token usage |
| `/compact` | Summarize conversation to reduce token usage |
| `/session` | Show session info and workspace summary |
| `/share [file\|gist]` | Share session to a Markdown file or GitHub gist |
| `/clear` | Clear conversation history |
| `/exit` | Exit the CLI |

For a full list, type `/help` in the interactive interface.

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

Permissions granted during a session do not persist across sessions. Each new `copilot` invocation starts with a clean permission state (unless you pass `--allow-tool`/`--deny-tool` flags).

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
