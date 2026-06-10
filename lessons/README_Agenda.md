# GitHub Copilot Workshop — OctoCAT Supply Chain

## Workshop Agenda (2 Days)

---

### 📅 Day 1: Foundations, Core Features & Secure Usage

| # | Topic | Duration | Lesson |
|---|-------|----------|--------|
| 1 | Introduction & Setup | 30 min | — |
| 2 | Basic Features (GitHub Copilot Fundamentals) | 60 min | [Lesson 1](01-basic-features/readme.md) |
| 3 | Customizations | 75 min | [Lesson 2](02-customizations/readme.md) |
| 4 | Secure Usage of GitHub Copilot | 60 min | [Lesson 3](03-security/readme.md) |
| 5 | MCP Servers & Extensions | 60 min | [Lesson 6](06-mcp-and-extensions/readme.md) |
| 6 | Day 1 Wrap-up & Q&A | 15 min | — |

---

### 📅 Day 2: Advanced Capabilities, Agents & End-to-End Scenarios

| # | Topic | Duration | Lesson |
|---|-------|----------|--------|
| 1 | Day 1 Recap & Setup Validation | 15 min | — |
| 2 | Engineering Practices with Copilot | 60 min | — |
| 3 | Copilot CLI | 60 min | [Lesson 4](04-copilot-cli/readme.md) |
| 4 | Coding Agent (Introduction) | 60 min | [Lesson 5](05-coding-agent/readme.md) |
| 5 | Copilot Spaces (Collaboration) | 60 min | — |
| 6 | Spec-Driven Development & Advanced Agent Usage | 60 min | — |
| 7 | Day 2 Wrap-up & Next Steps | 15 min | — |

---

## Prerequisites

Before the workshop, ensure you have:

- [ ] **VS Code** (latest stable or Insiders) installed
- [ ] **GitHub Copilot** extension installed and licensed
- [ ] **Node.js 18+** installed (`node --version`)
- [ ] **npm** available (`npm --version`)
- [ ] **Git** configured (`git --version`)
- [ ] **GitHub CLI** installed (`copilot`) — for Lesson 4 (Day 2)
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

1. **Use Copilot effectively** — Ask, Edit, Plan, and Agent modes with the right model selection
2. **Apply engineering practices** — Prompt engineering, context engineering, model selection
3. **Customize Copilot** — Create instructions, prompts, agents, and skills for their teams
4. **Use Copilot securely** — Protect IP, govern agent output, safe CLI usage, audit dependencies
5. **Leverage Copilot CLI** — Use `gh copilot` for terminal-based AI assistance with safety patterns
6. **Assign work to Coding Agent** — Use GitHub's autonomous coding agent for issues and PRs
7. **Extend with MCP** — Connect Copilot to external tools via Model Context Protocol
8. **Collaborate with Spaces** — Create shared, context-aware workspaces for team productivity
9. **Apply spec-driven development** — Use specifications to drive Copilot-generated implementations

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

## Lesson & Session Overview

### Day 1

#### 1. Introduction & Setup (30 min)
Workshop overview, objectives, audience alignment, GitHub Copilot capabilities across IDEs, environment validation (licenses, repos, extensions).

➡️ **Hands-on (LBA):**
- Validate Copilot setup in IDE
- Try basic prompt / inline completion

---

#### 2. Basic Features — GitHub Copilot Fundamentals (60 min)
Code completions, chat, model picker, Ask/Edit/Plan/Agent modes, IDE capabilities and extensions.

➡️ **Hands-on (LBA):**
- Generate and refine code
- Use chat vs inline completions
- Compare different modes (ask / edit / plan)

---

#### 3. Customizations (75 min)
Custom instructions, prompts, agents, and skills. Prompt files and reusable patterns. Skills and org-level configuration.

➡️ **Hands-on (LBA):**
- Customize GitHub Copilot behavior
- Build reusable prompts
- Configure personalization

---

#### 4. Secure Usage of GitHub Copilot (60 min)
Responsible and secure usage patterns. Code validation and review strategies. Handling sensitive data and IP. Governance considerations.

➡️ **Hands-on (LBA):**
- Review Copilot-generated code for risks
- Apply secure coding practices
- Validate outputs before use

---

#### 5. MCP Servers & Extensions (60 min)
Model Context Protocol (MCP) overview. Extending Copilot with external tools. Integration patterns.

➡️ **Hands-on (LBA):**
- Explore MCP-enabled workflows
- Extend Copilot context with tools

---

#### 6. Wrap-up & Q&A (15 min)
Key takeaways from Day 1. Prep for advanced topics.

---

### Day 2

#### 1. Day 1 Recap & Setup Validation (15 min)
Key concepts recap.

---

#### 2. Engineering Practices with Copilot (60 min)
Prompt engineering fundamentals. Context engineering techniques. Working effectively with Copilot suggestions. Model selection and switching.

➡️ **Hands-on (LBA):**
- Improve prompts iteratively
- Control output using context

---

#### 3. Copilot CLI (60 min)
Introduction to CLI capabilities. When to use CLI vs IDE. Spec-driven development concepts.

➡️ **Hands-on (LBA):**
- Execute Copilot CLI scenarios
- Try spec-driven workflows

---

#### 4. Coding Agent — Introduction (60 min)
What is the coding agent. Agent vs IDE-based Copilot. Task delegation and workflows.

➡️ **Hands-on (LBA):**
- Assign a simple task to the agent
- Review generated output

---

#### 5. Copilot Spaces — Collaboration (60 min)
Creating shared, context-aware workspaces. Integrating repos, docs, and issues. Team collaboration patterns.

➡️ **Hands-on (LBA):**
- Create and use a shared Copilot space
- Collaborate using shared context

---

#### 6. Spec-Driven Development & Advanced Agent Usage (60 min)
Applying spec-driven development with Copilot. Assigning complex, scoped tasks to agents. Iterating on agent outputs. Reviewing pull requests.

➡️ **Hands-on (LBA):**
- Use agents for multi-step development tasks
- Review and refine generated code

---

#### 7. Wrap-up & Next Steps (15 min)
Key takeaways, recommended practices, resources and next steps.

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
