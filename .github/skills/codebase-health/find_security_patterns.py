"""
Scan TypeScript source files for common security anti-patterns.
Usage: python find_security_patterns.py <src-directory>
"""
import os
import re
import sys

PATTERNS = [
    {
        "name": "Hardcoded credentials",
        "pattern": re.compile(
            r"""(?:password|secret|token|api_key|apikey)\s*[:=]\s*['"][^'"]+['"]""",
            re.IGNORECASE,
        ),
        "severity": "Critical",
    },
    {
        "name": "Wildcard CORS origin",
        "pattern": re.compile(r"""origin:\s*['\"]?\*['\"]?""", re.IGNORECASE),
        "severity": "High",
    },
    {
        "name": "eval() usage",
        "pattern": re.compile(r"""\beval\s*\("""),
        "severity": "Critical",
    },
    {
        "name": "dangerouslySetInnerHTML",
        "pattern": re.compile(r"""dangerouslySetInnerHTML"""),
        "severity": "High",
    },
    {
        "name": "Console.log in production code",
        "pattern": re.compile(r"""console\.(log|debug)\s*\("""),
        "severity": "Low",
    },
    {
        "name": "Disabled TypeScript checks",
        "pattern": re.compile(r"""(?:@ts-ignore|@ts-nocheck|as\s+any)"""),
        "severity": "Medium",
    },
]


def scan_files(src_dir: str) -> None:
    """Walk the source directory and check each .ts/.tsx file for anti-patterns."""
    if not os.path.isdir(src_dir):
        print(f"Error: Directory not found: {src_dir}")
        sys.exit(1)

    findings = []
    files_scanned = 0

    for root, dirs, files in os.walk(src_dir):
        dirs[:] = [d for d in dirs if d not in ("node_modules", ".git", "dist")]
        for filename in files:
            if not filename.endswith((".ts", ".tsx")):
                continue
            filepath = os.path.join(root, filename)
            files_scanned += 1
            with open(filepath, "r", encoding="utf-8") as fh:
                for line_num, line in enumerate(fh, start=1):
                    for pat in PATTERNS:
                        if pat["pattern"].search(line):
                            findings.append({
                                "file": os.path.relpath(filepath, src_dir),
                                "line": line_num,
                                "severity": pat["severity"],
                                "pattern": pat["name"],
                                "content": line.strip()[:80],
                            })

    print(f"Scanned {files_scanned} files in {src_dir}\n")

    if not findings:
        print("✅ No security anti-patterns found!")
        return

    print(f"{'Severity':<10} {'File':<35} {'Line':<6} {'Pattern'}")
    print("-" * 80)
    for f in sorted(findings, key=lambda x: {"Critical": 0, "High": 1, "Medium": 2, "Low": 3}[x["severity"]]):
        print(f"{f['severity']:<10} {f['file']:<35} {f['line']:<6} {f['pattern']}")

    print(f"\n⚠️  Found {len(findings)} potential issue(s)")


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python find_security_patterns.py <src-directory>")
        sys.exit(1)
    scan_files(sys.argv[1])
