import { useState } from 'react';
import { Menu, LayoutDashboard, Car, MessageSquare, Plus, ExternalLink } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import { cn } from '../../../utils/helpers';

export default function AdminLayout({ children, title, actions }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const location = useLocation();

    const bottomNavItems = [
        { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dash' },
        { path: '/admin/vehicles', icon: Car, label: 'Fleet' },
        { path: '/admin/enquiries', icon: MessageSquare, label: 'Messages' },
        { path: '/admin/vehicles/new', icon: Plus, label: 'Add' },
    ];

    return (
        <div className="flex min-h-screen bg-slate-50 font-sans">
            {/* Sidebar (Desktop Collapsible, Mobile Drawer) */}
            <AdminSidebar
                isOpen={isSidebarOpen}
                isCollapsed={isCollapsed}
                onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
                onClose={() => setIsSidebarOpen(false)}
            />

            {/* Main Content Area */}
            <div className={cn(
                "flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out",
                isCollapsed ? "lg:ml-0" : ""
            )}>
                {/* Header (Desktop & Mobile) - Fixed on mobile, sticky on desktop */}
                <header className="bg-white fixed top-0 left-0 right-0 lg:sticky lg:relative z-30 px-4 lg:px-8 py-4 flex items-center justify-between border-b border-black">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="lg:hidden p-2 text-slate-900 hover:bg-slate-100 rounded-xl transition-all active:scale-95 flex-shrink-0"
                        >
                            <Menu size={24} />
                        </button>
                        <div className="lg:hidden h-5 w-[1px] bg-slate-200 mx-2" />
                        <div className="flex flex-col">
                            <span className="font-black text-slate-900 tracking-tight text-sm lg:text-xl uppercase">{title}</span>
                            <div className="h-1 w-8 bg-blue-600 rounded-full mt-1" />
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Desktop Actions */}
                        {actions && (
                            <div className="hidden lg:flex items-center gap-2 mr-2">
                                {actions}
                            </div>
                        )}
                        <a
                            href="/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-3 py-2 bg-slate-900 text-white hover:bg-blue-600 border border-slate-900 rounded-sm text-[10px] font-bold uppercase tracking-wider transition-all"
                        >
                            <span className="hidden sm:inline">Live Site</span>
                            <ExternalLink size={12} />
                        </a>
                    </div>
                </header>

                <div className="h-16 lg:hidden" /> {/* Spacer for fixed header on mobile */}

                {/* Desktop Header & Content */}
                <main className="flex-1 p-6 lg:p-10">
                    <div className="max-w-7xl mx-auto">
                        {/* Mobile Actions Area */}
                        {actions && (
                            <div className="lg:hidden flex items-center gap-3 mb-6 animate-in slide-in-from-top-4 duration-500">
                                {actions}
                            </div>
                        )}

                        {/* Content */}
                        <div className="min-h-[calc(100vh-250px)] pb-32 lg:pb-12">
                            {children}
                        </div>
                    </div>
                </main>
            </div>

            {/* Mobile Bottom Nav */}
            <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-slate-100 px-6 py-3 z-40 flex items-center justify-between shadow-[0_-10px_20px_rgba(0,0,0,0.02)]">
                {bottomNavItems.map((item) => {
                    const isActive = item.exact
                        ? location.pathname === item.path
                        : location.pathname.startsWith(item.path);
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={cn(
                                "flex flex-col items-center gap-1 transition-all duration-300",
                                isActive ? "text-blue-600 scale-110" : "text-slate-400"
                            )}
                        >
                            <item.icon size={22} className={isActive ? "fill-blue-50" : ""} />
                            <span className="text-[10px] font-bold uppercase tracking-widest">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}
