# GitHub Copilot Workshop — OctoCAT Supply Chain

## Workshop Agenda (Full Day)

| Time | Lesson | Topic | Duration |
|------|--------|-------|----------|
| 9:00 - 9:15 | — | Welcome & Setup Verification | 15 min |
| 9:15 - 10:15 | [Lesson 1](01-basic-features/readme.md) | GitHub Copilot Basic Features | 60 min |
| 10:15 - 10:30 | — | Break | 15 min |
| 10:30 - 12:00 | [Lesson 2](02-planning/readme.md) | Customization & Planning | 90 min |
| 12:00 - 1:00 | — | Lunch | 60 min |
| 1:00 - 2:00 | [Lesson 3](03-copilot-cli/readme.md) | Copilot CLI | 60 min |
| 2:00 - 2:15 | — | Break | 15 min |
| 2:15 - 3:15 | [Lesson 4](04-coding-agent/readme.md) | Coding Agent | 60 min |
| 3:15 - 3:30 | — | Break | 15 min |
| 3:30 - 4:30 | [Lesson 5](05-mcp-and-extensions/readme.md) | MCP Servers & Extensions | 60 min |
| 4:30 - 5:00 | — | Wrap-up, Q&A & Next Steps | 30 min |

---

## Prerequisites

Before the workshop, ensure you have:

- [ ] **VS Code** (latest stable or Insiders) installed
- [ ] **GitHub Copilot** extension installed and licensed
- [ ] **Node.js 18+** installed (`node --version`)
- [ ] **npm** available (`npm --version`)
- [ ] **Git** configured (`git --version`)
- [ ] **GitHub CLI** installed (`gh --version`) — for Lesson 3
- [ ] Repository cloned: `git clone https://github.com/<org>/GitHubCopilot_Customized.git`
- [ ] Dependencies installed: `npm ci` from root

### Verify the App Runs

```bash
# Build
npm run build

# Run API (terminal 1)
npm run dev --workspace=api

# Run Frontend (terminal 2)
npm run dev --workspace=frontend
```

- API: http://localhost:3000/api-docs (Swagger UI)
- Frontend: http://localhost:5137

---

## Learning Outcomes

By the end of this workshop, participants will be able to:

1. **Use Copilot effectively** — Ask, Edit, and Agent modes with the right model selection
2. **Customize Copilot** — Create instructions, prompts, agents, and skills for their teams
3. **Leverage Copilot CLI** — Use `gh copilot` for terminal-based AI assistance
4. **Assign work to Coding Agent** — Use GitHub's autonomous coding agent for issues and PRs
5. **Extend with MCP** — Connect Copilot to external tools via Model Context Protocol

---

## Workshop Codebase

**OctoCAT Supply Chain Management System** — A TypeScript monorepo with:

| Layer | Tech Stack |
|-------|------------|
| **API** | Express.js, TypeScript, Swagger/OpenAPI |
| **Frontend** | React 18, Vite, Tailwind CSS, React Router |
| **Testing** | Vitest, Supertest |
| **Deployment** | Docker, GitHub Actions, Azure Bicep |
| **Observability** | TAO (fictional internal framework) |

### Domain Model
```
Headquarters → Branches → Orders → OrderDetails → Products
                                                 → OrderDetailDeliveries
Suppliers → Deliveries → OrderDetailDeliveries
```

---

## Lesson Overview

### Lesson 1: Basic Features (60 min)
Explore Copilot's three interaction modes (Ask/Edit/Agent), chat participants, slash commands, and inline chat. Practice with the OctoCAT codebase.

### Lesson 2: Customization & Planning (90 min)
Deep dive into custom instructions, prompt files, custom agents, skills, and Plan mode. Create your own customization files.

### Lesson 3: Copilot CLI (60 min)
Install and use `gh copilot` in the terminal for shell commands, code explanation, and automation workflows.

### Lesson 4: Coding Agent (60 min)
Learn how GitHub Copilot's autonomous coding agent works — assign issues, review PRs, use custom instructions for agent guidance.

### Lesson 5: MCP Servers & Extensions (60 min)
Extend Copilot with Model Context Protocol servers (Playwright, GitHub, custom) and explore advanced integration patterns.

---

## Resources

- [GitHub Copilot Docs](https://docs.github.com/en/copilot)
- [Copilot Chat Modes](https://docs.github.com/en/copilot/using-github-copilot/copilot-chat)
- [Custom Instructions](https://docs.github.com/en/copilot/customizing-copilot/adding-custom-instructions)
- [MCP Specification](https://modelcontextprotocol.io/)
- [OctoCAT Architecture](../docs/architecture.md)
- [Demo Script](../docs/demo-script.md)

---

## Tips for Instructors

1. **Practice each demo** before presenting — Copilot is non-deterministic
2. **Have fallback prompts** ready if the AI takes an unexpected path
3. **Show the "why"** — connect each feature to real-world developer productivity
4. **Encourage experimentation** — there's no wrong way to prompt
5. **Build confidence** — start simple (Lesson 1) and increase complexity gradually
