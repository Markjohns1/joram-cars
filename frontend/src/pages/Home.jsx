/**
 * Premium Home Page
 * 
 * Re-designed for World-Class High-End Aesthetic:
 * - Immersive Hero with high-contrast typography
 * - Sophisticated quick-filter system
 * - Premium cards with soft-depth
 */

import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ArrowRight, Star, ShieldCheck, Zap, Car, Filter } from 'lucide-react';
import { vehiclesAPI } from '../api';
import { VehicleCard } from '../components/vehicles';
import { Button, LoadingPage, SEO } from '../components/common';
import { cn } from '../utils/helpers';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
    const navigate = useNavigate();
    const [featuredVehicles, setFeaturedVehicles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const brandsCarouselRef = useRef(null);
    const brands = [
        { name: 'Toyota', image: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&q=80' }, // Reliable Land Cruiser
        { name: 'Subaru', image: 'https://images.unsplash.com/photo-1629897048514-3dd74151e86b?auto=format&fit=crop&q=80' }, // Reliable WRX
        { name: 'Mazda', image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80' }, // Reliable CX-5
        { name: 'Nissan', image: 'https://images.unsplash.com/photo-1517524008697-5a92a8e48870?auto=format&fit=crop&q=80' }, // Reliable GTR
        { name: 'Honda', image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80' }  // Reliable Civic
    ];

    // Auto-scroll carousel on mobile (2s interval, infinite loop)
    useEffect(() => {
        // Small delay to ensure the DOM is fully rendered
        const timer = setTimeout(() => {
            const carousel = brandsCarouselRef.current;
            if (!carousel) return;

            // Only run on mobile (screen width < 768px)
            if (window.innerWidth >= 768) return;

            let currentIndex = 0;
            const totalCards = brands.length;

            const interval = setInterval(() => {
                currentIndex++;
                if (currentIndex >= totalCards) {
                    currentIndex = 0;
                }

                // Get accurate card width from first child to handle gaps/margins correctly
                const firstCard = carousel.children[0];
                const cardWidth = firstCard ? firstCard.clientWidth + 16 : carousel.scrollWidth / totalCards; // 16px is gap-4

                carousel.scrollTo({ left: cardWidth * currentIndex, behavior: 'smooth' });
            }, 2500);

            // Store interval ID for cleanup
            carousel._autoScrollInterval = interval;
        }, 500);

        return () => {
            clearTimeout(timer);
            const carousel = brandsCarouselRef.current;
            if (carousel && carousel._autoScrollInterval) {
                clearInterval(carousel._autoScrollInterval);
            }
        };
    }, []);

    // Desktop Continuous Rotation Logic
    const [desktopBrands, setDesktopBrands] = useState(brands);
    useEffect(() => {
        // Only run on desktop
        if (window.innerWidth < 768) return;

        const interval = setInterval(() => {
            setDesktopBrands(prev => {
                const [first, ...rest] = prev;
                return [...rest, first];
            });
        }, 3000); // Rotate every 3 seconds

        return () => clearInterval(interval);
    }, []);

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
                title="Premier Luxury & Performance Cars"
                description="Discover verified luxury and performance cars in Nairobi, Kenya. Joram Cars specializes in direct imports, pristine used vehicles, and seamless car sales. Worldwide inquiries welcome."
                canonical="/"
            />
            {isLoading ? <LoadingPage /> : (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col pb-20 w-full overflow-x-hidden"
                >
                    {/* 1. Immersive Hero Section */}
                    <section className="relative min-h-[70vh] md:min-h-[80vh] flex items-center pt-24 pb-16 overflow-hidden">
                        {/* Visual Backdrop with Stronger Contrast Gradient */}
                        <div className="absolute inset-0 bg-slate-950">
                            <img
                                src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80"
                                className="w-full h-full object-cover opacity-50 mix-blend-overlay"
                                alt="Luxury Sports Car in Showroom"
                                fetchPriority="high"
                                loading="eager"
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

                                {/* Premium Search Box - CTA Component */}
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.4 }}
                                    className="w-full max-w-lg"
                                >
                                    {/* Search Input with Submit Button */}
                                    <div className="flex items-center h-16 bg-slate-900/80 backdrop-blur-sm rounded-xl border border-slate-700/50 hover:border-slate-600 focus-within:border-blue-500/50 transition-all duration-300 overflow-hidden">
                                        <input
                                            type="text"
                                            placeholder="Search vehicles..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                            className="bg-transparent border-none outline-none ring-0 focus:ring-0 focus:outline-none flex-1 text-white placeholder:text-slate-500 font-medium text-lg px-6 h-full w-full"
                                        />
                                        <button
                                            onClick={handleSearch}
                                            className="h-full px-6 bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-wider text-sm flex items-center gap-2 transition-colors shrink-0"
                                        >
                                            <Search size={20} />
                                            <span className="hidden sm:inline">Search</span>
                                        </button>
                                    </div>
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

                        {/* Mobile View: Auto-scroll Carousel */}
                        <div ref={brandsCarouselRef} className="md:hidden flex overflow-x-auto gap-4 hide-scrollbar pb-8 -mx-4 px-4 snap-x">
                            {brands.map(brand => (
                                <div
                                    key={brand.name}
                                    onClick={() => navigate(`/vehicles?make=${brand.name}`)}
                                    className="flex-shrink-0 w-[80vw] mx-auto group cursor-pointer snap-center"
                                >
                                    <div className="aspect-[4/3] rounded-2xl overflow-hidden relative shadow-lg">
                                        <img
                                            src={brand.image}
                                            alt={brand.name}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 to-transparent" />
                                        <div className="absolute bottom-0 left-0 right-0 p-5">
                                            <span className="text-white font-black text-2xl tracking-tighter uppercase">{brand.name}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Desktop View: Animated Hero Rotator */}
                        <div className="hidden md:flex items-center gap-8 overflow-hidden py-12 px-2 relative min-h-[300px]">
                            <AnimatePresence mode='popLayout'>
                                {desktopBrands.map((brand, index) => (
                                    <motion.div
                                        layout
                                        key={brand.name}
                                        onClick={() => navigate(`/vehicles?make=${brand.name}`)}
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{
                                            scale: index === 0 ? 1.15 : 0.9,
                                            opacity: index === 0 ? 1 : 0.3,
                                            filter: index === 0 ? 'blur(0px)' : 'blur(2px)',
                                            x: 0,
                                        }}
                                        exit={{ scale: 0.8, opacity: 0, x: -100 }}
                                        transition={{
                                            type: "spring",
                                            stiffness: 350,
                                            damping: 25,
                                            layout: { duration: 0.6 }
                                        }}
                                        className={`flex-shrink-0 cursor-pointer relative group ${index === 0 ? 'z-20' : 'z-10'}`}
                                        style={{ width: index === 0 ? '280px' : '220px' }}
                                    >
                                        <div className={`
                                            aspect-square rounded-2xl flex flex-col items-center justify-end overflow-hidden border transition-all duration-500 shadow-2xl relative
                                            ${index === 0
                                                ? 'border-blue-500 shadow-blue-500/30'
                                                : 'border-slate-200'
                                            }
                                        `}>
                                            {/* Brand Image */}
                                            <div className="absolute inset-0 bg-slate-900">
                                                <img
                                                    src={brand.image}
                                                    alt={brand.name}
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                                            </div>

                                            {/* Text Overlay */}
                                            <div className="relative z-10 p-6 w-full text-center">
                                                <span className={`
                                                    font-black tracking-tighter uppercase transition-colors text-white
                                                    ${index === 0 ? 'text-4xl' : 'text-2xl opacity-80'}
                                                `}>
                                                    {brand.name}
                                                </span>
                                            </div>

                                            {/* Active Indicator Label */}
                                            {index === 0 && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className="absolute top-4 right-4 px-3 py-1 bg-blue-600 rounded-full text-white text-[10px] font-bold uppercase tracking-widest z-20 shadow-lg"
                                                >
                                                    View
                                                </motion.div>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
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
