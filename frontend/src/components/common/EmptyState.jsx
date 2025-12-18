/**
 * Empty State Component
 */

import { cn } from '../../utils/helpers';
import { Search } from 'lucide-react';

export default function EmptyState({
    icon: Icon = Search,
    title = 'No results found',
    description = 'Try adjusting your filters or search terms.',
    action,
    className,
}) {
    return (
        <div className={cn('text-center py-16', className)}>
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <Icon size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">{description}</p>
            {action}
        </div>
    );
}
