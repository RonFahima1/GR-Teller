"use client";
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Plus, Edit2, Trash2, Mail, Copy, Eye, UserPlus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
}

interface Invitation {
  id: string;
  email: string;
  role: string;
  token: string;
  expiresAt: string;
  usedAt: string | null;
  invitedByUser: {
    name: string;
  };
}

export default function UserManagementPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [newInvite, setNewInvite] = useState({ email: "", role: "AGENT_USER" });
  const [inviting, setInviting] = useState(false);

  const roles = [
    { value: "ORG_ADMIN", label: "Organization Admin" },
    { value: "AGENT_ADMIN", label: "Agent Admin" },
    { value: "AGENT_USER", label: "Teller" },
    { value: "COMPLIANCE_USER", label: "Compliance Officer" },
    { value: "ORG_USER", label: "Organization User" },
  ];

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ORG_ADMIN': return 'bg-red-100 text-red-800';
      case 'AGENT_ADMIN': return 'bg-blue-100 text-blue-800';
      case 'AGENT_USER': return 'bg-green-100 text-green-800';
      case 'COMPLIANCE_USER': return 'bg-purple-100 text-purple-800';
      case 'ORG_USER': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'SUSPENDED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchInvitations();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
      } else {
        toast.error('Failed to fetch users');
      }
    } catch (error) {
      toast.error('Error fetching users');
    } finally {
      setLoading(false);
    }
  };

  const fetchInvitations = async () => {
    try {
      const response = await fetch('/api/admin/invitations');
      if (response.ok) {
        const data = await response.json();
        setInvitations(data.invitations);
      }
    } catch (error) {
      console.error('Error fetching invitations:', error);
    }
  };

  const handleCreateInvitation = async () => {
    if (!newInvite.email || !newInvite.role) {
      toast.error('Please fill in all fields');
      return;
    }

    setInviting(true);
    try {
      const response = await fetch('/api/user/invite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newInvite),
      });

      if (response.ok) {
        const data = await response.json();
        toast.success('Invitation created successfully!');
        setNewInvite({ email: "", role: "AGENT_USER" });
        setShowInviteForm(false);
        fetchInvitations(); // Refresh invitations list
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to create invitation');
      }
    } catch (error) {
      toast.error('Error creating invitation');
    } finally {
      setInviting(false);
    }
  };

  const copyInviteLink = (token: string) => {
    const link = `${window.location.origin}/register?token=${token}`;
    navigator.clipboard.writeText(link);
    toast.success('Invitation link copied to clipboard!');
  };

  const handleToggleUserStatus = async (userId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
      const response = await fetch(`/api/admin/users/${userId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        toast.success(`User ${newStatus.toLowerCase()}`);
        fetchUsers(); // Refresh users list
      } else {
        toast.error('Failed to update user status');
      }
    } catch (error) {
      toast.error('Error updating user status');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading users...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground">
            Manage users, roles, and invitations
          </p>
        </div>
        <Button onClick={() => setShowInviteForm(true)}>
          <UserPlus className="h-4 w-4 mr-2" />
          Invite User
        </Button>
      </div>

      {/* Invitation Form */}
      {showInviteForm && (
        <Card className="card-ios">
          <CardHeader>
            <CardTitle>Create Invitation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <Input 
                placeholder="Email" 
                type="email"
                value={newInvite.email} 
                onChange={e => setNewInvite(n => ({ ...n, email: e.target.value }))} 
              />
              <select 
                className="border rounded px-3 py-2" 
                value={newInvite.role} 
                onChange={e => setNewInvite(n => ({ ...n, role: e.target.value }))}
              >
                {roles.map(role => (
                  <option key={role.value} value={role.value}>{role.label}</option>
                ))}
              </select>
              <div className="flex gap-2">
                <Button onClick={handleCreateInvitation} disabled={inviting}>
                  {inviting ? 'Creating...' : <><Mail className="h-4 w-4 mr-1" />Send Invite</>}
                </Button>
                <Button variant="outline" onClick={() => setShowInviteForm(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Active Users */}
      <Card className="card-ios">
        <CardHeader>
          <CardTitle>Active Users ({users.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-muted-foreground border-b">
                  <th className="py-3 px-2">Name</th>
                  <th className="py-3 px-2">Email</th>
                  <th className="py-3 px-2">Role</th>
                  <th className="py-3 px-2">Status</th>
                  <th className="py-3 px-2">Created</th>
                  <th className="py-3 px-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id} className="border-b last:border-0">
                    <td className="py-3 px-2 font-medium">{user.name}</td>
                    <td className="py-3 px-2">{user.email}</td>
                    <td className="py-3 px-2">
                      <Badge className={getRoleColor(user.role)}>
                        {user.role.replace('_', ' ')}
                      </Badge>
                    </td>
                    <td className="py-3 px-2">
                      <Badge className={getStatusColor(user.status)}>
                        {user.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-2 text-muted-foreground">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-2">
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleToggleUserStatus(user.id, user.status)}
                        >
                          {user.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Pending Invitations */}
      <Card className="card-ios">
        <CardHeader>
          <CardTitle>Pending Invitations ({invitations.filter(i => !i.usedAt).length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-muted-foreground border-b">
                  <th className="py-3 px-2">Email</th>
                  <th className="py-3 px-2">Role</th>
                  <th className="py-3 px-2">Invited By</th>
                  <th className="py-3 px-2">Expires</th>
                  <th className="py-3 px-2">Status</th>
                  <th className="py-3 px-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {invitations.filter(inv => !inv.usedAt).map(invitation => (
                  <tr key={invitation.id} className="border-b last:border-0">
                    <td className="py-3 px-2 font-medium">{invitation.email}</td>
                    <td className="py-3 px-2">
                      <Badge className={getRoleColor(invitation.role)}>
                        {invitation.role.replace('_', ' ')}
                      </Badge>
                    </td>
                    <td className="py-3 px-2">{invitation.invitedByUser.name}</td>
                    <td className="py-3 px-2 text-muted-foreground">
                      {new Date(invitation.expiresAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-2">
                      <Badge variant="secondary">Pending</Badge>
                    </td>
                    <td className="py-3 px-2">
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => copyInviteLink(invitation.token)}
                        >
                          <Copy className="h-4 w-4 mr-1" />
                          Copy Link
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {invitations.filter(i => !i.usedAt).length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No pending invitations
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 