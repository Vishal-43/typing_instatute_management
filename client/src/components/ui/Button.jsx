const variants = {
  primary: 'bg-primary text-white hover:bg-blue-800',
  secondary: 'bg-gray-100 text-text-primary hover:bg-gray-200',
  danger: 'bg-red-600 text-white hover:bg-red-700',
  outline: 'border border-border text-text-primary hover:bg-gray-50',
  ghost: 'text-text-primary hover:bg-gray-100',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
};

export const Button = ({ variant = 'primary', size = 'md', className = '', children, disabled, ...props }) => (
  <button
    className={`inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
    disabled={disabled}
    {...props}
  >
    {children}
  </button>
);
