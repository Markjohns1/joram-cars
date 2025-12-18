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
        primary: 'btn-primary',
        secondary: 'btn-secondary',
        accent: 'btn-accent',
        whatsapp: 'btn-whatsapp',
        danger: 'bg-red-500 text-white hover:bg-red-600',
        ghost: 'bg-transparent hover:bg-gray-100 text-gray-700',
    };

    const sizes = {
        sm: 'btn-sm',
        md: '',
        lg: 'btn-lg',
    };

    return (
        <button
            type={type}
            disabled={disabled || isLoading}
            className={cn(
                'btn',
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
