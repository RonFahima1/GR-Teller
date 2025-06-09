/**
 * Utility functions for the sender profile components
 */

// Format date for display (e.g., 07-Jun-2027)
export const formatDate = (dateString?: string) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${String(date.getDate()).padStart(2, '0')}-${months[date.getMonth()]}-${date.getFullYear()}`;
};

// Copy to clipboard with haptic feedback simulation
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    
    // If vibration API is supported (mobile devices), provide haptic feedback
    if (navigator && 'vibrate' in navigator && navigator.vibrate) {
      navigator.vibrate(50); // Short vibration
    }
    
    return true;
  } catch (error) {
    console.error('Failed to copy text:', error);
    return false;
  }
};

// Get country flag emoji from country code
export const getCountryFlag = (countryCode?: string) => {
  if (!countryCode || countryCode.length !== 2) {
    return '🌐'; // Default globe emoji if no valid country code
  }
  
  // Return flag emoji for the country code (ISO 3166-1 alpha-2)
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  
  return String.fromCodePoint(...codePoints);
};

// Extract country code from phone number
export const extractCountryCode = (phoneNumber?: string): string => {
  if (!phoneNumber) return '';
  if (phoneNumber.includes('+972')) return 'IL'; // Israel
  if (phoneNumber.includes('+1')) return 'US';   // USA
  if (phoneNumber.includes('+44')) return 'GB';  // UK
  if (phoneNumber.includes('+265')) return 'MW'; // Malawi
  
  // Default empty string if no match
  return '';
};
