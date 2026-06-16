"""Generate a report of order details from the OctoCAT Supply Chain API."""

from __future__ import annotations

import json
import logging
from dataclasses import dataclass
from datetime import datetime
from pathlib import Path

from octocat_python_analytics.demo_data import ORDER_LINES, ORDERS, PRODUCTS, BRANCHES

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
logger = logging.getLogger(__name__)

OUTPUT_DIR = Path(__file__).parent / "output"


@dataclass
class OrderDetailRecord:
    """Enriched order detail for reporting."""

    order_line_id: int
    order_id: int
    branch_name: str
    product_name: str
    quantity: int
    order_date: str


def _enrich_order_lines() -> list[OrderDetailRecord]:
    """Join order lines with orders, products, and branches."""

    order_map = {o.id: o for o in ORDERS}
    product_map = {p.id: p for p in PRODUCTS}
    branch_map = {b.id: b for b in BRANCHES}

    records: list[OrderDetailRecord] = []
    for line in ORDER_LINES:
        order = order_map.get(line.order_id)
        product = product_map.get(line.product_id)
        if order is None or product is None:
            logger.warning("Skipping line %d: missing order or product", line.id)
            continue

        branch = branch_map.get(order.branch_id)
        records.append(
            OrderDetailRecord(
                order_line_id=line.id,
                order_id=line.order_id,
                branch_name=branch.name if branch else "Unknown",
                product_name=product.name,
                quantity=line.quantity,
                order_date=order.order_date.isoformat(),
            )
        )
    return records


def generate_text_report(records: list[OrderDetailRecord]) -> str:
    """Format order detail records as a human-readable text report."""

    lines: list[str] = []
    lines.append("=" * 70)
    lines.append("OctoCAT Order Details Report")
    lines.append(f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    lines.append("=" * 70)
    lines.append("")

    total_quantity = 0
    for rec in records:
        lines.append(
            f"  Line #{rec.order_line_id:>3} | Order #{rec.order_id} | "
            f"{rec.branch_name:<18} | {rec.product_name:<22} | "
            f"Qty: {rec.quantity:>3} | Date: {rec.order_date}"
        )
        total_quantity += rec.quantity

    lines.append("")
    lines.append("-" * 70)
    lines.append(f"  Total lines: {len(records)}    Total quantity: {total_quantity}")
    lines.append("-" * 70)
    return "\n".join(lines)


def run_report(output_format: str = "text") -> None:
    """Generate and save the order details report.

    Args:
        output_format: One of 'text' or 'json'.
    """

    logger.info("Generating order details report...")
    records = _enrich_order_lines()
    logger.info("Found %d order detail records", len(records))

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    if output_format == "json":
        output_path = OUTPUT_DIR / "order_details_report.json"
        data = [
            {
                "order_line_id": r.order_line_id,
                "order_id": r.order_id,
                "branch_name": r.branch_name,
                "product_name": r.product_name,
                "quantity": r.quantity,
                "order_date": r.order_date,
            }
            for r in records
        ]
        output_path.write_text(json.dumps(data, indent=2), encoding="utf-8")
        logger.info("JSON report written to %s", output_path)
    else:
        output_path = OUTPUT_DIR / "order_details_report.txt"
        report_text = generate_text_report(records)
        output_path.write_text(report_text, encoding="utf-8")
        logger.info("Text report written to %s", output_path)
        print(report_text)


if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(
        description="Generate an order details report from OctoCAT demo data."
    )
    parser.add_argument(
        "--format",
        choices=["text", "json"],
        default="text",
        help="Output format: text (default) or json.",
    )
    args = parser.parse_args()
    run_report(output_format=args.format)
