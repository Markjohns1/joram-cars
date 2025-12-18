/**
 * Select Component
 */

import { forwardRef } from 'react';
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
                <label className="label">{label}</label>
            )}
            <select
                ref={ref}
                className={cn(
                    'input select',
                    error && 'input-error',
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
            {error && (
                <p className="error-message">{error}</p>
            )}
        </div>
    );
});

Select.displayName = 'Select';

export default Select;
