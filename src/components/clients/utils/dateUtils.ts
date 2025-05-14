export function formatDate(date: string | Date, format: string = 'yyyy-MM-dd'): string {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');

  switch (format) {
    case 'yyyy-MM-dd':
      return `${year}-${month}-${day}`;
    case 'dd/MM/yyyy':
      return `${day}/${month}/${year}`;
    case 'MM/dd/yyyy':
      return `${month}/${day}/${year}`;
    default:
      return `${year}-${month}-${day}`;
  }
}

export function parseDate(dateString: string): Date | null {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return null;
  return date;
}

export function validateDate(date: string, minDate?: string, maxDate?: string): string | null {
  const parsedDate = parseDate(date);
  if (!parsedDate) return 'Invalid date format';

  if (minDate && parsedDate < new Date(minDate)) {
    return 'Date must be after minimum date';
  }

  if (maxDate && parsedDate > new Date(maxDate)) {
    return 'Date must be before maximum date';
  }

  return null;
}

export function getAgeFromDob(dob: string): number {
  const today = new Date();
  const birthDate = new Date(dob);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

export function isDateInFuture(date: string): boolean {
  const parsedDate = parseDate(date);
  if (!parsedDate) return false;
  return parsedDate > new Date();
}
