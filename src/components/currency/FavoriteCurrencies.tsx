"use client";

import { useEffect, useState } from "react";
import { useLocalStorage } from "react-use";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Plus, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranslation } from "@/hooks/useTranslation";
import { cn } from "@/lib/utils";

interface FavoritePair {
  id: string;
  baseCurrency: string;
  targetCurrency: string;
}

const COMMON_CURRENCIES = ["USD", "EUR", "GBP", "JPY", "AUD", "CAD", "CHF", "CNY", "INR"];

export function FavoriteCurrencies({ onSelectPair }: { onSelectPair?: (base: string, target: string) => void }) {
  const { t } = useTranslation();
  const [favorites, setFavorites] = useLocalStorage<FavoritePair[]>("favorite-currency-pairs", []);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newBaseCurrency, setNewBaseCurrency] = useState("USD");
  const [newTargetCurrency, setNewTargetCurrency] = useState("EUR");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }
  
  const addFavoritePair = () => {
    if (newBaseCurrency === newTargetCurrency) return;
    
    // Check if this pair already exists
    const exists = favorites?.some(
      pair => pair.baseCurrency === newBaseCurrency && pair.targetCurrency === newTargetCurrency
    );
    
    if (exists) return;
    
    const newPair = {
      id: Math.random().toString(36).substring(2, 9),
      baseCurrency: newBaseCurrency,
      targetCurrency: newTargetCurrency,
    };
    
    setFavorites([...(favorites || []), newPair]);
    setIsAddDialogOpen(false);
  };
  
  const removeFavoritePair = (id: string) => {
    setFavorites((favorites || []).filter(pair => pair.id !== id));
  };
  
  const handlePairSelection = (base: string, target: string) => {
    if (onSelectPair) {
      onSelectPair(base, target);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-md font-medium">
          {t("currency.favoritePairs")}
        </CardTitle>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 px-2">
              <Plus className="h-4 w-4 mr-1" />
              {t("common.add")}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{t("currency.addFavoritePair")}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-[1fr,auto,1fr] items-center gap-2">
                <Select value={newBaseCurrency} onValueChange={setNewBaseCurrency}>
                  <SelectTrigger>
                    <SelectValue placeholder={t("currency.selectCurrency")} />
                  </SelectTrigger>
                  <SelectContent>
                    {COMMON_CURRENCIES.map((currency) => (
                      <SelectItem key={`base-${currency}`} value={currency}>
                        {currency}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <span className="text-center">/</span>
                <Select value={newTargetCurrency} onValueChange={setNewTargetCurrency}>
                  <SelectTrigger>
                    <SelectValue placeholder={t("currency.selectCurrency")} />
                  </SelectTrigger>
                  <SelectContent>
                    {COMMON_CURRENCIES.map((currency) => (
                      <SelectItem key={`target-${currency}`} value={currency}>
                        {currency}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={addFavoritePair} disabled={newBaseCurrency === newTargetCurrency}>
                {t("common.add")}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {!favorites || favorites.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">
            {t("currency.noFavoritePairs")}
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {favorites.map((pair) => (
              <div
                key={pair.id}
                className={cn(
                  "group flex items-center gap-1.5 px-3 py-1.5 rounded-full",
                  "bg-muted hover:bg-primary/10 transition-colors",
                  "border border-border cursor-pointer"
                )}
                onClick={() => handlePairSelection(pair.baseCurrency, pair.targetCurrency)}
              >
                <Heart className="h-3.5 w-3.5 text-primary" />
                <span className="text-sm">
                  {pair.baseCurrency}/{pair.targetCurrency}
                </span>
                <Trash2 
                  className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-destructive transition-opacity" 
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFavoritePair(pair.id);
                  }}
                />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function useFavoriteCurrencies() {
  const [favorites, setFavorites] = useLocalStorage<FavoritePair[]>("favorite-currency-pairs", []);
  
  const addFavoritePair = (baseCurrency: string, targetCurrency: string) => {
    if (baseCurrency === targetCurrency) return;
    
    // Check if already exists
    if (favorites?.some(pair => 
      pair.baseCurrency === baseCurrency && pair.targetCurrency === targetCurrency
    )) {
      return;
    }
    
    const newPair = {
      id: Math.random().toString(36).substring(2, 9),
      baseCurrency,
      targetCurrency,
    };
    
    setFavorites([...(favorites || []), newPair]);
  };
  
  return { favorites, addFavoritePair };
}