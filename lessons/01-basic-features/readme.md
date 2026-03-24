# Lesson 1: GitHub Copilot Basic Features

## Overview

| Aspect | Detail |
|--------|--------|
| **Duration** | 60 minutes (40 min instruction + 20 min hands-on) |
| **Level** | Beginner |
| **Prerequisites** | VS Code + Copilot extension installed, OctoCAT repo cloned |
| **Outcome** | Comfortable using Ask, Edit, and Agent modes with Copilot |

---

## Why This Matters

GitHub Copilot is more than autocomplete. It has three distinct interaction modes, each designed for different tasks. Understanding when to use each mode is the key to developer productivity with AI.

---

## The Three Copilot Modes

### 1. Ask Mode
**Purpose**: Get answers, explanations, and recommendations without changing code.

**How to use**: Open Copilot Chat → Select "Ask" from the mode dropdown

**Best for**:
- Understanding unfamiliar code
- Architecture questions
- Debugging guidance
- Learning concepts

**Example prompts**:
```
Explain how the Express routing works in this project

What is the relationship between Orders and Products in the domain model?

How does the ThemeContext work in the frontend?
```

### 2. Edit Mode
**Purpose**: Make targeted changes to specific code selections.

**How to use**: Select code → `Ctrl+I` (inline chat) or use Edit mode in Chat

**Best for**:
- Refactoring a function
- Adding error handling to a block
- Converting code patterns
- Adding TypeScript types

**Example prompts**:
```
Add proper error handling with 404 and 400 responses

Convert this to use async/await instead of callbacks

Add Swagger JSDoc comments to these endpoints
```

### 3. Agent Mode
**Purpose**: Autonomous multi-file changes with tool access (terminal, file system, search).

**How to use**: Open Copilot Chat → Select "Agent" from the mode dropdown

**Best for**:
- Creating new features across multiple files
- Generating test files
- Refactoring across the codebase
- Running and validating changes

**Example prompts**:
```
Create unit tests for the product route following the branch.test.ts pattern

Add a new Supplier management page to the frontend with CRUD operations

Add Swagger documentation to all API routes that are missing it
```

---

## Chat Participants

Chat participants provide scoped context to Copilot:

| Participant | Purpose | Example |
|-------------|---------|---------|
| *(built-in)* | Entire codebase context is included automatically | `How is the API structured?` |
| `@terminal` | Terminal output context | `@terminal explain the last error` |
| `@vscode` | VS Code settings/features | `@vscode how do I configure launch.json?` |
| `@github` | GitHub repo context | `@github what open issues exist?` |

---

## Slash Commands

| Command | Mode | Purpose |
|---------|------|---------|
| `/doc` | Edit | Generate documentation for selected code |
| `/explain` | Ask | Explain selected code in detail |
| `/fix` | Edit | Fix errors or issues in selected code |
| `/tests` | Agent | Generate tests for selected code |
| `/new` | Agent | Create new file or project scaffold |

---

## Inline Chat

**Shortcut**: `Ctrl+I` (Windows/Linux) or `Cmd+I` (Mac)

Select code in the editor and press the shortcut to open inline chat directly above your selection. This is the fastest way to make quick edits.

**Use cases**:
- "Add JSDoc to this function"
- "Make this handle null values"
- "Rename variables to follow naming conventions"

---

## Model Selection

Different AI models excel at different tasks:

| Task | Recommended Model | Why |
|------|-------------------|-----|
| Quick code completion | GPT-4o | Fast, good for simple tasks |
| Complex reasoning | O3 | Deep analysis, architecture decisions |
| Implementation | Claude Sonnet | Strong code generation |
| Planning | GPT-4o or O3 | Good at structured analysis |

Switch models in Chat using the model selector dropdown.

---

## Tips for Effective Prompts

1. **Be specific** — "Add error handling to the product POST route" > "Fix this code"
2. **Provide context** — Reference files, patterns, or conventions
3. **Use examples** — "Follow the pattern in branch.test.ts"
4. **Iterate** — Refine your prompt based on the response
5. **Use the right mode** — Ask for questions, Edit for changes, Agent for multi-file work

---

## Next Steps

- [Hands-on Exercises](hands-on-exercises.md) — Practice with the OctoCAT codebase
- [Lesson 2: Customization & Planning](../02-planning/readme.md) — Make Copilot work your way
