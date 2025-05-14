"use client";
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Plus, Edit2, Trash2 } from "lucide-react";

const initialUsers = [
  { id: 1, name: "Alex Morgan", email: "alex.morgan@example.com", role: "Admin", enabled: true },
  { id: 2, name: "Sarah Chen", email: "sarah.chen@example.com", role: "Teller", enabled: true },
  { id: 3, name: "John Smith", email: "john.smith@example.com", role: "Compliance", enabled: false },
];

export default function UserManagementPage() {
  const [users, setUsers] = useState(initialUsers);
  const [newUser, setNewUser] = useState({ name: "", email: "", role: "Teller", enabled: true });
  const [editingId, setEditingId] = useState<number | null>(null);

  function handleAdd() {
    if (!newUser.name || !newUser.email) return;
    setUsers(u => [...u, { id: Date.now(), ...newUser }]);
    setNewUser({ name: "", email: "", role: "Teller", enabled: true });
  }

  function handleEdit(id: number) {
    setEditingId(id);
    const user = users.find(u => u.id === id);
    if (user) setNewUser(user);
  }

  function handleUpdate() {
    if (!editingId) return;
    setUsers(users.map(u => u.id === editingId ? { ...u, ...newUser } : u));
    setEditingId(null);
    setNewUser({ name: "", email: "", role: "Teller", enabled: true });
  }

  function handleDelete(id: number) {
    setUsers(u => u.filter(user => user.id !== id));
  }

  function handleToggle(id: number) {
    setUsers(users.map(u => u.id === id ? { ...u, enabled: !u.enabled } : u));
  }

  return (
    <div className="container mx-auto p-6 max-w-3xl">
      <h1 className="text-2xl font-bold mb-4">User Management</h1>
      <Card className="mb-6 card-ios">
        <CardHeader>
          <CardTitle>Add / Edit User</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <Input placeholder="Name" value={newUser.name} onChange={e => setNewUser(n => ({ ...n, name: e.target.value }))} />
            <Input placeholder="Email" value={newUser.email} onChange={e => setNewUser(n => ({ ...n, email: e.target.value }))} />
            <select className="border rounded px-3 py-2" value={newUser.role} onChange={e => setNewUser(n => ({ ...n, role: e.target.value }))}>
              <option value="Admin">Admin</option>
              <option value="Teller">Teller</option>
              <option value="Compliance">Compliance</option>
            </select>
            <Button onClick={editingId ? handleUpdate : handleAdd}>
              {editingId ? "Update User" : <><Plus className="h-4 w-4 mr-1" />Add User</>}
            </Button>
          </div>
        </CardContent>
      </Card>
      <Card className="card-ios">
        <CardHeader>
          <CardTitle>Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-muted-foreground">
                  <th className="py-2 px-2">Name</th>
                  <th className="py-2 px-2">Email</th>
                  <th className="py-2 px-2">Role</th>
                  <th className="py-2 px-2">Enabled</th>
                  <th className="py-2 px-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id} className="border-b last:border-0">
                    <td className="py-2 px-2">{user.name}</td>
                    <td className="py-2 px-2">{user.email}</td>
                    <td className="py-2 px-2">{user.role}</td>
                    <td className="py-2 px-2">
                      <Switch checked={user.enabled} onCheckedChange={() => handleToggle(user.id)} />
                    </td>
                    <td className="py-2 px-2 flex gap-2">
                      <Button size="icon" variant="ghost" onClick={() => handleEdit(user.id)}><Edit2 className="h-4 w-4" /></Button>
                      <Button size="icon" variant="ghost" onClick={() => handleDelete(user.id)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
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