export function Badge({ children, variant = 'default', className = '' }) {
  const baseStyles = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
  
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    green: 'bg-green-100 text-green-800',
    amber: 'bg-yellow-100 text-yellow-800',
    red: 'bg-red-100 text-red-800',
  };

  const style = variants[variant] || variants.default;

  return (
    <span className={`${baseStyles} ${style} ${className}`}>
      {children}
    </span>
  );
}
