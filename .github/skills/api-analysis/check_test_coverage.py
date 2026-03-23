"""
Check test file coverage for Express API route files.
Usage: python check_test_coverage.py <routes-directory>
"""
import os
import sys

def check_tests(routes_dir: str) -> None:
    """Identify route files that are missing corresponding test files."""
    if not os.path.isdir(routes_dir):
        print(f"Error: Directory not found: {routes_dir}")
        sys.exit(1)

    all_files = os.listdir(routes_dir)
    route_files = sorted(
        f for f in all_files
        if f.endswith(".ts") and not f.endswith(".test.ts")
    )
    test_files = {f for f in all_files if f.endswith(".test.ts")}

    print(f"{'Route File':<30} {'Test File':<30} {'Status'}")
    print("-" * 70)

    covered = 0
    missing = 0

    for route_file in route_files:
        expected_test = route_file.replace(".ts", ".test.ts")
        if expected_test in test_files:
            print(f"{route_file:<30} {expected_test:<30} ✅ Covered")
            covered += 1
        else:
            print(f"{route_file:<30} {expected_test:<30} ❌ Missing")
            missing += 1

    print("-" * 70)
    total = covered + missing
    if total > 0:
        pct = f"{(covered / total) * 100:.0f}%"
    else:
        pct = "N/A"
    print(f"Coverage: {covered}/{total} route files have tests ({pct})")

    if missing > 0:
        print(f"\n⚠️  {missing} route(s) need test files!")
        print("Use the Unit-Test-Coverage prompt or Test Coverage Agent to generate them.")


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python check_test_coverage.py <routes-directory>")
        sys.exit(1)
    check_tests(sys.argv[1])
