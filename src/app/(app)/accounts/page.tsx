'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AccountsPage() {
  // In a real app, you might fetch account summaries here
  // or redirect to deposit/withdrawal if there's no main accounts view.

  return (
    <div className="p-4 md:p-6 space-y-6">
      <h1 className="text-h1 font-h1 text-foreground">Client Accounts</h1>

      <Card className="card-ios">
        <CardHeader>
          <CardTitle className="text-h3 font-h3 text-card-foreground">Account Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
           <Link href="/deposit" passHref>
             <Button className="btn-ios-primary">
                <ArrowDownLeft className="mr-2 h-4 w-4" /> Make a Deposit
             </Button>
           </Link>
            <Link href="/withdrawal" passHref>
             <Button variant="secondary" className="btn-ios-secondary">
                 <ArrowUpRight className="mr-2 h-4 w-4" /> Make a Withdrawal
             </Button>
            </Link>
        </CardContent>
      </Card>

       <Card className="card-ios">
        <CardHeader>
          <CardTitle className="text-h3 font-h3 text-card-foreground">Account Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Use the Deposit and Withdrawal sections to manage client account balances.
            A full account overview might be displayed here in a future update.
          </p>
          {/* Placeholder for account list or summary */}
        </CardContent>
      </Card>
    </div>
  );
}
