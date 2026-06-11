# Lesson 3: Secure Usage of GitHub Copilot

## Overview

| Aspect | Detail |
|--------|--------|
| **Duration** | 60 minutes (35 min instruction + 25 min hands-on) |
| **Level** | Intermediate |
| **Prerequisites** | Lesson 2 completed (understands customization files) |
| **Outcome** | Configure and use security governance for Copilot in an enterprise environment |

---

## Why This Matters

GitHub Copilot is a powerful tool — but in enterprise environments, ungoverned usage can lead to:

- **Secrets exposure** — Copilot suggestions may include hardcoded credentials if examples exist in context
- **IP leakage** — Internal hostnames, architecture details, or proprietary patterns can end up in code comments
- **Unsafe CLI usage** — Piping sensitive files into `gh copilot explain` sends content to the model
- **Agent scope creep** — Copilot coding agent may modify files it shouldn't or introduce unapproved dependencies
- **License violations** — Generated code may pull in dependencies with incompatible licenses

This lesson shows how to use Copilot's customization system to **enforce security policies automatically** — so developers get guardrails without friction.

---

## 1. The Security Customization Stack

We use four types of customization to create layered security governance:

```
┌─────────────────────────────────────────────────────────────────┐
│  security.instructions.md (applyTo: **/*) — ALWAYS ACTIVE       │
│  → Copilot follows these rules in EVERY interaction             │
│  → No secrets, no internal refs, no PII in logs                 │
├─────────────────────────────────────────────────────────────────┤
│  @Security Guardian (agent) — ON DEMAND                         │
│  → Comprehensive security review when explicitly invoked        │
│  → Structured compliance report with severity ratings           │
├─────────────────────────────────────────────────────────────────┤
│  Prompts (ask/agent mode) — ON DEMAND                           │
│  → cli-safety-guide: Safe Copilot CLI patterns                  │
│  → pre-commit-security-check: Pre-commit gate                   │
│  → security-review-agent-output: Review agent PRs               │
│  → copilot-agent-review-checklist: Full agent PR review         │
├─────────────────────────────────────────────────────────────────┤
│  security-audit (skill) — AUTOMATED SCRIPTS                     │
│  → scan_secrets.py: Regex + entropy secret detection            │
│  → check_dependencies_license.py: License compliance            │
│  → scan_internal_references.py: Internal URL/hostname finder    │
└─────────────────────────────────────────────────────────────────┘
```

### Key Principle: Layered Defense

| Layer | Type | When Active | Developer Friction |
|-------|------|-------------|-------------------|
| Instructions | Always-on guardrails | Every Copilot interaction | Zero — invisible |
| Agent | On-demand deep review | When `@Security Guardian` is invoked | Low — one command |
| Prompts | Task-specific checks | When developer runs a prompt | Low — explicit action |
| Skill scripts | CI/CD or manual audit | When scripts are executed | Medium — requires terminal |

---

## 2. Global Security Instructions

**File**: `.github/instructions/security.instructions.md`  
**Scope**: `applyTo: '**/*'` — applies to every file in the repository

This is the most powerful governance mechanism because it's **always active** without developer action.

### What It Enforces

| Category | Rule | Example Violation |
|----------|------|------------------|
| Secrets | Never hardcode tokens/keys | `const API_KEY = "sk-..."` |
| IP Protection | No internal hostnames in code | `// calls internal-api.corp.example.com` |
| Logging | No PII in log output | `console.log(user.email, user.ssn)` |
| CLI Safety | Don't pipe secrets into CLI | `cat .env \| gh copilot explain` |
| Agent PRs | Always require human review | Auto-merging agent PRs |
| Dependencies | Verify licenses before adding | Adding a GPL library to an MIT project |

### Configurable Blocklist

Organizations customize the internal terms blocklist with their own patterns:

```
# Example — replace with your organization's terms:
internal-api.corp.example.com
project-codename-phoenix
*.internal.example.com
```

### Demo: Instruction in Action

1. Open any file in the repo — the security instruction is active
2. In Edit mode, ask Copilot to add a configuration constant
3. Observe: Copilot suggests using environment variables, not hardcoded values
4. Try asking Copilot to add a comment with an internal URL — it should avoid generating one

> **Try it now:** Open `api/src/routes/order.ts` and ask Copilot:
> ```
> add the API key value
> ```
> Copilot should refuse to hardcode the value and instead suggest reading it from an environment variable, demonstrating the security instruction in action.

---

## 3. Security Guardian Agent

**File**: `.github/agents/Security-Guardian.agent.md`  
**Invocation**: `@Security Guardian` in Copilot Chat

A specialized agent persona that performs comprehensive security reviews with structured output.

### What It Reviews

1. **Secrets & Credentials** — Hardcoded tokens, API keys, connection strings
2. **IP Leakage** — Internal URLs, proprietary terms, architecture details in comments
3. **Dependency Governance** — License violations, vulnerable packages, unmaintained deps
4. **Secure Coding** — Injection, XSS, CORS misconfig, auth bypass
5. **Logging & PII** — Sensitive data in logs, full object dumps
6. **Agent Output Safety** — Scope creep, security-sensitive file modifications

### Output Format

The agent produces a structured compliance report:

```markdown
## Security Review: {target}

### Summary
- Overall: ✅ Pass / ⚠️ Issues Found / ❌ Critical Violations
- Secrets: ✅
- IP Leakage: ⚠️
- Dependencies: ✅

### Findings
| Severity | Category | Finding | Location | Remediation |
|----------|----------|---------|----------|-------------|
| 🔴 Critical | ... | ... | ... | ... |
```

### Demo: Security Guardian

```
@Security Guardian Review #file:api/src/routes/product.ts for security compliance
```

---

## 4. Security Prompts

### 4.1 CLI Safety Guide (`cli-safety-guide`)

**Mode**: ask  
**Purpose**: Educational — teaches developers safe Copilot CLI patterns

| Safe ✅ | Unsafe ❌ |
|---------|----------|
| Generic programming questions | Piping `.env` files |
| Public tool documentation | Piping proprietary source code |
| Sanitized error messages | Full log files with tokens |
| Open-source patterns | Internal URLs in queries |

### 4.2 Pre-Commit Security Check (`pre-commit-security-check`)

**Mode**: ask  
**Purpose**: Lightweight security gate before committing

Checks for:
- Hardcoded secrets (API keys, tokens, passwords)
- Internal references (hostnames, private IPs, project codenames)
- PII in code/data
- Unsafe patterns (`eval()`, `dangerouslySetInnerHTML`, CORS `*`)

### 4.3 Agent Output Review (`security-review-agent-output`)

**Mode**: agent  
**Purpose**: Review Copilot coding agent PRs before merge

Checks for:
- Secrets or credentials in generated code
- IP leakage in comments/docs
- Unapproved dependencies (license + vulnerability)
- Scope creep (files changed beyond the task)
- Security-sensitive file modifications

### 4.4 Agent PR Review Checklist (`copilot-agent-review-checklist`)

**Mode**: ask  
**Purpose**: Comprehensive quality + security review for any agent PR

Goes beyond security to cover:
- Code quality and conventions
- Test coverage
- Documentation completeness
- Performance considerations
- Common agent gotchas (hallucinated APIs, over-abstraction, placeholder code)

---

## 5. Security Audit Skill (Automated Scripts)

**Location**: `.github/skills/security-audit/`

Three Python scripts that can be run in CI/CD or manually:

### 5.1 Secret Scanner (`scan_secrets.py`)

```powershell
python .github/skills/security-audit/scan_secrets.py .
```

- Regex patterns for AWS keys, GitHub PATs, OpenAI keys, private keys, generic passwords
- Shannon entropy analysis to detect high-entropy strings (likely secrets)
- Severity classification: CRITICAL / HIGH / MEDIUM
- Skips node_modules, .git, build directories

### 5.2 License Checker (`check_dependencies_license.py`)

```powershell
python .github/skills/security-audit/check_dependencies_license.py .
```

- Reads `package.json` dependencies and checks license fields in `node_modules`
- Approved licenses: MIT, ISC, Apache-2.0, BSD-2-Clause, BSD-3-Clause, etc.
- Flags copyleft licenses (GPL, AGPL, LGPL) as requiring legal review
- Supports npm workspaces

### 5.3 Internal Reference Scanner (`scan_internal_references.py`)

```powershell
python .github/skills/security-audit/scan_internal_references.py .
python .github/skills/security-audit/scan_internal_references.py . --blocklist blocklist.txt
```

- Built-in patterns: `.internal.`, `.corp.`, `.local`, private IP ranges
- Custom blocklist support: one term per line
- Allowlists common development patterns (localhost, 127.0.0.1, example.com)

---

## 6. Putting It All Together: Security Workflow

### Developer Day-to-Day (Zero Friction)

```
Developer writes code
  → security.instructions.md is ALWAYS active
  → Copilot automatically avoids secrets, internal refs, unsafe patterns
  → No action needed — governance is invisible
```

### Before Committing (Low Friction)

```
Developer is ready to commit
  → Runs "pre-commit-security-check" prompt
  → Reviews output for any flagged items
  → Fixes issues before committing
```

### Reviewing Agent PRs (Required Action)

```
Copilot coding agent creates a PR
  → Run "security-review-agent-output" prompt
  → Run "copilot-agent-review-checklist" prompt
  → Review findings before approving
  → NEVER auto-merge agent PRs
```

### Periodic Audits (Scheduled)

```
Weekly/sprint-based
  → Run scan_secrets.py in CI/CD
  → Run check_dependencies_license.py
  → Run scan_internal_references.py
  → Address any findings
```

---

## 7. Common Gotchas & What to Avoid

| Gotcha | Risk | Prevention |
|--------|------|-----------|
| Piping `.env` into `gh copilot explain` | Credentials sent to model | Use `cli-safety-guide` prompt, train team |
| Auto-merging agent PRs | Unapproved code in production | Always require human review |
| Copilot suggesting internal URLs from context | IP leakage | `security.instructions.md` blocklist |
| Agent adding GPL dependencies | License violation | `check_dependencies_license.py` in CI |
| Hardcoded tokens in test fixtures | Secrets in source control | `scan_secrets.py` pre-commit hook |
| `console.log(user)` in routes | PII in production logs | Security instruction + review |
| Agent modifying CORS/auth files | Security weakening | `security-review-agent-output` prompt |

---

## Summary

| Artifact | Type | Purpose | When Used |
|----------|------|---------|-----------|
| `security.instructions.md` | Instruction | Global security rules | Always (every interaction) |
| `@Security Guardian` | Agent | Deep security review | On demand |
| `cli-safety-guide` | Prompt (ask) | Safe CLI usage education | Before CLI use |
| `pre-commit-security-check` | Prompt (ask) | Pre-commit gate | Before every commit |
| `security-review-agent-output` | Prompt (agent) | Agent PR review | Before merging agent PRs |
| `copilot-agent-review-checklist` | Prompt (ask) | Full agent PR checklist | Before merging agent PRs |
| `scan_secrets.py` | Skill script | Secret detection | CI/CD + manual |
| `check_dependencies_license.py` | Skill script | License compliance | CI/CD + manual |
| `scan_internal_references.py` | Skill script | Internal ref detection | CI/CD + manual |

---

## Next Steps

- [Hands-on Exercises](hands-on-exercises.md) — Practice using security governance tools
- [Lesson 4: Copilot CLI](../04-copilot-cli/readme.md) — Terminal-based AI assistance (with safety!)
