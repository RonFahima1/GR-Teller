'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { FileText, Save, Pencil } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export function ReceiptTab() {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [sendReceiptEmail, setSendReceiptEmail] = useState(true);

  const handleSave = () => {
    setIsEditing(false);
    toast({
      title: 'Settings updated',
      description: 'Receipt settings have been saved successfully.',
    });
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          Receipt
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
          <div className="flex items-center gap-3">
            <Switch 
              checked={sendReceiptEmail} 
              onCheckedChange={() => isEditing && setSendReceiptEmail(!sendReceiptEmail)} 
              disabled={!isEditing}
              id="send-receipt-email"
            />
            <div>
              <Label htmlFor="send-receipt-email" className="font-medium">Send Receipt Via Email</Label>
              <p className="text-sm text-gray-500 mt-1">
                Automatically send transaction receipt to Sender via email
              </p>
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
