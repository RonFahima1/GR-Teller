import React from 'react';
import { NoResultsProps } from '../types';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { quickActionRoutes, navigateToRoute } from '@/lib/routes';

interface QuickAction {
  id: string;
  label: string;
  icon: string;
  route: string;
  tooltip: string;
}

function Icon({ icon }: { icon: string }) {
  const getGradient = (icon: string) => {
    switch(icon) {
      case 'send': return 'from-blue-500 to-blue-600';
      case 'arrow-down-circle': return 'from-red-500 to-red-600';
      case 'arrow-up-circle': return 'from-green-500 to-green-600';
      case 'users': return 'from-purple-500 to-purple-600';
      case 'file-text': return 'from-yellow-500 to-yellow-600';
      case 'activity': return 'from-gray-500 to-gray-600';
      case 'grid': return 'from-blue-500 to-blue-600';
      case 'sliders': return 'from-gray-500 to-gray-600';
      case 'user': return 'from-purple-500 to-purple-600';
      case 'banknote': return 'from-green-500 to-green-600';
      case 'check-circle': return 'from-blue-500 to-blue-600';
      case 'scale': return 'from-purple-500 to-purple-600';
      case 'dollar-sign': return 'from-green-500 to-green-600';
      case 'list': return 'from-gray-500 to-gray-600';
      case 'cash': return 'from-orange-500 to-orange-600';
      case 'exchange': return 'from-teal-500 to-teal-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getIconPath = (icon: string) => {
    switch(icon) {
      case 'send':
        return (
          <>
            <path d="M6 3.5l-2.5-2.5a.5.5 0 0 0-.707.707L5.293 4l-2.5 2.5a.5.5 0 0 0 .707.707L6 4.707l2.5 2.5a.5.5 0 0 0 .707-.707L6.707 4l2.5-2.5a.5.5 0 0 0-.707-.707L6 3.293l-2.5-2.5z" />
          </>
        );
      case 'arrow-down-circle':
        return (
          <>
            <circle cx="6" cy="6" r="5" />
            <path d="M6 11l-2-2 2-2" />
          </>
        );
      case 'arrow-up-circle':
        return (
          <>
            <circle cx="6" cy="6" r="5" />
            <path d="M6 1l-2 2 2 2" />
          </>
        );
      case 'users':
        return (
          <>
            <path d="M6 4a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm0 2a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm0 2a2 2 0 1 1 0-4 2 2 0 0 1 0 4z" />
          </>
        );
      case 'file-text':
        return (
          <>
            <path d="M2 2h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm6 10v-2h4v2h-4zm0-4v-2h4v2h-4zm0-4v-2h4v2h-4z" />
          </>
        );
      case 'activity':
        return (
          <>
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            <path d="M11.406 15.54a5 5 0 1 0 2.121 2.121" />
          </>
        );
      case 'grid':
        return (
          <>
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
          </>
        );
      case 'sliders':
        return (
          <>
            <line x1="4" y1="21" x2="4" y2="10" />
            <line x1="12" y1="21" x2="12" y2="4" />
            <line x1="20" y1="21" x2="20" y2="16" />
            <line x1="6" y1="2" x2="18" y2="2" />
            <circle cx="4" cy="16" r="1" />
            <circle cx="12" cy="7" r="1" />
            <circle cx="20" cy="16" r="1" />
          </>
        );
      case 'user':
        return (
          <>
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </>
        );
      case 'banknote':
        return (
          <>
            <rect x="2" y="2" width="20" height="14" rx="2" ry="2" />
            <line x1="7" y1="2" x2="7" y2="16" />
            <line x1="17" y1="2" x2="17" y2="16" />
            <line x1="2" y1="9" x2="22" y2="9" />
          </>
        );
      case 'check-circle':
        return (
          <>
            <circle cx="12" cy="12" r="10" />
            <path d="M16.5 9a4 4 0 0 1 4 4l-5 5a4 4 0 0 1-5.3-5.3l3-3a4 4 0 0 1 5.3 0z" />
          </>
        );
      case 'scale':
        return (
          <>
            <rect x="4" y="4" width="16" height="4" rx="2" ry="2" />
            <circle cx="8" cy="18" r="2" />
            <circle cx="16" cy="18" r="2" />
            <path d="M8 4v14a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V4" />
          </>
        );
      case 'dollar-sign':
        return (
          <>
            <line x1="12" y1="1" x2="12" y2="23" />
            <path d="M12 5a7 7 0 0 0 7 7 1 1 0 0 1-2 0 5 5 0 0 1-7-5" />
          </>
        );
      case 'list':
        return (
          <>
            <line x1="8" y1="6" x2="21" y2="6" />
            <line x1="8" y1="12" x2="21" y2="12" />
            <line x1="8" y1="18" x2="21" y2="18" />
          </>
        );
      case 'cash':
        return (
          <>
            <path d="M2 2h28a2 2 0 0 1 2 2v28a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" />
            <path d="M16 16h4" />
            <path d="M8 16h4" />
            <path d="M12 16h4" />
            <path d="M12 4v12" />
            <path d="M16 8v8" />
          </>
        );
      case 'exchange':
        return (
          <>
            <path d="M21 13.7V12a8 8 0 1 0-6.5-7.7" />
            <path d="M14 2.3A9 9 0 0 0 13 20a7 7 0 0 0 5.6 1.3" />
          </>
        );
      default:
        return (
          <>
            <line x1="4" y1="3" x2="11" y2="3" />
            <line x1="4" y1="6" x2="11" y2="6" />
            <line x1="4" y1="9" x2="11" y2="9" />
          </>
        );
    }
  };

  return (
    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br" style={{ background: getGradient(icon), padding: '2px' }}>
      <div className="w-full h-full rounded-2xl bg-white dark:bg-gray-900">
        <svg 
          className="w-5 h-5 text-gray-500 dark:text-gray-400" 
          aria-hidden="true" 
          focusable="false"
          viewBox="0 0 24 24"
        >
          {getIconPath(icon)}
        </svg>
      </div>
    </div>
  );
}

function QuickActionItem({ action }: { action: QuickAction }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={() => navigateToRoute(action.route)}
          className="group relative h-16 w-16 rounded-2xl bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center"
        >
          <div className="h-10 w-10 flex items-center justify-center">
            <Icon icon={action.id} />
          </div>
        </button>
      </TooltipTrigger>
      <TooltipContent className="w-48">
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
          {action.tooltip}
        </p>
      </TooltipContent>
    </Tooltip>
  );
}

export function NoResults({ query, quickActions, onPopularSearchSelect }: NoResultsProps): JSX.Element {
  const allQuickActions = [...(quickActions || []), ...quickActionRoutes];

  return (
    <TooltipProvider>
      <div className="overflow-y-auto max-h-[50vh] scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent p-4">
        <div className="flex flex-col items-center text-center mb-6">
          <h3 className="text-xl font-semibold mb-2">No results found</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No matches found for "{query}". Try searching again or explore the quick actions below.
          </p>
        </div>
        
        <div className="mb-6">
          <div className="flex items-center text-xs font-medium text-gray-500 dark:text-gray-400 mb-3 px-1">
            Quick Actions
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-8 gap-3">
            {allQuickActions.map((action) => (
              <QuickActionItem key={action.id} action={action} />
            ))}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
