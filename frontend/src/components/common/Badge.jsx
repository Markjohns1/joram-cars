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
            {variant === 'success' && (
                <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-status-pulse absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                </span>
            )}
            {variant === 'error' && (
                <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
            )}
            {children}
        </span>
    );
}
