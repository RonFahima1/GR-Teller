"use client"

import * as React from "react"
import { Check, ChevronsUpDown, Search, UserPlus, Phone, User, CreditCard, QrCode, Hash, Building2, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { useTranslation } from "@/hooks/useTranslation"

interface Customer {
  id: string
  name: string
  email: string
}

type SearchType = "name" | "phone" | "id"

interface CustomerSearchProps {
  customers?: Customer[]
  onSelect?: (customer: Customer) => void
  className?: string
  onSearch?: (params: { type: SearchType; value: string }) => void
  showNewButton?: boolean
  newButtonText?: string
  newButtonLink?: string
  defaultTab?: SearchType
  onSearchComplete?: (success: boolean, message: string) => void
  placeholder?: string
  hideSearch?: boolean
}

export function CustomerSearch({ 
  customers = [], 
  onSelect,
  className,
  onSearch,
  showNewButton = false,
  newButtonText = "New Customer",
  newButtonLink = "/clients/new",
  defaultTab = "phone",
  onSearchComplete,
  hideSearch = false
}: CustomerSearchProps) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [searchType, setSearchType] = React.useState<SearchType>(defaultTab)
  const [searchValue, setSearchValue] = React.useState("")
  const { t } = useTranslation()

  const handleSearch = async () => {
    if (!searchValue.trim()) {
      setError(t("common.requiredField"))
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      if (onSearch) {
        onSearch({
          type: searchType,
          value: searchValue
        })
      }
      
      setOpen(false)
    } catch (err) {
      setError(t("common.searchError"))
    } finally {
      setLoading(false)
    }
  }

  const handleTabChange = (value: string) => {
    setSearchType(value as SearchType)
  }

  return (
    <div className="space-y-4">
      {showNewButton && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-end"
        >
          <Link href={newButtonLink} passHref>
            <Button 
              variant="secondary" 
              className="bg-gradient-to-b from-secondary/50 to-secondary hover:from-secondary/60 hover:to-secondary/90 text-sm font-medium shadow-sm transition-all duration-200 rounded-full px-4"
            >
              <UserPlus className="mr-2 h-4 w-4" /> {newButtonText}
            </Button>
          </Link>
        </motion.div>
      )}

      {!hideSearch && (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        className="backdrop-blur-xl bg-white/50 dark:bg-gray-900/50 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 p-4"
      >
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className={cn(
                "w-full justify-between h-[40px]",
                className
              )}
            >
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {value || t("common.search")}
                </span>
              </div>
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0" align="start">
            <Tabs defaultValue="name" className="w-full" onValueChange={(value) => setSearchType(value as SearchType)}>
              <TabsList className="w-full">
                <TabsTrigger value="name" className="flex-1">
                  <User className="h-4 w-4 mr-2" />
                  {t("common.name")}
                </TabsTrigger>
                <TabsTrigger value="phone" className="flex-1">
                  <Phone className="h-4 w-4 mr-2" />
                  {t("common.phone")}
                </TabsTrigger>
                <TabsTrigger value="id" className="flex-1">
                  <Hash className="h-4 w-4 mr-2" />
                  {t("common.id")}
                </TabsTrigger>
              </TabsList>
              <TabsContent value="name" className="p-4">
                <div className="space-y-4">
                  <Input
                    placeholder={t("common.enterName")}
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    className="h-[40px]"
                  />
                  {error && (
                    <p className="text-sm text-destructive">{error}</p>
                  )}
                  <Button
                    className="w-full"
                    onClick={handleSearch}
                    disabled={loading}
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <Search className="h-4 w-4 mr-2" />
                        {t("common.search")}
                      </>
                    )}
                  </Button>
                </div>
              </TabsContent>
              <TabsContent value="phone" className="p-4">
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Select defaultValue="+1">
                      <SelectTrigger className="w-[100px] h-[40px]">
                        <SelectValue placeholder="+1" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="+1">+1</SelectItem>
                        <SelectItem value="+44">+44</SelectItem>
                        <SelectItem value="+972">+972</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      placeholder={t("common.enterPhone")}
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                      className="h-[40px] flex-1"
                    />
                  </div>
                  {error && (
                    <p className="text-sm text-destructive">{error}</p>
                  )}
                  <Button
                    className="w-full"
                    onClick={handleSearch}
                    disabled={loading}
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <Search className="h-4 w-4 mr-2" />
                        {t("common.search")}
                      </>
                    )}
                  </Button>
                </div>
              </TabsContent>
              <TabsContent value="id" className="p-4">
                <div className="space-y-4">
                  <Input
                    placeholder={t("common.enterId")}
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    className="h-[40px]"
                  />
                  {error && (
                    <p className="text-sm text-destructive">{error}</p>
                  )}
                  <Button
                    className="w-full"
                    onClick={handleSearch}
                    disabled={loading}
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <Search className="h-4 w-4 mr-2" />
                        {t("common.search")}
                      </>
                    )}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </PopoverContent>
        </Popover>
      </motion.div>
      )}

      <AnimatePresence>
        {customers.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-4 backdrop-blur-xl bg-white/50 dark:bg-gray-900/50 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden"
          >
            {customers.map((customer, index) => (
              <motion.div
                key={customer.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors duration-200"
                onClick={() => onSelect?.(customer)}
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center transition-transform duration-200 group-hover:scale-110">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">{customer.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{customer.email}</p>
                  </div>
                </div>
                <Check
                  className={cn(
                    "h-5 w-5 text-primary transition-all duration-200",
                    value === customer.id ? "opacity-100 scale-100" : "opacity-0 scale-75"
                  )}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
