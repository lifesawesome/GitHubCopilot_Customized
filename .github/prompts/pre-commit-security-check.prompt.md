---
name: 'pre-commit-security-check'
description: 'Pre-commit checklist to verify no secrets, IP leakage, or security violations in staged changes'
mode: 'ask'
---

# Pre-Commit Security Check

Analyze the currently staged changes (or specified files) for security violations before committing. This is a lightweight security gate that catches common mistakes.

## Check These Categories

### 1. Hardcoded Secrets (🔴 Block commit if found)
Scan for patterns matching:
- API keys: `AKIA...`, `sk-...`, `ghp_...`, `Bearer ...`
- Passwords: `password = "..."`, `pwd: ...`, `passwd`
- Connection strings: `mongodb://user:pass@`, `postgres://`, `mysql://`
- Private keys: `-----BEGIN.*PRIVATE KEY-----`
- Tokens: `token = "..."`, `secret = "..."`, `apiKey = "..."`
- AWS/Azure/GCP credentials

### 2. Internal References (🔴 Block commit if found)
Scan for:
- Internal hostnames: `*.internal.*`, `*.corp.*`, `*.local` (non-localhost)
- Private IP ranges in non-example context: `10.x.x.x`, `172.16-31.x.x`, `192.168.x.x`
- Organization-specific terms from the blocklist (see security.instructions.md)
- Internal project codenames or system names

### 3. PII in Code/Data (🟠 Warn)
Scan for:
- Email addresses (real, non-example domains)
- Phone numbers
- Physical addresses
- Social security numbers / national IDs
- Credit card number patterns

### 4. Unsafe Patterns (🟡 Warn)
- `console.log` with variables that might contain sensitive data
- `dangerouslySetInnerHTML` with user-supplied content
- `eval()` or `new Function()` with dynamic input
- CORS set to `*` or `origin: true`
- Disabled TypeScript checks (`// @ts-ignore`, `as any`) hiding security issues
- `--no-verify` flags in scripts

### 5. Configuration Safety (🟡 Warn)
- `.env` files being committed (should be in `.gitignore`)
- Secrets in `docker-compose.yml`, `Dockerfile`, or CI config
- Overly permissive file permissions in scripts

## Output Format

```markdown
## Pre-Commit Security Check

**Files Scanned**: {count}
**Verdict**: ✅ Clear to commit / ⚠️ Warnings (review needed) / ❌ BLOCKED (fix required)

### 🔴 Blockers (must fix before commit)
| # | File | Line | Finding | Fix |
|---|------|------|---------|-----|
| 1 | ... | ... | ... | ... |

### 🟠 Warnings (should fix)
| # | File | Line | Finding | Fix |
|---|------|------|---------|-----|
| 1 | ... | ... | ... | ... |

### 🟡 Info (consider fixing)
| # | File | Line | Finding | Fix |
|---|------|------|---------|-----|
| 1 | ... | ... | ... | ... |

### ✅ Passed Checks
- [ ] No hardcoded secrets
- [ ] No internal references
- [ ] No PII in code/data
- [ ] No unsafe patterns
- [ ] Configuration files are clean
```

## Usage

Run this prompt before committing, especially when:
- You've written new code with configuration values
- You're adding test fixtures or seed data
- You've modified environment handling or auth code
- You're about to push to a shared/public branch
- You've used Copilot agent to generate code (always review agent output!)
