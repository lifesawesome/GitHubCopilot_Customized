"""
Analyze package.json files for dependency health.
Usage: python check_dependencies.py <project-root>
"""
import json
import os
import sys

def analyze_dependencies(project_root: str) -> None:
    """Read package.json files and report on dependency counts and structure."""
    if not os.path.isdir(project_root):
        print(f"Error: Directory not found: {project_root}")
        sys.exit(1)

    # Find all package.json files (excluding node_modules)
    package_files = []
    for root, dirs, files in os.walk(project_root):
        dirs[:] = [d for d in dirs if d != "node_modules" and d != ".git"]
        if "package.json" in files:
            package_files.append(os.path.join(root, "package.json"))

    print(f"{'Package Location':<40} {'Deps':<8} {'DevDeps':<10} {'Scripts'}")
    print("-" * 75)

    for pkg_path in sorted(package_files):
        rel_path = os.path.relpath(pkg_path, project_root)
        with open(pkg_path, "r", encoding="utf-8") as fh:
            data = json.load(fh)

        deps = len(data.get("dependencies", {}))
        dev_deps = len(data.get("devDependencies", {}))
        scripts = len(data.get("scripts", {}))

        print(f"{rel_path:<40} {deps:<8} {dev_deps:<10} {scripts}")

        # Check for potential issues
        if "name" not in data:
            print(f"  ⚠️  Missing 'name' field")
        if "version" not in data:
            print(f"  ⚠️  Missing 'version' field")

    print("-" * 75)
    print(f"Found {len(package_files)} package.json file(s)")
    print("\nTip: Run 'npm audit' to check for known vulnerabilities")
    print("Tip: Run 'npm outdated' to check for outdated packages")


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python check_dependencies.py <project-root>")
        sys.exit(1)
    analyze_dependencies(sys.argv[1])
