/**
 * Premium Header Component
 * 
 * World-Class Luxury Design:
 * - Floating glassmorphism effect
 * - Refined typography and spacing
 * - High-impact mobile interaction
 */

import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, Car, ArrowRight } from 'lucide-react';
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
        document.body.style.overflow = isMobileMenuOpen ? 'hidden' : 'unset';
    }, [location, isMobileMenuOpen]);

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
                    'fixed top-0 left-0 right-0 z-[100] transition-all duration-500',
                    isScrolled 
                        ? 'py-3' 
                        : 'py-5'
                )}
            >
                <div className={cn(
                    "container-premium flex items-center justify-between transition-all duration-500 h-16 md:h-16",
                    isScrolled 
                        ? "glass-nav rounded-2xl md:rounded-full py-2 shadow-[0_8px_30px_rgb(0,0,0,0.04)]" 
                        : "bg-transparent"
                )}>
                    
                    {/* Brand Signature */}
                    <Link to="/" className="flex items-center gap-3 relative z-[110]">
                        <div className="w-10 h-10 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-slate-900/20">
                            <Car size={22} className="text-white" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xl md:text-2xl font-black tracking-tighter text-slate-900 leading-none">
                                JORAM<span className="text-[var(--brand-primary)]">CARS</span>
                            </span>
                            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-400 leading-none mt-1">
                                Premium Automotive
                            </span>
                        </div>
                    </Link>

                    {/* Sophisticated Desktop Navigation */}
                    <nav className="hidden lg:flex items-center gap-10">
                        {navLinks.map(link => (
                            <Link 
                                key={link.path} 
                                to={link.path}
                                className={cn(
                                    "text-sm font-bold tracking-tight py-2 transition-all duration-300 relative group",
                                    location.pathname === link.path ? "text-slate-900" : "text-slate-500 hover:text-slate-900"
                                )}
                            >
                                {link.label}
                                <span className={cn(
                                    "absolute bottom-0 left-0 w-full h-0.5 bg-[var(--brand-primary)] transition-transform duration-300 origin-left",
                                    location.pathname === link.path ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                                )} />
                            </Link>
                        ))}
                    </nav>

                    {/* Premium Tools */}
                    <div className="flex items-center gap-3 md:gap-6 relative z-[110]">
                        <a href="tel:+254700000000" className="hidden sm:flex items-center gap-2 group">
                            <div className="w-9 h-9 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-[var(--brand-primary)] group-hover:text-white transition-colors">
                                <Phone size={16} />
                            </div>
                            <span className="text-sm font-bold text-slate-900 hidden md:inline-block">+254 700 000 000</span>
                        </a>

                        <div className="lg:hidden flex items-center gap-3">
                             <a href="tel:+254700000000" className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center sm:hidden shadow-lg shadow-slate-900/20">
                                <Phone size={18} />
                            </a>
                            <button 
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="w-10 h-10 flex items-center justify-center text-slate-900 rounded-full hover:bg-slate-50 transition-colors"
                            >
                                {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                            </button>
                        </div>

                        <Link to="/sell-car" className="hidden lg:block">
                            <button className="btn-premium btn-premium-primary text-sm h-12">
                                Sell Your Vehicle
                            </button>
                        </Link>
                    </div>
                </div>
            </header>

            {/* Premium Mobile Menu Overlay */}
            <div className={cn(
                "fixed inset-0 bg-white/95 backdrop-blur-2xl z-[90] transition-all duration-500 flex flex-col",
                isMobileMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full"
            )}>
                <div className="pt-32 px-8 flex flex-col h-full container-premium">
                    <nav className="flex flex-col gap-8">
                        {navLinks.map((link, idx) => (
                            <Link 
                                key={link.path} 
                                to={link.path} 
                                className="flex items-center justify-between group"
                                style={{ transitionDelay: `${idx * 100}ms` }}
                            >
                                <span className="text-4xl font-black text-slate-900 tracking-tighter group-active:text-[var(--brand-primary)]">
                                    {link.label}
                                </span>
                                <ArrowRight className="text-slate-300 group-active:text-[var(--brand-primary)] translate-x-[-10px] opacity-0 group-active:translate-x-0 group-active:opacity-100 transition-all" size={32} />
                            </Link>
                        ))}
                    </nav>

                    <div className="mt-auto mb-16 space-y-4">
                         <Link to="/sell-car" className="w-full">
                            <button className="w-full btn-premium btn-premium-primary h-16 text-lg">
                                Sell My Car
                            </button>
                         </Link>
                         <p className="text-center text-slate-400 font-bold text-xs uppercase tracking-[0.2em] pt-4">
                            Expert Assistance 24/7
                         </p>
                    </div>
                </div>
            </div>

            {/* Minimal Spacer */}
            <div className="h-[var(--header-h-mobile)] md:h-[var(--header-h)]" />
        </>
    );
}
