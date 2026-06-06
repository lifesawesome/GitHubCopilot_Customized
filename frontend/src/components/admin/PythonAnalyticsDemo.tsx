import React, { useEffect, useState } from 'react';
import { useTheme } from '../../context/ThemeContext';

interface Kpis {
  suppliers: number;
  products: number;
  orders: number;
  deliveries: number;
  overall_on_time_rate: number;
  overall_avg_delay_days: number;
}

interface SupplierPerformanceRow {
  supplier_id: number;
  supplier_name: string;
  total_deliveries: number;
  on_time_rate: number;
  avg_delay_days: number;
}

interface BranchOrderTrendRow {
  branch_id: number;
  branch_name: string;
  orders: number;
}

interface DelayedProductRow {
  product_id: number;
  product_name: string;
  total_quantity: number;
  risk_score: number;
}

interface PythonAnalyticsPayload {
  kpis: Kpis;
  supplier_performance: SupplierPerformanceRow[];
  branch_order_trend: BranchOrderTrendRow[];
  top_delayed_products: DelayedProductRow[];
}

const PythonAnalyticsDemo: React.FC = () => {
  const { darkMode } = useTheme();
  const [data, setData] = useState<PythonAnalyticsPayload | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch('/python-analytics.json', {
          cache: 'no-store',
        });

        if (!response.ok) {
          throw new Error(
            'Python analytics JSON not found. Export it first from the Python module.'
          );
        }

        const payload = (await response.json()) as PythonAnalyticsPayload;
        setData(payload);
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : 'Failed to load Python analytics payload.';
        setError(message);
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-10">
      <div className="mb-6">
        <h1 className={`text-3xl font-bold ${darkMode ? 'text-light' : 'text-gray-900'}`}>
          OctoCAT Analytics Dashboard
        </h1>
        <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mt-2`}>
          This screen renders data exported by the standalone Python module from
          octocat_python_analytics.
        </p>
      </div>

      {isLoading && (
        <div
          className={`rounded-lg border p-4 ${
            darkMode
              ? 'border-gray-700 bg-gray-800 text-gray-200'
              : 'border-gray-200 bg-white text-gray-700'
          }`}
        >
          Loading Python analytics payload...
        </div>
      )}

      {!isLoading && error && (
        <div
          className={`rounded-lg border p-4 ${
            darkMode
              ? 'border-red-800 bg-red-900/20 text-red-200'
              : 'border-red-200 bg-red-50 text-red-700'
          }`}
        >
          <p className="font-semibold">Unable to load analytics data</p>
          <p className="mt-1 text-sm">{error}</p>
          <p className="mt-3 text-sm">
            Run: <span className="font-mono">python -m octocat_python_analytics.main --mode json-file --output frontend/public/python-analytics.json</span>
          </p>
        </div>
      )}

      {!isLoading && !error && data && (
        <div className="space-y-8">
          <section>
            <h2 className={`text-xl font-semibold mb-3 ${darkMode ? 'text-light' : 'text-gray-900'}`}>
              KPI Snapshot
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <KpiCard darkMode={darkMode} label="Suppliers" value={data.kpis.suppliers.toString()} />
              <KpiCard darkMode={darkMode} label="Products" value={data.kpis.products.toString()} />
              <KpiCard darkMode={darkMode} label="Orders" value={data.kpis.orders.toString()} />
              <KpiCard darkMode={darkMode} label="Deliveries" value={data.kpis.deliveries.toString()} />
              <KpiCard darkMode={darkMode} label="Overall On-Time Rate" value={`${data.kpis.overall_on_time_rate}%`} />
              <KpiCard darkMode={darkMode} label="Average Delay" value={`${data.kpis.overall_avg_delay_days} days`} />
            </div>
          </section>

          <section>
            <h2 className={`text-xl font-semibold mb-3 ${darkMode ? 'text-light' : 'text-gray-900'}`}>
              Supplier Performance
            </h2>
            <DataTable
              darkMode={darkMode}
              headers={['Supplier', 'Deliveries', 'On-Time %', 'Avg Delay (days)']}
              rows={data.supplier_performance.map((row) => [
                row.supplier_name,
                row.total_deliveries.toString(),
                row.on_time_rate.toString(),
                row.avg_delay_days.toString(),
              ])}
            />
          </section>

          <section>
            <h2 className={`text-xl font-semibold mb-3 ${darkMode ? 'text-light' : 'text-gray-900'}`}>
              Branch Order Trend
            </h2>
            <DataTable
              darkMode={darkMode}
              headers={['Branch', 'Orders']}
              rows={data.branch_order_trend.map((row) => [
                row.branch_name,
                row.orders.toString(),
              ])}
            />
          </section>

          <section>
            <h2 className={`text-xl font-semibold mb-3 ${darkMode ? 'text-light' : 'text-gray-900'}`}>
              Top Delayed Product Risk
            </h2>
            <DataTable
              darkMode={darkMode}
              headers={['Product', 'Total Quantity', 'Risk Score']}
              rows={data.top_delayed_products.map((row) => [
                row.product_name,
                row.total_quantity.toString(),
                row.risk_score.toString(),
              ])}
            />
          </section>
        </div>
      )}
    </div>
  );
};

interface KpiCardProps {
  darkMode: boolean;
  label: string;
  value: string;
}

const KpiCard: React.FC<KpiCardProps> = ({ darkMode, label, value }) => {
  return (
    <div
      className={`rounded-xl border p-4 shadow-sm ${
        darkMode
          ? 'border-gray-700 bg-gray-800 text-gray-100'
          : 'border-gray-200 bg-white text-gray-900'
      }`}
    >
      <p className="text-sm text-primary font-medium">{label}</p>
      <p className="mt-2 text-2xl font-bold">{value}</p>
    </div>
  );
};

interface DataTableProps {
  darkMode: boolean;
  headers: string[];
  rows: string[][];
}

const DataTable: React.FC<DataTableProps> = ({ darkMode, headers, rows }) => {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
      <table className="min-w-full text-sm">
        <thead className={darkMode ? 'bg-gray-800 text-gray-200' : 'bg-gray-100 text-gray-700'}>
          <tr>
            {headers.map((header) => (
              <th key={header} className="px-4 py-3 text-left font-semibold">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className={darkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-800'}>
          {rows.map((row, index) => (
            <tr
              key={`row-${index}`}
              className={darkMode ? 'border-t border-gray-800' : 'border-t border-gray-200'}
            >
              {row.map((cell, cellIndex) => (
                <td key={`cell-${index}-${cellIndex}`} className="px-4 py-3">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PythonAnalyticsDemo;
