/**
 * Admin Layout Component
 * 
 * Flex-based layout to prevent overlap issues.
 */

import { useState } from 'react';
import { Menu } from 'lucide-react';
import AdminSidebar from './AdminSidebar';

export default function AdminLayout({ children, title, actions }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-slate-50">
            {/* Sidebar (Static on desktop, Fixed on mobile) */}
            <AdminSidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
                {/* Mobile Header */}
                <header className="lg:hidden bg-white shadow-sm sticky top-0 z-30 px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                        >
                            <Menu size={24} />
                        </button>
                        <span className="font-bold text-slate-900">{title}</span>
                    </div>
                </header>

                {/* Desktop Header & Content */}
                <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
                    <div className="max-w-7xl mx-auto">
                        {/* Page Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                            <div>
                                <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
                            </div>
                            {actions && (
                                <div className="flex items-center gap-3">
                                    {actions}
                                </div>
                            )}
                        </div>

                        {/* Content */}
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
