/**
 * Loading Spinner Component
 * Premium blue dots loading animation
 */

import { cn } from '../../utils/helpers';

export default function Spinner({ size = 'md', className }) {
    const sizes = {
        sm: 'gap-1',
        md: 'gap-2',
        lg: 'gap-3',
    };

    const dotSizes = {
        sm: 'w-2 h-2',
        md: 'w-3 h-3',
        lg: 'w-4 h-4',
    };

    return (
        <div className={cn('flex items-center justify-center', sizes[size], className)}>
            {[0, 1, 2].map((i) => (
                <div
                    key={i}
                    className={cn(
                        'bg-blue-500 rounded-full animate-pulse',
                        dotSizes[size]
                    )}
                    style={{
                        animationDelay: `${i * 0.15}s`,
                        animationDuration: '0.6s',
                    }}
                />
            ))}
        </div>
    );
}

export function LoadingPage() {
    return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
                <Spinner size="lg" className="mx-auto mb-4" />
                <p className="text-slate-400 text-sm font-medium">Loading...</p>
            </div>
        </div>
    );
}

export function LoadingOverlay() {
    return (
        <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center z-50">
            <Spinner size="lg" />
        </div>
    );
}
