/**
 * Premium Home Page
 * 
 * Re-designed for World-Class High-End Aesthetic:
 * - Immersive Hero with high-contrast typography
 * - Sophisticated quick-filter system
 * - Premium cards with soft-depth
 */

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ArrowRight, Star, ShieldCheck, Zap, Car, Filter } from 'lucide-react';
import { vehiclesAPI } from '../api';
import { VehicleCard } from '../components/vehicles';
import { Button, LoadingPage, SEO } from '../components/common';
import { cn } from '../utils/helpers';
import { motion } from 'framer-motion';

export default function Home() {
    const navigate = useNavigate();
    const [featuredVehicles, setFeaturedVehicles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await vehiclesAPI.getFeatured(3);
                setFeaturedVehicles(data);
            } catch (error) {
                // Fail silently for premium data
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleSearch = () => {
        // If query is empty, just go to all vehicles
        const query = searchQuery.trim() ? `?search=${encodeURIComponent(searchQuery)}` : '';
        navigate(`/vehicles${query}`);
    };

    return (
        <>
            <SEO
                title="Home"
                description="Kenya's Premier Used Car Marketplace. Discover luxury and quality vehicles at the best prices with Joram Cars."
                canonical="/"
            />
            {isLoading ? <LoadingPage /> : (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col gap-10 md:gap-20 pb-20 w-full overflow-x-hidden"
                >
                    {/* 1. Immersive Hero Section */}
                    <section className="relative min-h-[70vh] md:min-h-[80vh] flex items-center pt-24 pb-16 overflow-hidden">
                        {/* Visual Backdrop with Stronger Contrast Gradient */}
                        <div className="absolute inset-0 bg-slate-950">
                            <img
                                src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80"
                                className="w-full h-full object-cover opacity-50 mix-blend-overlay"
                                alt="Background"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent" />
                            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-transparent to-transparent" />
                        </div>

                        <div className="container-premium relative z-10">
                            <div className="max-w-2xl">
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-4 md:mb-6 backdrop-blur-sm">
                                        <Star size={12} className="fill-blue-500" /> Premium Performance
                                    </span>
                                    <h1 className="text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter mb-4 md:mb-6 italic leading-[0.9]">
                                        DRIVE THE <br />
                                        <span className="text-brand-primary drop-shadow-[0_0_15px_rgba(0,102,255,0.5)]">EXTRAORDINARY.</span>
                                    </h1>
                                    <p className="text-slate-300 text-sm md:text-xl mb-8 md:mb-10 leading-relaxed max-w-lg font-medium opacity-90">
                                        Nairobi's premier boutique car marketplace.
                                        Curating the finest machines for the discerning driver.
                                    </p>
                                </motion.div>

                                {/* Sophisticated Search Overlay - Mobile Optimized */}
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.4 }}
                                    className="flex flex-col md:flex-row items-stretch md:items-center gap-3 md:gap-0 md:bg-white md:p-1 md:rounded-[5px] md:shadow-2xl"
                                >
                                    <div className="flex flex-1 items-center px-5 h-14 md:h-12 bg-white rounded-[5px] shadow-xl md:shadow-none md:bg-transparent md:px-4 border-none focus-within:ring-0 transition-all duration-300">
                                        <Search className="text-slate-400 mr-3" size={20} />
                                        <input
                                            type="text"
                                            placeholder="Search Model..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                            className="bg-transparent border-none outline-none ring-0 focus:ring-0 focus:outline-none flex-1 text-slate-900 placeholder:text-slate-400 font-bold text-base p-0 h-full w-full shadow-none"
                                        />
                                    </div>
                                    <Button
                                        onClick={handleSearch}
                                        className="w-full md:w-auto btn-premium btn-premium-primary h-14 md:h-12 px-8 text-sm font-bold uppercase tracking-widest rounded-[5px] shadow-xl md:shadow-none transition-transform active:scale-95"
                                    >
                                        Discover
                                    </Button>
                                </motion.div>
                            </div>
                        </div>
                    </section>

                    {/* 2. Premium Grid Categories */}
                    {/* 2. Premium Grid Categories */}
                    <section className="container-premium relative">
                        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 md:mb-10 gap-6">
                            <div>
                                <h2 className="text-4xl font-black tracking-tighter text-slate-900 mb-2">COLLECTIONS</h2>
                                <p className="text-slate-500 font-bold text-sm uppercase tracking-widest">Hand-picked by our automotive experts</p>
                            </div>
                            {/* PC Tabs */}
                            <div className="hidden md:flex gap-4">
                                {['SUV', 'Sedan', 'Luxury', 'Performance'].map(type => (
                                    <button
                                        key={type}
                                        onClick={() => navigate(`/vehicles?body_type=${type}`)}
                                        className="px-6 py-3 rounded-xl bg-slate-50 text-slate-900 font-bold text-sm hover:bg-slate-900 hover:text-white transition-all"
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                            {/* Mobile Scroll Hint */}
                            <div className="md:hidden flex items-center gap-2 text-brand-primary animate-pulse">
                                <span className="text-xs font-bold uppercase tracking-widest">Swipe</span>
                                <ArrowRight size={16} />
                            </div>
                        </div>

                        <div className="flex overflow-x-auto gap-4 md:gap-6 hide-scrollbar pb-8 -mx-4 px-4 md:mx-0 md:px-0 snap-x">
                            {/* Horizontal Categories */}
                            {['Toyota', 'Subaru', 'Mazda', 'Nissan', 'Honda'].map(brand => (
                                <div
                                    key={brand}
                                    onClick={() => navigate(`/vehicles?make=${brand}`)}
                                    className="flex-shrink-0 w-[75vw] md:w-56 group cursor-pointer snap-center"
                                >
                                    <div className="aspect-square bg-white rounded-xl flex flex-col items-center justify-center gap-4 border border-slate-100 group-hover:bg-[var(--brand-primary)] group-hover:-translate-y-2 transition-all duration-500 shadow-lg hover:shadow-xl">
                                        <Car size={48} className="text-slate-300 group-hover:text-white transition-colors" />
                                        <span className="text-slate-900 font-black text-2xl tracking-tighter group-hover:text-white transition-colors uppercase">{brand}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* 3. Featured Showcase */}
                    <section className="bg-slate-50 py-10 md:py-16">
                        <div className="container-premium">
                            <div className="flex items-center justify-between mb-10">
                                <h2 className="text-2xl md:text-3xl font-black tracking-tighter text-slate-900 uppercase">The Showroom</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {featuredVehicles.map(vehicle => (
                                    <VehicleCard key={vehicle.id} vehicle={vehicle} />
                                ))}
                            </div>

                            {/* Browse More CTA */}
                            <div className="mt-16 flex justify-center">
                                <Link to="/vehicles">
                                    <button className="bg-blue-600 text-white h-12 px-8 rounded-[5px] font-bold text-sm uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl w-full md:w-auto min-w-[180px] active:scale-95">
                                        Browse Full Inventory
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </section>

                    {/* 4. The Joram Standard */}
                    <section className="container-premium py-10">
                        <div className="bg-slate-950 rounded-[5px] p-8 md:p-16 relative overflow-hidden flex flex-col md:flex-row items-center gap-12 shadow-2xl">
                            <div className="absolute top-0 right-0 p-4 opacity-5">
                                <Car size={300} className="text-white" />
                            </div>

                            <div className="flex-1 relative z-10 text-center md:text-left">
                                <h2 className="text-white text-4xl md:text-6xl font-black tracking-tighter mb-8 italic">
                                    THE <span className="text-blue-500">JORAM</span> <br />DIFFERENCE.
                                </h2>
                                <div className="grid gap-10 md:grid-cols-3">
                                    {[
                                        { icon: ShieldCheck, title: "Verified Heritage", desc: "Rigorous 150-point inspection on every vehicle." },
                                        { icon: Zap, title: "Elite Service", desc: "Concierge-level paperwork and delivery service." },
                                        { icon: Star, title: "Curated Selection", desc: "Only the top 5% of inventory makes our collection." }
                                    ].map((item, i) => (
                                        <div key={i} className="space-y-4">
                                            <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center text-blue-400 mx-auto md:mx-0">
                                                <item.icon size={24} />
                                            </div>
                                            <h4 className="text-white text-lg font-bold">{item.title}</h4>
                                            <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* 5. Sell CTA */}
                    <section className="container-premium mb-12">
                        <div className="relative group cursor-pointer overflow-hidden rounded-[5px] shadow-lg">
                            <div className="absolute inset-0 bg-blue-600 group-hover:bg-blue-700 transition-colors duration-500" />
                            <div className="relative z-10 p-6 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
                                <div className="text-center md:text-left">
                                    <h2 className="text-white text-2xl md:text-4xl font-black tracking-tighter mb-2">SELL YOUR VEHICLE.</h2>
                                    <p className="text-blue-100 text-sm md:text-base font-bold italic opacity-90">Get a world-class valuation in under 10 minutes.</p>
                                </div>
                                <Link to="/sell-car">
                                    <button className="bg-white text-blue-900 h-14 px-8 rounded-[3px] font-black text-sm hover:bg-slate-50 transition-colors shadow-xl uppercase tracking-widest">
                                        START APPRAISAL
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </section>
                </motion.div>
            )}
        </>
    );
}
