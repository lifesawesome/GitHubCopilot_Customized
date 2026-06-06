# Standalone Python Demo Module

This module is intentionally **self-contained** for live demos:

- Hardcoded data only
- No API calls
- No database
- No third-party Python packages

## Run

From repository root:

```bash
python -m octocat_python_analytics.main --mode summary
python -m octocat_python_analytics.main --mode json
python -m octocat_python_analytics.main --mode report
python -m octocat_python_analytics.main --mode json-file --output frontend/public/python-analytics.json
```

The report mode writes a static HTML file to:

- `octocat_python_analytics/output/analytics_report.html`

## Test

```bash
python -m unittest discover -s octocat_python_analytics/tests -p "test_*.py"
```

## Show In Frontend UI

1. Export JSON for the frontend:

```bash
python -m octocat_python_analytics.main --mode json-file --output frontend/public/python-analytics.json
```

2. Start app frontend (and API if you already run full app):

```bash
npm run dev:frontend
```

3. Login as admin (`@github.com` email), then open:

- `/admin/python-analytics`

The page reads `/python-analytics.json` and renders KPI cards + analytics tables.
