export interface TransactionType {
  label: string;
  href: string;
}

export const transactionTypes: TransactionType[] = [
  { label: "Remittance", href: "/transactions/remittance" },
  { label: "Exchange", href: "/transactions/exchange" },
  { label: "Client Account", href: "/transactions/client-account" },
  { label: "Card Load/Unload", href: "/transactions/card-load-unload" },
  { label: "Masav Transactions", href: "/transactions/masav" },
  { label: "A2A Transactions", href: "/transactions/a2a" },
  { label: "Payments History", href: "/transactions/payments-history" },
  { label: "Unknown Status", href: "/transactions/unknown-status" },
]; 