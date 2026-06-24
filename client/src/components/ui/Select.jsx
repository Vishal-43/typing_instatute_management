import { forwardRef } from 'react';

export const Select = forwardRef(({ label, error, options = [], placeholder = 'Select...', className = '', ...props }, ref) => (
  <div className="space-y-1">
    {label && <label className="block text-sm font-medium text-text-primary">{label}</label>}
    <select
      ref={ref}
      className={`w-full rounded-lg border ${error ? 'border-red-500' : 'border-border'} px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50 bg-white ${className}`}
      {...props}
    >
      <option value="">{placeholder}</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
    {error && <p className="text-xs text-red-500">{error}</p>}
  </div>
));

Select.displayName = 'Select';
