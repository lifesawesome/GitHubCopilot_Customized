# Lesson 3: Hands-On Exercises

## Exercise Overview

| # | Exercise | Command | Duration |
|---|----------|---------|----------|
| 1 | Get Oriented | suggest | 5 min |
| 2 | Build & Test Workflows | suggest | 5 min |
| 3 | Explain Complex Commands | explain | 5 min |
| 4 | Git Automation | suggest | 5 min |
| 5 | Debugging with CLI | explain | 5 min |

---

## Setup

1. Open a terminal (PowerShell or bash)
2. Navigate to the `GitHubCopilot_Customized` directory
3. Verify Copilot CLI is installed:
   ```powershell
   gh copilot --version
   ```

---

## Exercise 1: Get Oriented

**Goal**: Use Copilot CLI to explore the project structure.

Try these commands:

```powershell
gh copilot suggest "count how many TypeScript files are in the api/src directory"
```

```powershell
gh copilot suggest "list all Express route files in this project"
```

```powershell
gh copilot suggest "show the npm workspaces in package.json"
```

<details>
<summary>✅ Success Criteria</summary>

- Copilot suggests valid shell commands
- Commands produce correct output when run
- You discover the project has ~8 route files, 8 model files

</details>

---

## Exercise 2: Build & Test Workflows

**Goal**: Use Copilot to find the right build and test commands.

```powershell
gh copilot suggest "install dependencies for this npm monorepo"
```

```powershell
gh copilot suggest "run only the API tests using vitest"
```

```powershell
gh copilot suggest "run tests with coverage for the api workspace"
```

```powershell
gh copilot suggest "start both api and frontend dev servers concurrently"
```

<details>
<summary>✅ Success Criteria</summary>

- Copilot correctly uses `--workspace=api` flag
- Test commands reference vitest configuration
- Build commands work for the monorepo structure

</details>

---

## Exercise 3: Explain Complex Commands

**Goal**: Use `explain` to understand project commands.

1. Look at the scripts in `package.json` and pick one:

```powershell
gh copilot explain "npm run build --workspace=api && npm run build --workspace=frontend"
```

2. Explain a Docker command:

```powershell
gh copilot explain "docker build -t octocat-api:latest -f api/Dockerfile ."
```

3. Explain a Git command:

```powershell
gh copilot explain "git log --oneline --graph --all --decorate"
```

<details>
<summary>✅ Success Criteria</summary>

- Copilot breaks down each part of the command
- Explanations are clear and accurate
- You learn something new about the commands

</details>

---

## Exercise 4: Git Automation

**Goal**: Use Copilot CLI for common git workflows.

```powershell
gh copilot suggest "show which files I've changed but not committed"
```

```powershell
gh copilot suggest "create a feature branch called add-order-tests and switch to it"
```

```powershell
gh copilot suggest "see the commit history for just the api/src/routes directory"
```

```powershell
gh copilot suggest "create a PR with the title 'Add order route tests'"
```

<details>
<summary>✅ Success Criteria</summary>

- Git commands are correct for your shell (PowerShell/bash)
- PR creation uses `gh pr create` (GitHub CLI integration)
- Branch commands work correctly

</details>

---

## Exercise 5: Debugging with CLI

**Goal**: Use Copilot to debug common development issues.

1. Simulate a problem — try running an incorrect command:

```powershell
# This will fail — then ask Copilot about it
npm run test --workspace=nonexistent 2>&1 | Out-String | ForEach-Object { gh copilot explain $_ }
```

2. Ask about common errors:

```powershell
gh copilot explain "error TS2345: Argument of type 'string' is not assignable to parameter of type 'number'"
```

3. Find processes:

```powershell
gh copilot suggest "find what is running on port 3000 and how to stop it"
```

<details>
<summary>✅ Success Criteria</summary>

- Copilot explains errors in plain language
- Provides actionable fixes
- Port investigation command works for your OS

</details>

---

## Bonus Challenge

Create a multi-step automation:

```powershell
gh copilot suggest "write a PowerShell script that: 1) installs dependencies, 2) builds the API, 3) runs tests, 4) reports pass/fail status"
```

---

## Summary

In this lesson you practiced:
- ✅ `gh copilot suggest` for command generation
- ✅ `gh copilot explain` for command understanding
- ✅ Build and test workflows for the monorepo
- ✅ Git automation with GitHub CLI integration
- ✅ Debugging common development errors

**Next**: [Lesson 4 — Coding Agent](../04-coding-agent/readme.md)
