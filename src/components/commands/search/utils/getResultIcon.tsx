import React from 'react';
import { 
  User, 
  File, 
  Repeat, 
  HelpCircle, 
  Settings, 
  MessageSquare, 
  Terminal, 
  RefreshCw, 
  Navigation, 
  DollarSign 
} from 'lucide-react';

/**
 * Returns the appropriate icon based on the result type
 * @param type The type of search result
 * @returns React component with the appropriate icon
 */
export function getResultIcon(type: string): React.ReactNode {
  switch (type) {
    case 'client':
      return <User className="h-4 w-4" />;
    case 'document':
      return <File className="h-4 w-4" />;
    case 'transaction':
      return <Repeat className="h-4 w-4" />;
    case 'help':
      return <HelpCircle className="h-4 w-4" />;
    case 'setting':
      return <Settings className="h-4 w-4" />;
    case 'note':
      return <MessageSquare className="h-4 w-4" />;
    case 'command':
      return <Terminal className="h-4 w-4" />;
    case 'exchange':
      return <RefreshCw className="h-4 w-4" />;
    case 'page':
      return <Navigation className="h-4 w-4" />;
    default:
      return <DollarSign className="h-4 w-4" />;
  }
}
