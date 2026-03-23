# Lesson 4: GitHub Copilot Coding Agent

## Overview

| Aspect | Detail |
|--------|--------|
| **Duration** | 60 minutes (40 min instruction + 20 min hands-on) |
| **Level** | Advanced |
| **Prerequisites** | Lessons 1-2 completed, GitHub repo access, Actions enabled |
| **Outcome** | Assign issues to Copilot agent, review PRs, customize agent behavior |

---

## Why This Matters

The Coding Agent is fundamentally different from IDE-based Copilot. It runs **autonomously** — you assign an issue, and Copilot creates a branch, writes code, runs tests, and opens a PR. This enables developers to delegate well-defined tasks and focus on higher-value work.

---

## How It Works

```
1. Create Issue → 2. Assign to Copilot → 3. Agent works autonomously
                                              ├── Reads codebase
                                              ├── Plans changes
                                              ├── Writes code
                                              ├── Runs tests
                                              └── Opens PR
                                         4. Developer reviews PR
```

### What Makes It Different from IDE Copilot?

| Feature | IDE Agent Mode | Coding Agent |
|---------|---------------|--------------|
| Where it runs | VS Code (local) | GitHub cloud |
| Interaction | Conversational | Issue → PR |
| Scope | Current session | Repo-wide |
| Human oversight | Real-time approve/reject | PR review |
| Speed | Instant feedback | Background (minutes) |
| Best for | Interactive development | Well-defined tasks |

---

## Task Assignment Methods

### Method 1: Assign from Issues

1. Create or open a GitHub Issue
2. Assign it to `@copilot`
3. Wait for the PR to appear

### Method 2: From VS Code Chat

1. Open Copilot Chat → Agent mode
2. Plan and refine a feature
3. Use `/handoff-to-copilot-coding-agent` prompt (if configured)
4. Copilot creates an Issue and assigns itself

### Method 3: From GitHub MCP Server

1. In Copilot Chat with GitHub MCP enabled:
   ```
   Create an issue to add unit tests for the product route and assign it to Copilot
   ```

---

## Prerequisites for Coding Agent

1. **GitHub Copilot license** with coding agent enabled
2. **GitHub Actions** enabled on the repository
3. **Branch protection** on `main` (recommended):
   - Require PRs for changes
   - At least 1 reviewer required
4. **`copilot-setup-steps.yml`** workflow in `.github/workflows/`:

```yaml
# Already configured in this repo!
name: "Copilot Setup Steps"
on: workflow_dispatch
jobs:
  copilot-setup-steps:
    runs-on: ubuntu-latest
    permissions:
      contents: read
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "22"
          cache: "npm"
      - run: npm ci
```

This workflow tells the Coding Agent how to set up the environment.

---

## Customizing Agent Behavior

The Coding Agent reads the same customization files as IDE Copilot:

| File | Effect on Agent |
|------|-----------------|
| `copilot-instructions.md` | Agent follows these conventions |
| `*.instructions.md` | File-type rules applied to generated code |
| Prompt files | Can be referenced in issue descriptions |
| `copilot-setup-steps.yml` | Environment setup for the agent |

### Writing Good Issues for Copilot

```markdown
## Title: Add unit tests for the Product API route

## Description
Create comprehensive unit tests for `api/src/routes/product.ts` following 
the existing pattern in `api/src/routes/branch.test.ts`.

## Requirements
- Test all CRUD operations (GET all, GET by ID, POST, PUT, DELETE)
- Test error scenarios (404 for missing products, 400 for invalid body)
- Use Vitest with Supertest
- Run tests to verify they pass: `npm test --workspace=api`

## Acceptance Criteria
- [ ] `api/src/routes/product.test.ts` exists
- [ ] All tests pass
- [ ] Follows branch.test.ts pattern
```

**Tips for effective agent issues**:
- Be specific about file locations and patterns
- Reference existing code as examples
- Include acceptance criteria
- Mention test/validation commands

---

## Security & Governance

### What the Agent CAN Do
- Read repository files
- Create new files
- Modify existing files
- Create branches
- Run commands defined in setup workflow
- Open PRs

### What the Agent CANNOT Do
- Push to protected branches directly
- Approve its own PRs
- Access external systems (unless configured)
- Deploy code
- Modify GitHub settings

### Best Practices
- Always review agent PRs before merging
- Use branch protection rules
- Require CI checks to pass
- Add specific reviewers for agent PRs
- Monitor agent Actions runs for unexpected behavior

---

## Limitations

- Works best with well-defined, scoped tasks
- May struggle with highly ambiguous requirements
- Cannot access private package registries unless configured
- Large-scale refactoring may need breaking into smaller issues
- Agent cannot self-approve — human review is required

---

## Tracking Agent Work

1. **Issues** — Check the issue for agent comments and status
2. **Actions** — Watch the Actions tab for agent workflow runs
3. **PRs** — Review the generated PR with code diffs
4. **Commits** — Agent creates meaningful commit messages

---

## Summary

| Aspect | Detail |
|--------|--------|
| Trigger | Assign issue to `@copilot` |
| Output | PR with code changes |
| Environment | `copilot-setup-steps.yml` |
| Customization | Same `.github/` files as IDE |
| Oversight | Human PR review required |

---

## Next Steps

- [Hands-on Exercises](hands-on-exercises.md) — Assign your first agent task
- [Lesson 5: MCP Servers & Extensions](../05-mcp-and-extensions/readme.md) — Extend Copilot's capabilities
