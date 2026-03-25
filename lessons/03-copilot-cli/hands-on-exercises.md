# Lesson 3: Hands-On Exercises

## Exercise Overview

| # | Exercise | Feature | Duration |
|---|----------|---------|----------|
| 1 | Get Oriented | Interactive prompts, `@` file refs | 5 min |
| 2 | Build & Test Workflows | `-p` prompt mode | 5 min |
| 3 | Plan Mode | `/plan` slash command | 5 min |
| 4 | Git & PR Automation | `/delegate`, `/diff` | 5 min |
| 5 | Autopilot & Parallel | `--autopilot`, `/fleet` | 5 min |
| 6 | Review & Sessions | `/review`, `/share` | 5 min |

---

## Setup

1. Open a terminal (PowerShell or bash)
2. Navigate to the `GitHubCopilot_Customized` directory
3. Verify Copilot CLI is installed:
   ```powershell
   copilot version
   ```
4. Login if needed:
   ```powershell
   copilot login
   ```

---

## Exercise 1: Get Oriented

**Goal**: Launch the interactive interface and explore the project.

1. Start the interactive UI:

```powershell
copilot
```

2. Try these prompts in the interactive interface:

```
count how many TypeScript files are in the api/src directory
```

```
list all Express route files in this project
```

3. Reference a file directly with `@`:

```
@ package.json what workspaces are defined in this monorepo?
```

4. Run a shell command without leaving Copilot:

```
! tree api/src /F
```

5. Check your token usage:

```
/context
```

6. Exit when done:

```
/exit
```

<details>
<summary>✅ Success Criteria</summary>

- Interactive UI launches and accepts prompts
- Copilot reads files and executes commands to answer questions
- `@` file reference provides context from the actual file
- `/context` shows token usage breakdown

</details>

---

## Exercise 2: Build & Test Workflows

**Goal**: Use prompt mode (`-p`) for one-shot build and test commands.

```powershell
copilot -p "install dependencies for this npm monorepo"
```

```powershell
copilot -p "run only the API tests using vitest"
```

```powershell
copilot -p "run tests with coverage for the api workspace"
```

```powershell
copilot -p "explain what the build script in api/package.json does"
```

Try interactive mode with an initial prompt:

```powershell
copilot -i "start both api and frontend dev servers concurrently"
```

<details>
<summary>✅ Success Criteria</summary>

- `-p` mode executes and exits automatically
- `-i` mode starts interactive session after executing the prompt
- Copilot correctly uses `--workspace=api` flag
- Build commands work for the monorepo structure

</details>

---

## Exercise 3: Plan Mode

**Goal**: Use `/plan` to create implementation plans before making changes.

1. Launch the interactive interface:

```powershell
copilot
```

2. Switch to plan mode:

Press **Shift+Tab** until you see "plan" mode, or use:

```
/plan add a new GET endpoint to the supplier route that returns suppliers filtered by name
```

3. Review the plan Copilot creates — it should outline:
   - Files to modify
   - Code changes needed
   - Test updates

4. Try another plan:

```
/plan add Swagger documentation to the delivery route file
```

5. If you approve the plan, let Copilot execute it. Otherwise, clear and try something else:

```
/clear
```

<details>
<summary>✅ Success Criteria</summary>

- Copilot creates a structured plan before coding
- Plan identifies the correct files to modify
- You can review before Copilot acts
- `/clear` resets the conversation

</details>

---

## Exercise 4: Git & PR Automation

**Goal**: Use Copilot CLI for git workflows and code review.

1. Launch interactive mode:

```powershell
copilot
```

2. Check current changes:

```
/diff
```

3. Ask git questions:

```
show which files I've changed but not committed
```

```
see the commit history for just the api/src/routes directory
```

4. Try the `/delegate` command (creates a PR from instructions):

```
/delegate create a feature branch and add JSDoc comments to api/src/routes/delivery.ts
```

5. Review changes before they're pushed:

```
/review check the last set of changes for any issues
```

<details>
<summary>✅ Success Criteria</summary>

- `/diff` displays a rich diff of changes
- Git questions produce correct commands for your shell
- `/delegate` creates a PR (if you confirm)
- `/review` provides meaningful code review feedback

</details>

---

## Exercise 5: Autopilot & Parallel Execution

**Goal**: Let Copilot work autonomously and run tasks in parallel.

1. Run a task in autopilot mode (no confirmation prompts):

```powershell
copilot --autopilot -p "list all route files that are missing Swagger documentation"
```

2. Use `--silent` for scripting-friendly output:

```powershell
copilot -s -p "count the total number of API endpoints across all route files"
```

3. Launch interactive and use `/fleet` for parallel execution:

```powershell
copilot
```

```
/fleet check all route files for missing error handling on DELETE endpoints
```

4. Control tool permissions:

```powershell
copilot --allow-tool='shell(npm:*)' --deny-tool='shell(rm:*)' -i "run the API test suite"
```

<details>
<summary>✅ Success Criteria</summary>

- `--autopilot` runs without asking for confirmation
- `--silent` outputs only the agent response (no UI chrome)
- `/fleet` spawns parallel subagents for independent tasks
- Tool permission flags restrict what the agent can do

</details>

---

## Exercise 6: Review, Sessions & Sharing

**Goal**: Use code review, session management, and sharing features.

1. Launch interactive mode:

```powershell
copilot
```

2. Run the code review agent:

```
/review analyze the api/src/routes directory for security issues and missing validation
```

3. Check session info:

```
/session
```

4. Browse available models:

```
/models
```

5. Compact the conversation if it gets long:

```
/compact
```

6. Share your session for documentation:

```
/share file ./my-session.md
```

7. Resume a previous session:

```powershell
copilot --continue
```

<details>
<summary>✅ Success Criteria</summary>

- `/review` provides actionable code review feedback
- `/session` shows session summary and file access
- `/share` exports the session to a readable Markdown file
- `--continue` resumes the most recent session

</details>

---

## Bonus Challenge

### Autonomous Multi-Step Task

Use autopilot to complete a real task end-to-end:

```powershell
copilot --autopilot -p "Create a vitest test file for the product route at api/src/routes/product.test.ts. Follow the same pattern as branch.test.ts. Test all CRUD operations and error paths. Run the tests and fix any failures."
```

### Custom Agent with MCP

Explore MCP server management:

```powershell
copilot
```

```
/mcp show
```

### Hook into the Workflow

Initialize Copilot customizations for the repo:

```powershell
copilot init
```

---

## Summary

In this lesson you practiced:
- ✅ Interactive TUI with `copilot` command
- ✅ One-shot prompts with `-p` and interactive with `-i`
- ✅ `/plan` for structured implementation planning
- ✅ `/diff`, `/review`, `/delegate` for git and code review workflows
- ✅ `--autopilot` for autonomous execution
- ✅ `/fleet` for parallel task execution
- ✅ Session management with `/session`, `/share`, `--continue`
- ✅ Tool permissions with `--allow-tool` / `--deny-tool`
- ✅ Debugging common development errors

**Next**: [Lesson 4 — Coding Agent](../04-coding-agent/readme.md)
