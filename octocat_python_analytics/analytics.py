"""Core analytics logic for the standalone demo module."""

from __future__ import annotations

from dataclasses import asdict
from statistics import mean

from octocat_python_analytics.demo_data import BRANCHES
from octocat_python_analytics.demo_data import DELIVERIES
from octocat_python_analytics.demo_data import ORDER_LINES
from octocat_python_analytics.demo_data import ORDERS
from octocat_python_analytics.demo_data import PRODUCTS
from octocat_python_analytics.demo_data import SUPPLIERS


def _delay_days(delivered_days: int, expected_days: int) -> int:
    """Return delivery delay in days; non-late deliveries return zero."""

    return max(delivered_days - expected_days, 0)


def supplier_performance() -> list[dict[str, float | int | str]]:
    """Build supplier SLA metrics from hardcoded delivery records."""

    supplier_rows: list[dict[str, float | int | str]] = []
    for supplier in SUPPLIERS:
        deliveries = [d for d in DELIVERIES if d.supplier_id == supplier.id]
        delays = [
            _delay_days(d.delivered_date.toordinal(), d.expected_date.toordinal())
            for d in deliveries
        ]
        on_time_count = sum(1 for days in delays if days == 0)
        on_time_rate = (on_time_count / len(deliveries)) * 100 if deliveries else 0.0

        supplier_rows.append(
            {
                "supplier_id": supplier.id,
                "supplier_name": supplier.name,
                "total_deliveries": len(deliveries),
                "on_time_rate": round(on_time_rate, 2),
                "avg_delay_days": round(mean(delays), 2) if delays else 0.0,
            }
        )
    return supplier_rows


def branch_order_trend() -> list[dict[str, int | str]]:
    """Count orders per branch for a simple branch trend snapshot."""

    trend_rows: list[dict[str, int | str]] = []
    for branch in BRANCHES:
        order_count = sum(1 for order in ORDERS if order.branch_id == branch.id)
        trend_rows.append({"branch_id": branch.id, "branch_name": branch.name, "orders": order_count})
    return trend_rows


def top_delayed_products(top_n: int = 3) -> list[dict[str, float | int | str]]:
    """Estimate product risk by combining supplier delays with ordered quantity."""

    product_supplier = {product.id: product.supplier_id for product in PRODUCTS}
    product_name = {product.id: product.name for product in PRODUCTS}

    supplier_avg_delay: dict[int, float] = {}
    for supplier in SUPPLIERS:
        delays = [
            _delay_days(d.delivered_date.toordinal(), d.expected_date.toordinal())
            for d in DELIVERIES
            if d.supplier_id == supplier.id
        ]
        supplier_avg_delay[supplier.id] = mean(delays) if delays else 0.0

    risk_rows: list[dict[str, float | int | str]] = []
    for product in PRODUCTS:
        total_qty = sum(line.quantity for line in ORDER_LINES if line.product_id == product.id)
        delay = supplier_avg_delay[product_supplier[product.id]]
        # Weighted risk score for demo purposes only.
        risk_score = round(delay * total_qty, 2)
        risk_rows.append(
            {
                "product_id": product.id,
                "product_name": product_name[product.id],
                "total_quantity": total_qty,
                "risk_score": risk_score,
            }
        )

    sorted_rows = sorted(risk_rows, key=lambda row: float(row["risk_score"]), reverse=True)
    return sorted_rows[:top_n]


def summary() -> dict[str, object]:
    """Return one object containing all demo-ready analytics views."""

    supplier_rows = supplier_performance()
    branch_rows = branch_order_trend()
    delayed_rows = top_delayed_products()

    all_delays = [
        _delay_days(d.delivered_date.toordinal(), d.expected_date.toordinal())
        for d in DELIVERIES
    ]
    overall_on_time = (sum(1 for d in all_delays if d == 0) / len(all_delays)) * 100

    return {
        "kpis": {
            "suppliers": len(SUPPLIERS),
            "products": len(PRODUCTS),
            "orders": len(ORDERS),
            "deliveries": len(DELIVERIES),
            "overall_on_time_rate": round(overall_on_time, 2),
            "overall_avg_delay_days": round(mean(all_delays), 2),
        },
        "supplier_performance": supplier_rows,
        "branch_order_trend": branch_rows,
        "top_delayed_products": delayed_rows,
        "data_preview": {
            "suppliers": [asdict(s) for s in SUPPLIERS[:2]],
            "branches": [asdict(b) for b in BRANCHES[:2]],
        },
    }
