'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Bell, Save, Pencil } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export function ComplianceNotificationsTab() {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [emails, setEmails] = useState('');
  
  // Notification settings
  const [notifications, setNotifications] = useState({
    kycFail: true,
    complianceReview: true,
    uploadedDocument: false,
    documentVerified: true,
    transactionCreated: false,
    transactionCanceled: true,
  });

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
      description: 'Compliance notifications settings have been saved successfully.',
    });
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl flex items-center gap-2">
          <Bell className="h-5 w-5 text-primary" />
          Compliance notifications
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
            <Label htmlFor="notification-emails" className="text-base font-medium">Emails Will Be Sent To</Label>
            {isEditing ? (
              <Input 
                id="notification-emails" 
                value={emails} 
                onChange={(e) => setEmails(e.target.value)} 
                className="mt-2"
                placeholder="Enter email addresses separated by commas" 
              />
            ) : (
              <p className={`mt-1 ${emails ? 'text-gray-900' : 'text-gray-400 italic'}`}>
                {emails || 'No emails configured'}
              </p>
            )}
          </div>
          
          <div className="space-y-4">
            {/* KYC Fail */}
            <div className="flex items-start justify-between">
              <div>
                <p className="font-medium">KYC Fail</p>
                <p className="text-sm text-gray-500">Notify every time an automated address or ID check has failed</p>
              </div>
              {isEditing ? (
                <Switch 
                  checked={notifications.kycFail} 
                  onCheckedChange={() => handleToggleNotification('kycFail')} 
                />
              ) : (
                <div className={`h-4 w-4 rounded-full ${notifications.kycFail ? 'bg-primary' : 'bg-gray-200'}`} />
              )}
            </div>
            
            {/* Transaction Moved To Compliance Review */}
            <div className="flex items-start justify-between">
              <div>
                <p className="font-medium">Transaction Moved To Compliance Review</p>
                <p className="text-sm text-gray-500">Notify every time a transaction is moved to compliance review</p>
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
            
            {/* Uploaded Document */}
            <div className="flex items-start justify-between">
              <div>
                <p className="font-medium">Uploaded Document</p>
                <p className="text-sm text-gray-500">Send a notification when a document is uploaded to the system</p>
              </div>
              {isEditing ? (
                <Switch 
                  checked={notifications.uploadedDocument} 
                  onCheckedChange={() => handleToggleNotification('uploadedDocument')} 
                />
              ) : (
                <div className={`h-4 w-4 rounded-full ${notifications.uploadedDocument ? 'bg-primary' : 'bg-gray-200'}`} />
              )}
            </div>
            
            {/* Document Verified */}
            <div className="flex items-start justify-between">
              <div>
                <p className="font-medium">Document Verified</p>
                <p className="text-sm text-gray-500">Send a notification when a status of a customer document is set to "Verified"</p>
              </div>
              {isEditing ? (
                <Switch 
                  checked={notifications.documentVerified} 
                  onCheckedChange={() => handleToggleNotification('documentVerified')} 
                />
              ) : (
                <div className={`h-4 w-4 rounded-full ${notifications.documentVerified ? 'bg-primary' : 'bg-gray-200'}`} />
              )}
            </div>
            
            {/* Transaction Created */}
            <div className="flex items-start justify-between">
              <div>
                <p className="font-medium">Transaction Created</p>
                <p className="text-sm text-gray-500">Notify every time a new transaction is created</p>
              </div>
              {isEditing ? (
                <Switch 
                  checked={notifications.transactionCreated} 
                  onCheckedChange={() => handleToggleNotification('transactionCreated')} 
                />
              ) : (
                <div className={`h-4 w-4 rounded-full ${notifications.transactionCreated ? 'bg-primary' : 'bg-gray-200'}`} />
              )}
            </div>
            
            {/* Transaction Canceled */}
            <div className="flex items-start justify-between">
              <div>
                <p className="font-medium">Transaction Canceled</p>
                <p className="text-sm text-gray-500">Notify every time a transaction is canceled</p>
              </div>
              {isEditing ? (
                <Switch 
                  checked={notifications.transactionCanceled} 
                  onCheckedChange={() => handleToggleNotification('transactionCanceled')} 
                />
              ) : (
                <div className={`h-4 w-4 rounded-full ${notifications.transactionCanceled ? 'bg-primary' : 'bg-gray-200'}`} />
              )}
            </div>
          </div>
          
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
