/**
 * Professional Bottom Navigation
 * 
 * One-touch access to core mobile actions.
 * - Inventory Focus
 * - Smooth state transitions
 */

import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Search, PlusCircle, MessageSquare } from 'lucide-react';
import { cn } from '../../utils/helpers';

export default function BottomNav() {
    const navItems = [
        { path: '/', label: 'Home', icon: Home, exact: true },
        { path: '/vehicles', label: 'Inventory', icon: Search },
        { path: '/sell-car', label: 'Sell', icon: PlusCircle, isCTA: true },
        { path: '/contact', label: 'Contact', icon: MessageSquare },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-[100] md:hidden bg-white border-t border-slate-200">
            <div className="h-[68px] flex items-center justify-around px-4">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.exact}
                        className={({ isActive }) => cn(
                            "flex flex-col items-center justify-center min-w-[64px] h-full gap-1 transition-all duration-300",
                            isActive ? "text-brand-primary" : "text-slate-500 hover:text-slate-900"
                        )}
                    >
                        {({ isActive }) => (
                            <>
                                <div className={cn(
                                    "relative transition-all duration-300",
                                    isActive && !item.isCTA ? "scale-110" : "",
                                    item.isCTA ? "bg-slate-900 text-white p-2 rounded-xl shadow-lg -translate-y-4 border-4 border-white" : ""
                                )}>
                                    <item.icon
                                        size={item.isCTA ? 24 : 22}
                                        strokeWidth={isActive ? 2.5 : 2}
                                    />
                                    {isActive && !item.isCTA && (
                                        <motion.span
                                            layoutId="active-dot"
                                            className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-brand-primary rounded-full"
                                        />
                                    )}
                                </div>
                                {!item.isCTA && (
                                    <span className="text-[10px] font-bold uppercase tracking-wider">
                                        {item.label}
                                    </span>
                                )}
                            </>
                        )}
                    </NavLink>
                ))}
            </div>
        </nav>
    );
}
