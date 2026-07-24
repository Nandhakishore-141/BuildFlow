import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from './Button';

export const ErrorState = ({ 
  title = 'Something went wrong', 
  description = 'Failed to load data. Please check your connection and try again.',
  onRetry 
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 md:p-12 text-center bg-white rounded-xl border border-red-100 shadow-sm my-4">
      <div className="w-14 h-14 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4">
        <AlertTriangle className="w-7 h-7" />
      </div>
      <h3 className="text-lg font-bold text-neutral-900 mb-1">{title}</h3>
      <p className="text-sm text-neutral-500 max-w-md mb-6">{description}</p>
      {onRetry && (
        <Button variant="outline" onClick={onRetry} className="gap-2 text-sm">
          <RefreshCw className="w-4 h-4" />
          Try Again
        </Button>
      )}
    </div>
  );
};
