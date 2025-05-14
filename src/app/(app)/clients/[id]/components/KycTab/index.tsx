import React, { useState } from 'react';
import { Section } from '../Section';
import { Client, KycDocument, ComplianceFlag, AuditTrailEntry, ColorOption } from '../../types/client-profile.types';
import { KycDocuments } from './KycDocuments';
import { ComplianceFlags } from './ComplianceFlags';
import { ReviewSection } from './ReviewSection';
import { AuditTrail } from './AuditTrail';
import { useCurrentUser } from '@/context/CurrentUserContext';
import { canApproveKYC, canEditComplianceFlags } from '@/utils/permissions';

interface KycTabProps {
  client: Client;
  initialKycDocs: KycDocument[];
  initialFlags: ComplianceFlag[];
  auditTrail: AuditTrailEntry[];
  flagColors: ColorOption[];
}

/**
 * Tab for managing KYC and compliance information
 */
export function KycTab({ 
  client, 
  initialKycDocs, 
  initialFlags, 
  auditTrail, 
  flagColors 
}: KycTabProps) {
  const user = useCurrentUser();
  const [kycDocs, setKycDocs] = useState(initialKycDocs);
  const [reviewComment, setReviewComment] = useState('');

  // Permission-based flags
  const userCanApproveKYC = canApproveKYC(user);
  const userCanEditFlags = canEditComplianceFlags(user);

  // Handle document approval/rejection
  const handleKycApprove = (id: number) => {
    setKycDocs(docs => docs.map(doc => 
      doc.id === id ? { ...doc, status: 'approved' } : doc
    ));
  };

  const handleKycReject = (id: number) => {
    setKycDocs(docs => docs.map(doc => 
      doc.id === id ? { ...doc, status: 'rejected' } : doc
    ));
  };

  // Handle batch approval/rejection
  const handleApproveAll = () => {
    setKycDocs(docs => docs.map(doc => 
      doc.status === 'pending' ? { ...doc, status: 'approved' } : doc
    ));
  };

  const handleRejectAll = () => {
    setKycDocs(docs => docs.map(doc => 
      doc.status === 'pending' ? { ...doc, status: 'rejected' } : doc
    ));
  };

  return (
    <Section title="KYC / Compliance">
      <div className="mb-2">KYC Status: <b>{client.kycStatus}</b></div>
      <div className="mb-2">
        Compliance Flags: {client.complianceFlags.length === 0 ? 'None' : client.complianceFlags.join(', ')}
      </div>
      
      {/* KYC Documents */}
      <KycDocuments 
        documents={kycDocs} 
        canApprove={userCanApproveKYC} 
        onApprove={handleKycApprove} 
        onReject={handleKycReject} 
      />
      
      {/* Review Section */}
      <ReviewSection 
        reviewComment={reviewComment}
        setReviewComment={setReviewComment}
        canApprove={userCanApproveKYC}
        onApproveAll={handleApproveAll}
        onRejectAll={handleRejectAll}
      />
      
      {/* Compliance Flags */}
      <ComplianceFlags 
        initialFlags={initialFlags} 
        flagColors={flagColors} 
        canEdit={userCanEditFlags} 
      />
      
      {/* Audit Trail */}
      <AuditTrail entries={auditTrail} />
    </Section>
  );
}
