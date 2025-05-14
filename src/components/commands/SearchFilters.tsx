"use client";

import { useState } from "react";
import { Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface SearchFiltersProps {
  activeFilters: Record<string, any>;
  onFilterChange: (filters: Record<string, any>) => void;
}

export function SearchFilters({ 
  activeFilters, 
  onFilterChange 
}: SearchFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const handleFilterChange = (filterId: string, value: any) => {
    onFilterChange({
      ...activeFilters,
      [filterId]: value
    });
  };
  
  const clearFilters = () => {
    onFilterChange({});
  };
  
  const hasActiveFilters = Object.keys(activeFilters).length > 0;
  
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className={cn(
            "h-8 w-8 p-0 relative",
            hasActiveFilters ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400"
          )}
        >
          <Filter size={16} />
          {hasActiveFilters && (
            <span className="absolute -top-1 -right-1 bg-blue-600 rounded-full w-2 h-2"></span>
          )}
        </Button>
      </PopoverTrigger>
      
      <PopoverContent className="w-72 p-4" align="end">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-medium">Filters</h3>
          
          {hasActiveFilters && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-7 px-2 text-xs"
              onClick={clearFilters}
            >
              Clear all
            </Button>
          )}
        </div>
        
        <div className="space-y-4">
          {/* Entity Type Filter */}
          <div className="space-y-2">
            <Label className="text-xs font-medium">Entity Type</Label>
            <Select
              value={activeFilters.type || ''}
              onValueChange={(value) => handleFilterChange('type', value)}
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Types</SelectItem>
                <SelectItem value="client">Clients</SelectItem>
                <SelectItem value="transaction">Transactions</SelectItem>
                <SelectItem value="document">Documents</SelectItem>
                <SelectItem value="help">Help Articles</SelectItem>
                <SelectItem value="exchange">Exchange Rates</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Date Range Filter - Only show for transactions, documents */}
          {(!activeFilters.type || ['transaction', 'document'].includes(activeFilters.type)) && (
            <div className="space-y-2">
              <Label className="text-xs font-medium">Date Range</Label>
              <Select
                value={activeFilters.dateRange || ''}
                onValueChange={(value) => handleFilterChange('dateRange', value)}
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="Any Time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Any Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="yesterday">Yesterday</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="year">This Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          
          {/* Status Filter - Only show for transactions */}
          {activeFilters.type === 'transaction' && (
            <div className="space-y-2">
              <Label className="text-xs font-medium">Status</Label>
              <Select
                value={activeFilters.status || ''}
                onValueChange={(value) => handleFilterChange('status', value)}
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="Any Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Any Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          
          {/* Document Type Filter - Only show for documents */}
          {activeFilters.type === 'document' && (
            <div className="space-y-2">
              <Label className="text-xs font-medium">Document Type</Label>
              <Select
                value={activeFilters.documentType || ''}
                onValueChange={(value) => handleFilterChange('documentType', value)}
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="Any Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Any Type</SelectItem>
                  <SelectItem value="identification">Identification</SelectItem>
                  <SelectItem value="address">Address Proof</SelectItem>
                  <SelectItem value="financial">Financial</SelectItem>
                  <SelectItem value="employment">Employment</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          
          {/* Include Commands Checkbox */}
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="include-commands" 
              checked={activeFilters.includeCommands !== false}
              onCheckedChange={(checked) => 
                handleFilterChange('includeCommands', checked)
              }
            />
            <Label htmlFor="include-commands" className="text-xs font-medium cursor-pointer">
              Include Commands
            </Label>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
