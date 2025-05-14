'use client';

import { useState } from 'react';
import { useCurrentUser } from '@/context/CurrentUserContext';
import { canManageUsers } from '@/utils/permissions';

const mockRoles = [
  { label: 'Teller', value: 'teller' },
  { label: 'Manager', value: 'manager' },
  { label: 'Admin', value: 'admin' },
  { label: 'Compliance', value: 'compliance' },
];

const mockUsers = [
  { id: 1, name: 'Alice Teller', email: 'alice@bank.com', role: 'teller', status: 'active' },
  { id: 2, name: 'Bob Manager', email: 'bob@bank.com', role: 'manager', status: 'active' },
  { id: 3, name: 'Carol Admin', email: 'carol@bank.com', role: 'admin', status: 'active' },
  { id: 4, name: 'Eve Compliance', email: 'eve@bank.com', role: 'compliance', status: 'inactive' },
];

export default function UsersPage() {
  const user = useCurrentUser();
  if (!canManageUsers(user)) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">User Management</h1>
        <div className="text-red-600">Access denied. Only admins can manage users.</div>
      </div>
    );
  }
  const [users, setUsers] = useState(mockUsers);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: mockRoles[0].value, status: 'active' });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingUser, setEditingUser] = useState({ name: '', email: '', role: mockRoles[0].value, status: 'active' });

  function handleAddUser() {
    if (!newUser.name.trim() || !newUser.email.trim()) return;
    setUsers(u => [
      { id: Date.now(), ...newUser },
      ...u,
    ]);
    setNewUser({ name: '', email: '', role: mockRoles[0].value, status: 'active' });
  }

  function handleDeleteUser(id: number) {
    setUsers(u => u.filter(user => user.id !== id));
  }

  function handleEditUser(user: any) {
    setEditingId(user.id);
    setEditingUser({ name: user.name, email: user.email, role: user.role, status: user.status });
  }

  function handleSaveEditUser(id: number) {
    setUsers(u => u.map(user => user.id === id ? { ...user, ...editingUser } : user));
    setEditingId(null);
    setEditingUser({ name: '', email: '', role: mockRoles[0].value, status: 'active' });
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">User Management</h1>
      <div className="mb-6 flex gap-2 items-end">
        <input
          type="text"
          value={newUser.name}
          onChange={e => setNewUser(u => ({ ...u, name: e.target.value }))}
          placeholder="Name"
          className="border rounded px-2 py-1 text-sm"
        />
        <input
          type="email"
          value={newUser.email}
          onChange={e => setNewUser(u => ({ ...u, email: e.target.value }))}
          placeholder="Email"
          className="border rounded px-2 py-1 text-sm"
        />
        <select
          value={newUser.role}
          onChange={e => setNewUser(u => ({ ...u, role: e.target.value }))}
          className="border rounded px-2 py-1 text-sm"
        >
          {mockRoles.map(r => (
            <option key={r.value} value={r.value}>{r.label}</option>
          ))}
        </select>
        <select
          value={newUser.status}
          onChange={e => setNewUser(u => ({ ...u, status: e.target.value }))}
          className="border rounded px-2 py-1 text-sm"
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <button onClick={handleAddUser} className="px-3 py-1 bg-blue-600 text-white rounded">Add</button>
      </div>
      <table className="w-full text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2">Name</th>
            <th className="p-2">Email</th>
            <th className="p-2">Role</th>
            <th className="p-2">Status</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id} className="border-t">
              {editingId === user.id ? (
                <>
                  <td className="p-2"><input type="text" value={editingUser.name} onChange={e => setEditingUser(u => ({ ...u, name: e.target.value }))} className="border rounded px-2 py-1 text-sm" /></td>
                  <td className="p-2"><input type="email" value={editingUser.email} onChange={e => setEditingUser(u => ({ ...u, email: e.target.value }))} className="border rounded px-2 py-1 text-sm" /></td>
                  <td className="p-2">
                    <select value={editingUser.role} onChange={e => setEditingUser(u => ({ ...u, role: e.target.value }))} className="border rounded px-2 py-1 text-sm">
                      {mockRoles.map(r => (
                        <option key={r.value} value={r.value}>{r.label}</option>
                      ))}
                    </select>
                  </td>
                  <td className="p-2">
                    <select value={editingUser.status} onChange={e => setEditingUser(u => ({ ...u, status: e.target.value }))} className="border rounded px-2 py-1 text-sm">
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </td>
                  <td className="p-2 flex gap-2">
                    <button onClick={() => handleSaveEditUser(user.id)} className="text-green-600 hover:underline">Save</button>
                    <button onClick={() => setEditingId(null)} className="text-gray-500 hover:underline">Cancel</button>
                  </td>
                </>
              ) : (
                <>
                  <td className="p-2">{user.name}</td>
                  <td className="p-2">{user.email}</td>
                  <td className="p-2 capitalize">{user.role}</td>
                  <td className="p-2 capitalize">{user.status}</td>
                  <td className="p-2 flex gap-2">
                    <button onClick={() => handleEditUser(user)} className="text-blue-600 hover:underline">Edit</button>
                    <button onClick={() => handleDeleteUser(user.id)} className="text-red-600 hover:underline">Delete</button>
                  </td>
                </>
              )}
            </tr>
          ))}
          {users.length === 0 && (
            <tr><td colSpan={5} className="text-center text-gray-400 py-4">No users found.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
} 