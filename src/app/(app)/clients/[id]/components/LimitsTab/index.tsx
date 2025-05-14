import React from 'react';
import { Client } from '../../types/client-profile.types';
import { Section } from '../Section';

interface LimitsTabProps {
  client: Client;
}

/**
 * Displays client transaction limits and usage
 */
export function LimitsTab({ client }: LimitsTabProps) {
  return (
    <Section title="Limits">
      <div className="mb-2">
        Daily Limit: <b>${client.limits.daily.toLocaleString()}</b> 
        (Used: ${client.limits.usedToday.toLocaleString()})
      </div>
      <div>
        Monthly Limit: <b>${client.limits.monthly.toLocaleString()}</b> 
        (Used: ${client.limits.usedThisMonth.toLocaleString()})
      </div>
    </Section>
  );
}
