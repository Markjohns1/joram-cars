/**
 * Admin Sidebar Component
 * 
 * High contrast navigation.
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard, Car, MessageSquare, FileText,
    LogOut, X, ChevronLeft, Users, User, ChevronUp, ExternalLink
} from 'lucide-react';
import { useAuth } from '../../../context';
import { cn } from '../../../utils/helpers';

const NAV_ITEMS = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard, exact: true },
    { path: '/admin/vehicles', label: 'Vehicles', icon: Car },
    { path: '/admin/enquiries', label: 'Enquiries', icon: MessageSquare },
    { path: '/admin/sell-requests', label: 'Sell Requests', icon: FileText },
    { path: '/admin/users', label: 'Users', icon: Users },
    { path: '/admin/profile', label: 'My Profile', icon: User },
];

export default function AdminSidebar({ isOpen, isCollapsed, onToggleCollapse, onClose }) {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
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

            {/* Sidebar (Desktop Collapsible, Mobile Drawer) */}
            <aside className={cn(
                'fixed inset-y-0 left-0 z-50 bg-[#0F172A] text-white transform transition-all duration-300 ease-in-out lg:relative lg:translate-x-0 flex flex-col shadow-2xl lg:shadow-[20px_0_50px_rgba(0,0,0,0.05)] border-r border-white/5 w-72',
                isOpen ? 'translate-x-0' : '-translate-x-full',
                isCollapsed ? 'lg:w-20' : 'lg:w-72'
            )}>
                {/* Branding */}
                <div className={cn(
                    "h-20 flex items-center px-6 border-b border-white/10 bg-[#0F172A] group relative",
                    isCollapsed ? "justify-center px-0" : ""
                )}>
                    <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-10 h-10 bg-blue-600 flex-shrink-0 flex items-center justify-center text-white border border-black/20">
                            <Car size={22} className="fill-current text-white" />
                        </div>
                        {!isCollapsed && (
                            <div className="flex flex-col whitespace-nowrap animate-in fade-in duration-500">
                                <span className="font-bold text-lg leading-tight tracking-tight text-white">Joram Cars</span>
                                <span className="text-[10px] uppercase font-bold text-blue-400 tracking-wider">Admin Panel</span>
                            </div>
                        )}
                    </div>

                    {/* Desktop Collapse Toggle */}
                    <button
                        onClick={onToggleCollapse}
                        className={cn(
                            "absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-blue-600 rounded-full hidden lg:flex items-center justify-center text-white shadow-lg transition-transform hover:scale-110 active:scale-95",
                            isCollapsed ? "rotate-180" : ""
                        )}
                    >
                        <ChevronLeft size={14} />
                    </button>

                    <button onClick={onClose} className="p-2 -mr-2 lg:hidden text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Navigation */}
                <div className={cn(
                    "flex-1 overflow-y-auto py-6 px-4 space-y-1.5 bg-[#0F172A] no-scrollbar",
                    isCollapsed ? "px-2" : ""
                )}>
                    {!isCollapsed && (
                        <p className="px-2 mb-3 text-xs font-bold text-gray-500 uppercase tracking-widest animate-in fade-in duration-500">Workspace</p>
                    )}
                    {NAV_ITEMS.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.exact}
                            onClick={onClose}
                            title={isCollapsed ? item.label : ''}
                            className={({ isActive }) => cn(
                                'flex items-center gap-3 px-4 py-3.5 transition-all duration-200 group relative',
                                isActive
                                    ? 'bg-blue-600 text-white font-semibold'
                                    : 'text-gray-400 hover:bg-white/5 hover:text-white font-medium',
                                isCollapsed ? "justify-center px-0 w-12 mx-auto" : ""
                            )}
                        >
                            {({ isActive }) => (
                                <>
                                    <item.icon size={20} className={cn(isActive ? "text-white" : "group-hover:text-white text-gray-400")} />
                                    {!isCollapsed && (
                                        <span className="whitespace-nowrap animate-in slide-in-from-left-2 duration-300">{item.label}</span>
                                    )}

                                    {/* Active Indicator Bar for Collapsed State */}
                                    {isCollapsed && isActive && (
                                        <div className="absolute right-[-8px] top-1/2 -translate-y-1/2 w-1.5 h-6 bg-blue-600 rounded-l-full animate-in fade-in slide-in-from-right-1" />
                                    )}
                                </>
                            )}
                        </NavLink>
                    ))}

                    {/* Compact Profile Toggle - Now inside the menu flow */}
                    <div className={cn(
                        "mt-6 pt-4 border-t border-white/10 relative",
                        isCollapsed ? "px-0" : "px-2"
                    )}>
                        {!isCollapsed ? (
                            <div className="relative">
                                <button
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    className={cn(
                                        "w-full flex items-center gap-3 p-2 bg-white/5 hover:bg-white/10 transition-all border border-white/5 group",
                                        isProfileOpen ? "border-blue-500/50 bg-white/10" : ""
                                    )}
                                >
                                    <div className="w-10 h-10 rounded-full flex-shrink-0 bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-sm font-bold text-white shadow-inner">
                                        {user?.username?.[0]?.toUpperCase() || 'A'}
                                    </div>
                                    <div className="flex-1 text-left overflow-hidden">
                                        <p className="text-sm font-semibold text-white truncate">{user?.full_name || user?.username}</p>
                                        <p className="text-[10px] text-gray-400 truncate uppercase tracking-wider">Administrator</p>
                                    </div>
                                    <ChevronUp size={16} className={cn("text-gray-500 transition-transform", isProfileOpen ? "" : "rotate-180")} />
                                </button>

                                {/* Dropdown Menu (Opens Upwards since it's now higher) */}
                                <motion.div
                                    initial={false}
                                    animate={isProfileOpen ? { opacity: 1, y: 0, display: 'block' } : { opacity: 0, y: 10, transitionEnd: { display: 'none' } }}
                                    className="absolute bottom-full left-0 right-0 mb-2 bg-[#1E293B] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 p-1"
                                >
                                    <a
                                        href="/"
                                        target="_blank"
                                        className="flex items-center gap-2 px-3 py-2.5 text-xs font-semibold text-gray-300 hover:bg-white/5 hover:text-white rounded-lg transition-colors"
                                    >
                                        <ExternalLink size={14} />
                                        View Website
                                    </a>
                                    <div className="h-[1px] bg-white/5 my-1" />
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-2 px-3 py-2.5 text-xs font-semibold text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-lg transition-colors"
                                    >
                                        <LogOut size={14} />
                                        Sign Out
                                    </button>
                                </motion.div>
                            </div>
                        ) : (
                            <div className="flex justify-center">
                                <button
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-sm font-bold text-white shadow-lg hover:scale-105 transition-transform"
                                >
                                    {user?.username?.[0]?.toUpperCase() || 'A'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </aside>
        </>
    );
}
