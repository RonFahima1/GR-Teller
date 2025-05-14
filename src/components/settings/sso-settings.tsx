"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Icons } from "@/components/ui/icons";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const ssoSchema = z.object({
  enabled: z.boolean(),
  clientId: z.string().min(1, "Client ID is required"),
  clientSecret: z.string().min(1, "Client Secret is required"),
  tenantId: z.string().min(1, "Tenant ID is required"),
  redirectUri: z.string().url("Must be a valid URL"),
});

type SSOFormData = z.infer<typeof ssoSchema>;

export function SSOSettings() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [isEnabled, setIsEnabled] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<SSOFormData>({
    resolver: zodResolver(ssoSchema),
    defaultValues: {
      enabled: false,
      clientId: "",
      clientSecret: "",
      tenantId: "",
      redirectUri: "http://localhost:3000/api/auth/callback/microsoft",
    },
  });

  React.useEffect(() => {
    // Load saved settings
    const loadSettings = async () => {
      try {
        const savedSettings = localStorage.getItem("ssoSettings");
        if (savedSettings) {
          const settings = JSON.parse(savedSettings);
          setValue("enabled", settings.enabled);
          setValue("clientId", settings.clientId);
          setValue("clientSecret", settings.clientSecret);
          setValue("tenantId", settings.tenantId);
          setValue("redirectUri", settings.redirectUri);
          setIsEnabled(settings.enabled);
        }
      } catch (error) {
        console.error("Failed to load SSO settings:", error);
      }
    };

    loadSettings();
  }, [setValue]);

  const onSubmit = async (data: SSOFormData) => {
    setIsLoading(true);
    try {
      // Save settings to localStorage (in a real app, this would be saved to a backend)
      localStorage.setItem("ssoSettings", JSON.stringify(data));
      setIsEnabled(data.enabled);
      toast.success("SSO settings saved successfully");
    } catch (error) {
      toast.error("Failed to save SSO settings");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Microsoft SSO Settings</CardTitle>
        <CardDescription>
          Configure Microsoft Azure AD SSO settings for your application
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex items-center space-x-2">
            <Switch
              id="sso-enabled"
              checked={isEnabled}
              onCheckedChange={(checked) => {
                setValue("enabled", checked);
                setIsEnabled(checked);
              }}
            />
            <Label htmlFor="sso-enabled">Enable Microsoft SSO</Label>
          </div>

          {isEnabled && (
            <>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="clientId">Client ID</Label>
                  <Input
                    id="clientId"
                    placeholder="Enter your Azure AD Client ID"
                    {...register("clientId")}
                  />
                  {errors.clientId && (
                    <p className="text-sm text-destructive">
                      {errors.clientId.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="clientSecret">Client Secret</Label>
                  <Input
                    id="clientSecret"
                    type="password"
                    placeholder="Enter your Azure AD Client Secret"
                    {...register("clientSecret")}
                  />
                  {errors.clientSecret && (
                    <p className="text-sm text-destructive">
                      {errors.clientSecret.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tenantId">Tenant ID</Label>
                  <Input
                    id="tenantId"
                    placeholder="Enter your Azure AD Tenant ID"
                    {...register("tenantId")}
                  />
                  {errors.tenantId && (
                    <p className="text-sm text-destructive">
                      {errors.tenantId.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="redirectUri">Redirect URI</Label>
                  <Input
                    id="redirectUri"
                    placeholder="Enter your redirect URI"
                    {...register("redirectUri")}
                  />
                  {errors.redirectUri && (
                    <p className="text-sm text-destructive">
                      {errors.redirectUri.message}
                    </p>
                  )}
                </div>
              </div>

              <Button type="submit" disabled={isLoading}>
                {isLoading && (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                )}
                Save Settings
              </Button>
            </>
          )}
        </form>
      </CardContent>
    </Card>
  );
} 