'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { MessageSquare, Save, Pencil } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export function CustomerNotificationsTab() {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  
  // Customer notification settings
  const [notifications, setNotifications] = useState({
    signUp: true,
    passwordChange: true,
    receiverChange: false,
    complianceReview: true,
    complianceStatusApprove: true,
    complianceStatusPending: false,
    smsRegistration: true,
  });

  // BCC settings
  const [sendBCC, setSendBCC] = useState(false);
  const [bccEmails, setBCCEmails] = useState('');

  const handleToggleNotification = (key: string) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev],
    }));
  };

  const handleSave = () => {
    setIsEditing(false);
    toast({
      title: 'Settings updated',
      description: 'Customer notifications settings have been saved successfully.',
    });
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary" />
          Customer Notifications
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
          <div>
            <Label className="text-base font-medium">Send Notifications to customer on</Label>
          </div>
          
          <div className="space-y-4">
            {/* Sign Up */}
            <div className="flex items-start justify-between">
              <div>
                <p className="font-medium">Sign Up</p>
              </div>
              {isEditing ? (
                <Switch 
                  checked={notifications.signUp} 
                  onCheckedChange={() => handleToggleNotification('signUp')} 
                />
              ) : (
                <div className={`h-4 w-4 rounded-full ${notifications.signUp ? 'bg-primary' : 'bg-gray-200'}`} />
              )}
            </div>
            
            {/* Password Change */}
            <div className="flex items-start justify-between">
              <div>
                <p className="font-medium">Password Change</p>
                <p className="text-sm text-gray-500">Send an email when a user has reset his password</p>
              </div>
              {isEditing ? (
                <Switch 
                  checked={notifications.passwordChange} 
                  onCheckedChange={() => handleToggleNotification('passwordChange')} 
                />
              ) : (
                <div className={`h-4 w-4 rounded-full ${notifications.passwordChange ? 'bg-primary' : 'bg-gray-200'}`} />
              )}
            </div>
            
            {/* Receiver Change */}
            <div className="flex items-start justify-between">
              <div>
                <p className="font-medium">Receiver Change</p>
                <p className="text-sm text-gray-500">Send an email when the user's recipients list has changed</p>
              </div>
              {isEditing ? (
                <Switch 
                  checked={notifications.receiverChange} 
                  onCheckedChange={() => handleToggleNotification('receiverChange')} 
                />
              ) : (
                <div className={`h-4 w-4 rounded-full ${notifications.receiverChange ? 'bg-primary' : 'bg-gray-200'}`} />
              )}
            </div>
            
            {/* Compliance Review */}
            <div className="flex items-start justify-between">
              <div>
                <p className="font-medium">Compliance Review</p>
                <p className="text-sm text-gray-500">Send an email once a transaction is pending compliance officer's approval</p>
              </div>
              {isEditing ? (
                <Switch 
                  checked={notifications.complianceReview} 
                  onCheckedChange={() => handleToggleNotification('complianceReview')} 
                />
              ) : (
                <div className={`h-4 w-4 rounded-full ${notifications.complianceReview ? 'bg-primary' : 'bg-gray-200'}`} />
              )}
            </div>
            
            {/* Compliance Status Change - Approve */}
            <div className="flex items-start justify-between">
              <div>
                <p className="font-medium">Compliance Status Change</p>
                <p className="text-sm text-gray-500">Send email when "Approve" status is set</p>
              </div>
              {isEditing ? (
                <Switch 
                  checked={notifications.complianceStatusApprove} 
                  onCheckedChange={() => handleToggleNotification('complianceStatusApprove')} 
                />
              ) : (
                <div className={`h-4 w-4 rounded-full ${notifications.complianceStatusApprove ? 'bg-primary' : 'bg-gray-200'}`} />
              )}
            </div>
            
            {/* Compliance Status Change - Pending */}
            <div className="flex items-start justify-between">
              <div>
                <p className="font-medium">Compliance Status Change</p>
                <p className="text-sm text-gray-500">Send email when "Pending Review" status is set</p>
              </div>
              {isEditing ? (
                <Switch 
                  checked={notifications.complianceStatusPending} 
                  onCheckedChange={() => handleToggleNotification('complianceStatusPending')} 
                />
              ) : (
                <div className={`h-4 w-4 rounded-full ${notifications.complianceStatusPending ? 'bg-primary' : 'bg-gray-200'}`} />
              )}
            </div>
            
            {/* SMS Upon Registration */}
            <div className="flex items-start justify-between">
              <div>
                <p className="font-medium">SMS Upon Registration</p>
                <p className="text-sm text-gray-500">Send SMS to Customers upon registration</p>
              </div>
              {isEditing ? (
                <Switch 
                  checked={notifications.smsRegistration} 
                  onCheckedChange={() => handleToggleNotification('smsRegistration')} 
                />
              ) : (
                <div className={`h-4 w-4 rounded-full ${notifications.smsRegistration ? 'bg-primary' : 'bg-gray-200'}`} />
              )}
            </div>
          </div>
          
          {/* BCC Section */}
          <div className="mt-8 border-t pt-6">
            <Label className="text-base font-medium">Send BCC (blind copy)</Label>
            
            <div className="mt-4 flex items-center gap-2">
              <Switch 
                checked={sendBCC} 
                onCheckedChange={() => isEditing && setSendBCC(!sendBCC)} 
                disabled={!isEditing}
              />
              <span className="font-medium">Send BCC</span>
            </div>
            
            {sendBCC && (
              <div className="mt-4">
                <Label htmlFor="bcc-emails">BCC Will Be Sent To</Label>
                {isEditing ? (
                  <Input 
                    id="bcc-emails" 
                    value={bccEmails} 
                    onChange={(e) => setBCCEmails(e.target.value)} 
                    className="mt-2"
                    placeholder="Enter email addresses separated by commas" 
                  />
                ) : (
                  <p className={`mt-1 ${bccEmails ? 'text-gray-900' : 'text-gray-400 italic'}`}>
                    {bccEmails || 'No BCC emails configured'}
                  </p>
                )}
              </div>
            )}
          </div>
          
          {isEditing && (
            <Button onClick={handleSave} className="mt-6">
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
