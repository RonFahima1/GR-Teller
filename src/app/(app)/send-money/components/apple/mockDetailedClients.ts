import { Client } from '../../hooks/useSendMoneyForm';

// Extended client interface for detailed profile view
export interface DetailedClient extends Omit<Client, 'gender' | 'products'> {
  middleName?: string;
  dateOfBirth: string;
  gender: string;
  nationality: string;
  bankDetails: {
    bankCode: string;
    branchCode: string;
    accountNumber: string;
    iban: string;
  };
  identification: {
    type: string;
    issuanceCountry: string;
    number: string;
    expiryDate: string;
    issueDate?: string;
  };
  address: {
    country: string;
    street: string;
    city: string;
    postalCode?: string;
    isVerified: boolean;
  };
  balances: Array<{
    currency: string;
    amount: string;
    convertedValue?: string;
  }>;
  products: {
    prepaidCard?: {
      cardNumber: string;
      expiryDate: string;
      status: string;
    } | null;
    simCard?: {
      number: string;
      provider: string;
      status: string;
    } | null;
  };
}

// Detailed mock clients with all profile information
export const mockDetailedClients: DetailedClient[] = [
  {
    id: '1',
    name: 'Test Rinase',
    firstName: 'Test',
    middleName: 'Sanityne',
    lastName: 'Rinase',
    dateOfBirth: '2007-05-07',
    gender: 'Male',
    nationality: 'Israel',
    phone: '+972 517790303',
    email: '',
    country: 'Israel',
    bankAccount: '800-000952807',
    idType: 'Passport',
    idNumber: '1993838123',
    bankDetails: {
      bankCode: '47',
      branchCode: '800',
      accountNumber: '000952807',
      iban: 'IL05 0478 0000 0000 0952 807',
    },
    identification: {
      type: 'Passport',
      issuanceCountry: 'Malawi',
      number: '1993838123',
      expiryDate: '2027-06-07',
      issueDate: '',
    },
    address: {
      country: 'Israel',
      street: 'Street',
      city: 'Hadera',
      postalCode: '',
      isVerified: true,
    },
    status: 'Active',
    kycVerified: true,
    riskRating: 'Low',
    balances: [
      {
        currency: 'ILS',
        amount: '2,500.00',
        convertedValue: '684.93'
      },
      {
        currency: 'USD',
        amount: '750.00',
        convertedValue: '750.00'
      }
    ],
    products: {
      prepaidCard: null,
      simCard: null,
    },
  },
  {
    id: '2',
    name: 'Bob Smith',
    firstName: 'Bob',
    lastName: 'Smith',
    dateOfBirth: '1985-08-15',
    gender: 'Male',
    nationality: 'United States',
    phone: '+1 (555) 234-5678',
    email: 'bob.smith@example.com',
    country: 'United States',
    bankAccount: '23456789012345',
    idType: 'Driver License',
    idNumber: 'DL987654321',
    bankDetails: {
      bankCode: '026',
      branchCode: '1234',
      accountNumber: '23456789012345',
      iban: 'US45 1234 5678 9012 3456',
    },
    identification: {
      type: 'Driver License',
      issuanceCountry: 'United States',
      number: 'DL987654321',
      expiryDate: '2026-11-30',
      issueDate: '2020-11-30',
    },
    address: {
      country: 'United States',
      street: '123 Main St',
      city: 'New York',
      postalCode: '10001',
      isVerified: true,
    },
    status: 'Active',
    kycVerified: true,
    riskRating: 'Low',
    balances: [
      {
        currency: 'USD',
        amount: '3,200.00',
        convertedValue: '3,200.00'
      },
      {
        currency: 'EUR',
        amount: '1,500.00',
        convertedValue: '1,635.00'
      }
    ],
    products: {
      prepaidCard: {
        cardNumber: '**** **** **** 5678',
        expiryDate: '2025-12',
        status: 'Active',
      },
      simCard: null,
    },
  },
  {
    id: '3',
    name: 'Carlos Rodriguez',
    firstName: 'Carlos',
    lastName: 'Rodriguez',
    dateOfBirth: '1990-06-12',
    gender: 'Male',
    nationality: 'Spain',
    phone: '+34 612 345 678',
    email: 'carlos.rodriguez@example.com',
    country: 'Spain',
    bankAccount: 'ES9121000418450200051332',
    idType: 'National ID',
    idNumber: 'N12345678X',
    bankDetails: {
      bankCode: '2100',
      branchCode: '0418',
      accountNumber: '0200051332',
      iban: 'ES91 2100 0418 4502 0005 1332',
    },
    identification: {
      type: 'National ID',
      issuanceCountry: 'Spain',
      number: 'N12345678X',
      expiryDate: '2029-03-21',
      issueDate: '2019-03-21',
    },
    address: {
      country: 'Spain',
      street: 'Calle de Alcalá 25',
      city: 'Madrid',
      postalCode: '28001',
      isVerified: true,
    },
    status: 'Active',
    kycVerified: true,
    riskRating: 'Low',
    balances: [
      {
        currency: 'EUR',
        amount: '4,800.00',
        convertedValue: '5,232.00'
      }
    ],
    products: {
      prepaidCard: null,
      simCard: {
        number: '+34 698 765 432',
        provider: 'Movistar',
        status: 'Active',
      },
    },
  }
];
