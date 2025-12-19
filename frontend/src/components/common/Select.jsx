/**
 * Select Component
 */

import { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../utils/helpers';

const Select = forwardRef(({
    label,
    error,
    options = [],
    placeholder = 'Select an option',
    className,
    selectClassName,
    ...props
}, ref) => {
    return (
        <div className={className}>
            {label && (
                <label className="block text-sm font-bold text-gray-700 mb-1">{label}</label>
            )}
            <div className="relative">
                <select
                    ref={ref}
                    className={cn(
                        'appearance-none w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent font-medium transition-shadow',
                        error && 'border-red-500 focus:ring-red-500',
                        selectClassName
                    )}
                    {...props}
                >
                    <option value="">{placeholder}</option>
                    {options.map((option) => (
                        <option
                            key={option.value}
                            value={option.value}
                        >
                            {option.label}
                        </option>
                    ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
            </div>
            {error && (
                <p className="mt-1 text-sm text-red-500 font-medium">{error}</p>
            )}
        </div>
    );
});

Select.displayName = 'Select';

export default Select;
