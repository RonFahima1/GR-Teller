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
  FormLabel
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { useForm } from 'react-hook-form';
import { Edit, Save } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface ComplianceNotificationFormValues {
  notificationEmail: string;
  notifyKycFail: boolean;
  notifyComplianceReview: boolean;
  notifyDocumentUpload: boolean;
  notifyDocumentVerified: boolean;
  notifyTransactionCreated: boolean;
  notifyTransactionCanceled: boolean;
}

export function ComplianceNotifications() {
  const [isEditing, setIsEditing] = useState(false);
  
  const form = useForm<ComplianceNotificationFormValues>({
    defaultValues: {
      notificationEmail: 'compliance@globalremit.com',
      notifyKycFail: true,
      notifyComplianceReview: true,
      notifyDocumentUpload: true,
      notifyDocumentVerified: true,
      notifyTransactionCreated: true,
      notifyTransactionCanceled: true
    }
  });

  const onSubmit = (data: ComplianceNotificationFormValues) => {
    console.log('Saving compliance notification settings:', data);
    toast({
      title: "Settings saved",
      description: "Compliance notification settings have been updated successfully."
    });
    setIsEditing(false);
  };

  return (
    <>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Compliance Notifications</CardTitle>
          <CardDescription>
            Configure which compliance events trigger email notifications
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
            <FormField
              control={form.control}
              name="notificationEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Emails will be sent to</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={!isEditing}
                      type="email"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="notifyKycFail"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">KYC Fail</FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Notify every time an automated address or ID check has failed
                      </p>
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
              
              <FormField
                control={form.control}
                name="notifyComplianceReview"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Transaction moved to compliance review</FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Notify every time a transaction is moved to compliance review
                      </p>
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
              
              <FormField
                control={form.control}
                name="notifyDocumentUpload"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Uploaded document</FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Send a notification when a document is uploaded to the system
                      </p>
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
              
              <FormField
                control={form.control}
                name="notifyDocumentVerified"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Document verified</FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Send a notification when a status of a customer document is set to "Verified"
                      </p>
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
              
              <FormField
                control={form.control}
                name="notifyTransactionCreated"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Transaction Created</FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Notify every time a new transaction is created
                      </p>
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
              
              <FormField
                control={form.control}
                name="notifyTransactionCanceled"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Transaction Canceled</FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Notify every time a transaction is canceled
                      </p>
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
            </div>
          </form>
        </Form>
      </CardContent>
    </>
  );
}
