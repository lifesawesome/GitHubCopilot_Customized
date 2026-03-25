# Lesson 3: Copilot CLI

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

Copilot CLI has a granular permission system. Control which tools the agent can use:

```powershell
# Allow all git commands except git push
copilot --allow-tool='shell(git:*)' --deny-tool='shell(git push)'

# Allow a specific MCP server tool
copilot --allow-tool='MyMCP(create_issue)'
```

Permission patterns: `shell(command)`, `write(path)`, `read(path)`, `url(domain)`, `memory`.

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
- [Lesson 4: Coding Agent](../04-coding-agent/readme.md) — Autonomous task execution
