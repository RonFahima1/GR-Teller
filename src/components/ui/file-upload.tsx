'use client';

import { cn } from '@/lib/utils';
import { FileUploadProps } from './file-upload.types';

export function FileUpload({
  value,
  onChange,
  accept = 'image/*,application/pdf',
  className,
  ...props
}: FileUploadProps) {
  return (
    <div className={cn(
      "relative cursor-pointer overflow-hidden rounded-lg border-2 border-dashed border-gray-300 bg-white p-6 text-center transition-all duration-200 hover:border-gray-400 hover:bg-gray-50",
      className
    )}>
      <input
        type="file"
        accept={accept}
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            onChange(e.target.files[0]);
          }
        }}
        className="sr-only"
        {...props}
      />
      <div className="space-y-4">
        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="h-10 w-10 text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-10 w-10"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3m6.75-3v5.25c0 2.066-2.343 2.25-4.5 1.907a4.5 4.5 0 10-4.5 4.484c.405-.07.814-.17 1.22-.264l7.414-2.882a1.125 1.125 0 011.07 1.536l-4.44 1.96m0 0a2.25 2.25 0 00-1.8 2.184l.735 3.01a2.25 2.25 0 002.36 1.674l2.625-.985a2.25 2.25 0 00.652-1.328l-2.01-.787m0 0l.183-1.181M17.25 16.5a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z"
              />
            </svg>
          </div>
          <div className="text-center">
            <p className="text-base font-medium text-gray-700">Drag & drop your file here</p>
            <p className="text-sm text-gray-500">or click to browse</p>
            <p className="text-xs text-gray-400 mt-2">{accept.replace(/\*/, ' files')}</p>
          </div>
        </div>
        {value && (
          <div className="mt-2 flex items-center justify-center space-x-2 text-sm text-gray-600">
            <span>{value.name}</span>
            <span className="text-gray-400">({Math.round(value.size / 1024)}KB)</span>
          </div>
        )}
      </div>
    </div>
  );
}
