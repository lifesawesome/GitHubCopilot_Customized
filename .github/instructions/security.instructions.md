---
applyTo: '**/*'
---

# Security & IP Protection Instructions

These rules apply globally to **all files** in this repository. They ensure GitHub Copilot does not inadvertently expose proprietary information, introduce security vulnerabilities, or bypass organizational governance.

---

## 1. Secrets & Credentials

- **Never** hardcode API keys, tokens, passwords, connection strings, or certificates in source code
- Use environment variables or a secrets manager for all sensitive configuration
- Never log secrets — even partially (e.g., `token.substring(0, 5)` is still a leak)
- If you detect a hardcoded secret in existing code, flag it immediately and suggest remediation

## 2. Internal References & IP Leakage

- **Never** include internal hostnames, IP addresses, or private URLs in code, comments, or documentation
- Do not reference proprietary system names, internal project codenames, or architecture details that are not public
- Do not embed internal org chart info, employee names, or team identifiers in code comments
- Sanitize all example data — use generic placeholders, not real internal values

### Internal Terms Blocklist (Customize Per Organization)

> **Configure this list** with your organization's internal terms that should never appear in code:

```
# Example blocklist — replace with your organization's terms:
# internal-api.corp.example.com
# project-codename-phoenix
# internal-service-mesh.local
# *.internal.example.com
# ACME-SECRET-*
```

If any of these terms appear in generated code, flag immediately and replace with safe alternatives.

## 3. Logging & Observability

- Never log PII (names, emails, phone numbers, addresses, SSNs, credit card numbers)
- Never log authentication tokens, session IDs, or cookies at INFO level or above
- Sanitize request/response bodies before logging — redact sensitive fields
- Use structured logging with explicit field allowlists, not full object dumps

## 4. GitHub Copilot CLI Safety (`gh copilot explain/suggest`)

- **Never pipe sensitive files** into Copilot CLI: `.env`, `secrets.yaml`, private keys, credentials files
- **Never pipe proprietary source code** from restricted repos into Copilot CLI explain
- Scope CLI queries to the minimum context needed — don't paste entire files when a snippet suffices
- Review all CLI suggestions before executing — especially destructive commands (`rm`, `DROP`, `DELETE`)
- Do not use Copilot CLI to generate infrastructure credentials or access tokens

## 5. Copilot Coding Agent Guardrails

- **Never auto-merge** agent-generated PRs — always require human review
- Review agent PRs for:
  - Unintended scope creep (changes to files not relevant to the task)
  - Introduction of unapproved dependencies
  - Accidental exposure of internal architecture in comments/docs
  - Test coverage — agent should not reduce existing coverage
  - License compatibility of any new code patterns
- Agent-generated code must pass the same security review as human-written code
- If an agent PR modifies security-sensitive files (auth, CORS, env config), require additional reviewer

## 6. Dependency Governance

- Do not add dependencies without verifying:
  - License compatibility (MIT, Apache 2.0, BSD are generally safe; GPL/AGPL require legal review)
  - No known critical vulnerabilities (`npm audit`, `pip audit`, Dependabot)
  - Active maintenance (last commit within 12 months, no archived repos)
  - Appropriate scope (no kitchen-sink libraries for a single utility function)
- Pin dependency versions — avoid `*` or `latest` in package.json/requirements.txt
- Prefer well-known, widely-adopted packages over obscure alternatives

## 7. Code Boundaries & Data Isolation

- Do not copy proprietary patterns, algorithms, or business logic into public repositories
- Do not reference code from repositories you don't have license to use
- Ensure generated code does not replicate significant portions of copyrighted material
- Keep test fixtures and seed data generic — never use real customer data, even "anonymized"
- Environment-specific configuration (dev/staging/prod) must never leak between environments

## 8. Secure Coding Patterns

- Validate all input at system boundaries (API endpoints, CLI args, file uploads)
- Use parameterized queries — never string-concatenate user input into queries
- Encode output contextually (HTML encode for HTML, URL encode for URLs)
- Set restrictive CORS policies — never use `origin: '*'` in production
- Apply principle of least privilege for all service accounts and API scopes
- Use HTTPS for all external communication — never downgrade to HTTP

## 9. Review Checklist (Before Every Commit)

- [ ] No hardcoded secrets, tokens, or credentials
- [ ] No internal hostnames, URLs, or proprietary terms in code/comments
- [ ] No PII in logs, seed data, or test fixtures
- [ ] All new dependencies are license-compatible and vulnerability-free
- [ ] Agent-generated code has been manually reviewed
- [ ] CORS, auth, and security headers are correctly configured
- [ ] Error messages don't expose internal architecture or stack traces to end users
