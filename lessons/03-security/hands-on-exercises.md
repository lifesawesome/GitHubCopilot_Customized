# Lesson 3: Hands-On Exercises — Secure Usage of GitHub Copilot

## Exercise Overview

| # | Exercise | Focus | Duration |
|---|----------|-------|----------|
| 1 | Explore the Security Instruction | Always-on governance | 5 min |
| 2 | Use the Security Guardian Agent | Deep security review | 5 min |
| 3 | Run Pre-Commit Security Check | Pre-commit gate | 5 min |
| 4 | Run Security Audit Scripts | Automated scanning | 5 min |
| 5 | Copilot CLI Safety | Safe vs unsafe patterns | 5 min |
| 6 | Review an Agent PR for Security | Agent output review | 5 min |

---

## Exercise 1: Explore the Security Instruction

**Goal**: Understand how always-active security instructions govern Copilot behavior.

1. Open `.github/instructions/security.instructions.md`
2. Note the `applyTo: '**/*'` — this means it applies to **every file** you edit
3. Read through each section — identify the 7 categories of security rules

### Test It

4. Open `api/src/routes/product.ts` in the editor
5. In **Edit** mode, ask:
   ```
   Add a configuration constant for the external payment API endpoint
   ```
6. Observe: Copilot should suggest using an environment variable (e.g., `process.env.PAYMENT_API_URL`) rather than a hardcoded URL — because the security instruction prohibits hardcoded URLs/secrets

7. Now try asking:
   ```
   Add a comment explaining which internal service this route connects to
   ```
8. Observe: Copilot avoids generating internal hostnames or proprietary system names

<details>
<summary>✅ Success Criteria</summary>

- Copilot uses `process.env.*` for configuration, not hardcoded values
- Copilot avoids internal hostnames/URLs in comments
- You didn't have to explicitly ask for security — the instruction handles it automatically
- You understand that `applyTo: '**/*'` = global enforcement with zero developer friction

</details>

---

## Exercise 2: Use the Security Guardian Agent

**Goal**: Perform a comprehensive security review using the custom agent.

1. Open Copilot Chat
2. Select **Security Guardian** from the agent picker (model selector at bottom)
3. Ask:
   ```
   Review #file:api/src/routes/supplier.ts for security compliance
   ```
4. Read the structured compliance report — note the categories and severity ratings

5. Now ask a broader question:
   ```
   Are there any hardcoded secrets or internal references in the api/src/ directory?
   ```

6. Compare the output format with the generic `@workspace` response:
   - Security Guardian: Structured table with severity, category, remediation
   - Generic: Unstructured prose

<details>
<summary>✅ Success Criteria</summary>

- Agent produces a structured compliance report (not generic prose)
- Report includes severity ratings (🔴/🟠/🟡/🔵)
- Report covers multiple categories: secrets, IP leakage, secure coding, dependencies
- Each finding includes a remediation step
- Agent correctly identifies any actual issues in the route file

</details>

---

## Exercise 3: Run Pre-Commit Security Check

**Goal**: Use the pre-commit prompt to catch security issues before committing.

### Part A: Clean scan

1. Open Command Palette → **Prompts: Run Prompt → pre-commit-security-check**
2. Review the output — the codebase should be relatively clean

### Part B: Intentionally introduce a violation

3. Open `api/src/routes/product.ts` and add this line at the top (temporarily):
   ```typescript
   const DB_PASSWORD = "SuperSecret123!";
   ```

4. Run the prompt again: Command Palette → **Prompts: Run Prompt → pre-commit-security-check**
5. Observe: The prompt catches the hardcoded password as a 🔴 blocker

### Part C: Try IP leakage

6. Add another line:
   ```typescript
   // Connects to billing-service.internal.corp.example.com for payment processing
   ```

7. Run the prompt one more time
8. Observe: It catches the internal hostname reference

9. **Remove both test lines!** (Don't commit them)

<details>
<summary>✅ Success Criteria</summary>

- Clean codebase produces a ✅ "Clear to commit" result
- Hardcoded password is caught as 🔴 Critical / Blocker
- Internal hostname in comment is caught as 🔴/🟠
- You understand this is a manual check — the developer chooses to run it before committing
- You removed the test violations (check your file!)

</details>

---

## Exercise 4: Run Security Audit Scripts

**Goal**: Execute the automated security audit scripts and interpret their output.

### 4.1 Scan for Secrets

```powershell
python .github/skills/security-audit/scan_secrets.py .
```

- Expected: ✅ No secrets detected (clean codebase)
- If any findings appear, investigate whether they're false positives

### 4.2 Check Dependency Licenses

```powershell
python .github/skills/security-audit/check_dependencies_license.py .
```

- Expected: Report showing all npm dependencies and their license status
- Look for any HIGH severity findings (copyleft licenses)
- Verify your project's dependencies are all MIT/Apache/BSD

### 4.3 Scan for Internal References

```powershell
python .github/skills/security-audit/scan_internal_references.py .
```

- Expected: ✅ No internal references (or only findings in the security instruction file itself which uses examples)
- Try with a custom blocklist:

```powershell
# Create a temporary blocklist
echo "octocat-internal" > temp-blocklist.txt
echo "*.secret-service.local" >> temp-blocklist.txt

# Scan with custom blocklist
python .github/skills/security-audit/scan_internal_references.py . --blocklist temp-blocklist.txt

# Clean up
Remove-Item temp-blocklist.txt
```

<details>
<summary>✅ Success Criteria</summary>

- All three scripts run successfully without Python errors
- You can read and interpret the output format (severity table, summary)
- You understand how the scripts could be integrated into CI/CD
- You know how to customize the blocklist for your organization
- Exit codes: 0 = pass, 1 = critical/high findings

</details>

---

## Exercise 5: Copilot CLI Safety

**Goal**: Understand what is safe vs unsafe to use with `gh copilot explain/suggest`.

### Part A: Read the safety guide

1. Open Command Palette → **Prompts: Run Prompt → cli-safety-guide**
2. Read through the output — note the ✅ Safe vs ❌ Unsafe categories

### Part B: Practice safe CLI usage

3. In the terminal, try a **safe** query:
   ```powershell
   gh copilot explain "What does express-rate-limit middleware do?"
   ```

4. Now consider these scenarios — which are safe? (Don't actually run the unsafe ones!)

   | Scenario | Safe? | Why? |
   |----------|-------|------|
   | `gh copilot explain "How to add CORS to Express?"` | ✅ | Generic, public knowledge |
   | `cat .env \| gh copilot explain` | ❌ | Exposes secrets to model |
   | `gh copilot suggest "Write a Dockerfile for Node 20"` | ✅ | Generic, no proprietary info |
   | `cat api/src/routes/product.ts \| gh copilot explain` | ⚠️ | OK for this demo repo; risky for proprietary code |
   | `gh copilot explain "$(cat ~/.ssh/id_rsa)"` | ❌ | Exposes private key! |

### Part C: The scoping principle

5. Instead of piping an entire file, practice extracting minimal context:

   ```powershell
   # ❌ Bad: Full file
   # cat api/src/index.ts | gh copilot explain

   # ✅ Good: Specific question about a pattern
   gh copilot explain "Why would express cors() middleware need an origin allowlist array?"
   ```

<details>
<summary>✅ Success Criteria</summary>

- You can distinguish safe from unsafe CLI inputs
- You understand the principle of minimum context
- You know to never pipe `.env`, private keys, or proprietary source
- You know to always review `gh copilot suggest` output before executing

</details>

---

## Exercise 6: Review an Agent PR for Security

**Goal**: Practice the workflow for reviewing Copilot coding agent output.

### Scenario

Imagine the Copilot coding agent just created a PR that adds a new "suppliers" endpoint. You need to review it for security compliance.

### Part A: Use the agent output review prompt

1. Open `api/src/routes/supplier.ts` as context
2. Open Command Palette → **Prompts: Run Prompt → security-review-agent-output**
3. Review the structured output:
   - Does it check for secrets?
   - Does it check for scope creep?
   - Does it list new dependencies?
   - Does it flag security-sensitive changes?

### Part B: Use the comprehensive checklist

4. Open Command Palette → **Prompts: Run Prompt → copilot-agent-review-checklist**
5. Review the broader checklist — note it covers:
   - Scope & intent
   - Code quality
   - Security
   - Testing
   - Documentation
   - Performance
   - Agent-specific gotchas

### Part C: Know the common gotchas

6. Review this table of common agent mistakes:

   | Agent Gotcha | How to Spot | Risk |
   |-------------|-------------|------|
   | Adds `console.log` with sensitive data | Search for `console.log` in diff | PII/secrets in prod logs |
   | Installs GPL dependency | Check new deps in package.json | License violation |
   | Sets CORS to `*` | Check cors() config | Security weakening |
   | Hardcodes URLs | Search for `http://` or `https://` | Environment leakage |
   | Removes error handling | Missing try/catch or status checks | Silent failures |
   | Creates but doesn't register routes | Route file exists but not in index.ts | Dead code |

<details>
<summary>✅ Success Criteria</summary>

- You know the two-prompt workflow: `security-review-agent-output` + `copilot-agent-review-checklist`
- You can identify the key review categories
- You understand why agent PRs should NEVER be auto-merged
- You can spot common agent gotchas in a diff
- You know when to request an additional reviewer (security-sensitive file changes)

</details>

---

## Bonus: Create a CI/CD Security Gate

Create a GitHub Actions workflow that runs the security audit scripts on every PR:

```yaml
# .github/workflows/security-audit.yml
name: Security Audit
on: [pull_request]
jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: '3.12'
      - name: Scan for secrets
        run: python .github/skills/security-audit/scan_secrets.py .
      - name: Check dependency licenses
        run: python .github/skills/security-audit/check_dependencies_license.py .
      - name: Scan for internal references
        run: python .github/skills/security-audit/scan_internal_references.py .
```

This ensures every PR (including agent-generated ones) passes automated security checks.

---

## Summary

In this lesson you:
- ✅ Explored always-active security instructions (`applyTo: '**/*'`)
- ✅ Used the Security Guardian agent for deep compliance review
- ✅ Ran pre-commit security checks to catch issues before committing
- ✅ Executed automated audit scripts (secrets, licenses, internal refs)
- ✅ Learned safe vs unsafe Copilot CLI patterns
- ✅ Practiced the agent PR review workflow

### Key Takeaways

1. **Instructions = invisible governance** — developers get guardrails without extra work
2. **Prompts = explicit checks** — run before committing or merging
3. **Agent = deep review** — use for comprehensive security audits
4. **Scripts = automation** — integrate into CI/CD for mandatory checks
5. **Never auto-merge agent PRs** — always require human security review
6. **Minimum context for CLI** — don't pipe proprietary code or secrets

**Next**: [Lesson 4 — Copilot CLI](../04-copilot-cli/readme.md)
