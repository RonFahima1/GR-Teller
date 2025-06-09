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
  FormField,
  FormItem,
  FormLabel,
  FormDescription
} from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { useForm } from 'react-hook-form';
import { Edit, Save, FileText } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface ReceiptSettingsFormValues {
  sendEmailReceipt: boolean;
}

export function ReceiptSettings() {
  const [isEditing, setIsEditing] = useState(false);
  
  const form = useForm<ReceiptSettingsFormValues>({
    defaultValues: {
      sendEmailReceipt: true
    }
  });

  const onSubmit = (data: ReceiptSettingsFormValues) => {
    console.log('Saving receipt settings:', data);
    toast({
      title: "Settings saved",
      description: "Receipt settings have been updated successfully."
    });
    setIsEditing(false);
  };

  return (
    <>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Receipt</CardTitle>
          <CardDescription>
            Configure email receipt options for transactions
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
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Send Receipt via Email</h3>
              
              <FormField
                control={form.control}
                name="sendEmailReceipt"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 mr-2 text-blue-500" />
                        <FormLabel className="text-base">Automatically send transaction receipt to Sender via email</FormLabel>
                      </div>
                      <FormDescription>
                        When enabled, all transaction receipts will automatically be sent to the sender's email address
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={!isEditing}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              {form.watch('sendEmailReceipt') && (
                <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
                  <div className="text-sm flex items-start">
                    <div className="bg-blue-500 p-2 rounded-full mr-3">
                      <FileText className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium">Receipt emails are active</p>
                      <p className="text-muted-foreground mt-1">
                        Transaction receipts will automatically be sent to senders after successful transactions.
                        This helps provide immediate confirmation and transaction details for their records.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </>
  );
}
