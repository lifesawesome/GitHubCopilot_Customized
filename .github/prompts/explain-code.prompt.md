---
name: 'explain-code'
description: 'Explain TypeScript/React code with architecture context, dependencies, and improvement suggestions'
agent: 'ask'
---

# Explain Code

Analyze the selected code and provide a clear, structured explanation:

## Output Format

### 1. Purpose
One-sentence summary of what this code does and why it exists.

### 2. Walkthrough
Step-by-step explanation of the code flow:
- Entry point and initialization
- Key logic branches and data flow
- Return values or side effects

### 3. Key Concepts
List any patterns, frameworks, or techniques used:
- Express routing, middleware, Swagger
- React hooks, context, routing
- TypeScript generics, type guards, interfaces

### 4. Dependencies
Identify external dependencies and their roles:
- npm packages used (express, axios, react-query, etc.)
- Internal modules referenced (models, seedData, config)
- Context providers (AuthContext, ThemeContext)

### 5. Architecture Fit
How this code fits into the OctoCAT Supply Chain architecture:
- **API routes** serve REST endpoints mounted in `index.ts`
- **Models** define entity interfaces used across API and frontend
- **Components** compose the React UI with Tailwind styling
- Reference the [architecture doc](../../docs/architecture.md) for ERD relationships

### 6. Potential Issues
Flag any concerns:
- Missing error handling or validation
- Performance considerations
- Security risks (hardcoded values, missing auth)
- Missing Swagger documentation
- Missing test coverage

### 7. Improvement Suggestions
Concise recommendations for enhancing the code quality.
