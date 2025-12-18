/**
 * Textarea Component
 */

import { forwardRef } from 'react';
import { cn } from '../../utils/helpers';

const Textarea = forwardRef(({
    label,
    error,
    className,
    textareaClassName,
    rows = 4,
    ...props
}, ref) => {
    return (
        <div className={className}>
            {label && (
                <label className="label">{label}</label>
            )}
            <textarea
                ref={ref}
                rows={rows}
                className={cn(
                    'input resize-none',
                    error && 'input-error',
                    textareaClassName
                )}
                {...props}
            />
            {error && (
                <p className="error-message">{error}</p>
            )}
        </div>
    );
});

Textarea.displayName = 'Textarea';

export default Textarea;
