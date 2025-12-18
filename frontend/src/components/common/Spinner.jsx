/**
 * Loading Spinner Component
 */

import { cn } from '../../utils/helpers';

export default function Spinner({ size = 'md', className }) {
    const sizes = {
        sm: 'w-4 h-4 border-2',
        md: 'w-8 h-8 border-3',
        lg: 'w-12 h-12 border-4',
    };

    return (
        <div className={cn('spinner', sizes[size], className)} />
    );
}

export function LoadingPage() {
    return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
                <Spinner size="lg" className="mx-auto mb-4" />
                <p className="text-gray-500">Loading...</p>
            </div>
        </div>
    );
}

export function LoadingOverlay() {
    return (
        <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-50">
            <Spinner size="lg" />
        </div>
    );
}
