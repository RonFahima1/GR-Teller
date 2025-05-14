"use client";

import { useState } from "react";
import { CurrencyRates } from "./CurrencyRates";
import { CurrencyConverter } from "./CurrencyConverter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslation } from "@/hooks/useTranslation";
import { useMediaQuery } from "@/hooks/use-media-query";

export default function CurrencyExchangeView() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("converter");
  const isDesktop = useMediaQuery("(min-width: 768px)");

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6">{t("currency.exchangeTitle")}</h1>
      
      {isDesktop ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CurrencyConverter />
          <CurrencyRates />
        </div>
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 w-full mb-4">
            <TabsTrigger value="converter">{t("currency.converter")}</TabsTrigger>
            <TabsTrigger value="rates">{t("currency.rates")}</TabsTrigger>
          </TabsList>
          <TabsContent value="converter">
            <CurrencyConverter />
          </TabsContent>
          <TabsContent value="rates">
            <CurrencyRates />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}