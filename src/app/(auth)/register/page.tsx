"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get("token");

  const [loading, setLoading] = useState(true);
  const [invite, setInvite] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    password: "",
    confirmPassword: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      setError("No invitation token provided.");
      setLoading(false);
      return;
    }
    // Validate token by fetching invite info
    fetch(`/api/user/invite/validate?token=${token}`)
      .then(async (res) => {
        if (!res.ok) throw new Error("Invalid or expired invitation.");
        const data = await res.json();
        setInvite(data.invite);
      })
      .catch(() => setError("Invalid or expired invitation."))
      .finally(() => setLoading(false));
  }, [token]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setSubmitting(true);
    setError(null);
    const res = await fetch("/api/user/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token,
        firstName: form.firstName,
        lastName: form.lastName,
        password: form.password,
      }),
    });
    if (res.ok) {
      setSuccess(true);
      setTimeout(() => router.push("/login"), 2000);
    } else {
      const data = await res.json();
      setError(data.error || "Registration failed.");
    }
    setSubmitting(false);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin w-8 h-8 text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="max-w-md w-full p-6">
          <CardHeader>
            <CardTitle>Registration Error</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-red-600 mb-4">{error}</div>
            <Button onClick={() => router.push("/login")}>Go to Login</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (success) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="max-w-md w-full p-6">
          <CardHeader>
            <CardTitle>Registration Successful</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">Your account has been created. Redirecting to login...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[80vh] bg-background">
      <Card className="max-w-md w-full p-6">
        <CardHeader>
          <CardTitle>Complete Your Registration</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <Label>Email</Label>
              <Input value={invite?.email || ""} disabled />
            </div>
            <div className="flex gap-2">
              <div className="flex-1">
                <Label htmlFor="firstName">First Name</Label>
                <Input name="firstName" value={form.firstName} onChange={handleChange} required />
              </div>
              <div className="flex-1">
                <Label htmlFor="lastName">Last Name</Label>
                <Input name="lastName" value={form.lastName} onChange={handleChange} required />
              </div>
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input name="password" type="password" value={form.password} onChange={handleChange} required minLength={8} />
            </div>
            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} required minLength={8} />
            </div>
            {error && <div className="text-red-600 text-sm">{error}</div>}
            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? <Loader2 className="animate-spin w-4 h-4" /> : "Register"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 