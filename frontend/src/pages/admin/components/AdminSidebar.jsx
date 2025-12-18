/**
 * Admin Sidebar Component
 * 
 * High contrast navigation.
 */

import { NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard, Car, MessageSquare, FileText,
    LogOut, X, ChevronLeft
} from 'lucide-react';
import { useAuth } from '../../../context';
import { cn } from '../../../utils/helpers';

const NAV_ITEMS = [
    { path: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
    { path: '/admin/vehicles', label: 'Vehicles', icon: Car },
    { path: '/admin/enquiries', label: 'Enquiries', icon: MessageSquare },
    { path: '/admin/sell-requests', label: 'Sell Requests', icon: FileText },
];

export default function AdminSidebar({ isOpen, onClose }) {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/admin/login');
    };

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
                    onClick={onClose}
                />
            )}

            {/* Sidebar Container */}
            <aside className={cn(
                'fixed inset-y-0 left-0 z-50 w-72 bg-[#0F172A] text-white transform transition-transform duration-300 ease-out lg:relative lg:translate-x-0 flex flex-col shadow-2xl lg:shadow-none',
                isOpen ? 'translate-x-0' : '-translate-x-full'
            )}>
                {/* Branding */}
                <div className="h-20 flex items-center px-6 border-b border-white/10 bg-[#0F172A]">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                            <Car size={22} className="fill-current text-white" />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-bold text-lg leading-tight tracking-tight text-white">Joram Cars</span>
                            <span className="text-[10px] uppercase font-bold text-blue-400 tracking-wider">Admin Panel</span>
                        </div>
                    </div>
                    <button onClick={onClose} className="ml-auto lg:hidden text-gray-400 hover:text-white">
                        <X size={24} />
                    </button>
                </div>

                {/* Navigation */}
                <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1.5 bg-[#0F172A]">
                    <p className="px-2 mb-3 text-xs font-bold text-gray-500 uppercase tracking-widest">Workspace</p>
                    {NAV_ITEMS.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.exact}
                            onClick={onClose}
                            className={({ isActive }) => cn(
                                'flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group',
                                isActive
                                    ? 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-900/20'
                                    : 'text-gray-400 hover:bg-white/5 hover:text-white font-medium'
                            )}
                        >
                            <item.icon size={20} className={cn(({ isActive }) => isActive ? "text-white" : "group-hover:text-white text-gray-400")} />
                            <span>{item.label}</span>
                        </NavLink>
                    ))}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-white/10 bg-[#020617]">
                    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl mb-4 border border-white/5">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-sm font-bold text-white shadow-inner">
                            {user?.username?.[0]?.toUpperCase() || 'A'}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-semibold text-white truncate">{user?.full_name || 'Administrator'}</p>
                            <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                        </div>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-lg transition-colors font-medium"
                    >
                        <LogOut size={18} />
                        Sign Out
                    </button>

                    <a
                        href="/"
                        className="w-full flex items-center justify-center gap-2 mt-3 px-4 py-2 text-xs font-semibold text-gray-500 hover:text-white transition-colors"
                    >
                        <ChevronLeft size={14} />
                        Back to Website
                    </a>
                </div>
            </aside>
        </>
    );
}
