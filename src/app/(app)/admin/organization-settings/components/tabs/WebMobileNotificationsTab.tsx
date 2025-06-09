'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { MonitorSmartphone, Save, Pencil } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export function WebMobileNotificationsTab() {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [sendNotification, setSendNotification] = useState(true);
  const [notificationMessage, setNotificationMessage] = useState('');

  const handleSave = () => {
    setIsEditing(false);
    toast({
      title: 'Settings updated',
      description: 'Web and mobile notification settings have been saved successfully.',
    });
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl flex items-center gap-2">
          <MonitorSmartphone className="h-5 w-5 text-primary" />
          Web and Mobile Notifications
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
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Switch 
              checked={sendNotification} 
              onCheckedChange={() => isEditing && setSendNotification(!sendNotification)} 
              disabled={!isEditing}
            />
            <Label className="font-medium">Send Notification</Label>
          </div>
          
          {sendNotification && (
            <div className="mt-4">
              <Label htmlFor="notification-message">Add notification message below</Label>
              {isEditing ? (
                <Textarea 
                  id="notification-message" 
                  value={notificationMessage} 
                  onChange={(e) => setNotificationMessage(e.target.value)} 
                  className="mt-2 h-32"
                  placeholder="Enter notification message" 
                />
              ) : (
                <div className="mt-2 p-4 border rounded-md min-h-[100px]">
                  {notificationMessage || <span className="text-gray-400 italic">No message configured</span>}
                </div>
              )}
            </div>
          )}
          
          {isEditing && (
            <Button onClick={handleSave} className="mt-4">
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
