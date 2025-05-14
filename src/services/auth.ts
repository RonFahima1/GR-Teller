import { useRouter } from 'next/navigation';

export const useAuth = () => {
  const router = useRouter();

  const logout = async () => {
    try {
      // Clear any auth tokens/session data from localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Redirect to login page using the correct path
      router.push('/login');
      router.refresh();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      // For demo purposes, store dummy data
      localStorage.setItem('token', 'demo-token');
      localStorage.setItem('user', JSON.stringify({ email }));
      
      // Redirect to dashboard
      router.push('/dashboard');
      router.refresh();
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return {
    logout,
    login,
  };
}; 