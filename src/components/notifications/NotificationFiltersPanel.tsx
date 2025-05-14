"use client";

import { useState } from "react";
import { X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { NotificationFilters, NotificationType, NotificationPriority } from "@/types/notification.types";

interface NotificationFiltersPanelProps {
  currentFilters: NotificationFilters;
  onApplyFilters: (filters: NotificationFilters) => void;
  onClose: () => void;
}

export function NotificationFiltersPanel({
  currentFilters,
  onApplyFilters,
  onClose
}: NotificationFiltersPanelProps) {
  const [filters, setFilters] = useState<NotificationFilters>(currentFilters || {});

  // Handle type filter change
  const handleTypeChange = (type: NotificationType | undefined) => {
    setFilters(prev => ({
      ...prev,
      type
    }));
  };

  // Handle priority filter change
  const handlePriorityChange = (priority: NotificationPriority | undefined) => {
    setFilters(prev => ({
      ...prev,
      priority
    }));
  };

  // Apply filters
  const handleApplyFilters = () => {
    onApplyFilters(filters);
  };

  // Reset filters
  const handleResetFilters = () => {
    setFilters({});
  };

  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium">Filter Notifications</h3>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 rounded-full"
          onClick={onClose}
        >
          <X className="h-3 w-3" aria-hidden="true" />
        </Button>
      </div>

      <div className="space-y-4">
        {/* Type Filter */}
        <div>
          <Label className="text-xs font-medium mb-2 block">Notification Type</Label>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant={!filters.type ? "default" : "outline"}
              size="sm"
              className="text-xs h-7 justify-start"
              onClick={() => handleTypeChange(undefined)}
            >
              All Types
            </Button>
            <Button
              variant={filters.type === "transaction" ? "default" : "outline"}
              size="sm"
              className="text-xs h-7 justify-start"
              onClick={() => handleTypeChange("transaction")}
            >
              Transactions
            </Button>
            <Button
              variant={filters.type === "client" ? "default" : "outline"}
              size="sm"
              className="text-xs h-7 justify-start"
              onClick={() => handleTypeChange("client")}
            >
              Clients
            </Button>
            <Button
              variant={filters.type === "system" ? "default" : "outline"}
              size="sm"
              className="text-xs h-7 justify-start"
              onClick={() => handleTypeChange("system")}
            >
              System
            </Button>
            <Button
              variant={filters.type === "security" ? "default" : "outline"}
              size="sm"
              className="text-xs h-7 justify-start"
              onClick={() => handleTypeChange("security")}
            >
              Security
            </Button>
            <Button
              variant={filters.type === "exchange" ? "default" : "outline"}
              size="sm"
              className="text-xs h-7 justify-start"
              onClick={() => handleTypeChange("exchange")}
            >
              Exchange
            </Button>
            <Button
              variant={filters.type === "alert" ? "default" : "outline"}
              size="sm"
              className="text-xs h-7 justify-start"
              onClick={() => handleTypeChange("alert")}
            >
              Alerts
            </Button>
          </div>
        </div>

        {/* Priority Filter */}
        <div>
          <Label className="text-xs font-medium mb-2 block">Priority</Label>
          <RadioGroup
            value={filters.priority || ""}
            onValueChange={(value: string) => handlePriorityChange(value as NotificationPriority || undefined)}
            className="flex space-x-4"
          >
            <div className="flex items-center space-x-1">
              <RadioGroupItem value="" id="priority-all" />
              <Label htmlFor="priority-all" className="text-xs">All</Label>
            </div>
            <div className="flex items-center space-x-1">
              <RadioGroupItem value="high" id="priority-high" />
              <Label htmlFor="priority-high" className="text-xs">High</Label>
            </div>
            <div className="flex items-center space-x-1">
              <RadioGroupItem value="medium" id="priority-medium" />
              <Label htmlFor="priority-medium" className="text-xs">Medium</Label>
            </div>
            <div className="flex items-center space-x-1">
              <RadioGroupItem value="low" id="priority-low" />
              <Label htmlFor="priority-low" className="text-xs">Low</Label>
            </div>
          </RadioGroup>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between pt-2">
          <Button
            variant="outline"
            size="sm"
            className="text-xs"
            onClick={handleResetFilters}
          >
            Reset
          </Button>
          <Button
            variant="default"
            size="sm"
            className="text-xs"
            onClick={handleApplyFilters}
          >
            Apply Filters
          </Button>
        </div>
      </div>
    </div>
  );
}
