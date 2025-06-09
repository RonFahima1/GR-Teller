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
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { Edit, Save } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface WebMobileNotificationsFormValues {
  sendNotification: boolean;
  notificationMessage: string;
  notificationUrl: string;
}

export function WebMobileNotifications() {
  const [isEditing, setIsEditing] = useState(false);
  
  const form = useForm<WebMobileNotificationsFormValues>({
    defaultValues: {
      sendNotification: true,
      notificationMessage: 'HAPPY WEDNESDAY!!\nSALARY TIME IS COMING TO OUR TELLERS WAITING TO YOU AT OUR BRANCHES TO SEND YOU TRANSACTIONS WITH ONLY 10NIS COMMISSION!! GLOBAL REMIT',
      notificationUrl: 'https://global-remit.co.il/dd'
    }
  });

  const onSubmit = (data: WebMobileNotificationsFormValues) => {
    console.log('Saving web & mobile notification settings:', data);
    toast({
      title: "Settings saved",
      description: "Web & mobile notification settings have been updated successfully."
    });
    setIsEditing(false);
  };
  
  const characterCount = form.watch('notificationMessage').length;
  const maxLength = 250;

  return (
    <>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Web and Mobile Notifications</CardTitle>
          <CardDescription>
            Configure notifications shown to customers in web and mobile apps
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
              name="sendNotification"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Send notification</FormLabel>
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
            
            {form.watch('sendNotification') && (
              <>
                <FormField
                  control={form.control}
                  name="notificationMessage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Add notification message below</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Textarea
                            {...field}
                            disabled={!isEditing}
                            rows={4}
                            maxLength={maxLength}
                            className="resize-y"
                          />
                          <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
                            {characterCount}/{maxLength}
                          </div>
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="notificationUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notification URL (optional)</FormLabel>
                      <FormControl>
                        <input
                          type="url"
                          {...field}
                          disabled={!isEditing}
                          placeholder="https://example.com"
                          className="w-full p-2 rounded-md border border-input bg-background text-sm"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                {isEditing && (
                  <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Preview</h4>
                    <div className="bg-white dark:bg-gray-800 p-3 rounded-md border shadow-sm">
                      <p className="text-sm whitespace-pre-line">{form.watch('notificationMessage')}</p>
                      {form.watch('notificationUrl') && (
                        <p className="text-sm text-blue-500 mt-2">
                          {form.watch('notificationUrl')}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </form>
        </Form>
      </CardContent>
    </>
  );
}
