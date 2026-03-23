# Lesson 4: Hands-On Exercises

## Exercise Overview

| # | Exercise | Focus | Duration |
|---|----------|-------|----------|
| 1 | Assign First Agent Task | Issue creation | 5 min |
| 2 | Review Agent PR | Code review | 5 min |
| 3 | Iterate on Agent Work | Follow-up issues | 5 min |
| 4 | Agent with Custom Instructions | Customization | 10 min |

---

## Setup

1. Ensure you have push access to the GitHub repository
2. Verify GitHub Actions are enabled on the repo
3. Confirm `copilot-setup-steps.yml` exists in `.github/workflows/`
4. Check that Copilot Coding Agent is enabled in repo settings

---

## Exercise 1: Assign First Agent Task

**Goal**: Create an issue and assign it to Copilot.

1. Go to your GitHub repository → Issues → New Issue
2. Create this issue:

**Title**: `Add unit tests for the Supplier API route`

**Body**:
```markdown
## Task
Create comprehensive unit tests for `api/src/routes/supplier.ts`.

## Pattern to Follow
Use the exact pattern from `api/src/routes/branch.test.ts`:
- Import Vitest and Supertest
- Set up Express app in beforeEach
- Test all CRUD operations

## Test Cases Required
- [ ] GET all suppliers
- [ ] GET supplier by ID
- [ ] POST create new supplier  
- [ ] PUT update supplier
- [ ] DELETE supplier
- [ ] 404 for non-existing supplier

## Validation
Run: `npm test --workspace=api`
All tests must pass.
```

3. Assign the issue to `@copilot` (or `Copilot` in the assignee field)
4. Watch the Actions tab for the agent to start working

<details>
<summary>✅ Success Criteria</summary>

- Issue created with clear requirements
- Agent picks up the issue (check Actions tab)
- Agent creates a PR with test file
- Tests pass in CI

</details>

---

## Exercise 2: Review Agent PR

**Goal**: Review the PR that Copilot creates.

1. Wait for the agent to open a PR (check the Issues page for a link)
2. Review the PR:
   - Check the file diff — does it follow the `branch.test.ts` pattern?
   - Are all CRUD operations tested?
   - Are error scenarios covered?
   - Did CI pass?

3. Leave review comments:
   - If tests are missing, comment specifically what's needed
   - If code quality could improve, suggest changes
   - Approve if it meets the criteria

4. **Decision**:
   - Merge if all criteria met
   - Request changes if improvements needed (agent may auto-fix)

<details>
<summary>✅ Success Criteria</summary>

- PR reviewed with meaningful feedback
- Code follows existing patterns
- All tests pass in CI
- Merged or changes requested with clear reasoning

</details>

---

## Exercise 3: Iterate on Agent Work

**Goal**: Create a follow-up issue based on the first task.

If the agent's test file could be improved, or you want to extend coverage:

1. Create a new issue:

**Title**: `Add unit tests for the Order API route`

**Body**:
```markdown
## Task
Create unit tests for `api/src/routes/order.ts` following the pattern 
established in `api/src/routes/branch.test.ts` and the recently created 
`api/src/routes/supplier.test.ts`.

## Special Considerations
- Orders have a `status` field with enum values: pending, processing, shipped, delivered, cancelled
- Test filtering by status if applicable
- Test relationship validation (branchId must reference valid branch)

## Validation
Run: `npm test --workspace=api`
```

2. Assign to `@copilot`
3. While waiting, review how the agent handles the more complex entity

<details>
<summary>✅ Success Criteria</summary>

- Second issue leverages context from previous work
- Agent produces more complex tests for the Order entity
- Tests handle status field correctly

</details>

---

## Exercise 4: Agent with Custom Instructions

**Goal**: See how custom instructions influence the agent's code generation.

1. Update `.github/copilot-instructions.md` to add a temporary rule: 

   Add before the Code Review Checklist:
   ```markdown
   ## Additional Test Requirements
   - All test files must include a comment header with: file name, date, and description
   - Test descriptions should follow the format: "should [action] when [condition]"
   - Include at least one test for edge cases (empty arrays, zero values)
   ```

2. Create a new issue:

**Title**: `Add unit tests for the Delivery API route`

**Body**:
```markdown
Create tests for `api/src/routes/delivery.ts` following project conventions.
Include CRUD tests and error scenarios. Follow the testing instructions in 
our custom instructions.

Validation: `npm test --workspace=api`
```

3. Assign to `@copilot`
4. When the PR arrives, check:
   - Does it include the comment header?
   - Do test descriptions follow the prescribed format?
   - Are edge cases included?

5. **Important**: Revert the temporary instruction change after the exercise

<details>
<summary>✅ Success Criteria</summary>

- Agent reads and follows the updated instructions
- Test file includes the comment header
- Test descriptions match the format
- Edge case tests are present

</details>

---

## Bonus: Security Remediation with Agent

Create an issue for security improvements:

**Title**: `Add input validation and security headers to the API`

**Body**:
```markdown
## Security Improvements
1. Add helmet.js middleware for security headers
2. Add input validation on POST/PUT endpoints for the Product route
3. Ensure CORS is not using wildcard origin in production

Reference `.github/prompts/security-review.prompt.md` for standards.
```

Assign to `@copilot` and review the security implementations.

---

## Summary

In this lesson you:
- ✅ Created and assigned your first Coding Agent issue
- ✅ Reviewed an agent-generated PR
- ✅ Iterated with follow-up tasks
- ✅ Observed how custom instructions influence agent output

**Next**: [Lesson 5 — MCP Servers & Extensions](../05-mcp-and-extensions/readme.md)
