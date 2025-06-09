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
import { Separator } from '@/components/ui/separator';

interface CustomerNotificationsFormValues {
  notifyOnSignup: boolean;
  notifyOnPasswordChange: boolean;
  notifyOnReceiverChange: boolean;
  notifyOnComplianceReview: boolean;
  notifyOnComplianceApproved: boolean;
  notifyOnCompliancePending: boolean;
  notifySmsRegistration: boolean;
  sendBcc: boolean;
  bccEmail: string;
}

export function CustomerNotifications() {
  const [isEditing, setIsEditing] = useState(false);
  
  const form = useForm<CustomerNotificationsFormValues>({
    defaultValues: {
      notifyOnSignup: true,
      notifyOnPasswordChange: true,
      notifyOnReceiverChange: true,
      notifyOnComplianceReview: true,
      notifyOnComplianceApproved: true,
      notifyOnCompliancePending: true,
      notifySmsRegistration: true,
      sendBcc: false,
      bccEmail: ''
    }
  });

  const onSubmit = (data: CustomerNotificationsFormValues) => {
    console.log('Saving customer notification settings:', data);
    toast({
      title: "Settings saved",
      description: "Customer notification settings have been updated successfully."
    });
    setIsEditing(false);
  };

  return (
    <>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Customer Notifications</CardTitle>
          <CardDescription>
            Configure notifications sent to customers for various events
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
              <h3 className="text-lg font-medium">Send Notifications to customer on</h3>
              
              <FormField
                control={form.control}
                name="notifyOnSignup"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Sign up</FormLabel>
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
                name="notifyOnPasswordChange"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Password Change</FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Send an email when a user has reset their password
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
                name="notifyOnReceiverChange"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Receiver Change</FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Send an email when the user's recipients list has changed
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
                name="notifyOnComplianceReview"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Compliance Review</FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Send an email once a transaction is pending compliance officer's approval
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
                name="notifyOnComplianceApproved"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Compliance Status Change</FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Send email when "Approve" status is set
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
                name="notifyOnCompliancePending"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Compliance Status Change</FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Send email when "Pending Review" status is set
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
                name="notifySmsRegistration"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">SMS Upon Registration</FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Send SMS to Customers upon registration
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
            
            <Separator className="my-4" />
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Send BCC (blind copy)</h3>
              
              <FormField
                control={form.control}
                name="sendBcc"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Send BCC</FormLabel>
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
              
              {form.watch('sendBcc') && (
                <FormField
                  control={form.control}
                  name="bccEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>BCC will be sent to</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={!isEditing}
                          type="email"
                          placeholder="Enter email address"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </>
  );
}
