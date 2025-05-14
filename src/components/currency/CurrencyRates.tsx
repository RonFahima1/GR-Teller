"use client";

import { useEffect } from "react";
import { ArrowDown, ArrowUp, RefreshCcw } from "lucide-react";
import { format } from "date-fns";
import { useCurrencyRates } from "@/services/currency-rates";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/useTranslation";
import { Loading } from "@/components/ui/loading";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription } from "@/components/ui/alert";

const POPULAR_CURRENCIES = ["EUR", "GBP", "JPY", "AUD", "CAD", "CHF", "CNY", "INR"];

export function CurrencyRates() {
  const { t } = useTranslation();
  const { rates, loading, error, lastUpdated, fetchRates } = useCurrencyRates();

  useEffect(() => {
    fetchRates();
    // Refresh rates every 5 minutes
    const interval = setInterval(fetchRates, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchRates]);

  const popularRates = rates.filter((rate) => POPULAR_CURRENCIES.includes(rate.code));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {t("currency.rates")}
          <div className="flex items-center gap-2 text-sm font-normal text-muted-foreground">
            {lastUpdated && (
              <span>
                {t("currency.lastUpdated", {
                  time: format(lastUpdated, "HH:mm"),
                })}
              </span>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={fetchRates}
              disabled={loading}
            >
              <RefreshCcw className={cn("h-4 w-4", loading && "animate-spin")} />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {loading && !rates.length ? (
          <Loading className="py-8" text={t("common.loading")} />
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {popularRates.map((rate) => (
              <div
                key={rate.code}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <div>
                  <div className="font-medium">{rate.code}</div>
                  <div className="text-sm text-muted-foreground">
                    {rate.name}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">{rate.rate.toFixed(4)}</div>
                  {rate.change !== 0 && (
                    <div
                      className={cn(
                        "flex items-center text-sm",
                        rate.change > 0
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-600 dark:text-red-400"
                      )}
                    >
                      {rate.change > 0 ? (
                        <ArrowUp className="mr-1 h-3 w-3" />
                      ) : (
                        <ArrowDown className="mr-1 h-3 w-3" />
                      )}
                      {Math.abs(rate.change).toFixed(2)}%
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
} 