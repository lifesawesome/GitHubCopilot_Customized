---
name: 'summarize-code'
description: 'Provide a concise 3-6 bullet summary of code purpose, inputs/outputs, and architecture fit'
mode: 'ask'
---

# Summarize Code

Provide a concise summary of the selected code in 3-6 bullet points.

## Format
Each bullet should cover one of these aspects (as applicable):

- **What**: What the code does (one sentence)
- **Inputs/Outputs**: Parameters, return values, or HTTP request/response shapes
- **Core Logic**: Key algorithm, data transformation, or business rule
- **API Interaction**: Endpoints called or exposed, request/response formats
- **Dependencies**: Key packages or internal modules used
- **Architecture**: Where this fits in the OctoCAT supply chain system

## Example Output

**`api/src/routes/branch.ts`**
- Implements CRUD REST endpoints for Branch entities (`GET`, `POST`, `PUT`, `DELETE`)
- Uses in-memory array with seed data; auto-increments IDs on creation
- Each endpoint has Swagger JSDoc documentation for `/api-docs`
- Returns 404 for missing branches, 201 for creation with `Location` header
- Depends on `Branch` model and `seedBranches` from `seedData.ts`
- Part of the API layer serving the frontend's branch management views

## Rules
- Keep each bullet to one line maximum
- Use technical but clear language
- Include entity relationship context from the ERD when relevant
- Do not include code snippets — summary only
