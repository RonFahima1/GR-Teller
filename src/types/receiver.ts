export interface Receiver {
  id: string; // Assuming a unique ID for each receiver
  firstName: string;
  lastName: string;
  middleName?: string;
  dateOfBirth?: string; // Consider using a Date type or ISO string if doing date operations
  gender?: string;
  country: string;
  city?: string;
  streetAddress?: string;
  postalCode?: string;
  phone: string;
  email?: string;
  relationshipToSender?: string; // e.g., 'Family', 'Friend', 'Business Partner'
  // You can add any other fields that come from your NewReceiverForm.tsx
  bankName?: string;
  bankAccountNumber?: string;
  bankSwiftCode?: string;
  bankBranch?: string;
  // etc.
} 