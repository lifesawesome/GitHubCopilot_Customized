"""
List all Express API route files and their HTTP endpoints.
Usage: python list_routes.py <routes-directory>
"""
import os
import re
import sys

def find_routes(routes_dir: str) -> None:
    """Scan route files for HTTP method handlers and print a summary."""
    if not os.path.isdir(routes_dir):
        print(f"Error: Directory not found: {routes_dir}")
        sys.exit(1)

    http_methods = re.compile(
        r"router\.(get|post|put|patch|delete)\s*\(\s*['\"]([^'\"]+)['\"]",
        re.IGNORECASE,
    )

    route_files = sorted(
        f for f in os.listdir(routes_dir)
        if f.endswith(".ts") and not f.endswith(".test.ts")
    )

    print(f"{'Route File':<30} {'Method':<8} {'Path'}")
    print("-" * 70)

    total_endpoints = 0
    for filename in route_files:
        filepath = os.path.join(routes_dir, filename)
        with open(filepath, "r", encoding="utf-8") as fh:
            content = fh.read()

        matches = http_methods.findall(content)
        if matches:
            for method, path in matches:
                print(f"{filename:<30} {method.upper():<8} {path}")
                total_endpoints += 1
        else:
            print(f"{filename:<30} {'—':<8} No endpoints found")

    print("-" * 70)
    print(f"Total: {len(route_files)} route files, {total_endpoints} endpoints")


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python list_routes.py <routes-directory>")
        sys.exit(1)
    find_routes(sys.argv[1])
