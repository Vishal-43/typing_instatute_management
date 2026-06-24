export const Card = ({ className = '', children, ...props }) => (
  <div className={`bg-white rounded-xl border border-border shadow-sm ${className}`} {...props}>
    {children}
  </div>
);

export const CardHeader = ({ className = '', children }) => (
  <div className={`px-6 py-4 border-b border-border ${className}`}>{children}</div>
);

export const CardContent = ({ className = '', children }) => (
  <div className={`px-6 py-4 ${className}`}>{children}</div>
);
