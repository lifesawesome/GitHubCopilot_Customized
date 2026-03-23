# Lesson 3: Copilot CLI

## Overview

| Aspect | Detail |
|--------|--------|
| **Duration** | 60 minutes (40 min instruction + 20 min hands-on) |
| **Level** | Intermediate |
| **Prerequisites** | GitHub CLI installed (`gh --version`), Copilot license |
| **Outcome** | Use `gh copilot` for terminal-based AI assistance |

---

## Why This Matters

Not everything happens in VS Code. When you're in the terminal — deploying, debugging, scripting, or managing git — Copilot CLI brings AI assistance directly to your command line without switching context.

---

## Installation

### 1. Install GitHub CLI

```powershell
# Windows (winget)
winget install GitHub.cli

# macOS (Homebrew)
brew install gh

# Linux
sudo apt install gh
```

### 2. Authenticate

```powershell
gh auth login
```

### 3. Install the Copilot Extension

```powershell
gh extension install github/gh-copilot
```

### 4. Verify

```powershell
gh copilot --version
```

---

## Two Main Commands

### `gh copilot suggest` — Get Command Suggestions

Ask for a shell command in natural language:

```powershell
gh copilot suggest "list all TypeScript files in the api directory"
```

Copilot returns the command and asks if you want to run it:
```
Command: Get-ChildItem -Path api -Recurse -Filter *.ts | Select-Object FullName

? Run this command? (Y/n)
```

### `gh copilot explain` — Understand Commands

Ask Copilot to explain a command:

```powershell
gh copilot explain "npm run build --workspace=api"
```

Copilot provides a plain-language explanation of what the command does.

---

## Interactive Mode

Start an interactive session for multiple questions:

```powershell
gh copilot suggest
```

Then type queries conversationally:
```
> how do I run only the API tests?
> how do I check test coverage?
> how do I build the frontend for production?
```

---

## OctoCAT Workflow Examples

### Project Setup

```powershell
gh copilot suggest "clone the repo and install dependencies for a Node.js monorepo"
```

### Build & Test

```powershell
gh copilot suggest "run tests only in the api workspace with coverage"
```

```powershell
gh copilot suggest "build both api and frontend workspaces in parallel"
```

### Git Operations

```powershell
gh copilot suggest "create a new branch called feature/add-cart and push it"
```

```powershell
gh copilot suggest "show the diff of only TypeScript files in the last commit"
```

### Docker

```powershell
gh copilot suggest "build a docker image for the api project and tag it as octocat-api:latest"
```

### Debugging

```powershell
gh copilot explain "npm ERR! ERESOLVE unable to resolve dependency tree"
```

```powershell
gh copilot suggest "find which process is using port 3000 and kill it"
```

---

## File References

You can reference files in your prompts with `@`:

```powershell
gh copilot suggest "create a docker-compose file based on @api/Dockerfile"
```

---

## Shell Integration

Use `!` to pipe shell output into Copilot:

```powershell
# Run a command and ask Copilot about the output
npm test --workspace=api 2>&1 | gh copilot explain "why did this test fail?"
```

---

## Tips

1. **Be specific** — "run API tests" is better than "run tests"
2. **Mention your OS** — helps get the right shell syntax
3. **Use suggest for doing, explain for learning**
4. **Review before running** — always verify suggested commands
5. **Start interactive session** for related multi-step tasks

---

## Quick Reference

| Task | Command |
|------|---------|
| Get a command suggestion | `gh copilot suggest "..."` |
| Explain a command | `gh copilot explain "..."` |
| Interactive mode | `gh copilot suggest` (no args) |
| Version check | `gh copilot --version` |
| Update extension | `gh extension upgrade gh-copilot` |

---

## Next Steps

- [Hands-on Exercises](hands-on-exercises.md) — Practice CLI workflows
- [Lesson 4: Coding Agent](../04-coding-agent/readme.md) — Autonomous task execution
