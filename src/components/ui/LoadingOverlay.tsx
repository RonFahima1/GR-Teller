import React from 'react';

const LoadingOverlay = () => (
  <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-background/80 backdrop-blur-sm">
    <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
  </div>
);

export default LoadingOverlay; 