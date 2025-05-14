"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

const initialBranches = [
  { id: 1, name: "Main Branch", address: "123 Main St" },
  { id: 2, name: "Downtown", address: "456 Center Ave" },
];

export default function BranchSettings() {
  const [branches, setBranches] = useState(initialBranches);
  const [newBranch, setNewBranch] = useState({ name: "", address: "" });

  function handleAdd() {
    if (!newBranch.name.trim() || !newBranch.address.trim()) return;
    setBranches(b => [
      ...b,
      { id: Date.now(), ...newBranch }
    ]);
    setNewBranch({ name: "", address: "" });
  }
  function handleRemove(id: number) {
    setBranches(b => b.filter(branch => branch.id !== id));
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="card-ios">
        <h2 className="text-xl font-semibold mb-4">Branches</h2>
        <ul className="space-y-2 mb-4">
          {branches.map(b => (
            <li key={b.id} className="flex justify-between items-center">
              <div>
                <div className="font-medium">{b.name}</div>
                <div className="text-xs text-muted-foreground">{b.address}</div>
              </div>
              <Button size="sm" variant="destructive" onClick={() => handleRemove(b.id)}>Remove</Button>
            </li>
          ))}
        </ul>
        <div className="flex gap-2 mb-4">
          <input
            className="input-ios"
            placeholder="Branch Name"
            value={newBranch.name}
            onChange={e => setNewBranch(n => ({ ...n, name: e.target.value }))}
          />
          <input
            className="input-ios"
            placeholder="Address"
            value={newBranch.address}
            onChange={e => setNewBranch(n => ({ ...n, address: e.target.value }))}
          />
          <Button className="btn-ios-primary" onClick={handleAdd}>Add</Button>
        </div>
      </div>
    </div>
  );
} 