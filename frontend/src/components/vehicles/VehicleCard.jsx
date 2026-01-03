/**
 * World-Class Premium Vehicle Card
 * 
 * Design Philosophy:
 * - Ultra-minimalist frame
 * - Dynamic Depth (Shadows & Scale)
 * - Refined Typography & Spacing
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Gauge, Settings, ShieldCheck, Heart, MapPin, Camera, Eye, Zap } from 'lucide-react';
import { Badge } from '../common';
import { formatPrice, formatMileage, getImageUrl, getStatusColor, getStatusLabel } from '../../utils/helpers';
import { cn } from '../../utils/helpers';
import 'react-lazy-load-image-component/src/effects/blur.css';

export default function VehicleCard({ vehicle }) {
    const [imageIndex, setImageIndex] = useState(0);
    const photos = vehicle.images?.length > 0
        ? vehicle.images.slice(0, 3)
        : [{ image_url: vehicle.primary_image }];

    // World-Class Autoplay: System auto-rotates photos to show off inventory
    useEffect(() => {
        if (photos.length <= 1) return;

        const interval = setInterval(() => {
            setImageIndex((prev) => (prev + 1) % photos.length);
        }, 4000); // 4 seconds of "Numerical Wisdom" eye-time

        return () => clearInterval(interval);
    }, [photos.length]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -8 }}
            className="group premium-card overflow-hidden h-full flex flex-col"
        >
            {/* 1. Immersive Image Base - With Automatic infinite shimer */}
            <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
                <Link to={`/vehicles/${vehicle.id}`} title={`View details for ${vehicle.year} ${vehicle.make} ${vehicle.model}`}>
                    <AnimatePresence mode="wait">
                        <motion.img
                            key={imageIndex}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.8, ease: "easeInOut" }}
                            src={getImageUrl(photos[imageIndex]?.image_url || photos[0].image_url)}
                            crossOrigin="anonymous"
                            alt={`${vehicle.year} ${vehicle.make} ${vehicle.model} - Part ${imageIndex + 1}`}
                            className="w-full h-full object-cover transition-all duration-[2000ms] group-hover:scale-105"
                        />
                    </AnimatePresence>
                </Link>

                {/* Photo Counter Indicator */}
                {photos.length > 1 && (
                    <div className="absolute bottom-3 right-3 flex gap-1 z-10 px-2 py-1 rounded-full bg-black/30 backdrop-blur-md">
                        {photos.map((_, idx) => (
                            <div
                                key={idx}
                                className={cn(
                                    "w-1.5 h-1.5 rounded-full transition-all duration-500",
                                    imageIndex === idx ? "bg-white w-4" : "bg-white/40"
                                )}
                            />
                        ))}
                    </div>
                )}

                {/* Floating Interactive Layer - World-Class FOMO */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute bottom-4 left-4 flex items-center gap-2">
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 backdrop-blur-md border border-white/10">
                            <Eye size={14} className="text-white" />
                            <span className="text-white text-[10px] font-bold tracking-widest">{vehicle.views_count} Views</span>
                        </div>
                    </div>
                </div>

                {/* Heart Action */}
                <button className="absolute top-4 right-4 w-10 h-10 glass-card rounded-full flex items-center justify-center text-slate-900 hover:text-red-500 active:scale-90 transition-all z-10 shadow-xl border-white/40">
                    <Heart size={20} className="transition-colors" />
                </button>

                {/* High-Contrast Availability Badge - Absolute Corner */}
                <div className="absolute top-0 left-0 z-10 flex flex-col items-start">
                    <div className={cn(
                        "flex items-center gap-1.5 px-3 py-1.5 rounded-br-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl",
                        vehicle.availability_status === 'available'
                            ? "bg-emerald-600 text-white"
                            : vehicle.availability_status === 'sold'
                                ? "bg-rose-600 text-white"
                                : "bg-blue-600 text-white"
                    )}>
                        {vehicle.availability_status === 'available' && (
                            <span className="relative flex h-2 w-2">
                                <span className="animate-status-pulse absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                            </span>
                        )}
                        {getStatusLabel(vehicle.availability_status)}
                    </div>

                    {/* Automated Trending Logic: 90% Automation for conversion */}
                    {vehicle.views_count > 20 && vehicle.availability_status === 'available' && (
                        <div className="mt-1 flex items-center gap-1.5 px-2.5 py-1 rounded-r-full bg-amber-500 text-white font-black text-[9px] uppercase tracking-[0.15em] shadow-xl animate-bounce-subtle">
                            <Zap size={10} className="fill-white" />
                            Trending
                        </div>
                    )}
                </div>
            </div>

            {/* 2. Refined Information Architecture */}
            <div className="p-4 md:p-5 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-2">
                    <Link to={`/vehicles/${vehicle.id}`} className="flex-1 mr-4">
                        <h3 className="text-lg md:text-xl font-bold tracking-tight text-slate-900 mb-1 leading-tight line-clamp-1 group-hover:text-brand-primary transition-colors">
                            {vehicle.year} {vehicle.make} {vehicle.model}
                        </h3>
                        <p className="text-slate-400 font-bold text-[9px] uppercase tracking-[0.2em]">{vehicle.trim || "Verified Edition"}</p>
                    </Link>
                </div>

                {/* Price Landmark */}
                <div className="mb-4">
                    <p className="text-brand-primary font-extrabold text-xl md:text-2xl tracking-tight">
                        {(formatPrice(vehicle.price, vehicle.currency) || '').replace('KSH', 'KSh')}
                    </p>
                </div>

                {/* Minimalist Tech Specs */}
                <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-100">
                    <div className="flex flex-col gap-0.5">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Mileage</span>
                        <div className="flex items-center gap-1.5 text-slate-700 font-bold text-xs">
                            {formatMileage(vehicle.mileage)}
                        </div>
                    </div>
                    <div className="flex flex-col gap-0.5 text-center">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">DRIVE</span>
                        <div className="flex items-center justify-center gap-1.5 text-slate-700 font-bold text-xs uppercase">
                            {vehicle.transmission?.slice(0, 4)}
                        </div>
                    </div>
                    <div className="flex flex-col gap-0.5 text-right">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">LOCATION</span>
                        <div className="flex items-center justify-end gap-1.5 text-slate-700 font-bold text-xs">
                            {vehicle.location}
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
