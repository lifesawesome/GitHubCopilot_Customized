# Lesson 2: Hands-On Exercises

## Exercise Overview

| # | Exercise | Focus | Duration |
|---|----------|-------|----------|
| 1 | Explore Existing Instructions | Read & understand | 5 min |
| 2 | See Instructions in Action | Observe behavior | 5 min |
| 3 | Create a Custom Prompt | Write prompt file | 10 min |
| 4 | Create a Custom Agent | Write agent file | 10 min |
| 5 | Use Plan Mode | Plan a feature | 10 min |

---

## Exercise 1: Explore Existing Instructions

**Goal**: Understand the customization hierarchy by reading existing files.

1. Open `.github/copilot-instructions.md` — read the project overview section
2. Open `.github/instructions/api-routes.instructions.md` — note the `applyTo` pattern
3. Open `.github/instructions/react.instructions.md` — note the Tailwind/dark mode rules
4. Open `.github/prompts/review-api-route.prompt.md` — note the YAML frontmatter

**Questions to answer**:
- What pattern does `api-routes.instructions.md` apply to?
- What mode does the `review-api-route` prompt use?
- Where does Copilot learn about the TAO observability framework?

<details>
<summary>✅ Answers</summary>

- `api/src/routes/**/*.ts`
- `ask` mode
- From `copilot-instructions.md` and `docs/tao.md`

</details>

---

## Exercise 2: See Instructions in Action

**Goal**: Observe how file-specific instructions change Copilot's behavior.

1. Open `api/src/routes/supplier.ts`
2. Open Copilot Chat in **Edit** mode
3. Select any endpoint and ask:
   ```
   Add proper error handling to this endpoint
   ```
4. Notice how Copilot follows the API route patterns (proper status codes, error shape)

5. Now open `frontend/src/components/About.tsx`
6. Select a section and ask:
   ```
   Improve the styling of this section
   ```
7. Notice how Copilot uses Tailwind classes and dark mode — not inline styles

<details>
<summary>✅ Success Criteria</summary>

- API route gets proper 404/400 handling with `{ error: string }` shape
- React component uses Tailwind utilities with `dark:` prefixes
- No inline styles in the React output

</details>

---

## Exercise 3: Create a Custom Prompt

**Goal**: Create your own reusable prompt file.

1. Create a new file: `.github/prompts/add-error-handling.prompt.md`
2. Add this content (customize as you like):

```markdown
---
name: 'add-error-handling'
description: 'Add comprehensive error handling to Express route endpoints'  
mode: 'edit'
---

# Add Error Handling

Add proper error handling to the selected Express route endpoint(s):

## Requirements
1. Wrap handler logic in try/catch
2. Return 404 with `{ error: "[Entity] not found" }` for missing resources
3. Return 400 with `{ error: "field is required" }` for invalid input
4. Return 500 with `{ error: "Internal server error" }` for unexpected errors
5. Log errors with context: `console.error('Error in [method]:', error)`

## Do NOT:
- Change the existing business logic
- Modify successful response shapes
- Add unnecessary validation for optional fields
```

3. Test your prompt:
   - Open `api/src/routes/order.ts`
   - Run your prompt via Command Palette → "Prompts: Run Prompt"

<details>
<summary>✅ Success Criteria</summary>

- Prompt file created with valid YAML frontmatter
- Running the prompt adds try/catch with proper status codes
- Error responses match the specified format

</details>

---

## Exercise 4: Create a Custom Agent

**Goal**: Create a specialized agent persona.

1. Create a new file: `.github/agents/Documentation-Writer.agent.md`
2. Add this content:

```markdown
---
name: Documentation Writer
description: Generate and update project documentation, Swagger docs, and README files
tools: ['search', 'codebase', 'editFiles']
model: Claude Sonnet 4.6 (copilot)
---

# Documentation Writer Agent

## Role
You are a technical documentation specialist for the OctoCAT Supply Chain project.

## What You Do
1. **API Docs** — Generate Swagger JSDoc for undocumented endpoints
2. **README** — Update project README with new features
3. **Architecture** — Update docs/architecture.md when structure changes
4. **Code Comments** — Add JSDoc to interfaces and complex functions

## Workflow
1. Scan the codebase for missing documentation
2. Prioritize: Swagger > README > Architecture > Code comments
3. Generate documentation following existing patterns
4. Verify Swagger renders at /api-docs

## Rules
- Match the tone and style of existing documentation
- Never remove existing documentation
- Always include code examples in guides
- Use Mermaid diagrams for architecture visualizations
```

3. Test your agent:
   - Open Copilot Chat and type `@Documentation Writer`
   - Ask: "What API endpoints are missing Swagger documentation?"

<details>
<summary>✅ Success Criteria</summary>

- Agent file created with valid YAML frontmatter
- Agent responds with its specialized persona
- Identifies undocumented endpoints correctly

</details>

---

## Exercise 5: Use Plan Mode

**Goal**: Use Plan mode to design a feature before implementing it.

1. Open Copilot Chat and switch to **Plan** mode
2. Enter this prompt:

```
I want to add an Order Management page to the frontend that shows all orders grouped by branch. 
Each order should show its status, date, and total value calculated from order details. 
Include a filter to show orders by status (pending, processing, shipped, delivered, cancelled).
```

3. Review the plan output — it should identify:
   - New components to create
   - Existing components to modify (App.tsx, Navigation.tsx)
   - API endpoints to use
   - State management approach

4. Ask a follow-up to refine:
```
Simplify the plan — just show a table of orders with status filter, no grouping by branch
```

5. **Do NOT implement** — just review the plan

<details>
<summary>✅ Success Criteria</summary>

- Plan identifies the correct files to create and modify
- References existing patterns (Products page as template)
- Uses Tailwind CSS and dark mode in the proposal
- Simplified plan is less complex than the original

</details>

---

## Bonus: Create a Skill

Create `.github/skills/documentation-audit/SKILL.md` with a description of scripts that would check for missing Swagger docs and undocumented interfaces. Write at least one Python script.

---

## Summary

In this lesson you:
- ✅ Explored the customization hierarchy
- ✅ Observed file-specific instructions changing behavior
- ✅ Created a custom prompt file
- ✅ Created a custom agent persona
- ✅ Used Plan mode for feature design

**Next**: [Lesson 3 — Copilot CLI](../03-copilot-cli/readme.md)
