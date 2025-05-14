import { useState, useCallback } from 'react';
import { FileData, DocumentType } from '../types/form';

export function useFileUpload() {
  const [uploads, setUploads] = useState<Record<DocumentType, FileData>>({});

  const handleFileUpload = useCallback(
    async (type: DocumentType, file: File): Promise<FileData | null> => {
      if (!file) return null;

      try {
        // Validate file type and size
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
          throw new Error('File size must be less than 5MB');
        }

        // Create preview URL
        const previewUrl = URL.createObjectURL(file);

        const fileData: FileData = {
          file,
          previewUrl,
          name: file.name,
          size: file.size,
          type: file.type,
        };

        setUploads(prev => ({
          ...prev,
          [type]: fileData,
        }));

        return fileData;
      } catch (error) {
        console.error('File upload error:', error);
        return null;
      }
    },
    []
  );

  const removeFile = useCallback((type: DocumentType) => {
    const fileData = uploads[type];
    if (fileData?.previewUrl) {
      URL.revokeObjectURL(fileData.previewUrl);
    }
    setUploads(prev => ({
      ...prev,
      [type]: undefined,
    }));
  }, [uploads]);

  const clearAllFiles = useCallback(() => {
    Object.values(uploads).forEach(fileData => {
      if (fileData?.previewUrl) {
        URL.revokeObjectURL(fileData.previewUrl);
      }
    });
    setUploads({});
  }, [uploads]);

  return {
    uploads,
    handleFileUpload,
    removeFile,
    clearAllFiles,
  };
}
