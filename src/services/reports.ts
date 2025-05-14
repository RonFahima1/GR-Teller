import { format } from "date-fns";

export interface ReportFilter {
  startDate?: Date;
  endDate?: Date;
  type?: string;
  status?: string;
  currency?: string;
}

export interface ReportData {
  totalTransactions: number;
  totalAmount: number;
  averageAmount: number;
  transactionsByType: Record<string, number>;
  transactionsByStatus: Record<string, number>;
  transactionsByCurrency: Record<string, number>;
  dailyTransactions: Array<{
    date: string;
    count: number;
    amount: number;
  }>;
}

export async function generateReport(filters: ReportFilter): Promise<ReportData> {
  // This is a mock implementation. In a real application, this would fetch data from your API
  const mockData: ReportData = {
    totalTransactions: 150,
    totalAmount: 75000,
    averageAmount: 500,
    transactionsByType: {
      send: 80,
      receive: 70,
    },
    transactionsByStatus: {
      completed: 120,
      pending: 20,
      failed: 10,
    },
    transactionsByCurrency: {
      USD: 50,
      EUR: 40,
      GBP: 30,
      AUD: 30,
    },
    dailyTransactions: Array.from({ length: 7 }, (_, i) => ({
      date: format(new Date(Date.now() - i * 24 * 60 * 60 * 1000), "yyyy-MM-dd"),
      count: Math.floor(Math.random() * 30) + 10,
      amount: Math.floor(Math.random() * 10000) + 1000,
    })),
  };

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return mockData;
}

export async function exportReport(data: ReportData, format: "csv" | "pdf"): Promise<Blob> {
  if (format === "csv") {
    const headers = ["Date", "Transactions", "Amount"];
    const rows = data.dailyTransactions.map((day) => [
      day.date,
      day.count.toString(),
      day.amount.toString(),
    ]);

    const csv = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    return new Blob([csv], { type: "text/csv" });
  } else {
    // In a real application, you would use a PDF generation library
    const mockPdf = "Mock PDF content";
    return new Blob([mockPdf], { type: "application/pdf" });
  }
}

export function downloadReport(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
} 