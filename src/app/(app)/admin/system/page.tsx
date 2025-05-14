"use client";
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Settings, ShieldCheck, Cloud } from "lucide-react";

export default function SystemSettingsPage() {
  const [maintenance, setMaintenance] = useState(false);
  const [auditLogging, setAuditLogging] = useState(true);
  const [cloudBackup, setCloudBackup] = useState(false);

  return (
    <div className="container mx-auto p-6 max-w-3xl">
      <h1 className="text-2xl font-bold mb-4">System Settings</h1>
      <Card className="mb-6 card-ios">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" /> System Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Maintenance Mode</h3>
              <p className="text-sm text-muted-foreground">Temporarily disable user access for maintenance</p>
            </div>
            <Switch checked={maintenance} onCheckedChange={setMaintenance} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Audit Logging</h3>
              <p className="text-sm text-muted-foreground">Track all critical actions for compliance</p>
            </div>
            <Switch checked={auditLogging} onCheckedChange={setAuditLogging} />
          </div>
        </CardContent>
      </Card>
      <Card className="card-ios">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cloud className="h-5 w-5" /> Integrations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Cloud Backup</h3>
              <p className="text-sm text-muted-foreground">Enable automatic daily cloud backups</p>
            </div>
            <Switch checked={cloudBackup} onCheckedChange={setCloudBackup} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 