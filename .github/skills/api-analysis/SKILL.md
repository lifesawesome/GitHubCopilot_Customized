---
name: 'api-analysis'
description: 'Analyze Express API routes for completeness, Swagger coverage, and test coverage'
---

# API Analysis Skill

Analyze the OctoCAT Supply Chain API for route completeness, Swagger documentation coverage, and test coverage.

## Scripts

| Script | Purpose | Usage |
|--------|---------|-------|
| `list_routes.py` | List all API routes and their endpoints | `python list_routes.py <api-src-dir>` |
| `check_swagger_coverage.py` | Check Swagger JSDoc completeness | `python check_swagger_coverage.py <routes-dir>` |
| `check_test_coverage.py` | Identify routes missing test files | `python check_test_coverage.py <routes-dir>` |

## Quick Usage

```powershell
# List all routes and endpoints
python .github/skills/api-analysis/list_routes.py api/src/routes

# Check Swagger documentation coverage
python .github/skills/api-analysis/check_swagger_coverage.py api/src/routes

# Check test file coverage
python .github/skills/api-analysis/check_test_coverage.py api/src/routes
```

## Safety
- **Safe**: All scripts are read-only analysis — they never modify files
- **Output**: Plain text reports to stdout

## Related
- Agent: [API-Reviewer.agent.md](../../agents/API-Reviewer.agent.md)
- Prompt: [review-api-route.prompt.md](../../prompts/review-api-route.prompt.md)
- Instructions: [api-routes.instructions.md](../../instructions/api-routes.instructions.md)
