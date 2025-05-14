"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Plus, Trash2, Edit2 } from "lucide-react";

const initialBranches = [
  { id: 1, name: "Main Branch", address: "123 Main St", manager: "John Smith", phone: "+1 555-0123" },
  { id: 2, name: "Downtown", address: "456 Center Ave", manager: "Sarah Chen", phone: "+1 555-0124" },
];

export default function BranchManagementPage() {
  const [branches, setBranches] = useState(initialBranches);
  const [newBranch, setNewBranch] = useState({ name: "", address: "", manager: "", phone: "" });
  const [editingId, setEditingId] = useState<number | null>(null);

  function handleAdd() {
    if (!newBranch.name || !newBranch.address) return;
    setBranches(b => [...b, { id: Date.now(), ...newBranch }]);
    setNewBranch({ name: "", address: "", manager: "", phone: "" });
  }

  function handleEdit(id: number) {
    setEditingId(id);
    const branch = branches.find(b => b.id === id);
    if (branch) setNewBranch(branch);
  }

  function handleUpdate() {
    if (!editingId) return;
    setBranches(branches.map(b => b.id === editingId ? { ...b, ...newBranch } : b));
    setEditingId(null);
    setNewBranch({ name: "", address: "", manager: "", phone: "" });
  }

  function handleDelete(id: number) {
    setBranches(b => b.filter(branch => branch.id !== id));
  }

  return (
    <div className="container mx-auto p-6 max-w-3xl">
      <h1 className="text-2xl font-bold mb-4">Branch Management</h1>
      <Card className="mb-6 card-ios">
        <CardHeader>
          <CardTitle>Add / Edit Branch</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <Input placeholder="Branch Name" value={newBranch.name} onChange={e => setNewBranch(n => ({ ...n, name: e.target.value }))} />
            <Input placeholder="Address" value={newBranch.address} onChange={e => setNewBranch(n => ({ ...n, address: e.target.value }))} />
            <Input placeholder="Manager" value={newBranch.manager} onChange={e => setNewBranch(n => ({ ...n, manager: e.target.value }))} />
            <Input placeholder="Phone" value={newBranch.phone} onChange={e => setNewBranch(n => ({ ...n, phone: e.target.value }))} />
          </div>
          <Button onClick={editingId ? handleUpdate : handleAdd} className="w-full">
            {editingId ? "Update Branch" : "Add Branch"}
          </Button>
        </CardContent>
      </Card>
      <Card className="card-ios">
        <CardHeader>
          <CardTitle>Branches</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-muted-foreground">
                  <th className="py-2 px-2">Name</th>
                  <th className="py-2 px-2">Address</th>
                  <th className="py-2 px-2">Manager</th>
                  <th className="py-2 px-2">Phone</th>
                  <th className="py-2 px-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {branches.map(branch => (
                  <tr key={branch.id} className="border-b last:border-0">
                    <td className="py-2 px-2">{branch.name}</td>
                    <td className="py-2 px-2">{branch.address}</td>
                    <td className="py-2 px-2">{branch.manager}</td>
                    <td className="py-2 px-2">{branch.phone}</td>
                    <td className="py-2 px-2 flex gap-2">
                      <Button size="icon" variant="ghost" onClick={() => handleEdit(branch.id)}><Edit2 className="h-4 w-4" /></Button>
                      <Button size="icon" variant="ghost" onClick={() => handleDelete(branch.id)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
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