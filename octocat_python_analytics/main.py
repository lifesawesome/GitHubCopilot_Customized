"""CLI entrypoint for the standalone Python analytics demo."""

from __future__ import annotations

import argparse
import json
from pathlib import Path

from octocat_python_analytics.analytics import summary
from octocat_python_analytics.report import write_report


def _build_parser() -> argparse.ArgumentParser:
    """Create argument parser for demo modes."""

    parser = argparse.ArgumentParser(
        description=(
            "Standalone OctoCAT analytics demo. "
            "Uses hardcoded data and Python standard library only."
        )
    )
    parser.add_argument(
        "--mode",
        choices=["summary", "json", "report", "json-file"],
        default="summary",
        help="Choose terminal summary, raw JSON, static HTML report, or JSON file export mode.",
    )
    parser.add_argument(
        "--output",
        default="octocat_python_analytics/output/analytics_report.html",
        help="Output path for --mode report or --mode json-file.",
    )
    return parser


def run() -> None:
    """Execute CLI workflow based on selected mode."""

    args = _build_parser().parse_args()
    payload = summary()

    if args.mode == "json":
        print(json.dumps(payload, indent=2))
        return

    if args.mode == "report":
        report_path = write_report(payload, Path(args.output))
        print(f"Report generated: {report_path}")
        return

    if args.mode == "json-file":
        output_path = Path(args.output)
        output_path.parent.mkdir(parents=True, exist_ok=True)
        output_path.write_text(json.dumps(payload, indent=2), encoding="utf-8")
        print(f"JSON exported: {output_path}")
        return

    kpis = payload["kpis"]
    print("OctoCAT Standalone Python Analytics")
    print("-" * 40)
    print(f"Suppliers: {kpis['suppliers']}")
    print(f"Products: {kpis['products']}")
    print(f"Orders: {kpis['orders']}")
    print(f"Deliveries: {kpis['deliveries']}")
    print(f"Overall on-time rate: {kpis['overall_on_time_rate']}%")
    print(f"Average delay: {kpis['overall_avg_delay_days']} days")


if __name__ == "__main__":
    run()
