'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { startRegistration, startAuthentication } from '@simplewebauthn/browser';
import { Key, Plus, Trash2, AlertCircle } from 'lucide-react';

interface Passkey {
  id: string;
  name: string;
  createdAt: string;
  lastUsed?: string;
}

export default function PasskeyManager() {
  const [passkeys, setPasskeys] = useState<Passkey[]>([]);
  const [loading, setLoading] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    loadPasskeys();
  }, []);

  const loadPasskeys = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/passkey/list');
      if (response.ok) {
        const data = await response.json();
        setPasskeys(data.passkeys);
      }
    } catch (error) {
      console.error('Failed to load passkeys:', error);
    } finally {
      setLoading(false);
    }
  };

  const registerPasskey = async () => {
    try {
      setRegistering(true);
      setError(null);

      // Step 1: Generate registration options
      const generateResponse = await fetch('/api/passkey/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'generate' }),
      });

      if (!generateResponse.ok) {
        throw new Error('Failed to generate registration options');
      }

      const { options } = await generateResponse.json();

      // Step 2: Start registration on the client
      const registrationResponse = await startRegistration(options);

      // Step 3: Verify registration
      const verifyResponse = await fetch('/api/passkey/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'verify', 
          response: registrationResponse 
        }),
      });

      if (!verifyResponse.ok) {
        throw new Error('Failed to verify registration');
      }

      setSuccess('Passkey registered successfully!');
      loadPasskeys(); // Reload the list
    } catch (error) {
      console.error('Registration error:', error);
      setError(error instanceof Error ? error.message : 'Failed to register passkey');
    } finally {
      setRegistering(false);
    }
  };

  const deletePasskey = async (passkeyId: string) => {
    try {
      const response = await fetch(`/api/passkey/delete/${passkeyId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setSuccess('Passkey deleted successfully!');
        loadPasskeys(); // Reload the list
      } else {
        throw new Error('Failed to delete passkey');
      }
    } catch (error) {
      console.error('Delete error:', error);
      setError(error instanceof Error ? error.message : 'Failed to delete passkey');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="h-5 w-5" />
          Passkey Management
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
            <AlertCircle className="h-4 w-4 text-destructive" />
            <span className="text-sm text-destructive">{error}</span>
          </div>
        )}

        {success && (
          <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-md">
            <span className="text-sm text-green-700">{success}</span>
          </div>
        )}

        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-medium">Your Passkeys</h3>
            <p className="text-sm text-muted-foreground">
              Manage your passkeys for secure authentication
            </p>
          </div>
          <Button 
            onClick={registerPasskey} 
            disabled={registering}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            {registering ? 'Registering...' : 'Add Passkey'}
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-sm text-muted-foreground mt-2">Loading passkeys...</p>
          </div>
        ) : passkeys.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed border-muted-foreground/20 rounded-lg">
            <Key className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No passkeys registered yet</p>
            <p className="text-sm text-muted-foreground">
              Add a passkey for faster and more secure login
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {passkeys.map((passkey) => (
              <div
                key={passkey.id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div>
                  <p className="font-medium">{passkey.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Created: {formatDate(passkey.createdAt)}
                  </p>
                  {passkey.lastUsed && (
                    <p className="text-sm text-muted-foreground">
                      Last used: {formatDate(passkey.lastUsed)}
                    </p>
                  )}
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Passkey</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this passkey? You won't be able to use it for authentication anymore.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => deletePasskey(passkey.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <h4 className="font-medium mb-2">About Passkeys</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Passkeys are more secure than passwords</li>
            <li>• They work with biometric authentication (fingerprint, face ID)</li>
            <li>• No need to remember complex passwords</li>
            <li>• Protected against phishing attacks</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
} 