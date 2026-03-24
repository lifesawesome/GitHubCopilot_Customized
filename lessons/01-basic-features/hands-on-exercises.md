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
What is this project about? Summarize the architecture.
```

```
How many API routes exist and what entities do they serve?
```

```
What is the ERD relationship between Orders, OrderDetails, and Products?
```

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
Explain how the Welcome component works, including the brand carousel.
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
Add input validation — return 400 if required fields are missing in the request body
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
Add complete Swagger JSDoc documentation for this endpoint
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
Create a test file for the supplier route at api/src/routes/supplier.test.ts. Follow the exact pattern used in branch.test.ts. Include tests for:
- GET all suppliers
- GET supplier by ID
- POST create supplier
- PUT update supplier
- DELETE supplier
- 404 for non-existing supplier
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
Analyze the test coverage of the API project. Which routes have tests and which don't? Create a markdown report.
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

**Next**: [Lesson 2 — Customization & Planning](../02-planning/readme.md)
