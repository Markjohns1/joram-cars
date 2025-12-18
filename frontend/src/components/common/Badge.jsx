/**
 * Badge Component
 */

import { cn } from '../../utils/helpers';

export default function Badge({
    children,
    variant = 'primary',
    className,
    ...props
}) {
    const variants = {
        primary: 'badge-primary',
        success: 'badge-success',
        warning: 'badge-warning',
        error: 'badge-error',
        accent: 'badge-accent',
    };

    return (
        <span
            className={cn('badge', variants[variant], className)}
            {...props}
        >
            {children}
        </span>
    );
}
