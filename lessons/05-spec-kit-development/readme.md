# Lesson 5: Spec Kit Development

## Overview

| Aspect | Detail |
|--------|--------|
| **Duration** | 60 minutes (40 min instruction + 20 min hands-on) |
| **Level** | Intermediate–Advanced |
| **Prerequisites** | Lessons 1–2 completed, VS Code with Copilot extension |
| **Outcome** | Author, organize, and validate the full set of Copilot customization files for a team codebase |

---

## Why This Matters

A **spec kit** is the collection of Copilot customization files that travels with your codebase. When every developer on a team works from the same spec kit, Copilot produces consistent output that matches your architecture, conventions, and domain language — without anyone needing to re-explain the codebase in every chat session.

Without a spec kit, every developer reimagines the same instructions. With a well-maintained spec kit, the codebase teaches Copilot about itself.

---

## What Is a Spec Kit?

A spec kit is the complete set of `.github/` customization files:

| Artifact | File Pattern | Scope | Purpose |
|----------|-------------|-------|---------|
| Repo instructions | `copilot-instructions.md` | All files | Project-wide context and conventions |
| Scoped instructions | `.github/instructions/*.instructions.md` | File-type match | Rules for a specific language or role |
| Prompt files | `.github/prompts/*.prompt.md` | On demand | Reusable prompt templates for common tasks |
| Agent modes | `.github/agents/*.agent.md` | Named agent | Custom agent with persona, tools, workflow |
| Skills | `.github/skills/*/SKILL.md` | Named skill | Domain knowledge packages with helper scripts |

Together these five artifact types form a **hierarchy of context** that Copilot applies at the right time:

```
copilot-instructions.md  ← always active (project-wide)
        │
        ├── *.instructions.md  ← active when files match the applyTo pattern
        │
        ├── *.prompt.md        ← invoked explicitly by name in Copilot Chat
        │
        ├── *.agent.md         ← invoked by @AgentName in Copilot Chat
        │
        └── SKILL.md           ← invoked by skill name, bundles helper scripts
```

---

## Artifact Deep Dive

### 1. Repo Instructions (`copilot-instructions.md`)

The root instruction file is the foundation. It tells Copilot:
- What the project is and does
- Architecture overview (folder layout, data model)
- Key commands (build, test, lint)
- Critical conventions that apply everywhere

**Location**: `.github/copilot-instructions.md`

```markdown
# OctoCAT Supply Chain — Copilot Instructions

## Project Overview
TypeScript monorepo: Express API (api/) + React frontend (frontend/).

## Architecture
- API routes live in api/src/routes/
- Models are defined in api/src/models/
- In-memory seed data is in api/src/seedData.ts

## Key Commands
- Build: npm run build
- Test: npm run test
- Dev: npm run dev
```

**Best practices**:
- Keep it concise — Copilot reads it on every interaction
- Focus on *what to do*, not documentation for humans
- Update it as the project evolves

---

### 2. Scoped Instructions (`*.instructions.md`)

Scoped instructions activate automatically when a file matching the `applyTo` glob is open in the editor. Use them to encode rules for a specific file type, layer, or team.

**Location**: `.github/instructions/<name>.instructions.md`

**File structure**:
```markdown
---
applyTo: '**/*.test.ts'
---
# Testing Instructions

## Framework
Use Vitest + Supertest. Pattern: branch.test.ts.

## Coverage Requirements
- All CRUD operations (GET, GET by ID, POST, PUT, DELETE)
- Error paths (404, 400)
- Use beforeEach to reset state
```

**Naming convention**: Describe the scope in the filename, e.g., `testing.instructions.md`, `api-routes.instructions.md`, `react.instructions.md`.

**When to create a new scoped file** vs. adding to `copilot-instructions.md`:
- Create a new file when the rules only apply to a subset of files
- Use the root file for rules that span all files

---

### 3. Prompt Files (`*.prompt.md`)

Prompt files are reusable, parameterized chat templates. They replace copying and pasting the same prompt multiple times. Invoke them with `@workspace /prompt-name` in Copilot Chat.

**Location**: `.github/prompts/<name>.prompt.md`

**File structure**:
```markdown
# Generate API Route

Generate a complete Express.js route file for the `${entity}` entity.

Requirements:
- Full CRUD operations (GET /, GET /:id, POST /, PUT /:id, DELETE /:id)
- Swagger JSDoc on every endpoint
- Input validation on POST/PUT
- 404 handling for GET/PUT/DELETE by ID
- Export a reset${Entity}() function for test isolation
```

**Best use cases**:
- Code generation (new route, new component, new test file)
- Documentation tasks (add Swagger docs, add JSDoc comments)
- Review workflows (security review, API review, accessibility audit)
- Team-specific workflows (PR description, release notes, deployment checklist)

---

### 4. Agent Modes (`*.agent.md`)

Agent mode files define a **custom AI persona** with a specific role, knowledge domain, tool permissions, and output format. They let you create specialized assistants for your team.

**Location**: `.github/agents/<name>.agent.md`

**File structure**:
```markdown
# API Reviewer

## Role
You are an expert Express.js code reviewer...

## Scope
Review route files for: CRUD completeness, Swagger docs, error handling,
security, and test coverage.

## Workflow
1. Read the route file
2. Read the corresponding model
3. Read the test file (if exists)
4. Generate a structured review report

## Output Format
Markdown report with: Summary table, Findings table (Severity/Finding/Fix),
Recommendations.

## Safety
- Suggest improvements but ask before modifying
- Never delete routes or disable CORS
```

**Design principles**:
- Give the agent a clear, bounded role
- Define an explicit workflow (numbered steps)
- Specify a concrete output format
- Add safety constraints (what it should NOT do)

---

### 5. Skills (`SKILL.md`)

Skills are domain knowledge packages — a markdown spec file plus optional helper scripts. They give Copilot deep context about a specific domain concept, and the scripts provide executable analysis tools.

**Location**: `.github/skills/<skill-name>/SKILL.md`

**File structure**:
```markdown
# Codebase Health Skill

Assess overall codebase health including dependency analysis, complexity,
and security patterns.

## Scripts

| Script | Purpose | Usage |
|--------|---------|-------|
| check_dependencies.py | Analyze package.json for outdated deps | python check_dependencies.py <root> |
| find_security_patterns.py | Scan for security anti-patterns | python find_security_patterns.py <src> |

## Quick Usage
python .github/skills/codebase-health/check_dependencies.py .

## Safety
All scripts are read-only — they never modify files.
```

**When to create a skill vs. a prompt**:
- **Skill**: Bundles executable scripts alongside docs; invoked by skill name in Copilot Chat (e.g., `Use the codebase-health skill`)
- **Prompt**: Pure text template; parameterized with variables; no scripts

---

## Reading the OctoCAT Spec Kit

The OctoCAT Supply Chain project ships with a complete reference spec kit. Before writing new artifacts, always audit what already exists:

```
.github/
├── copilot-instructions.md         ← project-wide context
├── instructions/
│   ├── api-routes.instructions.md  ← Express route conventions
│   ├── project.instructions.md     ← overall project rules
│   ├── react.instructions.md       ← frontend component patterns
│   ├── testing.instructions.md     ← Vitest/Supertest patterns
│   └── typescript.instructions.md  ← TypeScript strict conventions
├── prompts/
│   ├── generate-api-route.prompt.md
│   ├── Unit-Test-Coverage.prompt.md
│   ├── add-swagger-docs.prompt.md
│   ├── security-review.prompt.md
│   └── ... (10 prompts total)
├── agents/
│   ├── API-Reviewer.agent.md
│   ├── Frontend-Designer.agent.md
│   ├── Test-Coverage.agent.md
│   └── ImplementationIdeas.agent.md
└── skills/
    ├── api-analysis/SKILL.md
    ├── codebase-health/SKILL.md
    └── frontend-design/SKILL.md
```

---

## Spec Kit Quality Checklist

Use this checklist when evaluating or authoring spec kit artifacts:

### `copilot-instructions.md`
- [ ] Project overview is < 5 sentences
- [ ] Folder structure is described
- [ ] Key commands are listed (build, test, dev)
- [ ] Domain vocabulary is defined (e.g., what is an "OrderDetail"?)
- [ ] Critical conventions are stated (not just documented)

### Scoped instructions (`*.instructions.md`)
- [ ] `applyTo` glob matches the intended file type exactly
- [ ] Instructions are actionable (e.g., "Use X" not "Consider X")
- [ ] No duplication with the root `copilot-instructions.md`
- [ ] Includes a code review checklist for easy verification

### Prompt files (`*.prompt.md`)
- [ ] Filename describes the task clearly
- [ ] Variables use `${variableName}` syntax for substitution
- [ ] Desired output format is specified
- [ ] Constraints are stated (what NOT to do)

### Agent modes (`*.agent.md`)
- [ ] Role is clearly defined (one sentence)
- [ ] Workflow is numbered and explicit
- [ ] Output format is specified
- [ ] Safety constraints are listed

### Skills (`SKILL.md`)
- [ ] Purpose is stated in the first paragraph
- [ ] Scripts table includes: name, purpose, usage
- [ ] Quick usage examples are copy-pasteable
- [ ] Safety notes included (read-only? modifies files?)

---

## Common Patterns

### Progressive Refinement

Start with the root instructions and add scoped files as the project grows:

```
Week 1: copilot-instructions.md (project basics)
Week 2: api-routes.instructions.md (after building first routes)
Week 3: testing.instructions.md (after establishing test patterns)
Month 2: agents/API-Reviewer.agent.md (after review pain points emerge)
```

### Linking Artifacts

Artifacts can reference each other to form a connected spec kit:

```markdown
# In an agent file:
Reference: For security standards, see `.github/prompts/security-review.prompt.md`

# In a skill file:
Related Instructions: `typescript.instructions.md`
Related Prompts: `security-review.prompt.md`
```

### Team Conventions

When multiple teams work in the same repo, use scoped instructions to encode team-specific rules without affecting the whole project:

```
.github/instructions/
├── api-routes.instructions.md     ← backend team
├── react.instructions.md          ← frontend team
└── infra.instructions.md          ← platform team (applyTo: '**/infra/**')
```

---

## Summary

| Artifact | When to Use | Activation |
|----------|------------|------------|
| `copilot-instructions.md` | Project-wide rules, always needed | Automatic |
| `*.instructions.md` | File-type or team-specific rules | Automatic (glob match) |
| `*.prompt.md` | Repeatable tasks, code generation | Explicit (`/prompt-name`) |
| `*.agent.md` | Custom AI persona with workflow | Explicit (`@AgentName`) |
| `SKILL.md` | Domain knowledge + executable tools | Explicit (skill name) |

A well-maintained spec kit is a **living document** — it grows alongside the codebase and encodes the team's evolving conventions. Treat it as code: review it, version it, and keep it in sync with the project.

---

## Next Steps

- [Hands-on Exercises](hands-on-exercises.md) — Author your first spec kit artifacts
- [Lesson 6: MCP Servers & Extensions](../05-mcp-and-extensions/readme.md) — Extend Copilot with external tools
