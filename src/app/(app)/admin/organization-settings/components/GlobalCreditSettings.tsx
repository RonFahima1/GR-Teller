import React, { useState } from 'react';
import { 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { Edit, Save } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface GlobalCreditFormValues {
  creditLimit: string;
  currency: string;
  paymentTerms: string;
}

export function GlobalCreditSettings() {
  const [isEditing, setIsEditing] = useState(false);
  
  const form = useForm<GlobalCreditFormValues>({
    defaultValues: {
      creditLimit: '2,400.00',
      currency: 'USD',
      paymentTerms: '5'
    }
  });

  const onSubmit = (data: GlobalCreditFormValues) => {
    // In a real app, this would save to an API
    console.log('Saving global credit settings:', data);
    toast({
      title: "Settings saved",
      description: "Global credit settings have been updated successfully.",
    });
    setIsEditing(false);
  };

  return (
    <>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Global Credit</CardTitle>
          <CardDescription>
            Manage organization-wide credit limits and payment terms
          </CardDescription>
        </div>
        {!isEditing ? (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-1"
          >
            <Edit className="h-4 w-4" /> Edit
          </Button>
        ) : (
          <Button 
            variant="default" 
            size="sm" 
            onClick={form.handleSubmit(onSubmit)}
            className="flex items-center gap-1"
          >
            <Save className="h-4 w-4" /> Save
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="creditLimit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Credit Limit</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        disabled={!isEditing}
                        type="text"
                        inputMode="decimal"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Currency</FormLabel>
                    <Select 
                      disabled={!isEditing}
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="EUR">EUR</SelectItem>
                        <SelectItem value="GBP">GBP</SelectItem>
                        <SelectItem value="ILS">ILS</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="paymentTerms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment terms</FormLabel>
                    <div className="flex items-center gap-2">
                      <FormControl>
                        <Input 
                          {...field} 
                          disabled={!isEditing}
                          type="number"
                          className="w-20"
                        />
                      </FormControl>
                      <span className="text-sm text-muted-foreground">days</span>
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
      </CardContent>
    </>
  );
}
