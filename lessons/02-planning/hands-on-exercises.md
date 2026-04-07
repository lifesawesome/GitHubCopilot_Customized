# Lesson 2: Hands-On Exercises

## Exercise Overview

| # | Exercise | Focus | Duration |
|---|----------|-------|----------|
| 1 | Explore Existing Instructions | Read & understand | 5 min |
| 2 | See Instructions in Action | Observe behavior | 5 min |
| 3 | Create a Custom Prompt | Write prompt file | 10 min |
| 4 | Create a Custom Agent | Write agent file | 10 min |
| 5 | Explore More Instruction Patterns | Global vs scoped | 10 min |
| 6 | Use Plan Mode | Plan a feature | 10 min |

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

**Goal**: Observe each customization type producing real output from this codebase.

### 1. Instructions file — `api-routes.instructions.md`

Open `api/src/routes/supplier.ts`, then in **Edit** mode ask:
```
Add a route to search suppliers by name
```
Copilot automatically adds a Swagger JSDoc block, returns `{ error: 'Supplier not found' }` (not a plain string), and uses status 404 — because `.github/instructions/api-routes.instructions.md` applies to every file matching `api/src/routes/**/*.ts`.

### 2. Global instructions — `copilot-instructions.md` + TAO

In **Agent** mode ask:
```
Add observability to #file:api/src/routes/supplier.ts using our internal standards
```
Copilot uses `@Measure`, `@Trace`, and `@Log` from the TAO framework — even though TAO isn't a public package. It learned this from `.github/copilot-instructions.md` which references `docs/tao.md`.

### 3. Prompt file — `add-error-handling.prompt.md`

Open `api/src/routes/order.ts`, then run your prompt via **Command Palette → Prompts: Run Prompt → add-error-handling**.
Copilot wraps every handler in try/catch with 404/400/500 responses — exactly the shape defined in the prompt — without you repeating those rules each time.

### 4. React instructions — `react.instructions.md`

Open `frontend/src/components/entity/product/Products.tsx`, then in **Edit** mode ask:
```
Add a SupplierCard component that displays supplier name, contact person, and email
```
Copilot generates a functional component with a TypeScript props interface, uses only Tailwind utility classes (no inline styles), and includes `dark:` prefixes for dark mode support — because `.github/instructions/react.instructions.md` applies to every `**/*.tsx` file.

### 5. Testing instructions — `testing.instructions.md`

In **Agent** mode ask:
```
Create tests for #file:api/src/routes/supplier.ts
```
Copilot generates a `supplier.test.ts` file using Vitest + Supertest, with a fresh Express app in `beforeEach`, calls `resetSuppliers()` for test isolation, and covers all CRUD operations plus 404 error scenarios — following the pattern from `branch.test.ts` as defined in `.github/instructions/testing.instructions.md`.

### 6. Agent — Documentation Writer

Open the agent picker (model selector at the bottom of Chat), select **Documentation Writer**, then ask:
```
Which routes in #file:api/src/routes/supplier.ts are missing Swagger documentation?
```
The agent reads the file and reports gaps using its specialised documentation persona, rather than giving a generic Copilot response.

<details>
<summary>✅ Success Criteria</summary>

- Search route has Swagger JSDoc and `{ error: string }` shape — not a plain `res.send()`
- TAO decorators (`@Measure`, `@Trace`, `@Log`) appear in the observability output
- `add-error-handling` prompt wraps handlers in try/catch with consistent error shapes
- SupplierCard uses a TypeScript props interface, Tailwind classes only, and `dark:` prefixes
- Supplier tests use Vitest + Supertest with `beforeEach` app setup and `resetSuppliers()`
- Documentation Writer identifies missing Swagger blocks by name

</details>

---

## Exercise 3: Create a Custom Prompt

**Goal**: Create your own reusable prompt file.

> The `add-error-handling` prompt already exists at `.github/prompts/add-error-handling.prompt.md` as a reference example — open it first to study the pattern. Now you will create a **new** prompt that validates required fields.

1. Open `.github/prompts/add-error-handling.prompt.md` and read the YAML frontmatter (name, description, mode) and the instruction structure
2. Create a new file: `.github/prompts/add-input-validation.prompt.md`
3. Add this content (customize as you like):

```markdown
---
name: 'add-input-validation'
description: 'Add input validation to Express POST and PUT route handlers'
mode: 'edit'
---

# Add Input Validation

Add validation to POST and PUT handlers in the selected Express route file.

## Requirements
1. Check that all required fields (from the model interface) are present in `req.body`
2. Return `400` with `{ error: "<fieldName> is required" }` for each missing field
3. Validate that ID fields parsed from params are valid integers — return `400` with `{ error: "Invalid ID" }` if `NaN`
4. Place validation BEFORE any business logic

## Example — Before
```typescript
router.post('/', (req, res) => {
    const item = req.body;
    items.push(item);
    res.status(201).json(item);
});
```

## Example — After
```typescript
router.post('/', (req, res) => {
    const { name, price } = req.body;
    if (!name) return res.status(400).json({ error: 'name is required' });
    if (price === undefined) return res.status(400).json({ error: 'price is required' });
    const newItem = { id: Math.max(...items.map(i => i.id)) + 1, name, price };
    items.push(newItem);
    res.status(201).json(newItem);
});
```

## Do NOT
- Modify successful response shapes
- Add validation for optional model fields
- Add try/catch (use the add-error-handling prompt for that)
```

4. Test your prompt:
   - Open `api/src/routes/order.ts`
   - Run via Command Palette → **Prompts: Run Prompt → add-input-validation**

<details>
<summary>✅ Success Criteria</summary>

- Prompt file created with valid YAML frontmatter
- Running the prompt adds field presence checks before business logic
- Invalid ID params return 400, not 500
- Error responses use `{ error: string }` JSON shape

</details>

---

## Exercise 4: Create a Custom Agent

**Goal**: Create a specialized agent persona.

> The `Documentation Writer` agent already exists at `.github/agents/Documentation-Writer.agent.md` — open it first to study the YAML frontmatter (`name`, `description`, `tools`, `model`) and the structured workflow pattern. Now you will create a **new** agent with a different specialization.

1. Open `.github/agents/Documentation-Writer.agent.md` and study the structure
2. Create a new file: `.github/agents/Security-Reviewer.agent.md`
3. Add this content (customize as you like):

```markdown
---
name: Security Reviewer
description: Review code for OWASP Top 10 vulnerabilities and insecure patterns in the OctoCAT API
tools: ['search', 'codebase']
model: Claude Sonnet 4.6 (copilot)
---

# Security Reviewer Agent

## Role
You are a security specialist focused on the OctoCAT Supply Chain Express.js API.
You identify vulnerabilities without making code changes — report only.

## What You Check
1. **Input Validation** — Unvalidated `req.body` fields used directly
2. **Injection** — ID params used without `parseInt()` / `isNaN()` guard
3. **Error Leakage** — Stack traces or internal details sent to clients
4. **Hardcoded Secrets** — API keys, passwords, or tokens in source code
5. **Missing Auth** — Routes that should require authentication but don't

## Output Format

| Severity | Issue | File | Line | Remediation |
|----------|-------|------|------|-------------|
| HIGH | Unvalidated body used directly | supplier.ts | 92 | Destructure and check required fields |

## Rules
- Report findings only — do not modify files
- Classify each finding as HIGH / MEDIUM / LOW
- Always suggest a concrete remediation step
```

4. Test your agent:
   - Open the agent picker (model selector at the bottom of the Chat panel)
   - Select **Security Reviewer** from the list
   - Ask: `Review #file:api/src/routes/supplier.ts for security issues`

<details>
<summary>✅ Success Criteria</summary>

- Agent file created with valid YAML frontmatter
- Agent appears in the agent picker and uses its security-focused persona
- Returns a structured severity table, not a generic response
- Does not attempt to edit files (tools list has no `editFiles`)

</details>

---

## Exercise 5: Explore More Instruction Patterns

**Goal**: Understand the difference between global instructions, file-scoped instructions, and how to write new ones.

### The Customization Hierarchy

```
copilot-instructions.md          ← Always active (every chat)
    └── instructions/*.instructions.md   ← Active only when applyTo pattern matches
            └── prompts/*.prompt.md      ← Active only when explicitly run
                    └── agents/*.agent.md  ← Active only when agent is selected
```

### A) Compare global vs. file-scoped behavior

1. Open `api/src/routes/branch.ts` in the editor
2. In **Edit** mode, ask:
   ```
   Add a new field called `managerEmail` to this route
   ```
   Notice: Copilot uses `{ error: string }` shapes, Swagger JSDoc, and 404 patterns automatically — because `api-routes.instructions.md` applies to `api/src/routes/**/*.ts`.

3. Now open `api/src/seedData.ts` and ask the same question.
   Notice: Copilot behaves differently — no Swagger requirement enforced, because the pattern `api/src/routes/**/*.ts` does **not** match `seedData.ts`.

### B) Read the new models instruction

1. Open `.github/instructions/models.instructions.md` — note its `applyTo: 'api/src/models/**/*.ts'` target
2. Open `api/src/models/supplier.ts` in the editor
3. In **Edit** mode ask:
   ```
   Add a `country` field to the Supplier model
   ```
   Copilot will add the field to both the TypeScript interface AND the Swagger schema, include a FK-style description, and mark optional fields with `?` — all because of the models instruction.

### C) Write your own file-scoped instruction

1. Create `.github/instructions/seeddata.instructions.md`:

```markdown
---
applyTo: '**/seedData.ts'
---

# Seed Data Instructions

- Keep seed data realistic but clearly fictional (cat-themed names, addresses, etc.)
- Every seed array must have at least 3 entries
- IDs must start at 1 and be sequential with no gaps
- Do NOT add `Date.now()` or random values — seed data must be deterministic
- When adding a new entity, export it as `export const <plural>: <Type>[] = [...]`
```

2. Open `api/src/seedData.ts` and ask:
   ```
   Add 2 more suppliers to the seed data
   ```
   Copilot will use cat-themed names, sequential IDs, and deterministic data — because the instruction now applies.

<details>
<summary>✅ Success Criteria</summary>

- `api-routes.instructions.md` behavior is NOT triggered on `seedData.ts`
- `models.instructions.md` causes Copilot to update both TS interface AND Swagger schema
- New `seeddata.instructions.md` makes Copilot use cat-themed, deterministic seed data
- You can see the `applyTo` pattern is the key difference

</details>

---

## Exercise 6: Use Plan Mode

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

5. Ask another follow-up to anchor the plan to existing code:
```
Use #file:frontend/src/components/entity/product/Products.tsx as the template pattern for this new page
```

6. **Do NOT implement** — just review the plan

<details>
<summary>✅ Success Criteria</summary>

- Plan identifies the correct files to create and modify
- References the Products component as a concrete template (not generic)
- Uses Tailwind CSS and dark mode in the proposal
- Simplified plan is less complex than the original
- Third prompt produces a plan that mirrors the Products page structure

</details>

---

## Bonus: Create a Skill

Create `.github/skills/documentation-audit/SKILL.md` with a description of scripts that would check for missing Swagger docs and undocumented interfaces. Write at least one Python script.

---

## Summary

In this lesson you:
- ✅ Explored the customization hierarchy
- ✅ Observed file-specific instructions changing behavior
- ✅ Created a custom prompt file (`add-input-validation`)
- ✅ Created a custom agent persona (`Security-Reviewer`)
- ✅ Compared global vs. scoped instruction behavior
- ✅ Wrote your own file-scoped instruction
- ✅ Used Plan mode for feature design

**Next**: [Lesson 3 — Copilot CLI](../03-copilot-cli/readme.md)
