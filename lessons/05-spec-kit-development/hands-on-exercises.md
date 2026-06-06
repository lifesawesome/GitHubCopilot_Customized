# Lesson 5: Hands-On Exercises

## Exercise Overview

| # | Exercise | Focus | Duration |
|---|----------|-------|----------|
| 1 | Audit the Existing Spec Kit | Read and evaluate | 5 min |
| 2 | Write a Scoped Instructions File | Create `*.test.ts` rules | 10 min |
| 3 | Create a Prompt File | PR description generator | 10 min |
| 4 | Build a Mini Skill | Data model domain knowledge | 10 min |

---

## Setup

1. Open VS Code in the repository root
2. Ensure the GitHub Copilot extension is installed and signed in
3. Open the `.github/` folder in the Explorer sidebar — you should see `instructions/`, `prompts/`, `agents/`, and `skills/` subdirectories
4. Open Copilot Chat (Ctrl+Shift+I / Cmd+Shift+I)

---

## Exercise 1: Audit the Existing Spec Kit

**Goal**: Read and evaluate the quality of the current `.github/` customization files before creating new ones.

### Step 1 — Survey what exists

Open a new Copilot Chat in Agent mode and run:

```
@workspace List all the Copilot customization files in .github/. For each file, 
tell me: the artifact type, its applyTo scope (if any), and one-sentence summary 
of what it does.
```

Review the output and compare it to the spec kit structure in the lesson readme.

### Step 2 — Evaluate the root instructions

Open `.github/copilot-instructions.md` and ask Copilot to evaluate it:

```
@workspace Review .github/copilot-instructions.md against this checklist:
- Is the project overview concise (< 5 sentences)?
- Is the folder structure described?
- Are key commands listed?
- Is domain vocabulary defined?
- Are critical conventions stated (not just documented)?

For each item, say Pass or Fail with a one-line reason.
```

### Step 3 — Find a gap

Ask Copilot to identify what's missing:

```
@workspace Looking at the files in .github/instructions/, which file types or 
layers in the codebase are NOT covered by a scoped instructions file? Suggest 
one new instructions file that would be most valuable to add.
```

Take note of Copilot's suggestion — you'll need it for Exercise 2.

<details>
<summary>✅ Success Criteria</summary>

- You can list all 5 artifact types present in `.github/` from memory
- You identified at least one gap or improvement in the existing spec kit
- You have a specific file type or layer in mind for Exercise 2

</details>

---

## Exercise 2: Write a Scoped Instructions File

**Goal**: Create a new `.instructions.md` file that encodes conventions for `api/src/models/*.ts` files — a scope not yet covered by the existing instructions.

> **Why this scope?** The existing `typescript.instructions.md` covers general TypeScript conventions for the whole codebase. The `api/src/models/` directory has more specific rules: every file defines exactly one exported interface, uses `readonly` for stable properties, and must match the Swagger schema JSDoc in the corresponding route file. These focused rules deserve their own scoped file.

### Step 1 — Study the existing model files

Open `api/src/models/` and inspect two or three model files (e.g., `branch.ts`, `product.ts`, `order.ts`). Then ask Copilot:

```
@workspace Look at the TypeScript files in api/src/models/. Summarize the 
conventions used as a bullet list: interface structure, use of readonly, 
required vs optional fields, naming style, and how models relate to each other 
(e.g., foreign key field naming).
```

### Step 2 — Draft the instructions file

Create the file `.github/instructions/models.instructions.md` and use Copilot to help fill it in:

```
Based on the model conventions you just found in api/src/models/, write the 
content of a .instructions.md file for model files in this project.

The file must:
- Start with a frontmatter block: applyTo: 'api/src/models/**/*.ts'
- Cover: one interface per file, readonly for stable properties, 
  required vs optional fields, foreign key naming (e.g., branchId), 
  export conventions, and how models align with the Swagger schema in routes
- Include a brief "ID and Timestamp fields" section
- Include a code review checklist at the end
- Follow the format of .github/instructions/typescript.instructions.md
```

### Step 3 — Validate the output

After Copilot generates the content, paste it into the file you created. Then:

1. Open any existing model file in `api/src/models/`
2. In Copilot Chat (with the model file open), ask: `Does this file follow the project's model conventions?`
3. Verify Copilot references rules from your new instructions file

VS Code Copilot automatically picks up `.instructions.md` files in `.github/instructions/` when the `applyTo` glob matches the open file.

<details>
<summary>✅ Success Criteria</summary>

- `.github/instructions/models.instructions.md` exists
- The file has a valid frontmatter `applyTo: 'api/src/models/**/*.ts'` block
- It covers: single interface per file, readonly usage, foreign key naming, export conventions
- When a model file is open, Copilot references the new rules in its suggestions

</details>

---

## Exercise 3: Create a Prompt File

**Goal**: Write a reusable prompt file for generating pull request descriptions — a common, repeatable workflow for any developer.

### Step 1 — Understand the desired output

Think about what a good PR description looks like for this project. It should include:
- What changed (summary of the diff)
- Why it changed (linked issue or motivation)
- How to test it (commands to run)
- Checklist items from the project conventions

### Step 2 — Create the prompt file

Create `.github/prompts/generate-pr-description.prompt.md`:

```
Create a reusable prompt file called generate-pr-description.prompt.md. 

The prompt should instruct Copilot to:
1. Summarize the changes in the current git diff as a short "What changed" section
2. List which files were modified and why
3. Provide a "How to test" section with the relevant npm test commands for this project
4. Add a checklist based on the project's Code Review Checklist from copilot-instructions.md
5. Note any related issues or breaking changes

Format the prompt so it produces a Markdown PR body ready to paste into GitHub.
Use ${issueNumber} and ${branchName} as input variables.
```

### Step 3 — Test the prompt

1. Make a small, harmless code change (e.g., add a comment to `api/src/seedData.ts`)
2. Stage the change with `git add`
3. Open Copilot Chat and use your new prompt:

```
/generate-pr-description issueNumber=42 branchName=feature/my-change
```

4. Review whether the output is a complete, usable PR description

### Step 4 — Refine the prompt

If the output is missing something (e.g., the checklist items are wrong, or the test commands aren't correct), edit the prompt file and retry. Good prompts often need one or two iterations.

<details>
<summary>✅ Success Criteria</summary>

- `.github/prompts/generate-pr-description.prompt.md` exists
- The prompt uses at least one `${variable}` placeholder
- Running the prompt via `/generate-pr-description` produces a structured PR body
- The output includes: summary, changed files, test commands, and a checklist

</details>

---

## Exercise 4: Build a Mini Skill

**Goal**: Package the OctoCAT data model conventions into a `SKILL.md` so that Copilot can give accurate, domain-specific answers about the data model at any time.

### Step 1 — Identify the domain knowledge to capture

The OctoCAT data model has specific relationships and naming conventions that Copilot needs to understand when generating or reviewing code:

```
Headquarters (1) → (*) Branch → (*) Order → (*) OrderDetail → (*) OrderDetailDelivery
                                                             ↕                    ↕
                                                          Product              Delivery
                                                                                  ↕
                                                                             Supplier
```

Ask Copilot to summarize this:

```
@workspace Describe the full OctoCAT data model: all entities, their fields, 
and their relationships. Include which fields are required on POST, the enum 
values for status fields, and any naming conventions used for foreign key fields.
```

Review and correct the output — this becomes the knowledge base for your skill.

### Step 2 — Create the skill directory and file

Create the directory `.github/skills/data-model/` and the file `SKILL.md` inside it:

```
Write a SKILL.md file for a new skill called "data-model". 

The skill should:
- Explain that it provides authoritative knowledge about the OctoCAT data model
- Include a "Data Model Overview" section with the entity relationship diagram 
  (use the ASCII diagram from the lesson readme as a starting point)
- Include an "Entity Reference" table listing each entity with: name, route path, 
  key fields, and relationships
- Include an "ID Generation" section explaining the Math.max() pattern used in routes
- Include a "Status Enums" section listing valid values for Order.status and 
  Delivery.status (find these in api/src/models/ or api/src/seedData.ts)
- Include a "Naming Conventions" section (camelCase fields, PascalCase interfaces)
- End with a "Safety" note: this skill is read-only reference material

Follow the format of .github/skills/codebase-health/SKILL.md.
```

### Step 3 — Validate the skill

Test that your skill provides accurate answers:

```
Using the data-model skill, answer these questions:
1. What is the route path for the Headquarters entity?
2. What are the valid values for Order.status?
3. How are new IDs generated when creating an entity?
4. What entity links an OrderDetail to a Delivery?
```

Verify the answers by cross-referencing with `api/src/models/` and `api/src/seedData.ts`.

### Step 4 — Link the skill to related artifacts

Edit your `SKILL.md` to add a "Related Resources" section that links to:
- `api-routes.instructions.md` (for route conventions)
- `generate-api-route.prompt.md` (for generating new routes)
- `API-Reviewer.agent.md` (for reviewing routes)

This makes the spec kit **cross-referenced** — each artifact points to related ones.

<details>
<summary>✅ Success Criteria</summary>

- `.github/skills/data-model/SKILL.md` exists
- The file covers: entity relationships, route paths, status enums, ID generation, naming conventions
- Copilot can answer the 4 validation questions accurately using the skill
- The skill includes a "Related Resources" section linking to other spec kit artifacts

</details>

---

## Bonus: Evaluate and Improve an Existing Agent

Choose one of the existing agent files in `.github/agents/` (e.g., `Test-Coverage.agent.md`) and evaluate it against the agent quality checklist from the lesson:

- [ ] Role is clearly defined (one sentence)
- [ ] Workflow is numbered and explicit
- [ ] Output format is specified
- [ ] Safety constraints are listed

Then ask Copilot to suggest improvements:

```
Review .github/agents/Test-Coverage.agent.md against this quality checklist:
1. Is the role defined in one clear sentence?
2. Is the workflow numbered with explicit steps?
3. Is the output format specified?
4. Are safety constraints listed?

For any failing items, suggest the specific text to add.
```

Apply at least one improvement to the agent file and describe why it makes the agent more reliable.

---

## Summary

In this lesson you:
- ✅ Audited the existing spec kit and identified gaps
- ✅ Created a scoped instructions file for `*.test.ts` files
- ✅ Wrote a reusable prompt file with input variables
- ✅ Packaged domain knowledge into a `SKILL.md`

The spec kit you've built lives in `.github/` alongside the codebase and improves every developer's Copilot experience automatically.

**Next**: [Lesson 6 — MCP Servers & Extensions](../05-mcp-and-extensions/readme.md)
