---
name: 'cli-safety-guide'
description: 'Safe usage patterns for GitHub Copilot CLI — what to do, what to avoid, and how to protect proprietary information'
agent: 'ask'
---

# GitHub Copilot CLI Safety Guide

Provide a comprehensive safety guide for using GitHub Copilot CLI (`gh copilot explain` and `gh copilot suggest`) in a way that protects proprietary information and avoids common pitfalls.

## Cover These Topics

### 1. What Is Safe to Use with Copilot CLI

**Safe inputs:**
- Public documentation questions ("How do I configure CORS in Express?")
- Generic code patterns ("Show me a TypeScript interface for pagination")
- Open-source tool usage ("How to write a Dockerfile for Node.js 20")
- Error messages (sanitized — remove file paths and internal hostnames first)
- Git commands and shell scripting questions

**Safe patterns:**
```bash
# ✅ Safe: Generic questions
gh copilot explain "What does the --no-verify flag do in git commit?"
gh copilot suggest "Write a bash script to find large files in a git repo"

# ✅ Safe: Public tool usage
gh copilot explain "How does express-rate-limit middleware work?"

# ✅ Safe: Sanitized error
gh copilot explain "Error: ECONNREFUSED 127.0.0.1:3000"
```

### 2. What to NEVER Use with Copilot CLI

**Never pipe these into Copilot CLI:**
- `.env` files or any file containing credentials
- Private keys, certificates, or keystores
- Proprietary source code from restricted/private repositories
- Internal configuration files with hostnames, IPs, or service URLs
- Database dumps or files containing customer data
- Full application logs (may contain tokens, PII, or internal paths)

**Dangerous patterns to avoid:**
```bash
# ❌ NEVER: Piping credentials
cat .env | gh copilot explain
gh copilot explain "$(cat ~/.ssh/id_rsa)"

# ❌ NEVER: Piping proprietary code
cat src/proprietary-algorithm.ts | gh copilot explain

# ❌ NEVER: Full log files (may contain tokens)
gh copilot explain "$(tail -100 /var/log/app.log)"

# ❌ NEVER: Internal URLs in queries
gh copilot suggest "curl https://internal-api.corp.company.com/v2/users"
```

### 3. How to Scope CLI Queries Safely

**Principle of minimum context:**
- Extract only the relevant snippet, not the entire file
- Remove internal identifiers before asking
- Replace real hostnames with `example.com`
- Replace real credentials with `<PLACEHOLDER>`

**Safe scoping examples:**
```bash
# Instead of piping a whole file, extract the relevant function:
# ✅ Good: Minimal context
gh copilot explain "Why would express.Router().get('/:id') return 404 when the ID exists?"

# ❌ Bad: Full proprietary file
cat api/src/routes/internal-billing.ts | gh copilot explain
```

### 4. Reviewing CLI Suggestions Before Execution

**Always review `gh copilot suggest` output for:**
- Destructive commands (`rm -rf`, `DROP TABLE`, `git push --force`)
- Commands that modify system configuration
- Commands that install packages (verify the package name is correct)
- Commands that expose network services (opening ports, starting servers)
- Commands with elevated privileges (`sudo`, admin operations)

**Safe review workflow:**
1. Read the suggested command fully before pressing Enter
2. Check for unintended flags (e.g., `--force`, `--no-verify`, `-rf`)
3. Verify file paths point where you expect
4. For multi-line scripts, review each line independently
5. When in doubt, add `echo` prefix to preview what would execute

### 5. Organization-Level CLI Governance

**Recommended policies:**
- Establish an approved list of CLI use cases for your team
- Require CLI output review before execution in production environments
- Log CLI usage patterns for security audit (if your org requires it)
- Train team members on the difference between public and proprietary context
- Periodically review `gh copilot` shell history for accidental exposure

### 6. Common Gotchas

| Gotcha | Risk | Mitigation |
|--------|------|-----------|
| Piping `docker-compose.yml` with secrets | Credential exposure | Use `docker-compose.yml` without secret values |
| Asking about internal API endpoints | IP leakage | Replace with generic URLs |
| Pasting full stack traces | May contain internal paths | Sanitize paths and hostnames |
| Using in CI/CD scripts | May log prompts | Avoid Copilot CLI in automated pipelines |
| Explaining proprietary algorithms | IP exposure | Describe the pattern generically instead |

## Output Format

Present the guide in a clear, scannable format with:
- ✅ / ❌ indicators for safe vs unsafe patterns
- Concrete code examples for each scenario
- A quick-reference "Do / Don't" table at the end
