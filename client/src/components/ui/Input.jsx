import { forwardRef } from 'react';

export const Input = forwardRef(({ label, error, className = '', ...props }, ref) => (
  <div className="space-y-1">
    {label && <label className="block text-sm font-medium text-text-primary">{label}</label>}
    <input
      ref={ref}
      className={`w-full rounded-lg border ${error ? 'border-red-500' : 'border-border'} px-3 py-2 text-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary/50 ${className}`}
      {...props}
    />
    {error && <p className="text-xs text-red-500">{error}</p>}
  </div>
));

Input.displayName = 'Input';
