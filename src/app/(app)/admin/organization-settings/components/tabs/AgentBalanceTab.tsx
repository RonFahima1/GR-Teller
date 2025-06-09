'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { CircleDollarSign, Save, Pencil } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export function AgentBalanceTab() {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [allowBalanceConversion, setAllowBalanceConversion] = useState(false);

  const handleSave = () => {
    setIsEditing(false);
    toast({
      title: 'Settings updated',
      description: 'Agent balance conversion settings have been saved successfully.',
    });
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl flex items-center gap-2">
          <CircleDollarSign className="h-5 w-5 text-primary" />
          Agent Balance Conversion
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
              checked={allowBalanceConversion} 
              onCheckedChange={() => isEditing && setAllowBalanceConversion(!allowBalanceConversion)} 
              disabled={!isEditing}
              id="allow-balance-conversion"
            />
            <div>
              <Label htmlFor="allow-balance-conversion" className="font-medium">Allow Balance Conversion By Agents</Label>
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
