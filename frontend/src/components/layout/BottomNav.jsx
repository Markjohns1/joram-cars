/**
 * Premium Bottom Navigation
 * 
 * Minimalist, high-end mobile navigation.
 * - Glassmorphism background
 * - Subtle active indicators
 * - Balanced icon weighting
 */

import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Search, PlusCircle, Heart, MessageSquare } from 'lucide-react';
import { cn } from '../../utils/helpers';

export default function BottomNav() {
    const navItems = [
        { path: '/', label: 'Home', icon: Home, exact: true },
        { path: '/vehicles', label: 'Inventory', icon: Search },
        { path: '/sell-car', label: 'Sell', icon: PlusCircle, isCTA: true },
        { path: '/saved', label: 'Saved', icon: Heart },
        { path: '/contact', label: 'Contact', icon: MessageSquare },
    ];

    return (
        <nav className="fixed bottom-6 left-6 right-6 z-[100] md:hidden">
            <div className="glass-nav rounded-[24px] h-[68px] flex items-center justify-around px-2 shadow-[0_12px_40px_rgba(0,0,0,0.12)] border border-white/50">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.exact}
                        className={({ isActive }) => cn(
                            "flex flex-col items-center justify-center w-full h-full gap-1 transition-all duration-300 relative",
                            isActive ? "text-[var(--brand-primary)]" : "text-slate-400 hover:text-slate-600"
                        )}
                    >
                        {({ isActive }) => (
                            <>
                                <div className={cn(
                                    "relative transition-all duration-300",
                                    isActive && !item.isCTA ? "scale-110" : "",
                                    item.isCTA ? "bg-slate-900 text-white p-2.5 rounded-2xl shadow-lg -translate-y-1" : ""
                                )}>
                                    <item.icon
                                        size={item.isCTA ? 20 : 22}
                                        strokeWidth={isActive ? 2.5 : 2}
                                    />
                                    {isActive && !item.isCTA && (
                                        <motion.span
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-[var(--brand-primary)] rounded-full"
                                        />
                                    )}
                                </div>
                                {!item.isCTA && (
                                    <span className={cn(
                                        "text-[9px] font-black uppercase tracking-widest transition-all duration-300",
                                        isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"
                                    )}>
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
