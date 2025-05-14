'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Client } from './CustomerSelectionForExchange'; // Assuming Client type is exported here or from a shared types file

interface NewCustomerFormProps {
  onSave: (customerData: Omit<Client, 'id'>) => void;
  onCancel: () => void;
}

export const NewCustomerForm: React.FC<NewCustomerFormProps> = ({ onSave, onCancel }) => {
  // Basic state for a few fields as an example
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = () => {
    // Basic validation example
    if (!firstName || !lastName || !phone) {
      alert('Please fill in all fields.');
      return;
    }
    onSave({
      firstName,
      lastName,
      name: `${firstName} ${lastName}`.trim(), // Construct name
      phone,
      // Add other fields like idType, idNumber, etc., as needed by your Client type
    });
  };

  return (
    <div className="space-y-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800/50 shadow-sm">
      <h3 className="text-lg font-medium text-center text-gray-800 dark:text-white">Add New Customer</h3>
      
      <div>
        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">First Name</label>
        <Input 
          id="firstName" 
          value={firstName} 
          onChange={(e) => setFirstName(e.target.value)} 
          placeholder="Enter first name"
          className="dark:bg-gray-700 dark:border-gray-600"
        />
      </div>
      
      <div>
        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Last Name</label>
        <Input 
          id="lastName" 
          value={lastName} 
          onChange={(e) => setLastName(e.target.value)} 
          placeholder="Enter last name"
          className="dark:bg-gray-700 dark:border-gray-600"
        />
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number</label>
        <Input 
          id="phone" 
          value={phone} 
          onChange={(e) => setPhone(e.target.value)} 
          placeholder="Enter phone number"
          className="dark:bg-gray-700 dark:border-gray-600"
        />
      </div>
      {/* Add more input fields for other Client properties as needed */}

      <div className="flex justify-end space-x-2 pt-2">
        <Button variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700 text-white">Save Customer</Button>
      </div>
    </div>
  );
}; 