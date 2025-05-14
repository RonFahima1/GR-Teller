"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranslation } from "@/hooks/useTranslation";
import { DateRange } from "@/components/ui/date-range";
import { addDays, format, subDays } from "date-fns";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock historical data - in production, this would come from an API
const generateHistoricalData = (days: number, baseCurrency: string, targetCurrency: string) => {
  const today = new Date();
  return Array.from({ length: days }).map((_, i) => {
    const date = subDays(today, days - i - 1);
    // Generate a somewhat realistic looking rate that fluctuates a bit
    const baseRate = baseCurrency === "USD" && targetCurrency === "EUR" ? 0.92 : 1.15;
    const fluctuation = (Math.random() - 0.5) * 0.05; // +/- 5% fluctuation
    
    return {
      date: format(date, "yyyy-MM-dd"),
      rate: +(baseRate + fluctuation).toFixed(4),
    };
  });
};

type TimeRange = "7d" | "1m" | "3m" | "1y" | "custom";

export function ExchangeRateChart() {
  const { t } = useTranslation();
  const [baseCurrency, setBaseCurrency] = useState("USD");
  const [targetCurrency, setTargetCurrency] = useState("EUR");
  const [timeRange, setTimeRange] = useState<TimeRange>("1m");
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });
  
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    let days: number;
    
    switch (timeRange) {
      case "7d": days = 7; break;
      case "1m": days = 30; break;
      case "3m": days = 90; break;
      case "1y": days = 365; break;
      case "custom":
        if (dateRange.from && dateRange.to) {
          // Calculate days between dates
          const diffTime = Math.abs(dateRange.to.getTime() - dateRange.from.getTime());
          days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        } else {
          days = 30; // Default if custom but no range selected
        }
        break;
      default: days = 30;
    }
    
    setChartData(generateHistoricalData(days, baseCurrency, targetCurrency));
  }, [baseCurrency, targetCurrency, timeRange, dateRange]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between flex-wrap gap-2">
          {t("currency.historicalRates")}
          <div className="flex items-center gap-2">
            <Select value={baseCurrency} onValueChange={setBaseCurrency}>
              <SelectTrigger className="w-24">
                <SelectValue placeholder="From" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD</SelectItem>
                <SelectItem value="EUR">EUR</SelectItem>
                <SelectItem value="GBP">GBP</SelectItem>
                <SelectItem value="JPY">JPY</SelectItem>
              </SelectContent>
            </Select>
            <span>/</span>
            <Select value={targetCurrency} onValueChange={setTargetCurrency}>
              <SelectTrigger className="w-24">
                <SelectValue placeholder="To" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD</SelectItem>
                <SelectItem value="EUR">EUR</SelectItem>
                <SelectItem value="GBP">GBP</SelectItem>
                <SelectItem value="JPY">JPY</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex justify-between items-center flex-wrap gap-4">
          <div className="flex gap-1">
            {(["7d", "1m", "3m", "1y"] as const).map((range) => (
              <Button
                key={range}
                variant={timeRange === range ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeRange(range)}
              >
                {t(`currency.timeRange.${range}`)}
              </Button>
            ))}
            <Button
              variant={timeRange === "custom" ? "default" : "outline"}
              size="sm"
              className="flex items-center gap-1"
              onClick={() => setTimeRange("custom")}
            >
              <CalendarIcon className="h-3.5 w-3.5" />
              {t("currency.timeRange.custom")}
            </Button>
          </div>
          
          {timeRange === "custom" && (
            <DateRange
              value={dateRange}
              onChange={(range) => {
                setDateRange(range);
              }}
              className="max-w-xs"
            />
          )}
        </div>
        
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{
                top: 5,
                right: 20,
                left: 0,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#888" strokeOpacity={0.2} />
              <XAxis 
                dataKey="date" 
                tick={{ fill: "#888" }}
                tickFormatter={(value) => {
                  // Format based on time range
                  if (timeRange === "7d" || timeRange === "1m") {
                    return format(new Date(value), "dd MMM");
                  }
                  return format(new Date(value), "MMM yy");
                }}
              />
              <YAxis 
                tick={{ fill: "#888" }}
                domain={['auto', 'auto']} 
                tickFormatter={(value) => value.toFixed(2)}
              />
              <Tooltip 
                formatter={(value: number) => [`${value.toFixed(4)}`, `${baseCurrency}/${targetCurrency}`]}
                labelFormatter={(label) => format(new Date(label), "dd MMM yyyy")}
              />
              <Line
                type="monotone"
                dataKey="rate"
                stroke="#2563EB"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}