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
import { Textarea } from '@/components/ui/textarea';
import {
  RadioGroup,
  RadioGroupItem
} from '@/components/ui/radio-group';
import { useForm } from 'react-hook-form';
import { Edit, Save, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface AgentAnnouncementsFormValues {
  sendNotification: boolean;
  notificationLevel: 'info' | 'warning' | 'critical';
  notificationTitle: string;
  notificationMessage: string;
}

export function AgentAnnouncements() {
  const [isEditing, setIsEditing] = useState(false);
  
  const form = useForm<AgentAnnouncementsFormValues>({
    defaultValues: {
      sendNotification: false,
      notificationLevel: 'warning',
      notificationTitle: '',
      notificationMessage: ''
    }
  });

  const onSubmit = (data: AgentAnnouncementsFormValues) => {
    console.log('Saving agent announcement settings:', data);
    toast({
      title: "Announcement configured",
      description: "Agent announcement settings have been updated successfully."
    });
    setIsEditing(false);
  };
  
  const characterCount = form.watch('notificationMessage').length;
  const maxLength = 500;

  const getNotificationLevelIcon = (level: string) => {
    switch (level) {
      case 'info':
        return <Info className="h-4 w-4 text-blue-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case 'critical':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Agents Announcements</CardTitle>
          <CardDescription>
            Configure important announcements for agent users
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
                    <FormLabel className="text-base">Send Notification</FormLabel>
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
                  name="notificationLevel"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Select a level of your message</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                          disabled={!isEditing}
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="info" />
                            </FormControl>
                            <FormLabel className="font-normal flex items-center">
                              <Info className="h-4 w-4 mr-2 text-blue-500" />
                              Info
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="warning" />
                            </FormControl>
                            <FormLabel className="font-normal flex items-center">
                              <AlertTriangle className="h-4 w-4 mr-2 text-amber-500" />
                              Warning
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="critical" />
                            </FormControl>
                            <FormLabel className="font-normal flex items-center">
                              <AlertCircle className="h-4 w-4 mr-2 text-red-500" />
                              Critical
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                    </FormItem>
                  )}
                />

                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Add notification message below</h3>
                  
                  <FormField
                    control={form.control}
                    name="notificationTitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled={!isEditing}
                            placeholder="Enter announcement title"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="notificationMessage"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="relative">
                            <Textarea
                              {...field}
                              disabled={!isEditing}
                              rows={4}
                              maxLength={maxLength}
                              className="resize-y"
                              placeholder="Enter announcement message"
                            />
                            <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
                              {characterCount}/{maxLength}
                            </div>
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  {(form.watch('notificationTitle') || form.watch('notificationMessage')) && (
                    <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
                      <h4 className="font-medium mb-2">Preview</h4>
                      <div className={`p-3 rounded-md border shadow-sm ${
                        form.watch('notificationLevel') === 'info' ? 'bg-blue-50 border-blue-200' : 
                        form.watch('notificationLevel') === 'warning' ? 'bg-amber-50 border-amber-200' : 
                        'bg-red-50 border-red-200'
                      }`}>
                        <div className="flex items-center gap-2">
                          {getNotificationLevelIcon(form.watch('notificationLevel'))}
                          <p className="font-medium">
                            {form.watch('notificationTitle') || 'Announcement'}
                          </p>
                        </div>
                        <p className="mt-2 text-sm">
                          {form.watch('notificationMessage')}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </form>
        </Form>
      </CardContent>
    </>
  );
}
