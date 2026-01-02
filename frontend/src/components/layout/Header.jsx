/**
 * Premium Header Component (Hospital-Grade Polish)
 * 
 * Performance & Professionalism:
 * - Solid fallback for readability
 * - Standardized spacing
 * - Role-appropriate actions
 */

import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, Car } from 'lucide-react';
import { cn } from '../../utils/helpers';
import { Button } from '../common';
import AuthModal from '../auth/AuthModal';
import { useAuth } from '../../context/AuthContext';
import { LogOut, User as UserIcon } from 'lucide-react';

export default function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const { user, isAuthenticated, logout, isAdmin, isStaff } = useAuth();
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location]);

    const navLinks = [
        { path: '/', label: 'Home' },
        ...(isStaff ? [{ path: '/admin/dashboard', label: 'Dashboard' }] : []),
        { path: '/vehicles', label: 'Inventory' },
        { path: '/sell-car', label: 'Sell' },
        { path: '/about', label: 'Our Story' },
        { path: '/contact', label: 'Contact' },
    ];

    return (
        <>
            <header
                className={cn(
                    'fixed top-0 left-0 right-0 z-[100] transition-all duration-300',
                    isScrolled
                        ? 'bg-white border-b border-slate-200 py-2 shadow-sm'
                        : 'bg-white/80 backdrop-blur-md py-3'
                )}
            >
                <div className="container-premium flex items-center justify-between h-16 md:h-20">

                    {/* Brand + Nav Group */}
                    <div className="flex items-center gap-8 lg:gap-10">
                        <Link to="/" className="flex items-center group shrink-0">
                            <img
                                src="/brand/master-logo.png"
                                alt="Joram Cars"
                                className="h-14 md:h-16 lg:h-20 w-auto object-contain transition-all group-hover:scale-105"
                            />
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden lg:flex items-center gap-1">
                            {navLinks.map(link => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={cn(
                                        "text-sm font-extrabold tracking-tight px-4 py-2 rounded-full transition-all duration-200",
                                        location.pathname === link.path
                                            ? "bg-blue-50 text-blue-600"
                                            : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                                    )}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-4">
                        <a href="tel:+254716770077" className="hidden sm:flex items-center gap-2 text-sm font-bold text-slate-700 hover:text-brand-primary transition-colors">
                            <Phone size={14} />
                            <span>+254 716 770 077</span>
                        </a>

                        {/* User Auth */}
                        {isAuthenticated ? (
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={logout}
                                    className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 hover:bg-slate-200 transition-colors"
                                    title="Logout"
                                >
                                    <LogOut size={18} />
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => setIsAuthModalOpen(true)}
                                className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 hover:bg-slate-200 transition-colors"
                                title="Login / Register"
                            >
                                <UserIcon size={18} />
                            </button>
                        )}

                        <Link to="/sell-car" className="hidden sm:block">
                            <Button className="btn-premium btn-premium-primary text-xs h-10 px-5">
                                Sell Vehicle
                            </Button>
                        </Link>

                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="lg:hidden w-10 h-10 flex items-center justify-center text-slate-950 rounded-lg hover:bg-slate-100 transition-colors"
                        >
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </header>

            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
            />
            {/* Mobile Menu Backdrop - Click to Close */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/20 z-[85] md:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Mobile Menu Overlay */}
            <div className={cn(
                "fixed inset-0 bg-white z-[90] transition-all duration-300 md:hidden flex flex-col",
                isMobileMenuOpen ? "opacity-100 translate-x-0" : "opacity-0 translate-x-full pointer-events-none"
            )}>
                <div className="pt-24 px-6 space-y-1 overflow-y-auto flex-1 pb-32">
                    {navLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={cn(
                                "block py-4 text-2xl font-bold",
                                link.path === '/admin/dashboard'
                                    ? "text-blue-600 font-black"
                                    : (location.pathname === link.path ? "text-brand-primary" : "text-slate-900")
                            )}
                        >
                            {link.label}
                        </Link>
                    ))}
                    <div className="pt-8">
                        <Link to="/sell-car">
                            <Button className="w-full btn-premium btn-premium-primary h-14 text-lg">
                                Sell My Car
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* SPACER - CRITICAL TO PREVENT OVERLAP */}
            <div className="h-[80px] md:h-[90px] lg:h-[100px]" />
        </>
    );
}
