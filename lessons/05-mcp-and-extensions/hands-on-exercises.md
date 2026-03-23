# Lesson 5: Hands-On Exercises

## Exercise Overview

| # | Exercise | MCP Server | Duration |
|---|----------|------------|----------|
| 1 | Start MCP Servers | Setup | 5 min |
| 2 | Browse the App with Playwright | Playwright | 10 min |
| 3 | Interact with GitHub | GitHub | 10 min |
| 4 | Combined Workflow | Both | 10 min |

---

## Setup

1. Ensure the OctoCAT app is running:
   ```bash
   # Terminal 1 — API
   npm run dev --workspace=api
   
   # Terminal 2 — Frontend
   npm run dev --workspace=frontend
   ```
2. Verify:
   - API: http://localhost:3000/api-docs
   - Frontend: http://localhost:5137

---

## Exercise 1: Start MCP Servers

**Goal**: Configure and start MCP servers.

### Start Playwright MCP Server

1. Open Command Palette: `Ctrl+Shift+P`
2. Search: "MCP: List Servers"
3. Select `playwright` → Start Server
4. Verify the server is running (green indicator)

### Start GitHub MCP Server (if Docker available)

1. Open Command Palette: `Ctrl+Shift+P`
2. Search: "MCP: List Servers"
3. Select `github` (local or remote) → Start Server
4. Provide PAT when prompted (for local server)

<details>
<summary>✅ Success Criteria</summary>

- At least Playwright MCP server is running
- Server shows as active in the MCP server list
- No error messages in the output

</details>

---

## Exercise 2: Browse the App with Playwright

**Goal**: Use Playwright MCP to interact with the running frontend.

1. Open Copilot Chat → **Agent** mode
2. Try these prompts:

### Navigate and Verify

```
Browse to http://localhost:5137 and describe what you see on the home page.
```

### Test the Products Page

```
Browse to http://localhost:5137/products and:
1. Count how many products are displayed
2. Check if a search bar exists
3. Search for "SmartFeeder" 
4. Report what products match the search
```

### Verify Navigation

```
Browse to http://localhost:5137 and test the navigation:
1. Click on "Products" in the nav bar
2. Verify the products page loads
3. Click on "About" 
4. Verify the about page loads
5. Report the navigation test results
```

<details>
<summary>✅ Success Criteria</summary>

- Copilot successfully navigates the app
- Correct product count identified
- Search functionality tested
- Navigation links work correctly

</details>

---

## Exercise 3: Interact with GitHub

**Goal**: Use GitHub MCP to manage issues and PRs from Chat.

> Skip this exercise if you don't have the GitHub MCP server running.

1. Open Copilot Chat → **Agent** mode
2. Try these prompts:

### List Issues

```
List all open issues in this repository.
```

### Create an Issue

```
Create an issue in this repo with:
Title: "Add order management page to frontend"
Body: "Create a new page at /orders that displays all orders in a table with columns: ID, Branch, Status, Date, Total. Include status filtering (pending/processing/shipped/delivered/cancelled)."
Labels: enhancement
```

### Search Repository

```
Search this repository for any files that contain "TODO" or "FIXME" comments.
```

### Create Issue for Agent

```
Create an issue to add unit tests for the Order API route following the branch.test.ts pattern. Assign it to Copilot.
```

<details>
<summary>✅ Success Criteria</summary>

- Issues listed (or "no open issues" reported)
- New issue created with correct title and body
- Repository search returns relevant results
- Issue assigned to Copilot (if coding agent enabled)

</details>

---

## Exercise 4: Combined Workflow

**Goal**: Combine Playwright and GitHub MCP in a single workflow.

1. Open Copilot Chat → **Agent** mode
2. Run this multi-step workflow:

### Step 1: Discover a Problem

```
Browse to http://localhost:5137/products and check if all products display correctly. Report any visual issues or missing elements.
```

### Step 2: Create an Issue (if GitHub MCP available)

Based on findings from Step 1, ask Copilot to create an issue:

```
Based on the browsing results, create a GitHub issue summarizing any UI improvements needed for the Products page.
```

### Step 3: Plan the Fix

Switch to Plan mode:

```
Based on the issue we just created, plan the changes needed to fix the Products page issues.
```

### Alternative (without GitHub MCP)

If GitHub MCP is not available, combine Playwright with code analysis:

```
1. Browse to http://localhost:5137/products and take a screenshot
2. Read the Products.tsx component source code
3. Compare what the code does vs what the page shows
4. Suggest any improvements to the component
```

<details>
<summary>✅ Success Criteria</summary>

- Multi-step workflow executes across tools
- Findings from Playwright inform next steps
- Issue or improvement suggestions are actionable

</details>

---

## Bonus: Generate BDD Tests

Combine code generation with browser verification:

```
1. Read the product route at api/src/routes/product.ts
2. Generate a Gherkin feature file for testing the Product CRUD operations
3. Browse to http://localhost:3000/api-docs 
4. Use the Swagger UI to verify the Product endpoints exist
5. Save the feature file as api/tests/product.feature
```

---

## Bonus: Custom MCP Exploration

Explore what MCP tools are available:

```
What MCP servers are currently running? List all available tools from each server.
```

---

## Summary

In this lesson you:
- ✅ Configured and started MCP servers
- ✅ Used Playwright MCP for browser-based testing
- ✅ Used GitHub MCP for issue and PR management
- ✅ Combined multiple MCP servers in a workflow
- ✅ Experienced how MCP extends Copilot's capabilities

---

## Workshop Complete!

You've completed all 5 lessons:

| Lesson | Topic | Key Takeaway |
|--------|-------|--------------|
| 1 | Basic Features | Ask/Edit/Agent modes for different tasks |
| 2 | Customization | Instructions/prompts/agents/skills steer Copilot |
| 3 | Copilot CLI | Terminal AI for shell and git workflows |
| 4 | Coding Agent | Autonomous issue → PR pipeline |
| 5 | MCP Extensions | External tools via Model Context Protocol |

**Back to**: [Workshop Agenda](../README_Agenda.md)
