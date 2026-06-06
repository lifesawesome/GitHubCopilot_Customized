"""Static HTML report generator for the standalone analytics demo."""

from __future__ import annotations

from pathlib import Path


def _table(headers: list[str], rows: list[list[str]]) -> str:
    """Render a simple HTML table string."""

    header_html = "".join(f"<th>{header}</th>" for header in headers)
    row_html = "".join(
        "<tr>" + "".join(f"<td>{cell}</td>" for cell in row) + "</tr>" for row in rows
    )
    return (
        "<table>"
        "<thead><tr>"
        f"{header_html}"
        "</tr></thead>"
        f"<tbody>{row_html}</tbody>"
        "</table>"
    )


def write_report(summary_payload: dict[str, object], output_path: Path) -> Path:
    """Write a static HTML analytics report to output_path."""

    kpis = summary_payload["kpis"]
    suppliers = summary_payload["supplier_performance"]
    branches = summary_payload["branch_order_trend"]
    delayed = summary_payload["top_delayed_products"]

    supplier_rows = [
        [
            str(row["supplier_name"]),
            str(row["total_deliveries"]),
            f"{row['on_time_rate']}%",
            str(row["avg_delay_days"]),
        ]
        for row in suppliers
    ]
    branch_rows = [[str(row["branch_name"]), str(row["orders"])] for row in branches]
    delayed_rows = [
        [str(row["product_name"]), str(row["total_quantity"]), str(row["risk_score"])]
        for row in delayed
    ]

    html = f"""<!doctype html>
<html lang=\"en\">
<head>
  <meta charset=\"utf-8\">
  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">
  <title>OctoCAT Python Demo Analytics</title>
  <style>
    body {{
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      margin: 24px;
      color: #1f2937;
      background: #f8fafc;
    }}
    h1, h2 {{ color: #0f172a; }}
    .grid {{
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 12px;
      margin-bottom: 24px;
    }}
    .card {{
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 12px;
    }}
    table {{
      width: 100%;
      border-collapse: collapse;
      background: white;
      border: 1px solid #e2e8f0;
      margin-bottom: 20px;
    }}
    th, td {{
      border-bottom: 1px solid #e2e8f0;
      text-align: left;
      padding: 8px;
      font-size: 14px;
    }}
    th {{ background: #f1f5f9; }}
  </style>
</head>
<body>
  <h1>OctoCAT Standalone Python Analytics</h1>
  <p>Fully hardcoded dataset. No external services or packages required.</p>

  <div class=\"grid\">
    <div class=\"card\"><strong>Suppliers</strong><br>{kpis['suppliers']}</div>
    <div class=\"card\"><strong>Products</strong><br>{kpis['products']}</div>
    <div class=\"card\"><strong>Orders</strong><br>{kpis['orders']}</div>
    <div class=\"card\"><strong>Deliveries</strong><br>{kpis['deliveries']}</div>
    <div class=\"card\"><strong>Overall On-Time Rate</strong><br>{kpis['overall_on_time_rate']}%</div>
    <div class=\"card\"><strong>Average Delay</strong><br>{kpis['overall_avg_delay_days']} days</div>
  </div>

  <h2>Supplier Performance</h2>
  {_table(["Supplier", "Deliveries", "On-Time %", "Avg Delay (days)"], supplier_rows)}

  <h2>Branch Order Trend</h2>
  {_table(["Branch", "Orders"], branch_rows)}

  <h2>Top Delayed Product Risk</h2>
  {_table(["Product", "Total Qty", "Risk Score"], delayed_rows)}
</body>
</html>
"""

    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(html, encoding="utf-8")
    return output_path
