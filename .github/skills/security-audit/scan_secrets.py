"""Scan a directory for hardcoded secrets using regex patterns and entropy analysis."""

import math
import os
import re
import sys
from pathlib import Path
from typing import NamedTuple

# File extensions to scan
SCANNABLE_EXTENSIONS = {
    ".ts", ".tsx", ".js", ".jsx", ".py", ".json", ".yaml", ".yml",
    ".env", ".md", ".sh", ".bash", ".cfg", ".conf", ".ini", ".toml",
    ".xml", ".html", ".css", ".dockerfile",
}

# Files/directories to skip
SKIP_DIRS = {
    "node_modules", ".git", "dist", "build", "__pycache__",
    ".next", "coverage", ".nyc_output",
}

SKIP_FILES = {"package-lock.json", "yarn.lock", "pnpm-lock.yaml"}

# Secret patterns (name, regex, severity)
SECRET_PATTERNS: list[tuple[str, str, str]] = [
    ("AWS Access Key", r"AKIA[0-9A-Z]{16}", "CRITICAL"),
    ("AWS Secret Key", r"(?i)aws_secret_access_key\s*[=:]\s*['\"]?[A-Za-z0-9/+=]{40}", "CRITICAL"),
    ("GitHub PAT", r"ghp_[a-zA-Z0-9]{36}", "CRITICAL"),
    ("GitHub OAuth", r"gho_[a-zA-Z0-9]{36}", "CRITICAL"),
    ("OpenAI Key", r"sk-[a-zA-Z0-9]{48}", "CRITICAL"),
    ("Private Key", r"-----BEGIN\s*(RSA|EC|DSA|OPENSSH)?\s*PRIVATE KEY-----", "CRITICAL"),
    ("Generic Password", r"(?i)(password|passwd|pwd)\s*[=:]\s*['\"][^'\"]{4,}['\"]", "HIGH"),
    ("Generic Secret", r"(?i)(secret|api_key|apikey|access_token)\s*[=:]\s*['\"][^'\"]{4,}['\"]", "HIGH"),
    ("Generic Token", r"(?i)(token|auth_token|bearer)\s*[=:]\s*['\"][^'\"]{8,}['\"]", "HIGH"),
    ("Connection String", r"(?i)(mongodb|postgres|mysql|redis)://[^\s'\"]+:[^\s'\"]+@", "HIGH"),
    ("Bearer Token", r"Bearer\s+[A-Za-z0-9\-._~+/]+=*", "MEDIUM"),
    ("Base64 Encoded Secret", r"(?i)(secret|key|token|password)\s*[=:]\s*['\"]?[A-Za-z0-9+/]{40,}={0,2}['\"]?", "MEDIUM"),
]


class Finding(NamedTuple):
    """A single secret finding."""

    severity: str
    pattern_name: str
    file_path: str
    line_number: int
    snippet: str


def calculate_shannon_entropy(data: str) -> float:
    """Calculate Shannon entropy of a string."""
    if not data:
        return 0.0
    entropy = 0.0
    for char_count in [data.count(c) for c in set(data)]:
        probability = char_count / len(data)
        entropy -= probability * math.log2(probability)
    return entropy


def is_high_entropy(value: str, threshold: float = 4.5) -> bool:
    """Check if a string has suspiciously high entropy (likely a secret)."""
    if len(value) < 16:
        return False
    return calculate_shannon_entropy(value) > threshold


def should_scan_file(file_path: Path) -> bool:
    """Determine if a file should be scanned."""
    if file_path.name in SKIP_FILES:
        return False
    if file_path.suffix.lower() in SCANNABLE_EXTENSIONS:
        return True
    if file_path.name.startswith(".env"):
        return True
    return False


def scan_file(file_path: Path) -> list[Finding]:
    """Scan a single file for secret patterns."""
    findings: list[Finding] = []

    try:
        content = file_path.read_text(encoding="utf-8", errors="ignore")
    except (OSError, PermissionError):
        return findings

    lines = content.splitlines()

    for line_num, line in enumerate(lines, start=1):
        # Skip comment-only lines that are clearly documentation/examples
        stripped = line.strip()
        if stripped.startswith("#") and "example" in stripped.lower():
            continue
        if stripped.startswith("//") and "example" in stripped.lower():
            continue

        for pattern_name, regex, severity in SECRET_PATTERNS:
            matches = re.finditer(regex, line)
            for match in matches:
                # Truncate the snippet to avoid exposing actual secrets
                snippet = line.strip()[:80]
                if len(line.strip()) > 80:
                    snippet += "..."
                findings.append(Finding(
                    severity=severity,
                    pattern_name=pattern_name,
                    file_path=str(file_path),
                    line_number=line_num,
                    snippet=snippet,
                ))

    # Entropy-based detection for assignment-like patterns
    assignment_pattern = re.compile(
        r"(?i)(key|secret|token|password|credential|api_key)\s*[=:]\s*['\"]([^'\"]+)['\"]"
    )
    for line_num, line in enumerate(lines, start=1):
        for match in assignment_pattern.finditer(line):
            value = match.group(2)
            if is_high_entropy(value):
                snippet = line.strip()[:80]
                findings.append(Finding(
                    severity="HIGH",
                    pattern_name="High-Entropy Value",
                    file_path=str(file_path),
                    line_number=line_num,
                    snippet=snippet + ("..." if len(line.strip()) > 80 else ""),
                ))

    return findings


def scan_directory(directory: str) -> list[Finding]:
    """Recursively scan a directory for secrets."""
    findings: list[Finding] = []
    root_path = Path(directory).resolve()

    for dirpath, dirnames, filenames in os.walk(root_path):
        # Skip excluded directories
        dirnames[:] = [d for d in dirnames if d not in SKIP_DIRS]

        for filename in filenames:
            file_path = Path(dirpath) / filename
            if should_scan_file(file_path):
                findings.extend(scan_file(file_path))

    return findings


def print_report(findings: list[Finding]) -> None:
    """Print a formatted report of findings."""
    if not findings:
        print("✅ No secrets detected.")
        print("\nScanned successfully — no hardcoded secrets found.")
        return

    # Sort by severity
    severity_order = {"CRITICAL": 0, "HIGH": 1, "MEDIUM": 2, "LOW": 3}
    findings.sort(key=lambda f: severity_order.get(f.severity, 99))

    print(f"⚠️  Found {len(findings)} potential secret(s):\n")
    print(f"{'Severity':<10} {'Pattern':<25} {'File':<40} {'Line':<6} Snippet")
    print("-" * 120)

    for finding in findings:
        # Shorten file path for display
        short_path = finding.file_path
        if len(short_path) > 38:
            short_path = "..." + short_path[-35:]
        print(
            f"{finding.severity:<10} {finding.pattern_name:<25} "
            f"{short_path:<40} {finding.line_number:<6} {finding.snippet}"
        )

    # Summary
    critical_count = sum(1 for f in findings if f.severity == "CRITICAL")
    high_count = sum(1 for f in findings if f.severity == "HIGH")
    medium_count = sum(1 for f in findings if f.severity == "MEDIUM")

    print(f"\n{'='*60}")
    print(f"Summary: {critical_count} Critical | {high_count} High | {medium_count} Medium")
    if critical_count > 0:
        print("❌ CRITICAL secrets found — immediate remediation required!")
    elif high_count > 0:
        print("⚠️  High-severity findings — review and remediate before commit.")
    else:
        print("ℹ️  Medium findings — review for false positives.")


def main() -> None:
    """Entry point for the secret scanner."""
    if len(sys.argv) < 2:
        print("Usage: python scan_secrets.py <directory>")
        print("Example: python scan_secrets.py .")
        sys.exit(1)

    target_dir = sys.argv[1]
    if not os.path.isdir(target_dir):
        print(f"Error: '{target_dir}' is not a valid directory.")
        sys.exit(1)

    print(f"🔍 Scanning '{target_dir}' for hardcoded secrets...\n")
    findings = scan_directory(target_dir)
    print_report(findings)

    # Exit with non-zero if critical/high findings
    critical_or_high = [f for f in findings if f.severity in ("CRITICAL", "HIGH")]
    sys.exit(1 if critical_or_high else 0)


if __name__ == "__main__":
    main()
