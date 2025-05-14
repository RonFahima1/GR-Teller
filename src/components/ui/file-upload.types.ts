export type FileError = {
  type: 'size' | 'type' | 'required';
  message: string;
};

export interface FileUploadProps {
  value?: File | null;
  onChange: (file: File) => void;
  accept?: string;
  className?: string;
  maxSize?: number;
  required?: boolean;
  error?: FileError;
  onValidate?: (file: File) => Promise<FileError | null>;
}
