import { FileData } from '../types/form';
import { z } from 'zod';

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function validateFile(
  file: File,
  maxSize: number = 5 * 1024 * 1024, // 5MB
  allowedTypes: string[] = ['image/jpeg', 'image/png', 'application/pdf']
): string | null {
  if (file.size > maxSize) {
    return `File size must be less than ${formatFileSize(maxSize)}`;
  }

  if (!allowedTypes.includes(file.type)) {
    const typeMap: Record<string, string> = {
      'image/jpeg': 'JPEG',
      'image/png': 'PNG',
      'application/pdf': 'PDF'
    };
    const allowedTypesStr = allowedTypes
      .map(type => typeMap[type] || type.split('/')[1].toUpperCase())
      .join(', ');
    return `Invalid file type. Accepted types: ${allowedTypesStr}`;
  }

  return null;
}

export function createFileData(file: File): Promise<FileData> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      resolve({
        file,
        previewUrl: e.target?.result as string,
        name: file.name,
        size: file.size,
        type: file.type
      });
    };
    reader.readAsDataURL(file);
  });
}

export function getDocumentTypeFieldPath(type: string): string {
  const typeMap: Record<string, string> = {
    'idFront': 'document',
    'idBack': 'document',
    'proofOfAddress': 'identification'
  };
  return `${typeMap[type]}.fileData`;
}

export function getDocumentTypeLabel(type: string): string {
  const typeMap: Record<string, string> = {
    'idFront': 'ID Front',
    'idBack': 'ID Back',
    'proofOfAddress': 'Proof of Address'
  };
  return typeMap[type] || type;
}
