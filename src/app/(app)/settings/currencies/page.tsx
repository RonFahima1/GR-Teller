"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

const initialCurrencies = [
  { code: "USD", name: "US Dollar", rate: 1.0, enabled: true },
  { code: "EUR", name: "Euro", rate: 0.92, enabled: true },
  { code: "GBP", name: "British Pound", rate: 0.78, enabled: false },
];

export default function CurrencySettings() {
  const [currencies, setCurrencies] = useState(initialCurrencies);

  function handleRateChange(code: string, rate: number) {
    setCurrencies(currs => currs.map(cur => cur.code === code ? { ...cur, rate } : cur));
  }
  function handleToggle(code: string) {
    setCurrencies(currs => currs.map(cur => cur.code === code ? { ...cur, enabled: !cur.enabled } : cur));
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="card-ios">
        <h2 className="text-xl font-semibold mb-4">Currency & Rate Management</h2>
        <table className="ios-table">
          <thead>
            <tr>
              <th>Currency</th>
              <th>Rate</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currencies.map(c => (
              <tr key={c.code}>
                <td>{c.code} - {c.name}</td>
                <td>
                  <input
                    type="number"
                    className="input-ios w-24"
                    value={c.rate}
                    min={0}
                    step={0.01}
                    onChange={e => handleRateChange(c.code, parseFloat(e.target.value))}
                  />
                </td>
                <td>
                  {c.enabled ? (
                    <span className="ios-status-pill ios-status-pill-green">Enabled</span>
                  ) : (
                    <span className="ios-status-pill ios-status-pill-gray">Disabled</span>
                  )}
                </td>
                <td>
                  <Button size="sm" onClick={() => handleToggle(c.code)}>
                    {c.enabled ? "Disable" : "Enable"}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 