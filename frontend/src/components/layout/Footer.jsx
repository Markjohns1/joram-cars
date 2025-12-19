/**
 * Footer Component (Mobile Optimized)
 * 
 * Minimalist footer with bottom-nav clearance.
 * Mobile: Simple vertical stack, center aligned, reduced clutter.
 * Desktop: Expanded 4-column grid.
 */

import { Link } from 'react-router-dom';
import {
    Phone, Mail, MapPin, Clock,
    Facebook, Twitter, Instagram, Youtube,
    Car, ChevronRight
} from 'lucide-react';
import { SOCIAL_LINKS, NAV_LINKS, CONTACT_INFO } from '../../utils/constants';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-[#1a1f36] text-slate-300 pb-24 md:pb-0"> {/* pb-24 for mobile nav clearance */}
            <div className="container px-6 py-12 mx-auto">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-10 md:gap-8 text-left">

                    {/* Brand Section - Full width on mobile */}
                    <div className="col-span-2 md:col-span-1 flex flex-col items-start space-y-4">
                        <Link to="/" className="flex items-center gap-2 group">
                            <div className="w-10 h-10 rounded-xl bg-[#0066ff] flex items-center justify-center text-white shadow-lg shadow-blue-900/50">
                                <Car size={24} />
                            </div>
                            <span className="text-xl font-bold text-white tracking-tight">
                                Joram<span className="text-[#0066ff]">Cars</span>
                            </span>
                        </Link>
                        <p className="text-sm leading-relaxed max-w-xs text-slate-400">
                            Kenya's most trusted marketplace for verified quality used cars.
                        </p>
                        <div className="flex gap-4 pt-2">
                            {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
                                <a key={i} href="#" className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#0066ff] hover:text-white transition-all text-slate-400 hover:text-white">
                                    <Icon size={18} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Access */}
                    <div className="space-y-4">
                        <h4 className="text-white font-semibold tracking-wide uppercase text-xs">Quick Links</h4>
                        <ul className="space-y-2">
                            {NAV_LINKS.map(link => (
                                <li key={link.path}>
                                    <Link to={link.path} className="text-slate-300 hover:text-white transition-colors flex items-center gap-1 text-sm">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div className="space-y-4 col-span-2 md:col-span-1">
                        <h4 className="text-white font-semibold tracking-wide uppercase text-xs">Contact Us</h4>
                        <ul className="space-y-3 text-sm">
                            <li className="flex items-start gap-3">
                                <Phone size={16} className="text-[#0066ff] mt-1 shrink-0" />
                                <a href={`tel:${CONTACT_INFO.phone}`} className="text-slate-300 hover:text-white font-medium">{CONTACT_INFO.phone}</a>
                            </li>
                            <li className="flex items-start gap-3">
                                <Mail size={16} className="text-[#0066ff] mt-1 shrink-0" />
                                <a href={`mailto:${CONTACT_INFO.email}`} className="text-slate-300 hover:text-white break-all">{CONTACT_INFO.email}</a>
                            </li>
                            <li className="flex items-start gap-3">
                                <MapPin size={16} className="text-[#0066ff] mt-1 shrink-0" />
                                <span className="text-slate-300">{CONTACT_INFO.city}, {CONTACT_INFO.country}</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Clock size={16} className="text-[#0066ff] mt-1 shrink-0" />
                                <span className="text-slate-300">Mon - Sat: 8:00 AM - 6:00 PM</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-gray-800 text-sm text-center md:flex md:justify-between items-center text-slate-500">
                    <p>© {currentYear} Joram Cars. All rights reserved.</p>
                    <div className="flex justify-center gap-6 mt-4 md:mt-0">
                        <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
                        <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
