"""Check dependency licenses against an approved allowlist."""

import json
import os
import sys
from pathlib import Path
from typing import NamedTuple

# Approved license identifiers (SPDX)
APPROVED_LICENSES = {
    "MIT",
    "ISC",
    "Apache-2.0",
    "BSD-2-Clause",
    "BSD-3-Clause",
    "0BSD",
    "CC0-1.0",
    "CC-BY-4.0",
    "Unlicense",
    "WTFPL",
    "BlueOak-1.0.0",
    "Python-2.0",
    "PSF-2.0",
}

# Licenses that require legal review
REVIEW_REQUIRED_LICENSES = {
    "GPL-2.0",
    "GPL-3.0",
    "AGPL-3.0",
    "LGPL-2.1",
    "LGPL-3.0",
    "MPL-2.0",
    "EUPL-1.2",
    "CPAL-1.0",
    "OSL-3.0",
}


class DependencyFinding(NamedTuple):
    """A single dependency license finding."""

    severity: str
    package_name: str
    version: str
    license_id: str
    source_file: str
    recommendation: str


def check_npm_packages(project_root: Path) -> list[DependencyFinding]:
    """Check npm package licenses from package.json and node_modules."""
    findings: list[DependencyFinding] = []

    # Find all package.json files (workspace packages)
    package_files = list(project_root.glob("**/package.json"))
    package_files = [
        p for p in package_files
        if "node_modules" not in str(p) and "dist" not in str(p)
    ]

    for pkg_file in package_files:
        try:
            pkg_data = json.loads(pkg_file.read_text(encoding="utf-8"))
        except (json.JSONDecodeError, OSError):
            continue

        all_deps: dict[str, str] = {}
        all_deps.update(pkg_data.get("dependencies", {}))
        all_deps.update(pkg_data.get("devDependencies", {}))

        for dep_name, dep_version in all_deps.items():
            # Try to find license in node_modules
            license_id = _get_npm_package_license(project_root, dep_name)

            if license_id is None:
                findings.append(DependencyFinding(
                    severity="MEDIUM",
                    package_name=dep_name,
                    version=dep_version,
                    license_id="UNKNOWN",
                    source_file=str(pkg_file),
                    recommendation="Unable to determine license. Verify manually.",
                ))
            elif license_id.upper() in {lic.upper() for lic in REVIEW_REQUIRED_LICENSES}:
                findings.append(DependencyFinding(
                    severity="HIGH",
                    package_name=dep_name,
                    version=dep_version,
                    license_id=license_id,
                    source_file=str(pkg_file),
                    recommendation="Copyleft license — requires legal review before use.",
                ))
            elif license_id.upper() not in {lic.upper() for lic in APPROVED_LICENSES}:
                findings.append(DependencyFinding(
                    severity="MEDIUM",
                    package_name=dep_name,
                    version=dep_version,
                    license_id=license_id,
                    source_file=str(pkg_file),
                    recommendation="License not in approved list. Verify compatibility.",
                ))

    return findings


def _get_npm_package_license(project_root: Path, package_name: str) -> str | None:
    """Get the license of an npm package from node_modules."""
    # Check root node_modules first, then workspace node_modules
    search_paths = [
        project_root / "node_modules" / package_name / "package.json",
    ]

    # Also check workspace-level node_modules
    for workspace_dir in project_root.iterdir():
        if workspace_dir.is_dir() and (workspace_dir / "node_modules").exists():
            search_paths.append(
                workspace_dir / "node_modules" / package_name / "package.json"
            )

    for pkg_path in search_paths:
        if pkg_path.exists():
            try:
                pkg_data = json.loads(pkg_path.read_text(encoding="utf-8"))
                license_field = pkg_data.get("license", "")
                if isinstance(license_field, dict):
                    return license_field.get("type", "UNKNOWN")
                return license_field if license_field else None
            except (json.JSONDecodeError, OSError):
                continue

    return None


def check_python_packages(project_root: Path) -> list[DependencyFinding]:
    """Check Python package licenses from requirements files."""
    findings: list[DependencyFinding] = []

    req_files = (
        list(project_root.glob("**/requirements*.txt"))
        + list(project_root.glob("**/setup.cfg"))
        + list(project_root.glob("**/pyproject.toml"))
    )

    for req_file in req_files:
        if "node_modules" in str(req_file) or ".git" in str(req_file):
            continue

        if req_file.name.endswith(".txt"):
            deps = _parse_requirements_txt(req_file)
            for dep_name, dep_version in deps:
                # For Python deps, we can only flag that they need manual review
                # since we can't easily check licenses without pip
                findings.append(DependencyFinding(
                    severity="LOW",
                    package_name=dep_name,
                    version=dep_version,
                    license_id="NEEDS_CHECK",
                    source_file=str(req_file),
                    recommendation="Verify license with: pip show <package> | grep License",
                ))

    return findings


def _parse_requirements_txt(req_file: Path) -> list[tuple[str, str]]:
    """Parse a requirements.txt file into (name, version) pairs."""
    deps: list[tuple[str, str]] = []
    try:
        lines = req_file.read_text(encoding="utf-8").splitlines()
    except OSError:
        return deps

    for line in lines:
        line = line.strip()
        if not line or line.startswith("#") or line.startswith("-"):
            continue
        # Parse "package==version" or "package>=version" etc.
        for sep in ("==", ">=", "<=", "~=", "!=", ">", "<"):
            if sep in line:
                name, version = line.split(sep, 1)
                deps.append((name.strip(), version.strip()))
                break
        else:
            deps.append((line, "any"))

    return deps


def print_report(findings: list[DependencyFinding]) -> None:
    """Print a formatted license compliance report."""
    if not findings:
        print("✅ All dependencies have approved licenses.")
        return

    severity_order = {"CRITICAL": 0, "HIGH": 1, "MEDIUM": 2, "LOW": 3}
    findings.sort(key=lambda f: severity_order.get(f.severity, 99))

    print(f"⚠️  Found {len(findings)} dependency license issue(s):\n")
    print(f"{'Severity':<9} {'Package':<30} {'Version':<12} {'License':<15} Recommendation")
    print("-" * 110)

    for finding in findings:
        print(
            f"{finding.severity:<9} {finding.package_name:<30} "
            f"{finding.version:<12} {finding.license_id:<15} "
            f"{finding.recommendation}"
        )

    high_count = sum(1 for f in findings if f.severity == "HIGH")
    medium_count = sum(1 for f in findings if f.severity == "MEDIUM")

    print(f"\n{'='*60}")
    print(f"Summary: {high_count} High | {medium_count} Medium | {len(findings) - high_count - medium_count} Low")

    if high_count > 0:
        print("❌ Copyleft licenses detected — legal review required!")
    elif medium_count > 0:
        print("⚠️  Some licenses need verification.")
    else:
        print("ℹ️  Low-priority items — verify when convenient.")


def main() -> None:
    """Entry point for the license checker."""
    if len(sys.argv) < 2:
        print("Usage: python check_dependencies_license.py <project-root>")
        print("Example: python check_dependencies_license.py .")
        sys.exit(1)

    target_dir = sys.argv[1]
    if not os.path.isdir(target_dir):
        print(f"Error: '{target_dir}' is not a valid directory.")
        sys.exit(1)

    project_root = Path(target_dir).resolve()
    print(f"🔍 Checking dependency licenses in '{project_root}'...\n")

    findings: list[DependencyFinding] = []
    findings.extend(check_npm_packages(project_root))
    findings.extend(check_python_packages(project_root))

    print_report(findings)

    high_findings = [f for f in findings if f.severity == "HIGH"]
    sys.exit(1 if high_findings else 0)


if __name__ == "__main__":
    main()
