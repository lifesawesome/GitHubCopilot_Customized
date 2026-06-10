# Lesson 4: Hands-On Exercises

## Exercise Overview

| # | Exercise | Feature | Duration |
|---|----------|---------|----------|
| 1 | Get Oriented | Interactive prompts, `@` file refs | 5 min |
| 2 | Build & Test Workflows | `-p` prompt mode | 5 min |
| 3 | Plan Mode | `/plan` slash command | 5 min |
| 4 | Git & PR Automation | `/delegate`, `/diff` | 5 min |
| 5 | Autopilot & Parallel | `--autopilot`, `/fleet` | 5 min |
| 6 | Review & Sessions | `/review`, `/share` | 5 min |
| 7 | **Safe & Secure CLI Usage** | IP protection, safe input patterns | 10 min |

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
count TypeScript files in api/src
```

```
list Express route files
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
copilot -p "install deps for this npm monorepo"
```

```powershell
copilot -p "run API tests with vitest"
```

```powershell
copilot -p "run API tests with coverage"
```

```powershell
copilot -p "explain api/package.json build script"
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
/plan add GET /suppliers?name= endpoint with Swagger
```

3. Review the plan Copilot creates — it should outline:
   - Files to modify
   - Code changes needed
   - Test updates

4. Try another plan:

```
/plan add Swagger docs to delivery route
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
copilot --autopilot -p "list route files missing Swagger docs"
```

2. Use `--silent` for scripting-friendly output:

```powershell
copilot -s -p "count total API endpoints across all route files"
```

3. Launch interactive and use `/fleet` for parallel execution:

```powershell
copilot
```

```
/fleet check route files for missing DELETE error handling
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
/review scan api/src/routes for security issues and missing validation
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

## Exercise 7: Safe & Secure CLI Usage

**Goal**: Practice identifying safe vs unsafe CLI inputs and applying IP protection patterns.

### Part A: Identify Safe vs Unsafe Inputs

Review the following commands. For each, decide: **Safe ✅** or **Unsafe ❌**? Discuss with your group why.

```powershell
# 1
copilot -p "How do I add CORS middleware in Express?"

# 2
copilot -p "$(cat .env)"

# 3
copilot -p "Explain why ECONNREFUSED happens on port 3000"

# 4
copilot -p "Why is internal-api.corp.contoso.com returning 503?"

# 5
copilot --autopilot --allow-all -p "fix all bugs in the production branch"

# 6
copilot -p "Write a Vitest test for a GET endpoint that returns 404 on missing ID"

# 7
copilot -p "$(cat ~/.ssh/id_rsa) explain this key format"
```

<details>
<summary>✅ Answers</summary>

| # | Verdict | Reason |
|---|---------|--------|
| 1 | ✅ Safe | Generic programming question, no proprietary info |
| 2 | ❌ Unsafe | Pipes all environment secrets into the model |
| 3 | ✅ Safe | Generic error question with no internal details |
| 4 | ❌ Unsafe | Exposes internal hostname — use `example.com` instead |
| 5 | ❌ Unsafe | Autopilot + allow-all on production = unreviewed destructive risk |
| 6 | ✅ Safe | Generic test pattern, no proprietary code |
| 7 | ❌ Unsafe | Sends private key to model — never do this |

</details>

### Part B: Apply Minimum Context Principle

You want to ask Copilot CLI to help debug an internal service error. Practice rewriting unsafe prompts into safe ones.

**Unsafe version:**
```
copilot -p "Our order-fulfillment-service at svc-orders.internal.corp.com:8443 
is failing with auth token eyJhbGciOi... when calling the inventory microservice. 
The internal Redis cluster at redis-prod-3.vpc.corp.com is timing out."
```

**Your task:** Rewrite this as a safe prompt that still gets useful help. Strip:
- Internal hostnames and URLs
- Auth tokens and credentials
- Internal service names that reveal architecture

<details>
<summary>✅ Example Safe Rewrite</summary>

```
copilot -p "An HTTP service is failing when calling another internal microservice. 
The auth token format is JWT. A Redis cache dependency is timing out. 
What are common causes and debugging steps?"
```

Key changes:
- Replaced specific hostnames with generic descriptions
- Removed the actual token value
- Described the pattern without naming internal systems

</details>

### Part C: Use Tool Restrictions

Practice locking down CLI permissions for a sensitive task:

```powershell
# Allow only read operations and npm commands — deny writes and network
copilot --allow-tool='read(api/src/**)' --allow-tool='shell(npm:*)' --deny-tool='write(**)' --deny-tool='shell(curl:*)' -i "analyze the API route structure"
```

Try creating your own restricted command for:
1. Running tests only (no file writes, no git push)
2. Reading documentation files only (no code access)

<details>
<summary>✅ Example Solutions</summary>

```powershell
# Tests only — allow npm test, deny file writes and git push
copilot --allow-tool='shell(npm test:*)' --deny-tool='write(**)' --deny-tool='shell(git push:*)' -i "run all tests"

# Docs only — read docs folder, deny everything else
copilot --allow-tool='read(docs/**)' --deny-tool='write(**)' --deny-tool='shell(*)' -i "summarize the architecture docs"
```

</details>

### Part D: Review Before Execute

1. Run this in standard mode (not autopilot):

```powershell
copilot -i "clean up old branches and remove unused files in the api workspace"
```

2. When Copilot suggests commands, **DO NOT immediately confirm**. Instead:
   - Read each suggested command carefully
   - Check for destructive flags (`-rf`, `--force`, `--hard`)
   - Verify the file paths are correct
   - Only confirm if the command is safe

3. Practice rejecting a suggestion by pressing **Ctrl+C** or typing "no, don't do that"

<details>
<summary>✅ Success Criteria</summary>

- You correctly identified all unsafe inputs in Part A
- You rewrote an unsafe prompt into a safe one (Part B)
- You used `--deny-tool` to restrict CLI access (Part C)
- You reviewed and rejected at least one suggestion before execution (Part D)

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

**Next**: [Lesson 5 — Coding Agent](../05-coding-agent/readme.md)
