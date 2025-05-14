"use client";

import { useEffect, useState } from "react";
import { useLocalStorage } from "react-use";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTranslation } from "@/hooks/useTranslation";

interface Conversion {
  id: string;
  fromCurrency: string;
  toCurrency: string;
  fromAmount: number;
  toAmount: number;
  date: string;
}

export function RecentConversions() {
  const { t } = useTranslation();
  const [conversions, setConversions] = useLocalStorage<Conversion[]>("recent-conversions", []);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // Prevents hydration issues with localStorage
  }
  
  const clearHistory = () => {
    setConversions([]);
  };
  
  // This function would be called from the CurrencyConverter component to add new conversions
  const addConversion = (conversion: Omit<Conversion, "id" | "date">) => {
    const newConversion = {
      ...conversion,
      id: Math.random().toString(36).substring(2, 9),
      date: new Date().toISOString(),
    };
    
    setConversions((prev) => {
      const newConversions = [newConversion, ...(prev || [])];
      // Keep only the latest 10 conversions
      return newConversions.slice(0, 10);
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-md font-medium">
          {t("currency.recentConversions")}
        </CardTitle>
        {conversions && conversions.length > 0 && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearHistory}
            className="h-8 px-2 text-muted-foreground"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            {t("common.clear")}
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {!conversions || conversions.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">
            {t("currency.noRecentConversions")}
          </p>
        ) : (
          <ScrollArea className="h-[180px]">
            <div className="space-y-2">
              {conversions.map((conversion) => (
                <div 
                  key={conversion.id} 
                  className="flex items-center justify-between p-2 rounded-md border bg-background hover:bg-muted/50"
                >
                  <div className="flex flex-col">
                    <div className="font-medium">
                      {conversion.fromAmount.toLocaleString()} {conversion.fromCurrency} → {conversion.toAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })} {conversion.toCurrency}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(conversion.date).toLocaleString()}
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 px-2 text-primary"
                    onClick={() => {
                      // Add replay functionality - would dispatch conversion settings back to the converter
                      // Implementation depends on state management approach
                    }}
                  >
                    {t("common.replay")}
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}

// Export the addConversion function so it can be used by the CurrencyConverter
export function useRecentConversions() {
  const [conversions, setConversions] = useLocalStorage<Conversion[]>("recent-conversions", []);
  
  const addConversion = (conversion: Omit<Conversion, "id" | "date">) => {
    const newConversion = {
      ...conversion,
      id: Math.random().toString(36).substring(2, 9),
      date: new Date().toISOString(),
    };
    
    setConversions((prev) => {
      const newConversions = [newConversion, ...(prev || [])];
      // Keep only the latest 10 conversions
      return newConversions.slice(0, 10);
    });
  };
  
  return { addConversion };
}