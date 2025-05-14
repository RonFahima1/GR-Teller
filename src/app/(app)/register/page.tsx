
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Check, DollarSign, Euro, Hash, RefreshCw } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

// Define the structure for each currency's data
interface CurrencyData {
    opening: number;
    netPayments: number;
    current: number;
    leaveForNextShift: string; // Use string for input value
    totalToGive?: number; // Calculated value
    timestamp?: string; // Optional timestamp
}

// Define the overall register state structure
interface RegisterState {
    USD: CurrencyData;
    ILS: CurrencyData;
    EUR: CurrencyData;
}

// Mock Data with timestamps and default leave amount
const initialRegisterData: RegisterState = {
    USD: { opening: 0.00, netPayments: 0.00, current: 0.00, leaveForNextShift: '0', timestamp: '1970-01-01 02:00:00' },
    ILS: { opening: 0.00, netPayments: 4080.00, current: 4080.00, leaveForNextShift: '0', timestamp: '1970-01-01 02:00:00' },
    EUR: { opening: 0.00, netPayments: 0.00, current: 0.00, leaveForNextShift: '0', timestamp: '1970-01-01 02:00:00' },
};

const formatCurrency = (amount: number) => {
  // Simple formatting, adjust as needed
  return amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const getCurrencyIcon = (currency: string) => {
    switch (currency) {
        case 'USD': return <DollarSign className="h-4 w-4 text-muted-foreground" />;
        case 'ILS': return <Hash className="h-4 w-4 text-muted-foreground" />;
        case 'EUR': return <Euro className="h-4 w-4 text-muted-foreground" />;
        default: return null;
    }
};

export default function CashRegisterPage() {
  const [registerState, setRegisterState] = useState<RegisterState>(initialRegisterData);
  const [lastUpdated, setLastUpdated] = useState(new Date().toLocaleTimeString()); // Mock timestamp

  const handleNextShiftChange = (currency: keyof RegisterState, value: string) => {
    setRegisterState(prev => {
        const currentBalance = prev[currency].current;
        const leaveAmount = parseFloat(value) || 0;
        const totalToGive = Math.max(0, currentBalance - leaveAmount); // Ensure not negative

        return {
          ...prev,
          [currency]: {
              ...prev[currency],
              leaveForNextShift: value,
              totalToGive: totalToGive
          }
        }
    });
  };

  // Recalculate totals on initial load or if current balance changes
  useState(() => {
      let newState = { ...registerState };
      (Object.keys(newState) as Array<keyof RegisterState>).forEach(currency => {
          const currentBalance = newState[currency].current;
          const leaveAmount = parseFloat(newState[currency].leaveForNextShift) || 0;
          newState[currency].totalToGive = Math.max(0, currentBalance - leaveAmount);
      });
      setRegisterState(newState);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on mount


  const handleClearRegister = (currency: keyof RegisterState) => {
    // Logic to clear register for a specific currency, potentially reset state or call API
    console.log(`Clearing ${currency} register...`);
    // Example: Resetting next shift value for the cleared currency
    setRegisterState(prev => ({
      ...prev,
      [currency]: { ...prev[currency], leaveForNextShift: '0', totalToGive: prev[currency].current } // Reset leave amount, total to give becomes current balance
    }));
    // You might fetch new opening balances here or reset completely
  };

  const handleRefresh = () => {
      // Logic to refresh register data
      console.log("Refreshing register data...");
      // Update timestamp or fetch new data
      // For demo, just update timestamp
      setLastUpdated(new Date().toLocaleTimeString());
      // Potentially fetch new data and update setRegisterState(newData);
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
        <h1 className="text-h1 font-h1 text-foreground">Cash Register - Ron Fahima <span className="text-muted-foreground text-base font-normal">( Teller at cTorres )</span></h1>
         <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Last Updated: {lastUpdated}</span>
             <Button variant="ghost" size="icon" onClick={handleRefresh}>
                <RefreshCw className="h-4 w-4"/>
             </Button>
         </div>
      </div>

      {/* Cash Balances Section */}
       <Card className="card-ios">
        <CardHeader>
           <CardTitle className="text-h3 font-h3 text-card-foreground">CASH BALANCES</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
            <div className="overflow-x-auto">
             <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[150px]"></TableHead> {/* Empty cell for labels */}
                     {(Object.keys(registerState) as Array<keyof RegisterState>).map(currency => (
                        <TableHead key={currency} className="text-center font-semibold">{currency}</TableHead>
                     ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Open Balance:</TableCell>
                    {(Object.keys(registerState) as Array<keyof RegisterState>).map(currency => (
                      <TableCell key={currency} className="text-center">
                         <div>{formatCurrency(registerState[currency].opening)} {currency}</div>
                         <div className="text-xs text-muted-foreground">{registerState[currency].timestamp}</div>
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Net Payments:</TableCell>
                    {(Object.keys(registerState) as Array<keyof RegisterState>).map(currency => (
                      <TableCell key={currency} className={`text-center ${registerState[currency].netPayments < 0 ? 'text-destructive' : 'text-ios-green'}`}>
                        {formatCurrency(registerState[currency].netPayments)} {currency}
                      </TableCell>
                    ))}
                  </TableRow>
                   <TableRow>
                    <TableCell className="font-medium">Current Balance:</TableCell>
                    {(Object.keys(registerState) as Array<keyof RegisterState>).map(currency => (
                      <TableCell key={currency} className="text-center font-semibold">
                        <div className={registerState[currency].current < 0 ? 'text-destructive' : ''}>{formatCurrency(registerState[currency].current)} {currency}</div>
                         <div className="text-xs text-muted-foreground">{registerState[currency].timestamp}</div>
                      </TableCell>
                    ))}
                  </TableRow>
                </TableBody>
              </Table>
            </div>
        </CardContent>
       </Card>


      {/* Clear Registers Section */}
      <Card className="card-ios">
          <CardHeader>
           <CardTitle className="text-h3 font-h3 text-card-foreground">CLEAR REGISTERS</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
             <div className="overflow-x-auto">
             <Table>
                 <TableHeader>
                  <TableRow>
                     <TableHead className="w-[150px]"></TableHead> {/* Empty cell for labels */}
                     {(Object.keys(registerState) as Array<keyof RegisterState>).map(currency => (
                        <TableHead key={currency} className="text-center font-semibold">{currency}</TableHead>
                     ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow>
                        <TableCell className="font-medium">Leave for next shift:</TableCell>
                         {(Object.keys(registerState) as Array<keyof RegisterState>).map(currency => (
                             <TableCell key={currency} className="text-center">
                                <div className="flex justify-center items-center gap-2">
                                     <Input
                                       type="number"
                                       placeholder="0.00"
                                       value={registerState[currency].leaveForNextShift}
                                       onChange={(e) => handleNextShiftChange(currency as keyof RegisterState, e.target.value)}
                                       className="input-ios max-w-[120px] mx-auto text-right focus:ring-primary"
                                       />
                                       <span>{currency}</span>
                                </div>
                             </TableCell>
                         ))}
                    </TableRow>
                    <TableRow>
                        <TableCell className="font-medium">Total to give cTorres:</TableCell>
                         {(Object.keys(registerState) as Array<keyof RegisterState>).map(currency => (
                             <TableCell key={currency} className="text-center font-semibold">
                               {formatCurrency(registerState[currency].totalToGive ?? 0)} {currency}
                             </TableCell>
                         ))}
                    </TableRow>
                </TableBody>
            </Table>
             </div>
             {/* Clear Buttons */}
             <div className="flex flex-col md:flex-row justify-around gap-4 mt-6 pt-6 border-t">
                 {(Object.keys(registerState) as Array<keyof RegisterState>).map(currency => (
                     <AlertDialog key={currency}>
                        <AlertDialogTrigger asChild>
                          <Button variant="default" className="btn-ios-primary flex-1"> {/* Use primary blue */}
                             Clear {currency} Register
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="rounded-ios-card">
                          <AlertDialogHeader>
                            <AlertDialogTitle>Confirm Clear {currency} Register</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action will finalize the {currency} register based on the amount entered to leave for the next shift. Are you sure you want to proceed? This might trigger end-of-day processes.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="btn-ios-secondary">Cancel</AlertDialogCancel> {/* Use secondary style */}
                            <AlertDialogAction onClick={() => handleClearRegister(currency)} className="btn-ios-primary"> {/* Use primary style */}
                              Confirm & Clear {currency}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                 ))}
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
