---
name: 'security-audit'
description: 'Audit the workspace for security risks: secrets exposure, dependency license violations, and internal reference leakage'
---

# Security Audit Skill

Audit the OctoCAT Supply Chain repository for security risks including hardcoded secrets, dependency license violations, and accidental exposure of internal/proprietary references.

## Scripts

| Script | Purpose | Usage |
|--------|---------|-------|
| `scan_secrets.py` | Detect hardcoded secrets using regex and entropy analysis | `python scan_secrets.py <directory>` |
| `check_dependencies_license.py` | Verify all dependencies have approved licenses | `python check_dependencies_license.py <project-root>` |
| `scan_internal_references.py` | Find internal URLs, hostnames, and proprietary terms | `python scan_internal_references.py <directory> [--blocklist blocklist.txt]` |

## Quick Usage

```powershell
# Scan for hardcoded secrets
python .github/skills/security-audit/scan_secrets.py .

# Check dependency licenses
python .github/skills/security-audit/check_dependencies_license.py .

# Scan for internal references (with optional custom blocklist)
python .github/skills/security-audit/scan_internal_references.py .
python .github/skills/security-audit/scan_internal_references.py . --blocklist my-blocklist.txt
```

## Customization

### Blocklist for Internal References

Create a `blocklist.txt` file with one pattern per line to scan for organization-specific terms:

```
# Internal hostnames
internal-api.corp.example.com
*.internal.example.com

# Project codenames
project-phoenix
operation-catapult

# Internal service names
billing-service-v2
auth-gateway-internal
```

### Approved Licenses

The `check_dependencies_license.py` script uses an allowlist of approved licenses. Modify the `APPROVED_LICENSES` constant in the script to match your organization's policy.

## Safety
- **Safe**: All scripts are read-only analysis — they never modify files
- **Output**: Plain text reports to stdout with severity ratings

## Related
- Agent: [Security-Guardian.agent.md](../../agents/Security-Guardian.agent.md)
- Prompt: [pre-commit-security-check.prompt.md](../../prompts/pre-commit-security-check.prompt.md)
- Instructions: [security.instructions.md](../../instructions/security.instructions.md)
