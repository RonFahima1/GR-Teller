import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Transaction } from '@/app/(app)/send-money/components/SenderTransactionHistoryModal'; // Import Transaction type
import { Receiver } from '@/types/receiver'; // Import Receiver type

// Types
export interface Document {
  documentType: string;
  fileName: string;
  url?: string; // Placeholder for uploaded document URL
}

// --- New nested types for Client ---
interface AccountBalance {
  currency: string;
  balance: number;
  type?: string; // e.g., Savings, Current
}

interface PrepaidCard {
  id: string;
  last4: string;
  status: string;
  addCardLink?: string; // Placeholder for action
}

interface SimCard {
  id: string;
  number: string;
  status: string;
  showDetailsLink?: string; // Placeholder for action
}

interface ClientProducts {
  prepaidCards?: PrepaidCard[];
  simCards?: SimCard[];
}
// --- End new nested types ---

export interface Client {
  id: string;
  name: string; // Will be composed from firstName, middleName, lastName
  firstName: string;
  middleName?: string;
  lastName: string;
  dateOfBirth?: string; // Should be in YYYY-MM-DD format
  gender?: 'male' | 'female' | 'other';
  nationality?: string;
  
  phone: string;
  email?: string; // Made optional as per spec
  customerCardNumber?: string; // New field

  // Address (refined based on spec)
  country: string;
  streetAddress?: string;
  city?: string;
  postalCode?: string;
  // Old 'address' field can be deprecated or mapped from these

  // Identification (refined based on spec)
  idType: string; // e.g., passport, residence
  idNumber: string;
  idIssuanceCountry?: string;
  idIssueDate?: string; // Should be in YYYY-MM-DD format
  idExpiryDate?: string; // Should be in YYYY-MM-DD format
  
  // --- Fields from old design screenshot & request ---
  bankCode?: string;
  branchCode?: string;
  // bankAccount is already here
  accountBalances?: AccountBalance[];
  employer?: string;
  division?: string;
  products?: ClientProducts;
  qrCodeData?: string; // For text-based QR code search/data storage
  // --- End new fields ---

  bankAccount: string; // Existing, seems relevant for search
  status: string;
  kycVerified: boolean;
  riskRating: string;
  currency?: string; // Currency preference or default

  documents?: Document[]; // For ID document images
  relationshipToSender?: string; // For Receiver: Relationship to sender
  relationshipToBeneficiary?: string; // For Sender: Relationship to beneficiary
}

export interface FormData {
  currency: string;         // Source currency (e.g., USD)
  amount: string;           // Amount to send in source currency
  recipientAmount: string;  // Amount receiver gets in destination currency (calculated)
  fee: string;              // Calculated transaction fee
  totalAmount: string;      // Total amount sender pays (amount + fee - discounts)
  
  sourceOfFunds: string;    // E.g., Salary, Savings
  purposeOfTransfer: string; // E.g., Family Support, Gift
  transferType: string;     // E.g., Contact, Lightnet, Cash To Credit (as per spec)
  
  notes: string;            // Optional notes for the transaction
  agreeToTerms: boolean;    // Checkbox for terms and conditions

  // --- New fields for Phase 2 --- 
  // Transaction Delivery Configuration (Section 4 of spec)
  operator?: string;                 // E.g., Contact (selected operator)
  customerCardNumberDelivery?: string; // Optional customer card number for delivery context
  // Note: destinationCurrency is implied by recipientAmount and exchange rate, not directly stored here for now
  // but could be added if explicit selection is needed before calculation.

  // Amount and Payment Configuration (Section 5 of spec)
  exchangeRate?: number;          // Displayed exchange rate (e.g., 7.2161 USD/CNY)
  
  extraChargesPercent?: number;   // Optional, e.g., 0.05 for 5%
  feePayer?: 'sender' | 'beneficiary' | 'both'; 
  tellerDiscountPercent?: number; // Optional, e.g., 0.02 for 2%
  promoCode?: string;             // Optional promo code string
  
  paymentMethod?: string;         // E.g., 'cash', 'upay', 'clientAccount', 'cashPayLater', 'bankPayLater', 'cashHomePickup'
  // `changeToReturn` will be a calculated value based on paymentMethod='cash' and amount paid, not stored here.
  // `totalSenderPaymentAmount` is essentially `totalAmount`.

  destinationCurrency?: string; // New: For selecting destination currency
}

export interface Step {
  title: string;
  description: string;
}

// Add new interfaces for enhanced error handling and limits
interface TransferLimits {
  daily: number;
  monthly: number;
  perTransaction: number;
  remainingDaily: number;
  remainingMonthly: number;
}

export interface TransferError {
  code: string;
  message: string;
  field?: string;
  retryable: boolean;
}

export const useSendMoneyForm = () => {
  const router = useRouter();
  
  // Steps configuration
  const steps: Step[] = [
    { title: "Sender", description: "Select who is sending the money" },
    { title: "Receiver", description: "Select who will receive the money" },
    { title: "Details", description: "Specify transfer details" },
    { title: "Amount", description: "Enter amount and review fees" },
    { title: "Confirm", description: "Review and confirm transfer" }
  ];
  
  // Form state
  const [activeStep, setActiveStep] = useState(1);
  const [navigationDirection, setNavigationDirection] = useState<'forward' | 'backward'>('forward');
  const [transferComplete, setTransferComplete] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [searchQuery, setSearchQuery] = useState('');
  
  // Client selection state
  const [selectedSender, setSelectedSender] = useState<Client | null>(null);
  const [selectedReceiver, setSelectedReceiver] = useState<Client | null>(null);
  const [showNewSenderForm, setShowNewSenderForm] = useState(false);
  const [showNewReceiverForm, setShowNewReceiverForm] = useState(false);
  
  // State for Sender Transaction History Modal
  const [historyModalSender, setHistoryModalSender] = useState<Client | null>(null);
  const [senderTransactions, setSenderTransactions] = useState<Transaction[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  
  // State for Recent Receivers Modal
  const [showRecentReceiversModal, setShowRecentReceiversModal] = useState(false);
  const [recentReceivers, setRecentReceivers] = useState<Receiver[]>([]);
  const [isLoadingRecentReceivers, setIsLoadingRecentReceivers] = useState(false);

  // State for Receiver Details Modal
  const [selectedReceiverForDetails, setSelectedReceiverForDetails] = useState<Receiver | null>(null);
  const [showReceiverDetailsModal, setShowReceiverDetailsModal] = useState(false);

  // State for Receiver Transaction History Modal
  const [selectedReceiverForHistory, setSelectedReceiverForHistory] = useState<Receiver | null>(null);
  const [showReceiverHistoryModal, setShowReceiverHistoryModal] = useState(false);
  const [receiverTransactions, setReceiverTransactions] = useState<Transaction[]>([]);
  const [isLoadingReceiverHistory, setIsLoadingReceiverHistory] = useState(false);
  
  // Demo clients data - UPDATED to match new Client interface
  const [clients, setClients] = useState<Client[]>([
    {
      id: 'CUST1001',
      firstName: 'John',
      lastName: 'Smith',
      name: 'John Smith',
      phone: '+1 555-1234',
      email: 'john.smith@example.com',
      streetAddress: '123 Main St',
      city: 'New York',
      country: 'USA',
      postalCode: '10001',
      idType: 'Passport',
      idNumber: 'P12345678',
      idIssuanceCountry: 'USA',
      idIssueDate: '2022-01-01',
      idExpiryDate: '2030-01-01',
      bankAccount: '****1234', // Masked for display
      bankCode: '021000021',
      branchCode: '800',
      status: 'Active',
      kycVerified: true,
      riskRating: 'Low',
      currency: 'USD',
      dateOfBirth: '1980-01-15',
      gender: 'male',
      nationality: 'American',
      employer: 'Global Corp',
      division: 'Technology',
      accountBalances: [
        { currency: 'USD', balance: 10500.75, type: 'Checking' },
        { currency: 'EUR', balance: 5200.00, type: 'Savings' },
      ],
      products: {
        prepaidCards: [{ id: 'pc1', last4: '5678', status: 'Active', addCardLink: '#' }],
        simCards: [{ id: 'sc1', number: '+15551234567', status: 'Active', showDetailsLink: '#' }],
      },
      qrCodeData: 'johnsmith_qr_123',
      documents: [
        { documentType: 'Passport Scan', fileName: 'passport_john_smith.pdf' },
        { documentType: 'Proof of Address', fileName: 'utility_bill_js.pdf' },
      ],
      relationshipToBeneficiary: 'Spouse',
    },
    {
      id: 'CUST1002',
      firstName: 'Maria',
      lastName: 'Garcia',
      name: 'Maria Garcia',
      phone: '+1 555-5678',
      email: 'maria.garcia@example.com',
      streetAddress: '456 Oak St',
      city: 'Miami',
      country: 'USA',
      postalCode: '33101',
      idType: 'Driver License',
      idNumber: 'DL87654321',
      idIssuanceCountry: 'USA',
      idIssueDate: '2021-05-10',
      idExpiryDate: '2028-05-10',
      bankAccount: '****5678',
      bankCode: '061092387',
      branchCode: '101',
      status: 'Active',
      kycVerified: true,
      riskRating: 'Low',
      currency: 'EUR', 
      dateOfBirth: '1992-07-20',
      gender: 'female',
      nationality: 'Spanish',
      employer: 'Local Services Inc.',
      division: 'Customer Support',
      accountBalances: [{ currency: 'USD', balance: 7800.20, type: 'Checking' }],
      products: {
        prepaidCards: [{ id: 'pc2', last4: '1234', status: 'Active', addCardLink: '#' }],
      },
      qrCodeData: 'mariagarcia_qr_456',
      relationshipToBeneficiary: 'Friend',
    },
    // Add more detailed mock data for CUST1003 and CUST1004 if needed
    {
      id: 'CUST1003',
      firstName: 'David',
      lastName: 'Johnson',
      name: 'David Johnson',
      phone: '+1 555-9012',
      email: 'david.johnson@example.com',
      streetAddress: '789 Pine St',
      city: 'Chicago',
      country: 'USA',
      postalCode: '60601',
      idType: 'Passport',
      idNumber: 'P98765432',
      idIssuanceCountry: 'USA',
      idIssueDate: '2020-12-25',
      idExpiryDate: '2032-12-25',
      bankAccount: '****9012',
      bankCode: '071000013',
      branchCode: '202',
      status: 'Active',
      kycVerified: true,
      riskRating: 'Low',
      currency: 'GBP',
      dateOfBirth: '1975-03-10',
      gender: 'male',
      nationality: 'British',
      accountBalances: [{ currency: 'GBP', balance: 15000.00, type: 'Primary' }],
      qrCodeData: 'davidjohnson_qr_789',
    },
    {
      id: 'CUST1004',
      firstName: 'Sarah',
      lastName: 'Williams',
      name: 'Sarah Williams',
      phone: '+1 555-3456',
      email: 'sarah.williams@example.com',
      streetAddress: '321 Elm St',
      city: 'Los Angeles',
      country: 'USA',
      postalCode: '90001',
      idType: 'Driver License',
      idNumber: 'DL12345678',
      idIssuanceCountry: 'USA',
      idIssueDate: '2019-08-15',
      idExpiryDate: '2029-08-15',
      bankAccount: '****3456',
      bankCode: '121000358',
      branchCode: '303',
      status: 'Active',
      kycVerified: true,
      riskRating: 'Low',
      currency: 'JPY',
      dateOfBirth: '1988-11-05',
      gender: 'female',
      nationality: 'Canadian',
      accountBalances: [{ currency: 'JPY', balance: 2500000, type: 'Trading' }],
      qrCodeData: 'sarahwilliams_qr_012',
    }
  ]);
  
  // Form data
  const initialFormData: FormData = {
    currency: 'USD',
    amount: '',
    recipientAmount: '',
    fee: '0.00', // Default fee to a string representation of zero
    totalAmount: '',
    sourceOfFunds: '',
    purposeOfTransfer: '',
    transferType: '',
    notes: '',
    agreeToTerms: false,

    // Defaults for new fields
    operator: '', // Or a default operator ID if known
    customerCardNumberDelivery: '',
    exchangeRate: 1.08, // Example initial rate for USD to EUR, would be fetched
    extraChargesPercent: 0,
    feePayer: 'sender',
    tellerDiscountPercent: 0,
    promoCode: '',
    paymentMethod: 'cash', // Default as per spec example
    destinationCurrency: 'EUR', // Default destination currency
  };
  
  const [formData, setFormData] = useState<FormData>(initialFormData);
  
  // Filtered clients based on search query
  const [filteredClients, setFilteredClients] = useState<Client[]>(clients);
  
  // Add new state for enhanced features
  const [transferLimits, setTransferLimits] = useState<TransferLimits>({
    daily: 10000,
    monthly: 50000,
    perTransaction: 5000,
    remainingDaily: 10000,
    remainingMonthly: 50000,
  });
  const [retryCount, setRetryCount] = useState(0);
  const [transferErrors, setTransferErrors] = useState<TransferError[]>([]);
  const [isHighRiskTransaction, setIsHighRiskTransaction] = useState(false);
  const [requires2FA, setRequires2FA] = useState(false);
  const [is2FAVerified, setIs2FAVerified] = useState(false);
  
  // Mock Receivers Data
  const MOCK_RECEIVERS: Receiver[] = [
    {
      id: 'REC001',
      firstName: 'Alice',
      middleName: 'Mary',
      lastName: 'Johnson',
      dateOfBirth: '1990-05-15',
      gender: 'female',
      country: 'Canada',
      city: 'Toronto',
      streetAddress: '123 Maple Street',
      postalCode: 'M5H 2N2',
      phone: '+1-416-555-0101',
      email: 'alice.johnson@example.com',
      relationshipToSender: 'Friend',
      bankName: 'TD Canada Trust',
      bankAccountNumber: '**** **** **** 1234',
      bankSwiftCode: 'TDOMCATTTOR',
      bankBranch: 'Branch A'
    },
    {
      id: 'REC002',
      firstName: 'Bob',
      lastName: 'Williams',
      dateOfBirth: '1985-11-20',
      gender: 'male',
      country: 'UK',
      city: 'London',
      streetAddress: '456 Oak Avenue',
      postalCode: 'SW1A 1AA',
      phone: '+44-20-7946-0102',
      email: 'bob.williams@example.com',
      relationshipToSender: 'Family',
      bankName: 'HSBC UK',
      bankAccountNumber: '**** **** **** 5678',
      bankSwiftCode: 'MIDLGB22',
      bankBranch: 'Branch B'
    },
    {
      id: 'REC003',
      firstName: 'Elena',
      middleName: 'Sofia',
      lastName: 'Rodriguez',
      dateOfBirth: '1992-03-10',
      gender: 'female',
      country: 'Spain',
      city: 'Madrid',
      streetAddress: '789 Pine Road',
      postalCode: '28001',
      phone: '+34-91-555-0103',
      email: 'elena.rodriguez@example.com',
      relationshipToSender: 'Colleague',
    }
  ];

  // Mock Receiver Transactions Data
  const MOCK_RECEIVER_TRANSACTIONS: Transaction[] = [
    {
      id: 'TXN789012',
      date: '2024-03-10',
      amountSent: '150.00',
      currencySent: 'USD',
      amountReceived: '195.00',
      currencyReceived: 'CAD',
      status: 'Completed',
      receiverName: 'Alice Johnson',
      country: 'Canada',
      operator: 'Interac',
      transferType: 'E-transfer',
      transferDetails: 'Payment for services'
    },
    {
      id: 'TXN890123',
      date: '2024-02-20',
      amountSent: '200.00',
      currencySent: 'GBP',
      amountReceived: '230.00',
      currencyReceived: 'EUR',
      status: 'Completed',
      receiverName: 'Bob Williams',
      country: 'UK',
      operator: 'SWIFT',
      transferType: 'Bank Deposit',
      transferDetails: 'Account: ****5678'
    },
  ];
  
  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Filter clients when search query changes
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredClients(clients);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredClients(
        clients.filter(
          client =>
            client.name.toLowerCase().includes(query) ||
            client.phone.toLowerCase().includes(query) ||
            client.id.toLowerCase().includes(query)
        )
      );
    }
  }, [searchQuery, clients]);
  
  // Navigation and form handling
  const handleNavigation = (direction: 'next' | 'back') => {
    setNavigationDirection(direction === 'next' ? 'forward' : 'backward');
    const currentStepIsValid = validateCurrentStep();

    if (direction === 'next') {
      if (currentStepIsValid) {
        if (activeStep === 1 && selectedSender) { // Sender selection step
          // Instead of directly going to step 2, show recent receivers modal
          handleShowRecentReceiversModal(); 
        } else if (activeStep < steps.length) {
          setActiveStep(prev => prev + 1);
        } else if (activeStep === steps.length) {
          // This is the final confirmation step, trigger submit
          handleSubmit();
        }
      }
    } else if (direction === 'back') {
      if (activeStep > 1) {
        setActiveStep(prev => prev - 1);
      }
    }
  };
  
  // Check if can proceed to next step
  const canProceed = (): boolean => {
    switch (activeStep) {
      case 1:
        return !!selectedSender;
      case 2:
        return !!selectedReceiver;
      case 3:
        return !!formData.sourceOfFunds && !!formData.purposeOfTransfer;
      case 4:
        return !!formData.amount && parseFloat(formData.amount) > 0;
      case 5:
        return formData.agreeToTerms;
      default:
        return false;
    }
  };
  
  // Validate current step
  const validateCurrentStep = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    switch (activeStep) {
      case 1:
        if (!selectedSender) {
          newErrors.sender = 'Please select a sender';
        }
        break;
      case 2:
        if (!selectedReceiver) {
          newErrors.receiver = 'Please select a receiver';
        }
        break;
      case 3:
        if (!formData.sourceOfFunds) {
          newErrors.sourceOfFunds = 'Please select a source of funds';
        }
        if (!formData.purposeOfTransfer) {
          newErrors.purposeOfTransfer = 'Please select a purpose of transfer';
        }
        break;
      case 4:
        if (!formData.amount) {
          newErrors.amount = 'Please enter an amount';
        } else if (parseFloat(formData.amount) <= 0) {
          newErrors.amount = 'Amount must be greater than zero';
        }
        break;
      case 5:
        if (!formData.agreeToTerms) {
          newErrors.terms = 'You must agree to the terms and conditions';
        }
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const parsedValue = type === 'number' && value !== '' ? parseFloat(value) : value;
    // @ts-ignore // Temporarily ignore implicit any for prevFormData
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: parsedValue,
    }));
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  // Handle select changes
  const handleSelectChange = (name: keyof FormData, value: string | number) => {
    // @ts-ignore // Temporarily ignore implicit any for prevFormData
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };
  
  // Handle checkbox changes
  const handleCheckboxChange = (name: keyof FormData, checked: boolean) => {
    // @ts-ignore // Temporarily ignore implicit any for prevFormData
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: checked,
    }));
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  const applyPromoCode = (amount: number, promoCode?: string): number => {
    // Mock promo code logic
    if (promoCode === 'SAVE10') {
      return Math.max(0, amount - 10); // Flat $10 discount
    }
    if (promoCode === 'DISC5') {
      return amount * 0.95; // 5% discount
    }
    return amount;
  };

  const calculateFee = (): number => {
    const baseSendAmount = parseFloat(formData.amount || '0');
    if (baseSendAmount <= 0) return 0;

    // Example base fee: 1% of send amount, min $2, max $50
    let fee = baseSendAmount * 0.01;
    fee = Math.max(2, fee); // Min fee
    fee = Math.min(fee, 50); // Max fee

    // Add extra charges if applicable (as a percentage of the send amount)
    if (formData.extraChargesPercent && formData.extraChargesPercent > 0) {
      fee += baseSendAmount * (formData.extraChargesPercent / 100);
    }

    // Apply teller discount (as a percentage of the calculated fee so far)
    if (formData.tellerDiscountPercent && formData.tellerDiscountPercent > 0) {
      fee -= fee * (formData.tellerDiscountPercent / 100);
    }
    
    // Apply promo code discount to the fee itself (example logic)
    // More complex promo logic might apply to total or send amount directly.
    // For this example, let's say some promo codes reduce the fee.
    if (formData.promoCode) {
        // This is a simplified promo logic. A real system would be more complex.
        if (formData.promoCode.toUpperCase() === 'NOFEE') fee = 0;
        if (formData.promoCode.toUpperCase() === 'HALFEE' && fee > 0) fee /= 2;
    }

    return Math.max(0, fee); // Ensure fee is not negative
  };

  const calculateRecipientAmount = (): number => {
    const sendAmount = parseFloat(formData.amount || '0');
    const exchangeRate = formData.exchangeRate || 0;
    if (sendAmount <= 0 || exchangeRate <= 0) return 0;

    let recipientGets = sendAmount * exchangeRate;
    const feeInSourceCurrency = calculateFee();

    if (formData.feePayer === 'beneficiary') {
      const feeInDestinationCurrency = feeInSourceCurrency * exchangeRate;
      recipientGets -= feeInDestinationCurrency;
    } else if (formData.feePayer === 'both') {
      const halfFeeInDestinationCurrency = (feeInSourceCurrency / 2) * exchangeRate;
      recipientGets -= halfFeeInDestinationCurrency;
    }
    
    // Promo codes affecting recipient amount directly would be applied here.
    // For now, our promo affects the fee primarily.

    return Math.max(0, recipientGets);
  };

  const calculateTotalAmount = (): number => {
    let sendAmount = parseFloat(formData.amount || '0');
    if (sendAmount <= 0) return 0;
    
    let fee = calculateFee();
    let total = sendAmount;

    if (formData.feePayer === 'sender') {
      total += fee;
    } else if (formData.feePayer === 'both') {
      total += (fee / 2);
    }
    // If feePayer is 'beneficiary', sender pays only sendAmount, fee is handled on recipient side.
    
    // Example: Some promo codes might offer a discount on the total amount sender pays
    // This is distinct from promos that affect the fee directly.
    // total = applyPromoCode(total, formData.promoCode); // This was a generic promo example

    return Math.max(0, total);
  };

  // Update form data when amount or currency changes
  useEffect(() => {
    const fee = calculateFee();
    const recipientAmount = calculateRecipientAmount();
    const totalAmount = calculateTotalAmount();
    
    // @ts-ignore
    setFormData((prevFormData) => ({
      ...prevFormData,
      fee: fee.toFixed(2),
      recipientAmount: recipientAmount.toFixed(2),
      totalAmount: totalAmount.toFixed(2),
    }));
  }, [
    formData.amount,
    formData.currency, // Source currency
    formData.destinationCurrency, // Added dependency
    formData.exchangeRate,
    formData.extraChargesPercent,
    formData.tellerDiscountPercent,
    formData.feePayer,
    formData.promoCode,
    // Add formData.destinationCurrency if it becomes a direct input and affects calculations
  ]);
  
  // Enhanced validation with transfer limits
  const validateAmount = (amount: number): TransferError[] => {
    const errors: TransferError[] = [];
    
    if (amount <= 0) {
      errors.push({
        code: 'INVALID_AMOUNT',
        message: 'Amount must be greater than zero',
        field: 'amount',
        retryable: false
      });
    }

    if (amount > transferLimits.perTransaction) {
      errors.push({
        code: 'EXCEEDS_TRANSACTION_LIMIT',
        message: `Amount exceeds maximum transaction limit of ${transferLimits.perTransaction}`,
        field: 'amount',
        retryable: false
      });
    }

    if (amount > transferLimits.remainingDaily) {
      errors.push({
        code: 'EXCEEDS_DAILY_LIMIT',
        message: `Amount exceeds remaining daily limit of ${transferLimits.remainingDaily}`,
        field: 'amount',
        retryable: false
      });
    }

    if (amount > transferLimits.remainingMonthly) {
      errors.push({
        code: 'EXCEEDS_MONTHLY_LIMIT',
        message: `Amount exceeds remaining monthly limit of ${transferLimits.remainingMonthly}`,
        field: 'amount',
        retryable: false
      });
    }

    return errors;
  };

  // Check if transaction is high risk
  const checkHighRiskTransaction = (amount: number) => {
    const isHighRisk = amount > 1000 || 
                      selectedReceiver?.country !== selectedSender?.country ||
                      formData.sourceOfFunds === 'other';
    setIsHighRiskTransaction(isHighRisk);
    setRequires2FA(isHighRisk);
  };

  // Enhanced handleSubmit with retry logic and error handling
  const handleSubmit = async () => {
    if (!validateCurrentStep()) return;

    const amount = parseFloat(formData.amount);
    const amountErrors = validateAmount(amount);
    
    if (amountErrors.length > 0) {
      setTransferErrors(amountErrors);
      setErrors(prev => ({
        ...prev,
        amount: amountErrors[0].message
      }));
      return;
    }

    checkHighRiskTransaction(amount);

    if (requires2FA && !is2FAVerified) {
      setTransferErrors([{
        code: '2FA_REQUIRED',
        message: 'Please complete 2FA verification before proceeding',
        retryable: false
      }]);
      return;
    }

    setIsSubmitting(true);
    setTransferErrors([]);

    try {
      // Simulate API call with retry logic
      const maxRetries = 3;
      let attempt = 0;
      let success = false;

      while (attempt < maxRetries && !success) {
        try {
          // Simulate API call
          await new Promise((resolve, reject) => {
            setTimeout(() => {
              // Randomly simulate success/failure for demo
              if (Math.random() > 0.3) {
                resolve(true);
              } else {
                reject(new Error('Network error'));
              }
            }, 2000);
          });
          
          success = true;
          
          // Update limits after successful transfer
          setTransferLimits(prev => ({
            ...prev,
            remainingDaily: prev.remainingDaily - amount,
            remainingMonthly: prev.remainingMonthly - amount
          }));

          setTransferComplete(true);
          setShowSuccessMessage(true);
          
        } catch (error) {
          attempt++;
          setRetryCount(attempt);
          
          if (attempt === maxRetries) {
            setTransferErrors([{
              code: 'TRANSFER_FAILED',
              message: 'Transfer failed after multiple attempts. Please try again later.',
              retryable: true
            }]);
          }
          
          // Wait before retry
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        }
      }
    } catch (error) {
      setTransferErrors([{
        code: 'UNEXPECTED_ERROR',
        message: 'An unexpected error occurred. Please try again later.',
        retryable: true
      }]);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add 2FA verification handler
  const verify2FA = async (code: string) => {
    try {
      // Simulate 2FA verification
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIs2FAVerified(true);
      return true;
    } catch (error) {
      setTransferErrors([{
        code: '2FA_FAILED',
        message: 'Failed to verify 2FA code. Please try again.',
        retryable: true
      }]);
      return false;
    }
  };

  // Enhanced reset form
  const resetForm = () => {
    setActiveStep(1);
    setSelectedSender(null);
    setSelectedReceiver(null);
    setFormData(initialFormData);
    setErrors({});
    setShowSuccessMessage(false);
    setTransferComplete(false);
    setTransferErrors([]);
    setRetryCount(0);
    setIsHighRiskTransaction(false);
    setRequires2FA(false);
    setIs2FAVerified(false);
  };
  
  // Handle "Send Another" action
  const handleSendAnother = () => {
    resetForm();
  };

  const handleSaveSender = (senderData: Partial<Client>) => {
    // In a real app, this would involve an API call to create/update the sender.
    // For now, we'll add/update it in our local clients array and select it.
    const newSender: Client = {
      id: senderData.id || `CUST${Date.now()}`,
      name: `${senderData.firstName} ${senderData.lastName}`.trim(),
      firstName: senderData.firstName || '',
      lastName: senderData.lastName || '',
      phone: senderData.phone || '',
      // Add all other fields from senderData, providing defaults if necessary
      middleName: senderData.middleName,
      dateOfBirth: senderData.dateOfBirth,
      gender: senderData.gender,
      nationality: senderData.nationality,
      email: senderData.email,
      customerCardNumber: senderData.customerCardNumber,
      country: senderData.country || '',
      streetAddress: senderData.streetAddress,
      city: senderData.city,
      postalCode: senderData.postalCode,
      idType: senderData.idType || '',
      idNumber: senderData.idNumber || '',
      idIssuanceCountry: senderData.idIssuanceCountry,
      idIssueDate: senderData.idIssueDate,
      idExpiryDate: senderData.idExpiryDate,
      bankAccount: senderData.bankAccount || '',
      status: senderData.status || 'Active',
      kycVerified: senderData.kycVerified || false, // Default to false, KYC flow needed
      riskRating: senderData.riskRating || 'Medium',
      currency: senderData.currency || initialFormData.currency,
      documents: senderData.documents || [],
      relationshipToBeneficiary: senderData.relationshipToBeneficiary,
    };

    // Check if sender exists to update, otherwise add
    const clientIndex = clients.findIndex(c => c.id === newSender.id);
    let updatedClients = [...clients];
    if (clientIndex > -1) {
      updatedClients[clientIndex] = newSender;
    } else {
      updatedClients = [newSender, ...updatedClients];
    }
    setClients(updatedClients);
    setSelectedSender(newSender);
    setShowNewSenderForm(false); // Hide form and proceed
    // Optionally, navigate to the next step or allow user to confirm selection
  };

  const handleSaveReceiver = (receiverData: Partial<Client>) => {
    const newReceiver: Client = {
      id: receiverData.id || `RCVR${Date.now()}`,
      name: `${receiverData.firstName} ${receiverData.lastName}`.trim(),
      firstName: receiverData.firstName || '',
      lastName: receiverData.lastName || '',
      phone: receiverData.phone || '', // Phone is optional for receiver in some contexts
      middleName: receiverData.middleName,
      dateOfBirth: receiverData.dateOfBirth,
      gender: receiverData.gender,
      nationality: receiverData.nationality,
      email: receiverData.email,
      country: receiverData.country || '',
      streetAddress: receiverData.streetAddress,
      city: receiverData.city,
      postalCode: receiverData.postalCode,
      relationshipToSender: receiverData.relationshipToSender,
      // Receiver specific fields / defaults
      idType: receiverData.idType || '', // Often not needed for receiver, or simpler
      idNumber: receiverData.idNumber || '',
      bankAccount: receiverData.bankAccount || '', 
      status: receiverData.status || 'Active',
      kycVerified: receiverData.kycVerified || false, 
      riskRating: receiverData.riskRating || 'Low',
      currency: receiverData.currency || initialFormData.currency, // Or target currency
    };
    // Similar logic to add/update receiver in a list if managing a list of receivers
    // For now, just set as selected
    setSelectedReceiver(newReceiver);
    setShowNewReceiverForm(false); // Hide form and proceed
  };

  // Mock function to fetch sender transaction history
  const fetchSenderTransactionHistory = async (senderId: string) => {
    setIsLoadingHistory(true);
    setHistoryModalSender(clients.find(c => c.id === senderId) || null);
    await new Promise(resolve => setTimeout(resolve, 1000)); 
    
    const mockHistory: Transaction[] = [
      {
        id: 'TX123', date: '2024-07-15', receiverName: 'Jane Doe (History)', 
        amountSent: '100', currencySent: 'USD', amountReceived: '650', currencyReceived: 'CNY', status: 'Completed'
      },
      {
        id: 'TX124', date: '2024-06-20', receiverName: 'John Roe (History)', 
        amountSent: '50', currencySent: 'USD', amountReceived: '45', currencyReceived: 'EUR', status: 'Pending'
      },
      {
        id: 'TX125', date: '2024-05-10', receiverName: 'Alice Smith (History)', 
        amountSent: '200', currencySent: 'USD', amountReceived: '180', currencyReceived: 'GBP', status: 'Failed'
      },
      {
        id: 'TX126', date: '2024-07-01', receiverName: 'Another User (History)', 
        amountSent: '1000', currencySent: 'GBP', amountReceived: '1200', currencyReceived: 'USD', status: 'Completed'
      }
    ];
    
    // Filter randomly for demo variety, ensuring at least one is returned if possible
    const filteredHistory = mockHistory.filter(() => Math.random() > 0.4);
    setSenderTransactions(filteredHistory.length > 0 ? filteredHistory : mockHistory.slice(0,1));
    setIsLoadingHistory(false);
  };

  const handleShowSenderHistory = (senderId: string) => {
    fetchSenderTransactionHistory(senderId);
    // The modal component itself will control its isOpen state based on historyModalSender not being null
  };

  const handleCloseSenderHistoryModal = () => {
    setHistoryModalSender(null);
    setSenderTransactions([]);
  };

  const handleUseTransactionFromHistory = (transaction: Transaction) => {
    // 1. Find receiver based on name (simplified logic)
    const receiverClient = clients.find(c => 
      `${c.firstName} ${c.lastName}`.toLowerCase() === transaction.receiverName.toLowerCase() || 
      c.name.toLowerCase() === transaction.receiverName.toLowerCase()
    );
    setSelectedReceiver(receiverClient || null);

    // 2. Populate formData
    // @ts-ignore
    setFormData(prev => ({
      ...initialFormData, // Reset other fields to initial, then apply history
      amount: transaction.amountSent,
      currency: transaction.currencySent,
      destinationCurrency: transaction.currencyReceived,
      // Potentially pre-fill other details if available in Transaction type
      // e.g., sourceOfFunds, purposeOfTransfer based on history.
      // For now, primarily focusing on sender, receiver, and amount/currencies.
    }));

    // 3. Navigate to Amount step (step 4)
    // Ensure sender is set (should be, as history is for a selected sender)
    if(selectedSender) {
      setActiveStep(4);
    } else {
      // Fallback or error if sender isn't somehow selected when using history
      setActiveStep(1); // Go back to sender selection
      // Optionally, show an error message
    }

    // 4. Close modal
    handleCloseSenderHistoryModal();
  };

  const handleSetReceiverSameAsSender = () => {
    if (selectedSender) {
      // Create a new object for the receiver to avoid direct state mutation issues
      // and to allow for potential differences (e.g., receiver might not have an ID yet if new)
      // Or, if sender is a full client object, we can map relevant fields.
      const receiverDataFromSender: Partial<Client> = {
        // Map relevant fields from selectedSender to a new receiver object
        // This is a shallow copy; adjust if deep copy or specific transformations are needed
        ...selectedSender,
        id: `RCVR_FROM_${selectedSender.id}_${Date.now()}`, // Give a new temp ID
        relationshipToSender: 'Self', // Default or prompt for actual relationship
        // Clear any sender-specific fields that don't apply to a receiver if necessary
        // e.g., documents, relationshipToBeneficiary might not be directly copied
        documents: [], 
        relationshipToBeneficiary: undefined, 
      };
      // Assert the type if confident, or ensure all required Client fields are present
      setSelectedReceiver(receiverDataFromSender as Client);
      // Optionally, close the new receiver form if it was open
      setShowNewReceiverForm(false); 
      // Optionally, navigate to the next step if current step is ReceiverSelection
      if (activeStep === 2) {
        // handleNavigation('next'); // Consider if this auto-navigation is desired
      }
      // Display a notification/toast to the user
      // toast.success("Receiver details copied from sender."); // Example with a toast library
      alert("Receiver details have been set based on the sender.");
    } else {
      // toast.error("No sender selected to copy details from.");
      alert("No sender selected. Please select a sender first.");
    }
  };

  const handleUseGlobalRemitProduct = () => {
    // Logic for when user opts to use a Global Remit product for the receiver
    // This might involve setting a specific receiver type or pre-filling certain fields
    if (selectedSender) {
        const globalRemitReceiver: Client = {
            id: `GR_PRODUCT_${Date.now()}`,
            name: "Global Remit Product",
            firstName: "Global Remit",
            lastName: "Product",
            phone: selectedSender.phone, // Example: use sender's phone or a generic one
            email: selectedSender.email,
            country: selectedSender.country, // Example: use sender's country
            streetAddress: "N/A",
            city: "N/A",
            postalCode: "N/A",
            idType: "N/A",
            idNumber: "N/A",
            bankAccount: "N/A",
            status: "Active",
            kycVerified: true, // Assuming product itself is compliant
            riskRating: "Low",
            relationshipToSender: "Global Remit Service"
        };
        setSelectedReceiver(globalRemitReceiver);
        setShowNewReceiverForm(false);
        // Potentially navigate to next step if this selection is definitive
        // For example, to amount entry or a specialized product configuration step
        setActiveStep(prev => prev < steps.length ? prev + 1 : prev); 
    }
    console.log("Using Global Remit Product");
  };

  const handleGoToStep = (stepNumber: number) => {
    if (stepNumber > 0 && stepNumber <= steps.length) {
      setNavigationDirection(stepNumber > activeStep ? 'forward' : 'backward');
      setActiveStep(stepNumber);
    }
  };

  // --- MOCK API call for exchange rate ---
  const fetchExchangeRate = async (source?: string, destination?: string) => { // Made params optional to handle initial state
    if (!source || !destination || source === destination) {
      // @ts-ignore
      setFormData(prev => ({ ...prev, exchangeRate: source === destination ? 1 : 0 }));
      return;
    }
    console.log(`Fetching exchange rate for ${source} to ${destination}`);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300));
    let rate = 0;
    if (source === 'USD' && destination === 'EUR') rate = 0.92;
    else if (source === 'USD' && destination === 'GBP') rate = 0.79;
    else if (source === 'USD' && destination === 'CNY') rate = 7.25;
    else if (source === 'EUR' && destination === 'USD') rate = 1.08;
    else if (source === 'EUR' && destination === 'GBP') rate = 0.85;
    else if (source === 'GBP' && destination === 'USD') rate = 1.26;
    else if (source === 'GBP' && destination === 'EUR') rate = 1.17;
    // Add more common pairs
    else if (source === 'CNY' && destination === 'USD') rate = 0.14;
    else rate = Math.random() * 2 + 0.5; 
    
    // @ts-ignore
    setFormData(prev => ({ ...prev, exchangeRate: rate }));
  };

  // Fetch exchange rate initially and when source or destination currency changes
  useEffect(() => {
    fetchExchangeRate(formData.currency, formData.destinationCurrency);
  }, [formData.currency, formData.destinationCurrency]);

  // --- New Handlers for Receiver Modals ---
  const fetchRecentReceivers = async (senderId: string | undefined) => {
    if (!senderId) return; // Should not happen if a sender is selected
    setIsLoadingRecentReceivers(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    // For now, always return the same mock receivers, ideally filter/fetch based on senderId
    setRecentReceivers(MOCK_RECEIVERS); 
    setIsLoadingRecentReceivers(false);
  };

  const handleShowRecentReceiversModal = () => {
    if (selectedSender) {
      fetchRecentReceivers(selectedSender.id);
      setShowRecentReceiversModal(true);
    }
  };

  const handleCloseRecentReceiversModal = () => {
    setShowRecentReceiversModal(false);
  };

  const handleSelectReceiverFromRecent = (receiver: Receiver) => {
    // The Client type and Receiver type might be different.
    // For now, let's assume we can map/cast.
    const clientGender = (['male', 'female', 'other'] as const).includes(receiver.gender as any) 
        ? receiver.gender as 'male' | 'female' | 'other' 
        : undefined;

    const receiverAsClient: Client = {
        ...receiver, // Spread properties from Receiver
        name: `${receiver.firstName} ${receiver.lastName}`,
        streetAddress: receiver.streetAddress, 
        idType: '', // Placeholder
        idNumber: '', // Placeholder
        bankAccount: receiver.bankAccountNumber || '', // Map from receiver's bankAccountNumber
        status: 'Active', // Placeholder
        kycVerified: false, // Placeholder
        riskRating: 'Low', // Placeholder
        gender: clientGender, // Assign corrected gender
        // Ensure all required Client fields not in Receiver have some default or are optional
        // Required fields in Client: id, name, firstName, lastName, phone, country, idType, idNumber, bankAccount, status, kycVerified, riskRating
        // Receiver has: id, firstName, lastName, phone, country. We are adding name, and mapping bankAccount.
        // Need to ensure idType, idNumber, status, kycVerified, riskRating are handled.
        // The placeholders above address these.
    };
    setSelectedReceiver(receiverAsClient);
    setShowRecentReceiversModal(false);
    setActiveStep(3); // Move to Transfer Details step
  };

  const fetchReceiverTransactionHistory = async (receiverId: string) => {
    setIsLoadingReceiverHistory(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    // Filter mock transactions for the given receiverId - simplistic match by name for now
    const filteredTransactions = MOCK_RECEIVER_TRANSACTIONS.filter(
      t => t.receiverName?.includes(selectedReceiverForHistory?.firstName || '') && t.receiverName?.includes(selectedReceiverForHistory?.lastName || '')
    );
    setReceiverTransactions(filteredTransactions.length > 0 ? filteredTransactions : MOCK_RECEIVER_TRANSACTIONS.slice(0,1)); // Show one if no match for demo
    setIsLoadingReceiverHistory(false);
  };

  const handleOpenReceiverDetailsModal = (receiver: Receiver) => {
    setSelectedReceiverForDetails(receiver);
    setShowReceiverDetailsModal(true);
  };

  const handleCloseReceiverDetailsModal = () => {
    setShowReceiverDetailsModal(false);
    setSelectedReceiverForDetails(null);
  };

  const handleOpenReceiverHistoryModal = (receiver: Receiver) => {
    setSelectedReceiverForHistory(receiver);
    fetchReceiverTransactionHistory(receiver.id); // Pass receiver.id
    setShowReceiverHistoryModal(true);
  };

  const handleCloseReceiverHistoryModal = () => {
    setShowReceiverHistoryModal(false);
    setSelectedReceiverForHistory(null);
    setReceiverTransactions([]);
  };

  // --- End New Handlers ---

  return {
    steps,
    activeStep,
    navigationDirection,
    transferComplete,
    showSuccessMessage,
    isSubmitting,
    initialLoading,
    loading,
    errors,
    searchQuery,
    setSearchQuery,
    selectedSender,
    setSelectedSender,
    selectedReceiver,
    setSelectedReceiver,
    showNewSenderForm,
    setShowNewSenderForm,
    showNewReceiverForm,
    setShowNewReceiverForm,
    formData,
    setFormData,
    filteredClients,
    handleNavigation,
    canProceed,
    handleInputChange,
    handleSelectChange,
    handleCheckboxChange,
    calculateFee,
    calculateRecipientAmount,
    calculateTotalAmount,
    handleSendAnother,
    transferLimits,
    transferErrors,
    retryCount,
    isHighRiskTransaction,
    requires2FA,
    is2FAVerified,
    verify2FA,
    handleSaveSender,
    handleSaveReceiver,
    historyModalSender,
    senderTransactions,
    isLoadingHistory,
    handleShowSenderHistory,
    handleCloseSenderHistoryModal,
    handleUseTransactionFromHistory,
    handleSetReceiverSameAsSender,
    handleUseGlobalRemitProduct,
    handleSubmit, // Renamed from formSubmitHandler for clarity if needed externally
    
    // New state and handlers for receiver modals
    showRecentReceiversModal,
    recentReceivers,
    isLoadingRecentReceivers,
    handleShowRecentReceiversModal, // Exposed for direct call if needed, though tied to nav now
    handleCloseRecentReceiversModal,
    handleSelectReceiverFromRecent,

    showReceiverDetailsModal,
    selectedReceiverForDetails,
    handleOpenReceiverDetailsModal,
    handleCloseReceiverDetailsModal,

    showReceiverHistoryModal,
    selectedReceiverForHistory,
    receiverTransactions,
    isLoadingReceiverHistory,
    handleOpenReceiverHistoryModal,
    handleCloseReceiverHistoryModal,
    handleGoToStep, // Expose the new handler
  };
};

