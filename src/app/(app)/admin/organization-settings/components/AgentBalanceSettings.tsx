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
import { Edit, Save, RotateCw } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface AgentBalanceSettingsFormValues {
  allowBalanceConversion: boolean;
}

export function AgentBalanceSettings() {
  const [isEditing, setIsEditing] = useState(false);
  
  const form = useForm<AgentBalanceSettingsFormValues>({
    defaultValues: {
      allowBalanceConversion: false
    }
  });

  const onSubmit = (data: AgentBalanceSettingsFormValues) => {
    console.log('Saving agent balance settings:', data);
    toast({
      title: "Settings saved",
      description: "Agent balance conversion settings have been updated successfully."
    });
    setIsEditing(false);
  };

  return (
    <>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Agent Balance Conversion</CardTitle>
          <CardDescription>
            Configure balance conversion permissions for agents
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
              name="allowBalanceConversion"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <div className="flex items-center">
                      <RotateCw className="h-4 w-4 mr-2 text-blue-500" />
                      <FormLabel className="text-base">Allow Balance Conversion By Agents</FormLabel>
                    </div>
                    <FormDescription>
                      When enabled, agents can convert balance in the administration/settings admin page
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
            
            {form.watch('allowBalanceConversion') && (
              <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
                <div className="text-sm flex items-start">
                  <div className="bg-amber-500 p-2 rounded-full mr-3">
                    <RotateCw className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium">Agent Balance Conversion is Enabled</p>
                    <p className="text-muted-foreground mt-1">
                      Agents will be able to convert balances across different currencies.
                      This feature is accessible in the agent administration settings page.
                      Make sure your agents are properly trained on using this feature.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </form>
        </Form>
      </CardContent>
    </>
  );
}
