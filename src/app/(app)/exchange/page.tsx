'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Import for navigation
// import { BalancesDisplay } from './components/BalancesDisplay'; // Placeholder
import { ExchangeForm } from './components/ExchangeForm'; // ACTUAL IMPORT
// import { ClientSelection } from './components/ClientSelection'; // Placeholder
import { Button } from '@/components/ui/button';
// import { CustomerSelectionForExchange, Client } from './components/CustomerSelectionForExchange'; // Import Client as well
import { Client } from './types'; // Corrected import for Client type
// import { NewCustomerForm } from './components/NewCustomerForm'; // Import the actual form
import { ExchangeHistory, ExchangeTransaction } from './components/ExchangeHistory'; // Import the new history component
import ExchangePageEntitySearch from './components/ExchangePageEntitySearch'; // Reverted to no .tsx extension
// Import the modals
import { ExchangePageClientDetailsView } from './components/ExchangePageClientDetailsView';
import { TransactionModal } from './components/TransactionModal';
import { ExchangeConfirmationModal } from './components/ExchangeConfirmationModal'; // Import new modal
// import { TwoFactorVerification } from '../send-money/components/TwoFactorVerification'; // CORRECTED Import 2FA component - NO LONGER USED
import { ExchangeTwoFactorVerification } from './components/ExchangeTwoFactorVerification'; // Import new exchange-specific 2FA
import { ConfettiSuccess } from '@/components/ui/ConfettiSuccess'; // Using shared confetti success screen

// Define the transaction type, mirroring the one in Client interface
interface TransactionItem {
  id: string;
  date: string;
  type: string;
  details: string;
  amount: string;
}

// Mock data for balances - replace with actual data fetching
const MOCK_BALANCES = [
  { currency: 'USD', amount: 2000266514.15, symbol: '$' },
  { currency: 'EUR', amount: 155555.00, symbol: '€' },
  { currency: 'ILS', amount: -214300.67, symbol: '₪' },
  { currency: 'USD', amount: 150237.80, symbol: '$' }, // Another USD balance? Consolidate or clarify
];

// Mock data for currencies - replace with actual data
const MOCK_CURRENCIES = [
  { code: 'USD', name: 'US Dollar', flag: '🇺🇸' },
  { code: 'EUR', name: 'Euro', flag: '🇪🇺' },
  { code: 'ILS', name: 'Israeli Shekel', flag: '🇮🇱' },
  { code: 'GBP', name: 'British Pound', flag: '🇬🇧' },
];

// Mock Customer Data (similar to Send Money page's clients)
const MOCK_CUSTOMERS: Client[] = [
  {
    id: 'cust_123',
    firstName: 'John',
    lastName: 'Doe',
    name: 'John Doe',
    phone: '555-1234',
    idType: 'Passport',
    idNumber: 'P12345678',
    country: 'USA',
    status: 'Active', // Added for consistency with card display
    email: 'john.doe@example.com', // Added for completeness
    clientId: 'CUST001', // Added for completeness
  },
  {
    id: 'cust_456',
    firstName: 'Jane',
    lastName: 'Smith',
    name: 'Jane Smith',
    phone: '555-5678',
    idType: 'Driver License',
    idNumber: 'DL87654321',
    country: 'USA',
    status: 'Pending', // Added
    email: 'jane.smith@example.com', // Added
    clientId: 'CUST002', // Added
  },
  {
    id: 'cust_789',
    firstName: 'Alice',
    lastName: 'Johnson',
    name: 'Alice Johnson',
    phone: '555-9012',
    idType: 'National ID',
    idNumber: 'NID54321678',
    country: 'USA',
    status: 'Suspended', // Added
    email: 'alice.johnson@example.com', // Added
    clientId: 'CUST003', // Added
  },
];

// Mock Exchange History Data
const MOCK_EXCHANGE_HISTORY: ExchangeTransaction[] = [
  {
    id: 'hist_1',
    date: '2024-07-28T10:30:00Z',
    fromCurrency: 'USD',
    fromAmount: 1000,
    toCurrency: 'ILS',
    toAmount: 3685.50,
    rate: 3.6855,
    customerName: 'John Doe',
    customerId: 'cust_123'
  },
  {
    id: 'hist_2',
    date: '2024-07-27T15:00:00Z',
    fromCurrency: 'EUR',
    fromAmount: 500,
    toCurrency: 'USD',
    toAmount: 545.25,
    rate: 1.0905,
    customerName: 'Jane Smith',
    customerId: 'cust_456'
  },
  {
    id: 'hist_3',
    date: '2024-07-26T09:15:00Z',
    fromCurrency: 'ILS',
    fromAmount: 10000,
    toCurrency: 'USD',
    toAmount: 2710.00,
    rate: 0.2710,
    customerName: 'Alice Johnson',
    customerId: 'cust_789'
  },
];

// Define flow steps and staged exchange details interface
type ExchangeFlowStep = 'form' | 'confirmSummary' | 'mfa' | 'success';
interface StagedExchangeDetails {
  customerName: string;
  customerId: string;
  payAmount: number;
  payCurrency: string;
  receiveAmount: number;
  receiveCurrency: string;
  rate: number;
}

export default function CurrencyExchangePage() {
  // Customer Selection State
  const [selectedCustomer, setSelectedCustomer] = useState<Client | null>(null);
  const [showNewCustomerForm, setShowNewCustomerForm] = useState(false);
  const [viewingCustomerDetails, setViewingCustomerDetails] = useState<Client | null>(null);

  // Exchange Form State
  const [payAmount, setPayAmount] = useState<string>('');
  const [receiveAmount, setReceiveAmount] = useState<string>('');
  const [payCurrency, setPayCurrency] = useState<string>('USD'); 
  const [receiveCurrency, setReceiveCurrency] = useState<string>('ILS');
  const [currentExchangeRate, setCurrentExchangeRate] = useState<number | null>(null);

  const router = useRouter(); // Initialize router

  // Flow control states
  const [currentFlowStep, setCurrentFlowStep] = useState<ExchangeFlowStep>('form');
  const [stagedExchange, setStagedExchange] = useState<StagedExchangeDetails | null>(null);

  // Effect to update receiveAmount when payAmount or currentExchangeRate changes
  useEffect(() => {
    if (payAmount && currentExchangeRate && currentExchangeRate > 0) {
      const numericPayAmount = parseFloat(payAmount);
      if (!isNaN(numericPayAmount)) {
        setReceiveAmount((numericPayAmount * currentExchangeRate).toFixed(2));
      }
    } else {
      setReceiveAmount('');
    }
  }, [payAmount, currentExchangeRate]);

  // Callback for when the exchange is confirmed (to be implemented)
  const handleConfirmExchange = () => {
    if (!selectedCustomer) {
      alert("Please select a customer first.");
      return;
    }
    const numPayAmount = parseFloat(payAmount);
    const numReceiveAmount = parseFloat(receiveAmount);

    if (!numPayAmount || numPayAmount <= 0 || !numReceiveAmount || !currentExchangeRate) {
      alert("Please enter valid amounts and ensure an exchange rate is available.");
      return;
    }

    setStagedExchange({
      customerName: selectedCustomer.name,
      customerId: selectedCustomer.id || selectedCustomer.clientId || 'N/A',
      payAmount: numPayAmount,
      payCurrency: payCurrency,
      receiveAmount: numReceiveAmount,
      receiveCurrency: receiveCurrency,
      rate: currentExchangeRate,
    });
    setCurrentFlowStep('confirmSummary');
  };

  const handleSaveQuote = () => {
    if (!selectedCustomer) {
      alert("Please select a customer to save the quote.");
      return;
    }
    if (!payAmount || !currentExchangeRate) {
      alert("Please enter an amount and ensure a rate is available to save a quote.");
      return;
    }
    const quote = {
      customerId: selectedCustomer.id,
      customerName: selectedCustomer.name,
      payAmount: parseFloat(payAmount),
      payCurrency,
      receiveAmount: parseFloat(receiveAmount),
      receiveCurrency,
      rate: currentExchangeRate,
      timestamp: new Date().toISOString(),
    };
    console.log("Quote Saved:", quote);
    alert("Quote saved successfully (see console)!"); 
    // Here you would typically send this to a backend or state management
  };

  // Placeholder for saving a new customer
  const handleSaveCustomer = (customerData: Omit<Client, 'id'>) => {
    const newCustomer: Client = {
      id: `cust_${Date.now()}`,
      firstName: customerData.firstName || 'N/A',
      lastName: customerData.lastName || 'N/A',
      name: customerData.name || `${customerData.firstName || ''} ${customerData.lastName || ''}`.trim(),
      phone: customerData.phone || 'N/A',
      idType: customerData.idType,
      idNumber: customerData.idNumber,
      country: customerData.country || 'Unknown',
      status: 'Active', // Default status
      clientId: `CUST${Date.now()}`,
      ...customerData,
    };
    // Add to the beginning of the list for better UX
    MOCK_CUSTOMERS.unshift(newCustomer); 
    setSelectedCustomer(newCustomer);
    setShowNewCustomerForm(false);
    setViewingCustomerDetails(null); // Close details view on save
  };

  // New handler for viewing customer details/history
  const handleViewCustomerDetails = (customer: Client) => {
    console.log('Viewing details for customer:', customer);
    setSelectedCustomer(customer); 
    setViewingCustomerDetails(customer);
    // TODO: Trigger ExchangePageClientDetailsView modal here
  };

  // New handler for viewing customer transaction history
  const handleViewCustomerHistory = (customer: Client) => {
    console.log('Viewing transaction history for customer:', customer);
    // This could, for example, set state to show a history modal
    // or navigate to a history page, or update the existing details view.
    // For now, it just logs. If combined with details view, ensure that view can show history.
    setSelectedCustomer(customer); // Select the customer
    setViewingCustomerDetails(customer); // Show the details view which includes mock history
    // alert(`Transaction history for ${customer.name} (see console).`);
  };

  // ADDED: Handler for when a client is selected from ExchangePageEntitySearch
  const handleSelectClient = (client: Client) => {
    setSelectedCustomer(client);
    console.log('Client selected in page for exchange:', client.name);
    // Any other logic needed when a client is selected for the form
  };

  // Updated handler for "New Customer" button to redirect
  const handleNewCustomerRedirect = () => {
    console.log('Redirecting to /clients/new...');
    router.push('/clients/new');
  };

  // state for customer details modal (renamed for clarity from viewingCustomerDetails)
  const [detailsModalClient, setDetailsModalClient] = useState<Client | null>(null);
  // state for customer history modal
  const [historyModalClient, setHistoryModalClient] = useState<Client | null>(null); 

  // Filter transactions for the history modal
  const transactionsForModal = historyModalClient 
    ? MOCK_EXCHANGE_HISTORY.filter(tx => tx.customerId === (historyModalClient.id || historyModalClient.clientId))
    : [];

  // Handler for OTP verification
  const handleOtpVerification = async (otp: string): Promise<boolean> => {
    console.log("Verifying OTP:", otp, "for customer:", stagedExchange?.customerName);
    // Mock OTP verification
    if (otp === "000000") { // UPDATED: Expected OTP is now "000000" for demo mode
      console.log("OTP Correct!");
      // Here, you would typically call an API to finalize the exchange
      // For now, we'll just proceed to the success step.
      setCurrentFlowStep('success');
      // Keep stagedExchange for the success screen, clear it after if needed or on new transaction.
      return true;
    } else {
      console.log("OTP Incorrect.");
      return false; // This will trigger the error message in TwoFactorVerification component
    }
  };

  const handleMakeAnotherExchange = () => {
    setCurrentFlowStep('form');
    setStagedExchange(null);
    setSelectedCustomer(null);
    setPayAmount('');
    setReceiveAmount('');
    // Optionally reset currencies to default or leave as is
    // setPayCurrency('USD');
    // setReceiveCurrency('ILS');
    console.log("Resetting for another exchange.");
  };

  const handlePrintReceipt = () => {
    console.log("Print Receipt clicked for:", stagedExchange);
    // In a real app, this would trigger a print dialog with receipt content
    alert("Receipt printing initiated (see console).");
  };

  const handleGoToDashboard = () => {
    console.log("Navigating to dashboard.");
    router.push('/'); // Assuming '/' is the dashboard route
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-gray-950/95 backdrop-blur-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold">Currency Exchange</h1>
                    </div>
          {/* Potentially user profile icon or other global nav items here */}
                  </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-4 py-8">
        {/* The "Your Balances" section below is now removed. */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Exchange Form Section */}
          <section aria-labelledby="exchange-details-title" className="lg:col-span-2 bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800">
            <h2 id="exchange-details-title" className="text-xl font-semibold mb-6">Exchange Details</h2>
            <ExchangeForm 
              currencies={MOCK_CURRENCIES} 
              payAmount={payAmount}
              setPayAmount={setPayAmount}
              payCurrency={payCurrency}
              setPayCurrency={setPayCurrency}
              receiveAmount={receiveAmount}
              receiveCurrency={receiveCurrency}
              setReceiveCurrency={setReceiveCurrency}
              exchangeRate={currentExchangeRate}
              onRateCalculated={setCurrentExchangeRate}
            />
            <div className="mt-8 flex flex-col sm:flex-row justify-end gap-3">
                  <Button
                variant="outline_primary" 
                size="lg"
                className="font-semibold py-3 px-6 rounded-lg"
                onClick={handleSaveQuote}
                disabled={!selectedCustomer || !payAmount || !currentExchangeRate}
              >
                Save Quote
                  </Button>
                      <Button
                size="lg" 
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg"
                onClick={handleConfirmExchange}
                disabled={!selectedCustomer || !payAmount || !currentExchangeRate || !MOCK_CURRENCIES.length}
              >
                Confirm Exchange {selectedCustomer ? `for ${selectedCustomer.firstName}` : ''}
                      </Button>
              </div>
          </section>

          {/* Customer Selection Section - Now using ExchangePageEntitySearch */}
          <section aria-labelledby="customer-details-title" className="lg:col-span-1 bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800">
            <div className="flex justify-between items-center mb-6">
              <h2 id="customer-details-title" className="text-xl font-semibold">Customer</h2>
              {/* The "New Customer" button is now part of ExchangePageEntitySearch's header */}
              {/* <Button variant="outline_primary" size="sm" onClick={handleNewCustomerRedirect}>New Customer</Button> */}
              </div>

            <ExchangePageEntitySearch
              clients={MOCK_CUSTOMERS}
              onSelectClient={handleSelectClient}
              onAddNewClient={handleNewCustomerRedirect}
              onViewClientHistory={handleViewCustomerHistory}
              onViewClientDetails={handleViewCustomerDetails}
              selectedClientId={selectedCustomer?.id || selectedCustomer?.clientId || null}
            />
            {/* TODO: Add modal rendering for TransactionModal and ExchangePageClientDetailsView controlled by state in this component (e.g., viewingCustomerDetails for details modal) */}
            {/* Example for details modal:
              {viewingCustomerDetails && (
                <ExchangePageClientDetailsView
                  client={viewingCustomerDetails}
                  isOpen={!!viewingCustomerDetails}
                  onClose={() => setViewingCustomerDetails(null)}
                  // ... other necessary props based on ExchangePageClientDetailsView definition
                />
              )}
             */}
          </section>
        </div>

        {/* Exchange History Section */}
        <ExchangeHistory transactions={MOCK_EXCHANGE_HISTORY} />

      </main>

      {/* Render Modals */}
      {detailsModalClient && (
        <ExchangePageClientDetailsView
          isOpen={!!detailsModalClient}
          onClose={() => setDetailsModalClient(null)}
          customer={detailsModalClient} 
          // Not passing other optional props like onShowDocuments for now
        />
      )}

      {historyModalClient && (
        <TransactionModal
          isOpen={!!historyModalClient}
          onClose={() => setHistoryModalClient(null)}
          customer={historyModalClient} // Pass the customer for display in modal header
          transactions={transactionsForModal} // Pass the filtered transactions
        />
      )}

      {/* Confirmation Summary Modal */}
      {currentFlowStep === 'confirmSummary' && stagedExchange && (
        <ExchangeConfirmationModal
          isOpen={true}
          onClose={() => {
            setCurrentFlowStep('form');
            setStagedExchange(null);
          }}
          onConfirm={() => {
            console.log("OTP request for phone (simulated) - User:", stagedExchange.customerName);
            // TODO: Add actual OTP sending logic if applicable
            setCurrentFlowStep('mfa'); 
          }}
          details={stagedExchange}
        />
      )}

      {/* MFA Modal */}
      {currentFlowStep === 'mfa' && stagedExchange && selectedCustomer && (
        <ExchangeTwoFactorVerification
          customerPhone={selectedCustomer.phone} // Pass customer phone
          exchangeAmount={stagedExchange.payAmount.toFixed(2)} // Pass amount
          exchangeCurrency={stagedExchange.payCurrency} // Pass currency
          onVerify={handleOtpVerification}
          onCancel={() => {
            setCurrentFlowStep('confirmSummary'); // Go back to summary if cancelled
          }}
        />
      )}

      {/* Success Screen */}
      {currentFlowStep === 'success' && stagedExchange && (
        <ConfettiSuccess
          message="Currency Exchange Verified!"
          // description={`You have successfully exchanged ${stagedExchange.payAmount.toFixed(2)} ${stagedExchange.payCurrency} to ${stagedExchange.receiveAmount.toFixed(2)} ${stagedExchange.receiveCurrency}.`}
          // Pass exchange details to ConfettiSuccess props
          senderName="Your Account" // Or a more appropriate static value
          receiverName={stagedExchange.customerName} // Customer who received/for whom exchange was done
          amount={stagedExchange.payAmount.toFixed(2)} // Could be payAmount or receiveAmount based on desired display
          currency={stagedExchange.payCurrency} // 
          fee={(0).toFixed(2)} // Assuming no explicit fee for exchange shown here, or pass if available
          totalAmount={stagedExchange.payAmount.toFixed(2)} // If fee is 0, total is same as amount
          referenceId={stagedExchange.customerId} // Using customerId as a reference
          transferDate={new Date().toLocaleDateString()}
          
          onSendAnother={handleMakeAnotherExchange} // Maps to "Make Another Exchange"
          // The ConfettiSuccess component has its own Print button. We can use its internal onPrint.
          // For "Go to Dashboard", we use the generic onActionClick with a label.
          actionLabel="Go to Dashboard"
          onActionClick={handleGoToDashboard}
        />
      )}

    </div>
  );
}