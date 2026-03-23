"""
Check Swagger JSDoc coverage for Express API route files.
Usage: python check_swagger_coverage.py <routes-directory>
"""
import os
import re
import sys

def check_swagger(routes_dir: str) -> None:
    """Analyze each route file for Swagger @swagger JSDoc blocks."""
    if not os.path.isdir(routes_dir):
        print(f"Error: Directory not found: {routes_dir}")
        sys.exit(1)

    http_pattern = re.compile(
        r"router\.(get|post|put|patch|delete)\s*\(",
        re.IGNORECASE,
    )
    swagger_pattern = re.compile(r"@swagger", re.IGNORECASE)

    route_files = sorted(
        f for f in os.listdir(routes_dir)
        if f.endswith(".ts") and not f.endswith(".test.ts")
    )

    print(f"{'Route File':<30} {'Endpoints':<12} {'Swagger Blocks':<16} {'Coverage'}")
    print("-" * 75)

    total_endpoints = 0
    total_swagger = 0

    for filename in route_files:
        filepath = os.path.join(routes_dir, filename)
        with open(filepath, "r", encoding="utf-8") as fh:
            content = fh.read()

        endpoints = len(http_pattern.findall(content))
        swagger_blocks = len(swagger_pattern.findall(content))

        if endpoints > 0:
            coverage = f"{(swagger_blocks / endpoints) * 100:.0f}%"
        else:
            coverage = "N/A"

        status = "✅" if swagger_blocks >= endpoints else "❌"
        print(f"{filename:<30} {endpoints:<12} {swagger_blocks:<16} {status} {coverage}")

        total_endpoints += endpoints
        total_swagger += swagger_blocks

    print("-" * 75)
    if total_endpoints > 0:
        overall = f"{(total_swagger / total_endpoints) * 100:.0f}%"
    else:
        overall = "N/A"
    print(f"{'TOTAL':<30} {total_endpoints:<12} {total_swagger:<16} {overall}")


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python check_swagger_coverage.py <routes-directory>")
        sys.exit(1)
    check_swagger(sys.argv[1])
