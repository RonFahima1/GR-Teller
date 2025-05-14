'use client';

import { useEffect } from 'react';
import { useCurrencyRates } from '@/services/currency-rates';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCcw } from 'lucide-react';
import { format } from 'date-fns';

export default function TestCurrencyPage() {
  const { rates, loading, error, lastUpdated, fetchRates } = useCurrencyRates();

  useEffect(() => {
    fetchRates();
  }, [fetchRates]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Currency Rates API Test</h1>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>API Status</CardTitle>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={fetchRates}
            disabled={loading}
          >
            <RefreshCcw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="font-medium">Status:</p>
              {loading ? (
                <p className="text-muted-foreground">Loading...</p>
              ) : error ? (
                <p className="text-destructive">{error}</p>
              ) : (
                <p className="text-green-600">Connected successfully</p>
              )}
            </div>

            {lastUpdated && (
              <div>
                <p className="font-medium">Last Updated:</p>
                <p className="text-muted-foreground">
                  {format(lastUpdated, 'PPpp')}
                </p>
              </div>
            )}

            {rates.length > 0 && (
              <div>
                <p className="font-medium mb-2">Sample Rates:</p>
                <div className="grid gap-2">
                  {rates.slice(0, 5).map((rate) => (
                    <div 
                      key={rate.code}
                      className="flex justify-between items-center p-2 bg-muted rounded"
                    >
                      <span>{rate.code} - {rate.name}</span>
                      <span className="font-medium">{rate.rate.toFixed(4)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}