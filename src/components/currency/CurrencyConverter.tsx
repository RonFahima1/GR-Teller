"use client";

import { useState, useEffect } from "react";
import { ArrowUpDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranslation } from "@/hooks/useTranslation";
import { getExchangeRate } from "@/services/currency-exchange";
import { useCurrencyRates } from "@/services/currency-rates";

const POPULAR_CURRENCIES = ["USD", "EUR", "GBP", "JPY", "AUD", "CAD", "CHF", "CNY", "INR"];

export function CurrencyConverter() {
  const { t } = useTranslation();
  const { rates } = useCurrencyRates();
  const [amount, setAmount] = useState<number>(1);
  const [fromCurrency, setFromCurrency] = useState<string>("USD");
  const [toCurrency, setToCurrency] = useState<string>("EUR");
  const [result, setResult] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Get available currencies from rates
  const availableCurrencies = ["USD", ...rates.map(rate => rate.code)];

  useEffect(() => {
    convertCurrency();
  }, [fromCurrency, toCurrency, amount]);

  const convertCurrency = async () => {
    if (!amount || amount <= 0) {
      setResult(null);
      return;
    }

    setLoading(true);
    try {
      const { rate } = await getExchangeRate(fromCurrency, toCurrency);
      setResult(amount * rate);
    } catch (error) {
      console.error("Error converting currency:", error);
    } finally {
      setLoading(false);
    }
  };

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{t("currency.converter")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="amount">{t("currency.amount")}</Label>
            <Input
              id="amount"
              type="number"
              min="0"
              step="0.01"
              value={amount || ""}
              onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
              className="text-lg"
            />
          </div>

          <div className="grid grid-cols-[1fr,auto,1fr] items-center gap-2">
            <div className="space-y-2">
              <Label htmlFor="fromCurrency">{t("currency.from")}</Label>
              <Select value={fromCurrency} onValueChange={setFromCurrency}>
                <SelectTrigger id="fromCurrency">
                  <SelectValue placeholder={t("currency.selectCurrency")} />
                </SelectTrigger>
                <SelectContent>
                  {availableCurrencies.map((currency) => (
                    <SelectItem key={`from-${currency}`} value={currency}>
                      {currency}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={swapCurrencies}
              className="mt-8"
            >
              <ArrowUpDown className="h-4 w-4" />
            </Button>

            <div className="space-y-2">
              <Label htmlFor="toCurrency">{t("currency.to")}</Label>
              <Select value={toCurrency} onValueChange={setToCurrency}>
                <SelectTrigger id="toCurrency">
                  <SelectValue placeholder={t("currency.selectCurrency")} />
                </SelectTrigger>
                <SelectContent>
                  {availableCurrencies.map((currency) => (
                    <SelectItem key={`to-${currency}`} value={currency}>
                      {currency}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="rounded-lg border p-4">
          <div className="text-sm text-muted-foreground mb-1">
            {t("currency.result")}
          </div>
          <div className="text-2xl font-bold">
            {loading ? (
              <span className="text-muted-foreground">...</span>
            ) : result !== null ? (
              <>
                {amount.toLocaleString()} {fromCurrency} = {result.toLocaleString(undefined, { 
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2 
                })} {toCurrency}
              </>
            ) : (
              <span className="text-muted-foreground">
                {t("currency.enterAmount")}
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}