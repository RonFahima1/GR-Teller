'use client';

import { useState, useEffect } from 'react'; // Import useState & useEffect
import Link from 'next/link'; // Import Link
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { UserPlus, MoreHorizontal, Edit, Trash2, Eye } from 'lucide-react';
import { CustomerSearch } from '@/components/customer/CustomerSearch'; // Fix: Use named import
import type { Country } from '@/services/country-code'; // Import Country type
import { getCountries } from '@/services/country-code'; // Import getCountries
import { cn } from '@/lib/utils'; // Import cn


// Mock Data
const clients = [
  { id: 'CUST001', name: 'John Doe', phone: '+44 7700 900123', email: 'john.doe@example.com', status: 'Active' },
  { id: 'CUST002', name: 'Jane Smith', phone: '+972 50 123 4567', email: 'jane.s@mail.com', status: 'Active' },
  { id: 'CUST003', name: 'David Lee', phone: '+44 7800 111222', email: 'david.lee@provider.net', status: 'Inactive' },
  { id: 'CUST004', name: 'Sarah Chen', phone: '+972 54 987 6543', email: 's.chen@work.org', status: 'Active' },
];

// Mock search results state
const initialClients = [ /* your initial client list here */ ];

const getStatusPillClass = (status: string) => {
  switch (status.toLowerCase()) {
    case 'active':
      return 'ios-status-pill-green';
    case 'inactive':
      return 'ios-status-pill-red';
    default:
      return 'ios-status-pill-gray'; // Use gray for other statuses
  }
};

export default function ClientsPage() {
    const [displayedClients, setDisplayedClients] = useState(clients); // State for filtered clients

    const handleClientSearch = (searchParams: any) => {
        console.log("Searching for client (Clients Page):", searchParams);
        // Mock filtering logic
        const { type, value, countryCode } = searchParams;
        const lowerCaseValue = value.toLowerCase();

        const filtered = clients.filter(client => {
            switch (type) {
                case 'phone':
                    // Remove non-digit characters for comparison if needed
                    const phoneDigits = client.phone.replace(/\D/g, '');
                    const searchDigits = (countryCode + value).replace(/\D/g, '');
                    return phoneDigits.includes(value); // Simple substring match for now
                case 'name':
                    return client.name.toLowerCase().includes(lowerCaseValue);
                case 'id':
                    return client.id.toLowerCase().includes(lowerCaseValue);
                 case 'email': // Add email search if needed in CustomerSearch
                     return client.email?.toLowerCase().includes(lowerCaseValue);
                // Add cases for other search types (bank, qr, card) if data exists
                default:
                    return true; // Should not happen if type is always set
            }
        });
        setDisplayedClients(filtered);
    };


  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6 lg:space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-h1 font-h1 text-foreground">Clients</h1>
      </div>

      {/* Customer Search Card */}
      <Card className="card-ios">
        <CardHeader>
          <CardTitle className="text-h3 font-h3 text-card-foreground">Search Clients</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <CustomerSearch
            onSearch={handleClientSearch}
            showNewButton={true}
            newButtonText="New Client"
            newButtonLink="/clients/new"
            defaultTab="phone"
          />
        </CardContent>
      </Card>

      {/* Client List Table */}
      <Card className="card-ios">
        <CardHeader>
          <CardTitle className="text-h3 font-h3 text-card-foreground">Client List</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px]">Client ID</TableHead>
                  <TableHead className="min-w-[250px]">Name</TableHead>
                  <TableHead className="min-w-[180px]">Phone</TableHead>
                  <TableHead className="min-w-[300px]">Email</TableHead>
                  <TableHead className="w-[120px]">Status</TableHead>
                  <TableHead className="w-[120px] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayedClients.length > 0 ? (
                  displayedClients.map((client) => (
                    <TableRow key={client.id} className="hover:bg-muted/50 transition-colors">
                      <TableCell className="font-medium">{client.id}</TableCell>
                      <TableCell>{client.name}</TableCell>
                      <TableCell>{client.phone}</TableCell>
                      <TableCell>{client.email}</TableCell>
                      <TableCell>
                        <span className={`ios-status-pill ${getStatusPillClass(client.status)}`}>
                          {client.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-[160px]">
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              <span>View Details</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              <span>Edit</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600 dark:text-red-400">
                              <Trash2 className="mr-2 h-4 w-4" />
                              <span>Delete</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                      No clients found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* New Client Button at the bottom using the same pattern */}
      <div className="flex justify-end mt-6">
        <CustomerSearch
          onSearch={() => {}}
          showNewButton={true}
          newButtonText="New Client"
          newButtonLink="/clients/new"
          hideSearch={true} // Custom prop to hide search fields if supported
        />
      </div>
    </div>
  );
}

