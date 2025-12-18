/**
 * Premium Home Page
 * 
 * Re-designed for World-Class High-End Aesthetic:
 * - Immersive Hero with high-contrast typography
 * - Sophisticated quick-filter system
 * - Premium cards with soft-depth
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, ArrowRight, Star, ShieldCheck, Zap, Car, Filter } from 'lucide-react';
import { vehiclesAPI } from '../api';
import { VehicleCard } from '../components/vehicles';
import { Button, LoadingPage } from '../components/common';
import { motion } from 'framer-motion';

export default function Home() {
    const [featuredVehicles, setFeaturedVehicles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await vehiclesAPI.getFeatured(3);
                setFeaturedVehicles(data);
            } catch (error) {
                console.error('Failed to load premium home data', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    if (isLoading) return <LoadingPage />;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col gap-12 md:gap-24 pb-24"
        >
            {/* 1. Immersive Hero Section */}
            <section className="relative min-h-[85vh] flex items-center pt-20 pb-12 overflow-hidden">
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
                            className="bg-white p-2 rounded-2xl md:rounded-full flex flex-col md:flex-row items-center gap-2 shadow-2xl border border-white/10"
                        >
                            <div className="flex flex-1 items-center px-4 w-full h-12">
                                <Search className="text-slate-400 mr-2" size={20} />
                                <input
                                    type="text"
                                    placeholder="Search Model..."
                                    className="bg-transparent border-none focus:ring-0 flex-1 text-slate-900 placeholder:text-slate-400 font-bold text-sm md:text-base p-0"
                                />
                            </div>
                            <Button className="w-full md:w-auto btn-premium btn-premium-primary h-12 px-8 text-sm md:text-base whitespace-nowrap">
                                Discover Now
                            </Button>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* 2. Premium Grid Categories */}
            <section className="container-premium">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <div>
                        <h2 className="text-4xl font-black tracking-tighter text-slate-900 mb-2">COLLECTIONS</h2>
                        <p className="text-slate-500 font-bold text-sm uppercase tracking-widest">Hand-picked by our automotive experts</p>
                    </div>
                    <div className="flex gap-4">
                        {['SUV', 'Sedan', 'Luxury', 'Performance'].map(type => (
                            <button key={type} className="px-6 py-3 rounded-2xl bg-slate-50 text-slate-900 font-bold text-sm hover:bg-slate-900 hover:text-white transition-all">
                                {type}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex overflow-x-auto gap-6 hide-scrollbar pb-4 -mx-6 px-6">
                    {/* Horizontal Categories */}
                    {['Toyota', 'BMW', 'Mercedes', 'Mazda'].map(brand => (
                        <div key={brand} className="flex-shrink-0 w-48 group cursor-pointer">
                            <div className="aspect-square bg-slate-50 rounded-[40px] flex items-center justify-center border border-slate-100 group-hover:bg-[var(--brand-primary)] group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-500 shadow-sm group-hover:shadow-2xl group-hover:shadow-blue-200">
                                <Car size={48} className="text-slate-200 group-hover:text-white/20 transition-colors" />
                                <span className="absolute text-slate-900 font-black tracking-tighter group-hover:text-white transition-colors uppercase">{brand}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* 3. Featured Showcase */}
            <section className="bg-slate-50 py-20 md:py-32">
                <div className="container-premium">
                    <div className="flex items-center justify-between mb-10">
                        <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-slate-900 uppercase">The Showroom</h2>
                        <Link to="/vehicles" className="flex items-center gap-2 text-brand-primary font-bold uppercase tracking-widest text-xs group">
                            Explore All <ArrowRight className="group-hover:translate-x-1 transition-transform" size={16} />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {featuredVehicles.map(vehicle => (
                            <VehicleCard key={vehicle.id} vehicle={vehicle} />
                        ))}
                    </div>
                </div>
            </section>

            {/* 4. The Joram Standard */}
            <section className="container-premium py-10">
                <div className="bg-slate-950 rounded-[48px] p-10 md:p-24 relative overflow-hidden flex flex-col md:flex-row items-center gap-16">
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
            <section className="container-premium">
                <div className="relative group cursor-pointer overflow-hidden rounded-[48px]">
                    <div className="absolute inset-0 bg-[var(--brand-primary)] group-hover:bg-[#0052cc] transition-colors duration-500" />
                    <div className="relative z-10 p-12 md:p-24 flex flex-col md:flex-row items-center justify-between gap-10">
                        <div className="text-center md:text-left">
                            <h2 className="text-white text-4xl md:text-6xl font-black tracking-tighter mb-4">SELL YOUR VEHICLE.</h2>
                            <p className="text-blue-100 text-lg font-bold">Get a world-class valuation in under 10 minutes.</p>
                        </div>
                        <Link to="/sell-car">
                            <button className="bg-white text-slate-900 h-20 px-12 rounded-full font-black text-xl hover:scale-105 transition-transform shadow-2xl">
                                START APPRAISAL
                            </button>
                        </Link>
                    </div>
                </div>
            </section>
        </motion.div>
    );
}
