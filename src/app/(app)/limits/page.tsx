
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function LimitsPage() {
  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex items-center gap-4 mb-4">
         <Link href="/clients/new">
             <Button variant="ghost" size="icon">
               <ArrowLeft className="h-5 w-5" />
             </Button>
          </Link>
         <h1 className="text-h1 font-h1 text-foreground">Client Limits</h1>
      </div>


      <Card className="card-ios">
        <CardHeader>
          <CardTitle className="text-h3 font-h3 text-card-foreground">Transaction Limits</CardTitle>
          <CardDescription className="text-muted-foreground">
            Information about transaction limits for this client will be displayed here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Currently, the limits information is not available. This section will be updated with details about daily, weekly, and monthly transaction limits, as well as any specific product-related limits.
          </p>
          {/* Placeholder for limit details */}
           <div className="mt-4 space-y-2">
             <p><strong>Daily Limit:</strong> Not Set</p>
             <p><strong>Weekly Limit:</strong> Not Set</p>
             <p><strong>Monthly Limit:</strong> Not Set</p>
           </div>
        </CardContent>
      </Card>
       <Card className="card-ios">
        <CardHeader>
          <CardTitle className="text-h3 font-h3 text-card-foreground">Account Limits</CardTitle>
           <CardDescription className="text-muted-foreground">
            Information about account balance limits.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Details regarding maximum account balances or other account-specific limits will appear here.
          </p>
           {/* Placeholder for account limit details */}
            <div className="mt-4 space-y-2">
                <p><strong>Maximum Balance (USD):</strong> Not Set</p>
                <p><strong>Maximum Balance (ILS):</strong> Not Set</p>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
