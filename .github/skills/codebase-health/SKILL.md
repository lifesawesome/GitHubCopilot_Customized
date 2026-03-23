---
name: 'codebase-health'
description: 'Assess overall codebase health: dependency freshness, code complexity, and security patterns'
---

# Codebase Health Skill

Assess the overall health of the OctoCAT Supply Chain codebase including dependency analysis, code complexity checks, and security pattern scanning.

## Scripts

| Script | Purpose | Usage |
|--------|---------|-------|
| `check_dependencies.py` | Analyze package.json for outdated/missing deps | `python check_dependencies.py <project-root>` |
| `find_security_patterns.py` | Scan for common security anti-patterns | `python find_security_patterns.py <src-dir>` |
| `measure_complexity.py` | Measure file sizes and identify large files | `python measure_complexity.py <src-dir>` |

## Quick Usage

```powershell
# Check dependency health
python .github/skills/codebase-health/check_dependencies.py .

# Scan for security issues
python .github/skills/codebase-health/find_security_patterns.py api/src

# Measure complexity
python .github/skills/codebase-health/measure_complexity.py api/src
```

## Safety
- **Safe**: All scripts are read-only analysis — they never modify files
- **Output**: Plain text reports to stdout

## Related
- Prompt: [security-review.prompt.md](../../prompts/security-review.prompt.md)
- Instructions: [typescript.instructions.md](../../instructions/typescript.instructions.md)
