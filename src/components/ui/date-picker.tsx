
"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { type ControllerRenderProps } from 'react-hook-form';

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerProps {
    field: ControllerRenderProps<any, any>; // Get field from RHF Controller
    placeholder?: string;
    dateFormat?: string; // e.g., "PPP", "dd-MM-yyyy"
    triggerClassName?: string;
}

export function DatePicker({ field, placeholder = "Pick a date", dateFormat = "PPP", triggerClassName }: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal", // Default width full
            !field.value && "text-muted-foreground",
            triggerClassName // Allow overriding classes
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {field.value ? format(field.value, dateFormat) : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={field.value}
          onSelect={field.onChange} // Use field.onChange from RHF
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}

    