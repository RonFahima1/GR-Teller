// Simple toast utility for notifications
// This is a simplified version - in a real app, you'd use a more robust solution

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastOptions {
  title?: string;
  description?: string;
  duration?: number;
  type?: ToastType;
}

// Default options
const defaultOptions: ToastOptions = {
  duration: 3000,
  type: 'info',
};

// Simple toast implementation
export const toast = {
  show: (options: ToastOptions | string) => {
    const opts = typeof options === 'string' 
      ? { ...defaultOptions, description: options } 
      : { ...defaultOptions, ...options };
    
    // In a real implementation, this would display a toast notification
    console.log(`[Toast - ${opts.type}]: ${opts.title || ''} ${opts.description || ''}`);
    
    // Return a mock promise that resolves after the duration
    return new Promise<void>((resolve) => {
      setTimeout(resolve, opts.duration);
    });
  },
  
  // Convenience methods
  success: (options: ToastOptions | string) => 
    toast.show(typeof options === 'string' ? { description: options, type: 'success' } : { ...options, type: 'success' }),
  
  error: (options: ToastOptions | string) => 
    toast.show(typeof options === 'string' ? { description: options, type: 'error' } : { ...options, type: 'error' }),
  
  info: (options: ToastOptions | string) => 
    toast.show(typeof options === 'string' ? { description: options, type: 'info' } : { ...options, type: 'info' }),
  
  warning: (options: ToastOptions | string) => 
    toast.show(typeof options === 'string' ? { description: options, type: 'warning' } : { ...options, type: 'warning' }),
};
