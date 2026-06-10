"""Scan a directory for internal references, proprietary terms, and private URLs."""

import argparse
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

# Built-in patterns for internal references
BUILTIN_PATTERNS: list[tuple[str, str, str]] = [
    # Internal hostnames
    ("Internal Hostname (.internal.)", r"[a-zA-Z0-9\-]+\.internal\.[a-zA-Z0-9\.\-]+", "HIGH"),
    ("Corporate Hostname (.corp.)", r"[a-zA-Z0-9\-]+\.corp\.[a-zA-Z0-9\.\-]+", "HIGH"),
    ("Local Service (.local)", r"[a-zA-Z0-9\-]+\.local(?!\host)", "MEDIUM"),

    # Private IP ranges (excluding common dev patterns like 127.0.0.1, 0.0.0.0)
    ("Private IP (10.x.x.x)", r"(?<![\d.])10\.\d{1,3}\.\d{1,3}\.\d{1,3}(?![\d.])", "MEDIUM"),
    ("Private IP (172.16-31.x.x)", r"(?<![\d.])172\.(1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3}(?![\d.])", "MEDIUM"),
    ("Private IP (192.168.x.x)", r"(?<![\d.])192\.168\.\d{1,3}\.\d{1,3}(?![\d.])", "LOW"),

    # Internal URL patterns
    ("Internal API URL", r"https?://[a-zA-Z0-9\-]*(internal|corp|private|intranet)[a-zA-Z0-9\-\.]*", "HIGH"),
    ("VPN/Tunnel URL", r"https?://[a-zA-Z0-9\-]*(vpn|tunnel|bastion)[a-zA-Z0-9\-\.]*", "MEDIUM"),
]

# Allowlisted patterns (false positives to ignore)
ALLOWLIST_PATTERNS = [
    r"localhost",
    r"127\.0\.0\.1",
    r"0\.0\.0\.0",
    r"example\.com",
    r"example\.org",
    r"test\.com",
    r"placeholder",
    r"your-.*-here",
]


class Finding(NamedTuple):
    """A single internal reference finding."""

    severity: str
    pattern_name: str
    file_path: str
    line_number: int
    matched_text: str


def load_blocklist(blocklist_path: str | None) -> list[tuple[str, str, str]]:
    """Load custom blocklist patterns from a file."""
    if blocklist_path is None or not os.path.isfile(blocklist_path):
        return []

    patterns: list[tuple[str, str, str]] = []
    try:
        lines = Path(blocklist_path).read_text(encoding="utf-8").splitlines()
    except OSError:
        return []

    for line in lines:
        line = line.strip()
        if not line or line.startswith("#"):
            continue
        # Escape the line as a literal pattern for regex matching
        escaped = re.escape(line)
        # Replace escaped wildcards back to regex wildcards
        escaped = escaped.replace(r"\*", r"[a-zA-Z0-9\-\.]*")
        patterns.append((f"Blocklist: {line}", escaped, "HIGH"))

    return patterns


def is_allowlisted(text: str) -> bool:
    """Check if matched text is in the allowlist (likely a false positive)."""
    for pattern in ALLOWLIST_PATTERNS:
        if re.search(pattern, text, re.IGNORECASE):
            return True
    return False


def should_scan_file(file_path: Path) -> bool:
    """Determine if a file should be scanned."""
    if file_path.name in SKIP_FILES:
        return False
    if file_path.suffix.lower() in SCANNABLE_EXTENSIONS:
        return True
    if file_path.name.startswith(".env"):
        return True
    return False


def scan_file(
    file_path: Path,
    patterns: list[tuple[str, str, str]],
) -> list[Finding]:
    """Scan a single file for internal reference patterns."""
    findings: list[Finding] = []

    try:
        content = file_path.read_text(encoding="utf-8", errors="ignore")
    except (OSError, PermissionError):
        return findings

    lines = content.splitlines()

    for line_num, line in enumerate(lines, start=1):
        # Skip comment lines that are clearly documentation/examples
        stripped = line.strip()
        if stripped.startswith("#") and any(
            kw in stripped.lower() for kw in ("example", "placeholder", "customize")
        ):
            continue

        for pattern_name, regex, severity in patterns:
            for match in re.finditer(regex, line, re.IGNORECASE):
                matched_text = match.group(0)
                if not is_allowlisted(matched_text):
                    findings.append(Finding(
                        severity=severity,
                        pattern_name=pattern_name,
                        file_path=str(file_path),
                        line_number=line_num,
                        matched_text=matched_text,
                    ))

    return findings


def scan_directory(
    directory: str,
    patterns: list[tuple[str, str, str]],
) -> list[Finding]:
    """Recursively scan a directory for internal references."""
    findings: list[Finding] = []
    root_path = Path(directory).resolve()

    for dirpath, dirnames, filenames in os.walk(root_path):
        dirnames[:] = [d for d in dirnames if d not in SKIP_DIRS]

        for filename in filenames:
            file_path = Path(dirpath) / filename
            if should_scan_file(file_path):
                findings.extend(scan_file(file_path, patterns))

    return findings


def print_report(findings: list[Finding]) -> None:
    """Print a formatted report of findings."""
    if not findings:
        print("✅ No internal references or proprietary terms detected.")
        return

    severity_order = {"CRITICAL": 0, "HIGH": 1, "MEDIUM": 2, "LOW": 3}
    findings.sort(key=lambda f: severity_order.get(f.severity, 99))

    # Deduplicate by (file, line, matched_text)
    seen: set[tuple[str, int, str]] = set()
    unique_findings: list[Finding] = []
    for finding in findings:
        key = (finding.file_path, finding.line_number, finding.matched_text)
        if key not in seen:
            seen.add(key)
            unique_findings.append(finding)

    print(f"⚠️  Found {len(unique_findings)} internal reference(s):\n")
    print(f"{'Severity':<9} {'Pattern':<35} {'File':<40} {'Line':<6} Match")
    print("-" * 120)

    for finding in unique_findings:
        short_path = finding.file_path
        if len(short_path) > 38:
            short_path = "..." + short_path[-35:]
        print(
            f"{finding.severity:<9} {finding.pattern_name:<35} "
            f"{short_path:<40} {finding.line_number:<6} {finding.matched_text}"
        )

    high_count = sum(1 for f in unique_findings if f.severity == "HIGH")
    medium_count = sum(1 for f in unique_findings if f.severity == "MEDIUM")

    print(f"\n{'='*60}")
    print(f"Summary: {high_count} High | {medium_count} Medium | {len(unique_findings) - high_count - medium_count} Low")

    if high_count > 0:
        print("❌ Internal references found — replace with safe alternatives before commit!")
    else:
        print("ℹ️  Review findings for false positives.")


def main() -> None:
    """Entry point for the internal reference scanner."""
    parser = argparse.ArgumentParser(
        description="Scan for internal references and proprietary terms"
    )
    parser.add_argument("directory", help="Directory to scan")
    parser.add_argument(
        "--blocklist",
        help="Path to a custom blocklist file (one term per line)",
        default=None,
    )
    args = parser.parse_args()

    if not os.path.isdir(args.directory):
        print(f"Error: '{args.directory}' is not a valid directory.")
        sys.exit(1)

    # Combine built-in patterns with custom blocklist
    all_patterns = list(BUILTIN_PATTERNS)
    if args.blocklist:
        custom_patterns = load_blocklist(args.blocklist)
        all_patterns.extend(custom_patterns)
        print(f"📋 Loaded {len(custom_patterns)} custom blocklist pattern(s)")

    print(f"🔍 Scanning '{args.directory}' for internal references...\n")
    findings = scan_directory(args.directory, all_patterns)
    print_report(findings)

    high_findings = [f for f in findings if f.severity == "HIGH"]
    sys.exit(1 if high_findings else 0)


if __name__ == "__main__":
    main()
