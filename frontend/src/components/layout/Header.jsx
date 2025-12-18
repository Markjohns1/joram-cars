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

export default function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
                        ? 'bg-white border-b border-slate-200 py-3 shadow-sm'
                        : 'bg-white/80 backdrop-blur-md py-4'
                )}
            >
                <div className="container-premium flex items-center justify-between h-12">

                    {/* Brand Signature */}
                    <Link to="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-slate-950 rounded-lg flex items-center justify-center text-white">
                            <Car size={18} />
                        </div>
                        <span className="text-lg font-black tracking-tighter text-slate-950">
                            JORAMCARS
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center gap-8">
                        {navLinks.map(link => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={cn(
                                    "text-sm font-bold tracking-tight py-1 transition-all duration-200",
                                    location.pathname === link.path ? "text-brand-primary" : "text-slate-600 hover:text-slate-950"
                                )}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Actions */}
                    <div className="flex items-center gap-4">
                        <a href="tel:+254716770077" className="hidden sm:flex items-center gap-2 text-sm font-bold text-slate-700 hover:text-brand-primary transition-colors">
                            <Phone size={14} />
                            <span>+254 716 770 077</span>
                        </a>

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

            {/* Mobile Menu Overlay */}
            <div className={cn(
                "fixed inset-0 bg-white z-[90] transition-all duration-300 md:hidden flex flex-col",
                isMobileMenuOpen ? "opacity-100 translate-x-0" : "opacity-0 translate-x-full pointer-events-none"
            )}>
                <div className="pt-24 px-6 space-y-2">
                    {navLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={cn(
                                "block py-4 text-2xl font-bold border-b border-slate-50",
                                location.pathname === link.path ? "text-brand-primary" : "text-slate-900"
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
            <div className="h-[68px] lg:h-[80px]" />
        </>
    );
}
