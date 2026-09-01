import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from './Button';

export const ErrorState = ({ 
  title = 'Something went wrong', 
  description = 'Failed to load data. Please check your connection and try again.',
  onRetry 
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 md:p-12 text-center bg-zinc-900/60 rounded-xl border border-red-500/20 shadow-sm my-4 backdrop-blur-sm">
      <div className="w-14 h-14 bg-red-500/10 border border-red-500/20 text-red-400 rounded-full flex items-center justify-center mb-4">
        <AlertTriangle className="w-7 h-7" />
      </div>
      <h3 className="text-lg font-bold text-zinc-100 mb-1">{title}</h3>
      <p className="text-sm text-zinc-400 max-w-md mb-6 leading-relaxed">{description}</p>
      {onRetry && (
        <Button variant="outline" onClick={onRetry} className="gap-2 text-sm">
          <RefreshCw className="w-4 h-4" />
          Try Again
        </Button>
      )}
    </div>
  );
};
