import { forwardRef } from 'react';
import { HiExclamationCircle, HiCheckCircle } from 'react-icons/hi';

const Input = forwardRef(({
  label,
  error,
  success,
  helperText,
  icon,
  className = "",
  type = "text",
  ...props
}, ref) => {
  const baseClasses = "input";
  
  const stateClasses = error 
    ? "border-danger-500 focus:ring-danger-500" 
    : success 
    ? "border-success-500 focus:ring-success-500"
    : "";

  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-400 dark:text-gray-500">
              {icon}
            </span>
          </div>
        )}
        
        <input
          ref={ref}
          type={type}
          className={`${baseClasses} ${stateClasses} ${icon ? 'pl-10' : ''}`}
          {...props}
        />
        
        {(error || success) && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            {error && <HiExclamationCircle className="w-5 h-5 text-danger-500" />}
            {success && <HiCheckCircle className="w-5 h-5 text-success-500" />}
          </div>
        )}
      </div>
      
      {(error || success || helperText) && (
        <p className={`text-sm ${
          error 
            ? 'text-danger-600 dark:text-danger-400' 
            : success 
            ? 'text-success-600 dark:text-success-400'
            : 'text-gray-500 dark:text-gray-400'
        }`}>
          {error || success || helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;