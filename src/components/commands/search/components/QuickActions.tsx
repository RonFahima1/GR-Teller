import React from 'react';
import { cn } from '@/lib/utils';
import { QuickActionTile } from './QuickActionTile';
import { QuickAction } from './types';
import { QUICK_ACTIONS } from './types';
import {
  Send,
  FileText,
  Users,
  BarChart,
  Globe,
  Clock,
  UserPlus,
  Search,
  LineChart,
  Settings,
  CreditCard,
  Banknote,
  Building,
  Currency,
  Shield
} from 'lucide-react';

export function QuickActions({
  actions = QUICK_ACTIONS,
  searchQuery = '',
  onActionSelect,
  className
}: { 
  actions?: QuickAction[];
  searchQuery?: string;
  onActionSelect: (action: QuickAction) => void;
  className?: string;
}) {
  // Filter actions based on search query
  const filteredActions = searchQuery
    ? actions.filter(action =>
        action.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : actions;

  return (
    <div className={cn('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4', className)}>
      {filteredActions.map((action) => (
        <QuickActionTile
          key={action.id}
          action={action}
          isSelected={false}
          onClick={() => onActionSelect(action)}
        />
      ))}
    </div>
  );
}
          key={action.url}
          icon={action.icon}
          label={action.label}
          url={action.url}
          isSelected={selectedIndex === index}
          className="w-full"
        />
      ))}
    </div>
  );
}
