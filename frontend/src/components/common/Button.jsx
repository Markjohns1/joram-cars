/**
 * Button Component
 */

import { cn } from '../../utils/helpers';
import Spinner from './Spinner';

export default function Button({
    children,
    type = 'button',
    variant = 'primary',
    size = 'md',
    isLoading = false,
    disabled = false,
    className,
    ...props
}) {
    const variants = {
        primary: 'btn-premium-primary',
        secondary: 'btn-premium-outline',
        accent: 'btn-premium-primary', // Fallback
        whatsapp: 'btn-premium-whatsapp',
        danger: 'bg-red-500 text-white hover:bg-red-600',
        ghost: 'bg-transparent hover:bg-gray-100 text-slate-700',
    };

    const sizes = {
        sm: 'h-9 px-4 text-sm',
        md: 'h-12 px-6 text-base',
        lg: 'h-14 px-8 text-lg',
    };

    return (
        <button
            type={type}
            disabled={disabled || isLoading}
            className={cn(
                'btn-premium',
                variants[variant],
                sizes[size],
                className
            )}
            {...props}
        >
            {isLoading ? (
                <>
                    <Spinner size="sm" />
                    <span>Loading...</span>
                </>
            ) : (
                children
            )}
        </button>
    );
}
