"""
Measure file sizes and identify large/complex files.
Usage: python measure_complexity.py <src-directory>
"""
import os
import sys

THRESHOLD_LINES = 150  # Flag files over this many lines


def measure(src_dir: str) -> None:
    """Walk source directory and report line counts per file."""
    if not os.path.isdir(src_dir):
        print(f"Error: Directory not found: {src_dir}")
        sys.exit(1)

    file_stats = []
    for root, dirs, files in os.walk(src_dir):
        dirs[:] = [d for d in dirs if d not in ("node_modules", ".git", "dist")]
        for filename in files:
            if not filename.endswith((".ts", ".tsx")):
                continue
            filepath = os.path.join(root, filename)
            with open(filepath, "r", encoding="utf-8") as fh:
                lines = fh.readlines()
            non_empty = sum(1 for line in lines if line.strip())
            file_stats.append({
                "file": os.path.relpath(filepath, src_dir),
                "total_lines": len(lines),
                "non_empty": non_empty,
            })

    file_stats.sort(key=lambda x: x["total_lines"], reverse=True)

    print(f"{'File':<45} {'Lines':<8} {'Non-Empty':<10} {'Status'}")
    print("-" * 75)

    flagged = 0
    for stat in file_stats:
        status = "⚠️  Large" if stat["total_lines"] > THRESHOLD_LINES else "✅"
        if stat["total_lines"] > THRESHOLD_LINES:
            flagged += 1
        print(f"{stat['file']:<45} {stat['total_lines']:<8} {stat['non_empty']:<10} {status}")

    print("-" * 75)
    print(f"Total: {len(file_stats)} files, {flagged} over {THRESHOLD_LINES} lines")
    if flagged:
        print(f"\n⚠️  Consider splitting large files into smaller modules")


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python measure_complexity.py <src-directory>")
        sys.exit(1)
    measure(sys.argv[1])
