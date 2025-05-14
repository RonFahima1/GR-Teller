import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Client } from '../hooks/useSendMoneyForm'; // Assuming types are here

interface NewReceiverFormProps {
  onSave: (receiverData: Partial<Client>) => void;
  onCancel: () => void;
}

// Placeholder options - these would ideally come from an API or config
const countryOptions = [{ value: 'USA', label: 'United States' }, { value: 'CAN', label: 'Canada' }, { value: 'GBR', label: 'United Kingdom' }, { value: 'IND', label: 'India' }];
const genderOptions = [{ value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }, { value: 'other', label: 'Other' }];
const relationshipOptions = [
  { value: 'family_member', label: 'Family Member' }, 
  { value: 'friend', label: 'Friend' }, 
  { value: 'business_partner', label: 'Business Partner' }, 
  { value: 'self', label: 'Self' }, 
  { value: 'other', label: 'Other' }
];

export const NewReceiverForm: React.FC<NewReceiverFormProps> = ({ onSave, onCancel }) => {
  const [formData, setFormData] = useState<Partial<Client>>({
    firstName: '',
    lastName: '',
    country: 'USA', // Default country
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: keyof Client, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.country) {
      alert('Please fill in all required fields: First Name, Last Name, Country.');
      return;
    }
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-4 border rounded-lg shadow-sm bg-white dark:bg-gray-800">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white">Register New Receiver</h3>
      
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
      </div>

      {/* Contact Details */}
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
          <Label htmlFor="city">City</Label>
          <Input id="city" name="city" value={formData.city || ''} onChange={handleChange} />
        </div>
        <div>
          <Label htmlFor="streetAddress">Street Address</Label>
          <Input id="streetAddress" name="streetAddress" value={formData.streetAddress || ''} onChange={handleChange} />
        </div>
        <div>
          <Label htmlFor="postalCode">Postal Code</Label>
          <Input id="postalCode" name="postalCode" value={formData.postalCode || ''} onChange={handleChange} />
        </div>
        <div>
          <Label htmlFor="phone">Phone Number (with country code)</Label>
          <Input id="phone" name="phone" type="tel" value={formData.phone || ''} onChange={handleChange} />
        </div>
         <div>
          <Label htmlFor="email">Email Address</Label>
          <Input id="email" name="email" type="email" value={formData.email || ''} onChange={handleChange} />
        </div>
      </div>
      
      {/* Compliance Information */}
      <div>
        <Label htmlFor="relationshipToSender">Relationship to Sender (Required)</Label>
        <Select onValueChange={(value) => handleSelectChange('relationshipToSender', value)} value={formData.relationshipToSender} required>
          <SelectTrigger><SelectValue placeholder="Select relationship" /></SelectTrigger>
          <SelectContent>
            {relationshipOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Bank Details - Placeholder for future addition based on payout type */}
      {/* 
      <div>
        <Label htmlFor="bankAccount">Bank Account Number</Label>
        <Input id="bankAccount" name="bankAccount" value={formData.bankAccount || ''} onChange={handleChange} />
      </div> 
      */}

      <div className="flex justify-end space-x-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit">Save Receiver</Button>
      </div>
    </form>
  );
}; 