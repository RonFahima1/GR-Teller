"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Plus, Trash2, Edit2 } from "lucide-react";

const initialCurrencies = [
  { code: "USD", name: "US Dollar", rate: 1.0, enabled: true },
  { code: "EUR", name: "Euro", rate: 0.92, enabled: true },
  { code: "GBP", name: "British Pound", rate: 0.78, enabled: true },
  { code: "JPY", name: "Japanese Yen", rate: 110.0, enabled: false },
];

export default function CurrencyManagementPage() {
  const [currencies, setCurrencies] = useState(initialCurrencies);
  const [newCurrency, setNewCurrency] = useState({ code: "", name: "", rate: 1.0, enabled: true });
  const [editingCode, setEditingCode] = useState<string | null>(null);

  function handleAdd() {
    if (!newCurrency.code || !newCurrency.name) return;
    setCurrencies(c => [...c, { ...newCurrency }]);
    setNewCurrency({ code: "", name: "", rate: 1.0, enabled: true });
  }

  function handleEdit(code: string) {
    setEditingCode(code);
    const currency = currencies.find(c => c.code === code);
    if (currency) setNewCurrency(currency);
  }

  function handleUpdate() {
    if (!editingCode) return;
    setCurrencies(currencies.map(c => c.code === editingCode ? { ...c, ...newCurrency } : c));
    setEditingCode(null);
    setNewCurrency({ code: "", name: "", rate: 1.0, enabled: true });
  }

  function handleDelete(code: string) {
    setCurrencies(c => c.filter(currency => currency.code !== code));
  }

  function handleToggle(code: string) {
    setCurrencies(currencies.map(c => 
      c.code === code ? { ...c, enabled: !c.enabled } : c
    ));
  }

  return (
    <div className="container mx-auto p-6 max-w-3xl">
      <h1 className="text-2xl font-bold mb-4">Currency Management</h1>
      <Card className="mb-6 card-ios">
        <CardHeader>
          <CardTitle>Add / Edit Currency</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <Input placeholder="Currency Code (e.g. USD)" value={newCurrency.code} onChange={e => setNewCurrency(n => ({ ...n, code: e.target.value.toUpperCase() }))} maxLength={3} />
            <Input placeholder="Currency Name" value={newCurrency.name} onChange={e => setNewCurrency(n => ({ ...n, name: e.target.value }))} />
            <Input type="number" placeholder="Exchange Rate" value={newCurrency.rate} onChange={e => setNewCurrency(n => ({ ...n, rate: parseFloat(e.target.value) }))} step="0.01" min="0" />
            <Button onClick={editingCode ? handleUpdate : handleAdd}>
              {editingCode ? "Update Currency" : <><Plus className="h-4 w-4 mr-1" />Add Currency</>}
            </Button>
          </div>
        </CardContent>
      </Card>
      <Card className="card-ios">
        <CardHeader>
          <CardTitle>Currencies</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-muted-foreground">
                  <th className="py-2 px-2">Code</th>
                  <th className="py-2 px-2">Name</th>
                  <th className="py-2 px-2">Rate</th>
                  <th className="py-2 px-2">Enabled</th>
                  <th className="py-2 px-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currencies.map(currency => (
                  <tr key={currency.code} className="border-b last:border-0">
                    <td className="py-2 px-2 font-mono font-semibold">{currency.code}</td>
                    <td className="py-2 px-2">{currency.name}</td>
                    <td className="py-2 px-2">{currency.rate.toFixed(2)}</td>
                    <td className="py-2 px-2">
                      <Switch checked={currency.enabled} onCheckedChange={() => handleToggle(currency.code)} />
                    </td>
                    <td className="py-2 px-2 flex gap-2">
                      <Button size="icon" variant="ghost" onClick={() => handleEdit(currency.code)}><Edit2 className="h-4 w-4" /></Button>
                      <Button size="icon" variant="ghost" onClick={() => handleDelete(currency.code)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 