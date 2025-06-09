'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Building2, Save, Pencil } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export function GlobalCreditTab() {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [creditLimit, setCreditLimit] = useState('2,400.00');
  const [currency, setCurrency] = useState('USD');
  const [paymentTerms, setPaymentTerms] = useState('30');

  const handleSave = () => {
    setIsEditing(false);
    toast({
      title: 'Settings updated',
      description: 'Global credit settings have been saved successfully.',
    });
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl flex items-center gap-2">
          <Building2 className="h-5 w-5 text-primary" />
          Global Credit
        </CardTitle>
        {!isEditing ? (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setIsEditing(true)}
            className="text-primary"
          >
            <Pencil className="h-4 w-4 mr-2" />
            EDIT
          </Button>
        ) : null}
      </CardHeader>
      <CardContent className="pt-4">
        {isEditing ? (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="credit-limit">Credit Limit</Label>
              <div className="flex gap-2">
                <Input 
                  id="credit-limit" 
                  value={creditLimit} 
                  onChange={(e) => setCreditLimit(e.target.value)} 
                  className="max-w-[200px]" 
                />
                <div className="relative">
                  <select 
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary rounded-md"
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="payment-terms">Payment Terms</Label>
              <div className="flex items-center gap-2">
                <Input 
                  id="payment-terms" 
                  type="number" 
                  value={paymentTerms} 
                  onChange={(e) => setPaymentTerms(e.target.value)} 
                  className="max-w-[100px]" 
                />
                <span className="text-gray-500">days</span>
              </div>
            </div>
            
            <Button onClick={handleSave} className="mt-4">
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Credit Limit</h3>
              <p className="text-lg font-medium">{creditLimit}</p>
              <p className="text-sm text-gray-500">{currency}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Payment Terms</h3>
              <p className="flex items-center gap-1">
                <span className="text-lg font-medium">{paymentTerms}</span>
                <span className="text-sm text-gray-500">days</span>
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
