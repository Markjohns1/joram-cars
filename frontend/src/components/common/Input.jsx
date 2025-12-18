/**
 * Input Component
 */

import { forwardRef } from 'react';
import { cn } from '../../utils/helpers';

const Input = forwardRef(({
    label,
    error,
    className,
    inputClassName,
    ...props
}, ref) => {
    return (
        <div className={className}>
            {label && (
                <label className="label">{label}</label>
            )}
            <input
                ref={ref}
                className={cn(
                    'input',
                    error && 'input-error',
                    inputClassName
                )}
                {...props}
            />
            {error && (
                <p className="error-message">{error}</p>
            )}
        </div>
    );
});

Input.displayName = 'Input';

export default Input;
