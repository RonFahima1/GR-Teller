'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { MessageSquareText, Save, Pencil } from 'lucide-react';

type RadioValue = 'info' | 'warning' | 'critical';

// Simple radio component for message level selection
const MessageLevelSelector = ({ 
  value, 
  onChange, 
  disabled 
}: { 
  value: RadioValue, 
  onChange: (value: RadioValue) => void,
  disabled: boolean
}) => {
  return (
    <div className="flex space-x-4 mt-2">
      <div className="flex items-center space-x-2">
        <input 
          type="radio" 
          id="info" 
          name="message-level" 
          value="info" 
          checked={value === 'info'}
          onChange={() => !disabled && onChange('info')}
          disabled={disabled}
          className="accent-blue-600"
        />
        <Label htmlFor="info" className="text-blue-600">Info</Label>
      </div>
      <div className="flex items-center space-x-2">
        <input 
          type="radio" 
          id="warning" 
          name="message-level" 
          value="warning"
          checked={value === 'warning'}
          onChange={() => !disabled && onChange('warning')}
          disabled={disabled}
          className="accent-amber-600"
        />
        <Label htmlFor="warning" className="text-amber-600">Warning</Label>
      </div>
      <div className="flex items-center space-x-2">
        <input 
          type="radio" 
          id="critical" 
          name="message-level" 
          value="critical"
          checked={value === 'critical'}
          onChange={() => !disabled && onChange('critical')}
          disabled={disabled}
          className="accent-red-600"
        />
        <Label htmlFor="critical" className="text-red-600">Critical</Label>
      </div>
    </div>
  );
};

export function AgentsAnnouncementsTab() {
  const [isEditing, setIsEditing] = useState(false);
  const [sendNotification, setSendNotification] = useState(true);
  const [messageLevel, setMessageLevel] = useState<RadioValue>('warning');
  const [notificationMessage, setNotificationMessage] = useState('');

  const handleSave = () => {
    setIsEditing(false);
    // Show success message
    alert('Agent announcements settings have been saved successfully.');
  };

  const getLevelColor = (level: RadioValue) => {
    switch (level) {
      case 'info': return 'text-blue-600';
      case 'warning': return 'text-amber-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl flex items-center gap-2">
          <MessageSquareText className="h-5 w-5 text-primary" />
          Agents Announcements
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
            <>
              <div className="mt-4">
                <Label className="font-medium">Select a level of your message</Label>
                
                {isEditing ? (
                  <MessageLevelSelector
                    value={messageLevel}
                    onChange={setMessageLevel}
                    disabled={!isEditing}
                  />
                ) : (
                  <div className="mt-2">
                    <span className={`font-medium ${getLevelColor(messageLevel)} capitalize`}>
                      {messageLevel}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="mt-4">
                <Label htmlFor="announcement-message">Add notification message below</Label>
                {isEditing ? (
                  <Textarea 
                    id="announcement-message" 
                    value={notificationMessage} 
                    onChange={(e) => setNotificationMessage(e.target.value)} 
                    className="mt-2 h-32"
                    placeholder="Enter announcement message for agents" 
                  />
                ) : (
                  <div className={`mt-2 p-4 border rounded-md min-h-[100px] ${getLevelColor(messageLevel)} bg-opacity-5`}>
                    {notificationMessage || <span className="text-gray-400 italic">No announcement message configured</span>}
                  </div>
                )}
              </div>
            </>
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
