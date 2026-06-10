# Lesson 1: Hands-On Exercises

## Exercise Overview

| # | Exercise | Mode | Duration |
|---|----------|------|----------|
| 1 | Explore the Codebase | Ask | 5 min |
| 2 | Explain Code | Ask | 5 min |
| 3 | Fix and Improve Code | Edit | 5 min |
| 4 | Generate Documentation | Edit | 5 min |
| 5 | Generate Tests with Agent | Agent | 10 min |

---

## Setup

1. Open the `GitHubCopilot_Customized` workspace in VS Code
2. Ensure Copilot is active (check the Copilot icon in the status bar)
3. Open Copilot Chat (`Ctrl+Shift+I`)
4. Start the API: `npm run dev --workspace=api`

---

## Exercise 1: Explore the Codebase (Ask Mode)

**Goal**: Use Ask mode to understand the project (codebase context is now built in automatically).

1. Open Copilot Chat and select **Ask** mode
2. Try these prompts:

```
Summarize architecture and tech stack
```

```
List all API route files and their entities
```

```
Show ERD: Orders → OrderDetails → Products
```

> **Prompt tip**: Short, keyword-rich prompts use fewer tokens and produce equally good results. Copilot already has codebase context — no need to repeat "this project" or ask full questions.

<details>
<summary>✅ Success Criteria</summary>

- Copilot describes the OctoCAT Supply Chain system
- It identifies Express API + React frontend architecture
- It references the entity relationships from the domain model

</details>

---

## Exercise 2: Explain Code (Ask Mode)

**Goal**: Use Copilot to understand unfamiliar code.

1. Open `api/src/routes/branch.ts`
2. Select the entire file content
3. Open inline chat (`Ctrl+I`) and type:

```
/explain
```

4. Now open `frontend/src/components/Welcome.tsx` and ask:

```
Explain Welcome.tsx carousel and hero section
```

<details>
<summary>✅ Success Criteria</summary>

- Copilot explains the CRUD operations in the branch route
- It describes the Swagger annotations
- It explains the Welcome component's hero image and carousel

</details>

---

## Exercise 3: Fix and Improve Code (Edit Mode)

**Goal**: Use Edit mode to make targeted code improvements.

1. Open `api/src/routes/product.ts`
2. Find any endpoint that might be missing error handling
3. Select the code block and use inline chat (`Ctrl+I`):

```
Add 400 validation for missing required fields
```

4. Review the suggested changes and Accept or Reject

<details>
<summary>✅ Success Criteria</summary>

- Copilot adds validation checks for required fields
- Returns 400 status with descriptive error message
- Doesn't break existing functionality

</details>

---

## Exercise 4: Generate Documentation (Edit Mode)

**Goal**: Use the `/doc` slash command to generate documentation.

1. Open `api/src/models/product.ts`
2. Select the `Product` interface
3. Use inline chat (`Ctrl+I`) and type:

```
/doc
```

4. Now open `api/src/routes/supplier.ts`
5. Select a route handler that's missing Swagger docs
6. Type in inline chat:

```
Add Swagger JSDoc matching branch.ts pattern
```

<details>
<summary>✅ Success Criteria</summary>

- JSDoc comment added above the Product interface
- Swagger documentation includes tags, parameters, and response schemas
- Documentation matches the existing pattern in branch.ts

</details>

---

## Exercise 5: Generate Tests with Agent (Agent Mode)

**Goal**: Use Agent mode to create a complete test file.

1. Open Copilot Chat and select **Agent** mode
2. Enter this prompt:

```
Create api/src/routes/supplier.test.ts following branch.test.ts pattern. Cover full CRUD + 404 errors.
```

3. Watch Copilot:
   - Read the branch.test.ts pattern
   - Read the supplier route and model
   - Generate the test file
   - Optionally run the tests

4. Accept the changes and verify:

```bash
npm test --workspace=api -- src/routes/supplier.test.ts
```

<details>
<summary>✅ Success Criteria</summary>

- `supplier.test.ts` file created in `api/src/routes/`
- All CRUD operations tested
- Error scenarios (404) covered
- Tests pass when run

</details>

---

## Bonus Challenge

Open Copilot Chat in Agent mode and try:

```
Report API test coverage: which routes have/lack test files
```

---

## Summary

In this lesson you practiced:
- ✅ **Ask mode** for codebase exploration and code explanation
- ✅ **Edit mode** for targeted improvements and documentation
- ✅ **Agent mode** for multi-file test generation
- ✅ **Inline chat** for quick in-editor changes
- ✅ **Slash commands** (`/explain`, `/doc`)
- ✅ **Chat participants** (`@terminal`, `@github`, `@vscode`)

**Next**: [Lesson 2 — Customizations](../02-customizations/readme.md)
