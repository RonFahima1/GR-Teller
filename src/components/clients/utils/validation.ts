import { z } from 'zod';

export type IDType = 'passport' | 'national_id' | 'drivers_license';

export const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const isValidFormat = emailRegex.test(email);
  const isValidDomain = email.split('@')[1].length > 2;
  return isValidFormat && isValidDomain;
};

export const validatePhone = (phone: string) => {
  const phoneRegex = /^\+?[0-9]{1,4}\s*\([0-9]{1,3}\)\s*[0-9]{1,9}$/;
  const isValidFormat = phoneRegex.test(phone);
  const cleaned = phone.replace(/\D/g, '');
  const hasValidLength = cleaned.length >= 7 && cleaned.length <= 15;
  return isValidFormat && hasValidLength;
};

export const validateAreaCode = (areaCode: string) => {
  const isValidFormat = /^[0-9]{1,3}$/.test(areaCode);
  const isValidRange = parseInt(areaCode) >= 100 && parseInt(areaCode) <= 999;
  return isValidFormat && isValidRange;
};

export const validateDate = (date: string) => {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(date)) return false;
  
  const [year, month, day] = date.split('-').map(Number);
  const dateObj = new Date(year, month - 1, day);
  
  return (
    !isNaN(dateObj.getTime()) &&
    dateObj.getFullYear() === year &&
    dateObj.getMonth() === month - 1 &&
    dateObj.getDate() === day
  );
};

export const validateIncome = (income: string) => {
  const incomeRegex = /^\d+(\.\d{1,2})?$/;
  const isValidFormat = incomeRegex.test(income);
  const amount = parseFloat(income);
  const isValidRange = amount >= 0 && amount <= 10000000; // Maximum 10 million
  return isValidFormat && isValidRange;
};

export const validateIDNumber = (idNumber: string, idType: string) => {
  const rules: Record<IDType, { pattern: RegExp; min: number; max: number }> = {
    passport: { pattern: /^[A-Z0-9]{6,12}$/, min: 6, max: 12 },
    national_id: { pattern: /^[0-9]{9,12}$/, min: 9, max: 12 },
    drivers_license: { pattern: /^[A-Z0-9]{6,12}$/, min: 6, max: 12 }
  };

  const rule = rules[idType as IDType];
  if (!rule) return false;

  const isValidFormat = rule.pattern.test(idNumber);
  const isValidLength = idNumber.length >= rule.min && idNumber.length <= rule.max;
  return isValidFormat && isValidLength;
};

export const validateDocumentFile = (file: File) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
  const maxSize = 5 * 1024 * 1024; // 5MB
  const minSize = 1000; // 1KB minimum
  
  const isValidType = allowedTypes.includes(file.type);
  const isValidSize = file.size >= minSize && file.size <= maxSize;
  const isValidName = /^[a-zA-Z0-9_.-]+$/.test(file.name);
  
  const errors: string[] = [];
  
  if (!isValidType) {
    errors.push('Only JPEG, PNG, and PDF files are allowed');
  }
  
  if (!isValidSize) {
    errors.push(
      file.size < minSize 
        ? 'File size must be at least 1KB' 
        : 'File size must be less than 5MB'
    );
  }
  
  if (!isValidName) {
    errors.push('File name contains invalid characters');
  }
  
  return {
    isValid: isValidType && isValidSize && isValidName,
    errors: errors.length > 0 ? errors : undefined
  };
};

export const validateName = (name: string) => {
  const nameRegex = /^[a-zA-Z\s'-]{1,50}$/;
  const hasValidLength = name.length >= 1 && name.length <= 50;
  const isValidFormat = nameRegex.test(name);
  const hasValidCharacters = /^[a-zA-Z\s'-]*$/.test(name);
  return isValidFormat && hasValidLength && hasValidCharacters;
};

export const validateAddress = (address: string) => {
  const addressRegex = /^[a-zA-Z0-9\s.,'-]{1,100}$/;
  const hasValidLength = address.length >= 1 && address.length <= 100;
  const isValidFormat = addressRegex.test(address);
  return isValidFormat && hasValidLength;
};

export const validatePostalCode = (postalCode: string) => {
  const postalRegex = /^[a-zA-Z0-9\s-]{1,20}$/;
  const hasValidLength = postalCode.length >= 1 && postalCode.length <= 20;
  const isValidFormat = postalRegex.test(postalCode);
  return isValidFormat && hasValidLength;
};

export const validateEmployer = (employer: string) => {
  const employerRegex = /^[a-zA-Z0-9\s.,'-]{1,100}$/;
  const hasValidLength = employer.length >= 1 && employer.length <= 100;
  const isValidFormat = employerRegex.test(employer);
  const hasValidCharacters = /^[a-zA-Z0-9\s.,'-]*$/.test(employer);
  const isNotJustSpaces = employer.trim().length > 0;
  return isValidFormat && hasValidLength && hasValidCharacters && isNotJustSpaces;
};
