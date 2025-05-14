"use client";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Building2, Coins, UserCog, Settings } from "lucide-react";

const adminSections = [
  {
    title: "Branch Management",
    description: "Manage all company branches, addresses, and managers.",
    icon: Building2,
    href: "/admin/branches"
  },
  {
    title: "Currency Management",
    description: "Configure supported currencies and exchange rates.",
    icon: Coins,
    href: "/admin/currencies"
  },
  {
    title: "User Management",
    description: "Add, remove, and update user accounts and permissions.",
    icon: UserCog,
    href: "/admin/users"
  },
  {
    title: "System Settings",
    description: "Control system-wide settings and integrations.",
    icon: Settings,
    href: "/admin/system"
  }
];

export default function AdministrationPage() {
  return (
    <div className="container mx-auto p-6 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Administration</h1>
        <p className="text-muted-foreground">Manage all system administration tasks and settings</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {adminSections.map(section => (
          <Link href={section.href} key={section.href} className="block group">
            <Card className="card-ios transition-all group-hover:shadow-lg group-hover:scale-[1.03] cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <section.icon className="h-6 w-6 text-primary" />
                  {section.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">{section.description}</p>
                <span className="text-primary text-xs font-semibold group-hover:underline">Go to {section.title}</span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
} 