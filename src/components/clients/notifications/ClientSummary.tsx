import React from 'react';
import { NewClientFormData } from '../../../types/form';

interface ClientSummaryProps {
  clientData: NewClientFormData;
}

const ClientSummary: React.FC<ClientSummaryProps> = ({ clientData }) => {
  const { personal, contact, address, identification, employment } = clientData;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
          <span className="text-2xl font-bold text-primary-800">
            {personal.firstName.charAt(0).toUpperCase()}
            {personal.lastName.charAt(0).toUpperCase()}
          </span>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-foreground">
            {personal.firstName} {personal.lastName}
          </h2>
          <p className="text-sm text-foreground/70">{personal.nationality}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="text-sm font-medium text-foreground/80 mb-2">Contact Information</h3>
          <div className="space-y-2">
            <p className="text-sm text-foreground/90">
              <span className="font-medium">Email:</span> {contact.email}
            </p>
            <p className="text-sm text-foreground/90">
              <span className="font-medium">Phone:</span> {contact.phone}
            </p>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-foreground/80 mb-2">Address</h3>
          <div className="space-y-2">
            <p className="text-sm text-foreground/90">
              {address.streetAddress}
            </p>
            <p className="text-sm text-foreground/90">
              {address.city}, {address.postalCode}
            </p>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-foreground/80 mb-2">Identification</h3>
          <div className="space-y-2">
            <p className="text-sm text-foreground/90">
              <span className="font-medium">ID Type:</span> {identification.idType}
            </p>
            <p className="text-sm text-foreground/90">
              <span className="font-medium">ID Number:</span> {identification.idNumber}
            </p>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-foreground/80 mb-2">Employment</h3>
          <div className="space-y-2">
            <p className="text-sm text-foreground/90">
              <span className="font-medium">Occupation:</span> {employment.occupation}
            </p>
            <p className="text-sm text-foreground/90">
              <span className="font-medium">Employer:</span> {employment.employer}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientSummary;
