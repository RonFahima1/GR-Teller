"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon, Download, Loader2 } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import {
  generateReport,
  exportReport,
  downloadReport,
  type ReportFilter,
  type ReportData,
} from "@/services/reports";
import { BarChart, PieChart } from "@/components/ui/chart";
import { Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

type ChartData = {
  name: string;
  value: number;
};

const mockReports = [
  { id: 1, date: '2024-03-15', type: 'remittance', client: 'Jane Smith', amount: 500, status: 'completed' },
  { id: 2, date: '2024-03-14', type: 'exchange', client: 'Alex Morgan', amount: 200, status: 'pending' },
  { id: 3, date: '2024-03-14', type: 'remittance', client: 'Jane Smith', amount: 300, status: 'completed' },
];

function exportToCSV(data: any[], filename: string) {
  const csv = [
    Object.keys(data[0]).join(","),
    ...data.map(row => Object.values(row).join(","))
  ].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function ReportsPage() {
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const { t } = useTranslation();
  const { register, handleSubmit, watch } = useForm<ReportFilter>();
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [type, setType] = useState('all');
  const [client, setClient] = useState('');

  const onSubmit = async (data: ReportFilter) => {
    setLoading(true);
    try {
      const report = await generateReport(data);
      setReportData(report);
    } catch (error) {
      console.error("Failed to generate report:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (format: "csv" | "pdf") => {
    if (!reportData) return;

    try {
      const blob = await exportReport(reportData, format);
      const filename = `report-${format(new Date(), "yyyy-MM-dd")}.${format}`;
      downloadReport(blob, filename);
    } catch (error) {
      console.error("Failed to export report:", error);
    }
  };

  const filtered = mockReports.filter(r => {
    if (dateFrom && r.date < dateFrom) return false;
    if (dateTo && r.date > dateTo) return false;
    if (type !== 'all' && r.type !== type) return false;
    if (client && !r.client.toLowerCase().includes(client.toLowerCase())) return false;
    return true;
  });

  // Group by date for chart
  const chartData = Object.values(
    filtered.reduce((acc, r) => {
      acc[r.date] = acc[r.date] || { date: r.date, volume: 0 };
      acc[r.date].volume += r.amount;
      return acc;
    }, {} as Record<string, { date: string; volume: number }>)
  ).sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Reports</h1>
      <div className="flex flex-wrap gap-4 items-end mb-6">
        <div>
          <label className="block text-xs font-medium mb-1">Date From</label>
          <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="border rounded px-2 py-1 text-sm" />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1">Date To</label>
          <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="border rounded px-2 py-1 text-sm" />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1">Type</label>
          <select value={type} onChange={e => setType(e.target.value)} className="border rounded px-2 py-1 text-sm">
            <option value="all">All</option>
            <option value="remittance">Remittance</option>
            <option value="exchange">Exchange</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium mb-1">Client</label>
          <input type="text" value={client} onChange={e => setClient(e.target.value)} placeholder="Client name" className="border rounded px-2 py-1 text-sm" />
        </div>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded"
          onClick={() => filtered.length && exportToCSV(filtered, 'report.csv')}
        >
          Export CSV
        </button>
        <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded">Export PDF</button>
      </div>
      <div className="mb-8">
        <div className="bg-white rounded-lg border p-4 mb-4">
          <div className="font-semibold mb-2">Summary</div>
          <div className="flex gap-8">
            <div>Total Volume: <b>${filtered.reduce((sum, r) => sum + r.amount, 0).toLocaleString()}</b></div>
            <div>Transactions: <b>{filtered.length}</b></div>
          </div>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <div className="font-semibold mb-2">Transaction Volume (Bar Chart)</div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 16, right: 16, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="volume" fill="#2563eb" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg border p-4">
        <div className="font-semibold mb-2">Report Table</div>
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2">Date</th>
              <th className="p-2">Type</th>
              <th className="p-2">Client</th>
              <th className="p-2">Amount</th>
              <th className="p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(r => (
              <tr key={r.id} className="border-t">
                <td className="p-2">{r.date}</td>
                <td className="p-2 capitalize">{r.type}</td>
                <td className="p-2">{r.client}</td>
                <td className="p-2">{r.amount.toLocaleString()}</td>
                <td className="p-2 capitalize">{r.status}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={5} className="text-center text-gray-400 py-4">No data found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
} 