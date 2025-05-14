import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Client, Document } from '../hooks/useSendMoneyForm'; // Assuming types are here

interface NewSenderFormProps {
  onSave: (senderData: Partial<Client>) => void;
  onCancel: () => void;
}

// Placeholder options - these would ideally come from an API or config
const countryOptions = [{ value: 'USA', label: 'United States' }, { value: 'CAN', label: 'Canada' }];
const genderOptions = [{ value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }, { value: 'other', label: 'Other' }];
const idTypeOptions = [{ value: 'passport', label: 'Passport' }, { value: 'license', label: 'Driver Lincense' }, { value: 'residence', label: 'Residence Permit' }];

export const NewSenderForm: React.FC<NewSenderFormProps> = ({ onSave, onCancel }) => {
  // Using Partial<Client> for formData as not all fields are required initially or are WIP
  const [formData, setFormData] = useState<Partial<Client>>({
    firstName: '',
    lastName: '',
    phone: '',
    country: 'USA', // Default country
    idType: 'passport' // Default ID type
  });
  const [documentFiles, setDocumentFiles] = useState<File[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: keyof Client, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setDocumentFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Basic validation example
    if (!formData.firstName || !formData.lastName || !formData.phone) {
      alert('Please fill in all required fields: First Name, Last Name, Phone.');
      return;
    }
    // Map uploaded files to Document[] structure (simplified)
    const documents: Document[] = documentFiles.map(file => ({
      documentType: formData.idType || 'id', // Or derive from file type/selection
      fileName: file.name,
      // In a real app, you'd upload the file and get a URL
    }));

    onSave({ ...formData, documents });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-4 border rounded-lg shadow-sm bg-white dark:bg-gray-800">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white">Register New Sender</h3>
      
      {/* Personal Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName">First Name (Required)</Label>
          <Input id="firstName" name="firstName" value={formData.firstName || ''} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="middleName">Middle Name</Label>
          <Input id="middleName" name="middleName" value={formData.middleName || ''} onChange={handleChange} />
        </div>
        <div>
          <Label htmlFor="lastName">Last Name (Required)</Label>
          <Input id="lastName" name="lastName" value={formData.lastName || ''} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="dateOfBirth">Date of Birth (YYYY-MM-DD)</Label>
          <Input id="dateOfBirth" name="dateOfBirth" type="date" value={formData.dateOfBirth || ''} onChange={handleChange} />
        </div>
        <div>
          <Label htmlFor="gender">Gender</Label>
          <Select onValueChange={(value) => handleSelectChange('gender', value)} value={formData.gender}>
            <SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
            <SelectContent>
              {genderOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="nationality">Nationality</Label>
          <Input id="nationality" name="nationality" value={formData.nationality || ''} onChange={handleChange} />
        </div>
      </div>

      {/* Address Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="country">Country (Required)</Label>
          <Select onValueChange={(value) => handleSelectChange('country', value)} value={formData.country} required>
            <SelectTrigger><SelectValue placeholder="Select country" /></SelectTrigger>
            <SelectContent>
              {countryOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="streetAddress">Street Address</Label>
          <Input id="streetAddress" name="streetAddress" value={formData.streetAddress || ''} onChange={handleChange} />
        </div>
        <div>
          <Label htmlFor="city">City</Label>
          <Input id="city" name="city" value={formData.city || ''} onChange={handleChange} />
        </div>
        <div>
          <Label htmlFor="postalCode">Postal Code</Label>
          <Input id="postalCode" name="postalCode" value={formData.postalCode || ''} onChange={handleChange} />
        </div>
      </div>

      {/* Contact Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="phone">Phone Number (Required)</Label>
          <Input id="phone" name="phone" type="tel" value={formData.phone || ''} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="email">Email Address</Label>
          <Input id="email" name="email" type="email" value={formData.email || ''} onChange={handleChange} />
        </div>
        <div>
          <Label htmlFor="customerCardNumber">Customer Card Number</Label>
          <Input id="customerCardNumber" name="customerCardNumber" value={formData.customerCardNumber || ''} onChange={handleChange} />
        </div>
      </div>
      
      {/* Identification (ID) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="idType">ID Type (Required)</Label>
          <Select onValueChange={(value) => handleSelectChange('idType', value)} value={formData.idType} required>
            <SelectTrigger><SelectValue placeholder="Select ID type" /></SelectTrigger>
            <SelectContent>
              {idTypeOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="idNumber">ID Number (Required)</Label>
          <Input id="idNumber" name="idNumber" value={formData.idNumber || ''} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="idIssuanceCountry">ID Issuance Country</Label>
          {/* Should be a Select, using Input for brevity */}
          <Input id="idIssuanceCountry" name="idIssuanceCountry" value={formData.idIssuanceCountry || ''} onChange={handleChange} /> 
        </div>
        <div>
          <Label htmlFor="idIssueDate">ID Issue Date (YYYY-MM-DD)</Label>
          <Input id="idIssueDate" name="idIssueDate" type="date" value={formData.idIssueDate || ''} onChange={handleChange} />
        </div>
        <div>
          <Label htmlFor="idExpiryDate">ID Expiry Date (YYYY-MM-DD)</Label>
          <Input id="idExpiryDate" name="idExpiryDate" type="date" value={formData.idExpiryDate || ''} onChange={handleChange} required />
        </div>
      </div>

      {/* Document Upload */}
      <div>
        <Label htmlFor="documents">Upload ID Document(s)</Label>
        <Input id="documents" name="documents" type="file" multiple onChange={handleFileChange} />
        {documentFiles.length > 0 && (
          <ul className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {documentFiles.map(file => <li key={file.name}>{file.name} ({Math.round(file.size / 1024)}KB)</li>)}
          </ul>
        )}
      </div>

      {/* Relationship */}
      <div>
        <Label htmlFor="relationshipToBeneficiary">Relationship to Beneficiary</Label>
        <Input id="relationshipToBeneficiary" name="relationshipToBeneficiary" value={formData.relationshipToBeneficiary || ''} onChange={handleChange} />
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit">Save Sender</Button>
      </div>
    </form>
  );
}; 