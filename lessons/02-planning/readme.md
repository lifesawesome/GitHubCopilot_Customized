# Lesson 2: Customization & Planning

## Overview

| Aspect | Detail |
|--------|--------|
| **Duration** | 90 minutes (60 min instruction + 30 min hands-on) |
| **Level** | Intermediate |
| **Prerequisites** | Lesson 1 completed, familiar with Copilot modes |
| **Outcome** | Create custom instructions, prompts, agents, and skills |

---

## Why This Matters

Out-of-the-box Copilot doesn't know your team's conventions, internal frameworks, or domain-specific patterns. Customization files act as "steering documents" that guide Copilot to produce code matching your standards — every time, for every team member.

---

## The Customization Hierarchy

```
.github/
├── copilot-instructions.md          # 1. Global repo instructions
├── instructions/                     # 2. File-type specific rules
│   ├── typescript.instructions.md    #    → Applied to **/*.ts
│   ├── react.instructions.md         #    → Applied to **/*.tsx
│   ├── api-routes.instructions.md    #    → Applied to api/**/*.ts
│   ├── testing.instructions.md       #    → Applied to **/*.test.ts
│   └── project.instructions.md       #    → Applied to **/*.json
├── prompts/                          # 3. Reusable task prompts
│   ├── explain-code.prompt.md
│   ├── add-swagger-docs.prompt.md
│   ├── review-api-route.prompt.md
│   └── ...
├── agents/                           # 4. Custom agent personas
│   ├── API-Reviewer.agent.md
│   ├── Frontend-Designer.agent.md
│   └── Test-Coverage.agent.md
└── skills/                           # 5. Agent skills with scripts
    ├── api-analysis/
    │   ├── SKILL.md
    │   └── *.py
    └── codebase-health/
        ├── SKILL.md
        └── *.py
```

---

## 1. Custom Instructions (`copilot-instructions.md`)

The main instructions file applies to **every** Copilot interaction in this repo.

**Location**: `.github/copilot-instructions.md`

**What to include**:
- Project overview and architecture
- Technology stack description
- Coding conventions and naming rules
- Links to architecture docs
- Code review checklist

**Example** — Our repo's file tells Copilot about:
- TypeScript monorepo with Express API + React frontend
- Naming conventions (camelCase files, PascalCase interfaces)
- Swagger documentation requirements
- TAO observability framework (internal, not public)
- Tailwind CSS for styling (no inline styles)

### Demo: Custom Instructions in Action

1. Open `.github/copilot-instructions.md` — show its content
2. Open Copilot Agent mode and prompt:
   ```
   Add observability to the supplier route using our internal standards
   ```
3. Show how Copilot uses TAO patterns from the instructions
4. **Key insight**: TAO doesn't exist in the model's training data — Copilot learned it from our instructions!

---

## 2. File-Specific Instructions

Instructions scoped to specific file patterns via `applyTo` frontmatter.

**Format**:
```markdown
---
applyTo: '**/*.ts'
---

# TypeScript Instructions
[rules that apply only when editing .ts files]
```

**Our instructions**:

| File | Applies To | Key Rules |
|------|-----------|-----------|
| `typescript.instructions.md` | `**/*.ts` | Strict mode, naming, error handling |
| `react.instructions.md` | `**/*.tsx` | Functional components, Tailwind, props interfaces |
| `api-routes.instructions.md` | `api/src/routes/**/*.ts` | Swagger docs, CRUD pattern, HTTP status codes |
| `testing.instructions.md` | `**/*.test.ts` | Vitest/Supertest, coverage requirements |
| `project.instructions.md` | `**/*.json` | Monorepo workspace scripts, dependencies |

### Demo: File-Specific Rules

1. Open `api/src/routes/product.ts` — Copilot loads API route instructions
2. Use Edit mode to add a new endpoint — show how Swagger is auto-included
3. Open `frontend/src/components/About.tsx` — Copilot loads React instructions
4. Ask to modify the component — show Tailwind classes and dark mode support

---

## 3. Prompt Files (`.prompt.md`)

Reusable task templates that encode team workflows.

**Format**:
```markdown
---
name: 'prompt-name'
description: 'What this prompt does'
mode: 'ask|edit|agent'
---

# Task Title
[Detailed instructions for Copilot to follow]
```

**Our prompts**:

| Prompt | Mode | Purpose |
|--------|------|---------|
| `explain-code` | ask | Structured code explanation |
| `summarize-code` | ask | 3-6 bullet summary |
| `add-comments` | ask | Add JSDoc/inline comments |
| `review-api-route` | ask | Comprehensive route review |
| `security-review` | ask | Security vulnerability scan |
| `add-swagger-docs` | agent | Generate Swagger annotations |
| `refactor-component` | agent | Refactor React components |
| `add-tao-observability` | agent | Add TAO instrumentation |
| `generate-api-route` | agent | Scaffold complete new route |
| `Unit-Test-Coverage` | agent | Generate missing test files |
| `plan` | ask | Architecture change planning |
| `model` | ask | AI model selection guidance |

### Demo: Running a Prompt

1. Show the prompts directory in VS Code
2. Open `review-api-route.prompt.md` — explain the YAML frontmatter
3. Open `api/src/routes/product.ts` as context
4. Run the prompt via Command Palette → "Prompts: Run Prompt" → select `review-api-route`
5. Show the structured review output

---

## 4. Custom Agents (`.agent.md`)

Specialized AI personas with defined tools, knowledge, and workflows.

**Format**:
```markdown
---
name: Agent Name
description: What the agent does
tools: ['search', 'codebase', 'usages']
model: Claude Sonnet 4.6 (copilot)
---

# Agent Title
[Persona, workflow, decision tree, knowledge base]
```

**Our agents**:

| Agent | Role |
|-------|------|
| `ImplementationIdeas` | Creative exploration + PR creation |
| `API Reviewer` | Route quality, Swagger, security review |
| `Frontend Designer` | React + Tailwind component design |
| `Test Coverage` | Coverage analysis + test generation |

### Demo: Using a Custom Agent

1. Open Copilot Chat and type `@API Reviewer`
2. Ask: "Review the product route"
3. Show the structured review with severity ratings
4. Switch to `@Test Coverage` and ask: "What routes need tests?"

---

## 5. Agent Skills

Scripts and tools that agents can use for analysis.

**Structure**:
```
skills/
├── skill-name/
│   ├── SKILL.md        # Description and usage
│   ├── script1.py      # Analysis script
│   └── script2.py      # Another script
```

**Our skills**:

| Skill | Scripts | Purpose |
|-------|---------|---------|
| `api-analysis` | 3 Python scripts | Route listing, Swagger coverage, test coverage |
| `codebase-health` | 3 Python scripts | Dependencies, security patterns, complexity |
| `frontend-design` | SKILL.md only | Design guidelines for UI generation |

### Demo: Running a Skill Script

```powershell
python .github/skills/api-analysis/check_test_coverage.py api/src/routes
```

---

## 6. Plan Mode

A structured approach to complex changes:

1. Switch to **Plan** mode in Copilot Chat
2. Describe the change you want
3. Copilot analyzes the codebase and proposes a plan
4. Review, refine, then switch to Agent mode to implement

### Demo: Plan → Implement

1. Switch to Plan mode
2. Prompt: "I want to add a Cart page that shows selected products with quantities and total price"
3. Show the plan output (files to create/modify)
4. Ask to refine: "Remove the checkout button for now"
5. Switch to Agent mode → "Implement the plan"

---

## Summary

| Customization | Scope | When Applied |
|---------------|-------|-------------|
| `copilot-instructions.md` | Entire repo | Every interaction |
| `*.instructions.md` | File pattern | When editing matching files |
| `*.prompt.md` | Task-specific | When explicitly invoked |
| `*.agent.md` | Agent persona | When @ mentioned |
| `SKILL.md` + scripts | Agent tooling | When agent needs analysis |

---

## Next Steps

- [Hands-on Exercises](hands-on-exercises.md) — Create your own customization files
- [Lesson 3: Copilot CLI](../03-copilot-cli/readme.md) — Terminal-based AI assistance
