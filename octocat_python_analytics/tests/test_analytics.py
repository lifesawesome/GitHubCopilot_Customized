"""Unit tests for standalone analytics demo logic."""

from __future__ import annotations

import unittest

from octocat_python_analytics.analytics import branch_order_trend
from octocat_python_analytics.analytics import summary
from octocat_python_analytics.analytics import supplier_performance
from octocat_python_analytics.analytics import top_delayed_products


class AnalyticsTestCase(unittest.TestCase):
    """Validate deterministic outputs from hardcoded analytics data."""

    def test_supplier_performance_has_one_row_per_supplier(self) -> None:
        rows = supplier_performance()
        self.assertEqual(len(rows), 3)
        supplier_names = {str(row["supplier_name"]) for row in rows}
        self.assertSetEqual(
            supplier_names,
            {"PurrTech Industries", "WhiskerWare Labs", "CatNip Creations"},
        )

    def test_branch_order_trend_counts(self) -> None:
        rows = branch_order_trend()
        row_map = {str(row["branch_name"]): int(row["orders"]) for row in rows}
        self.assertEqual(row_map["Meowtown Central"], 3)
        self.assertEqual(row_map["Tabby Terrace"], 3)
        self.assertEqual(row_map["Pawline Point"], 2)

    def test_top_delayed_products_sorted_by_risk(self) -> None:
        rows = top_delayed_products(top_n=3)
        self.assertEqual(len(rows), 3)
        first = rows[0]
        second = rows[1]
        self.assertGreaterEqual(float(first["risk_score"]), float(second["risk_score"]))

    def test_summary_shape(self) -> None:
        payload = summary()
        self.assertIn("kpis", payload)
        self.assertIn("supplier_performance", payload)
        self.assertIn("branch_order_trend", payload)
        self.assertIn("top_delayed_products", payload)


if __name__ == "__main__":
    unittest.main()
