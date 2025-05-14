"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Eye, CheckCircle, XCircle, Clock, FileText } from "lucide-react";

const mockKycRequests = [
  { id: 1, name: "Jane Smith", email: "jane@email.com", submitted: "2024-03-15", status: "pending", documents: ["passport.pdf", "utility_bill.pdf"] },
  { id: 2, name: "Alex Morgan", email: "alex@email.com", submitted: "2024-03-14", status: "approved", documents: ["id_card.jpg"] },
  { id: 3, name: "Sarah Chen", email: "sarah@email.com", submitted: "2024-03-13", status: "rejected", documents: ["driver_license.pdf"] },
];

const mockAuditTrail = [
  { id: 1, date: "2024-03-15 14:30", user: "admin", action: "Approved KYC", client: "Alex Morgan" },
  { id: 2, date: "2024-03-14 11:20", user: "compliance", action: "Rejected KYC", client: "Sarah Chen" },
];

function KYCPage() {
  const [activeTab, setActiveTab] = useState("pending");

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending": return <Clock className="h-4 w-4 text-yellow-500" />;
      case "approved": return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "rejected": return <XCircle className="h-4 w-4 text-red-500" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "approved": return "bg-green-100 text-green-800";
      case "rejected": return "bg-red-100 text-red-800";
      default: return "";
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">KYC Management</h1>
      </div>

      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending">Pending Review</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
          <TabsTrigger value="audit">Audit Trail</TabsTrigger>
        </TabsList>

        {["pending", "approved", "rejected"].map((status) => (
          <TabsContent key={status} value={status}>
            <div className="grid gap-4">
              {mockKycRequests
                .filter(request => request.status === status)
                .map(request => (
                  <Card key={request.id}>
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-semibold text-lg">{request.name}</h3>
                          <p className="text-sm text-muted-foreground">{request.email}</p>
                          <p className="text-sm text-muted-foreground">Submitted: {request.submitted}</p>
                        </div>
                        <Badge className={getStatusColor(request.status)}>
                          <span className="flex items-center gap-1">
                            {getStatusIcon(request.status)}
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </span>
                        </Badge>
                      </div>
                      <div className="flex gap-2">
                        {request.documents.map((doc, index) => (
                          <Badge key={index} variant="outline" className="flex items-center gap-1">
                            <FileText className="h-4 w-4" />
                            {doc}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-2 mt-4">
                        <Button size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          View Details
                        </Button>
                        {status === "pending" && (
                          <>
                            <Button size="sm" variant="outline" className="text-green-600">
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                            <Button size="sm" variant="outline" className="text-red-600">
                              <XCircle className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>
        ))}

        <TabsContent value="audit">
          <Card>
            <CardHeader>
              <CardTitle>Audit Trail</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockAuditTrail.map(entry => (
                  <div key={entry.id} className="flex items-start gap-4 p-4 border-b last:border-0">
                    <div className="flex-1">
                      <p className="text-sm font-medium">{entry.action}</p>
                      <p className="text-sm text-muted-foreground">Client: {entry.client}</p>
                      <p className="text-xs text-muted-foreground">By {entry.user} on {entry.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default KYCPage; 