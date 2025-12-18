/**
 * World-Class Premium Vehicle Card
 * 
 * Design Philosophy:
 * - Ultra-minimalist frame
 * - Dynamic Depth (Shadows & Scale)
 * - Refined Typography & Spacing
 */

import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Gauge, Settings, ShieldCheck, Heart, MapPin } from 'lucide-react';
import { Badge } from '../common';
import { formatPrice, formatMileage, getImageUrl, getStatusColor, getStatusLabel } from '../../utils/helpers';
import { cn } from '../../utils/helpers';

export default function VehicleCard({ vehicle }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -8 }}
            className="group premium-card overflow-hidden h-full flex flex-col"
        >
            {/* 1. Immersive Image Base */}
            <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                <Link to={`/vehicles/${vehicle.id}`}>
                    <img
                        src={vehicle.primary_image ? getImageUrl(vehicle.primary_image) : '/placeholder-car.jpg'}
                        alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                </Link>

                {/* Floating Interactive Layer */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Heart Action */}
                <button className="absolute top-4 right-4 w-10 h-10 glass-card rounded-full flex items-center justify-center text-slate-900 hover:text-red-500 active:scale-90 transition-all z-10 shadow-xl border-white/40">
                    <Heart size={20} className="transition-colors" />
                </button>

                {/* Premium Status Badge */}
                {vehicle.availability_status !== 'available' && (
                    <div className="absolute top-4 left-4">
                        <div className={cn(
                            "px-3 py-1.5 rounded-xl backdrop-blur-md font-black text-[10px] uppercase tracking-widest shadow-lg",
                            vehicle.availability_status === 'sold' ? "bg-slate-900/90 text-white" : "bg-blue-500/90 text-white"
                        )}>
                            {getStatusLabel(vehicle.availability_status)}
                        </div>
                    </div>
                )}
            </div>

            {/* 2. Refined Information Architecture */}
            <div className="p-5 md:p-6 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-3">
                    <Link to={`/vehicles/${vehicle.id}`} className="flex-1 mr-4">
                        <h3 className="text-lg md:text-xl font-bold tracking-tight text-slate-900 mb-1 leading-tight line-clamp-1 group-hover:text-brand-primary transition-colors">
                            {vehicle.year} {vehicle.make} {vehicle.model}
                        </h3>
                        <p className="text-slate-400 font-bold text-[9px] uppercase tracking-[0.2em]">{vehicle.trim || "Verified Edition"}</p>
                    </Link>
                </div>

                {/* Price Landmark */}
                <div className="mb-5">
                    <p className="text-brand-primary font-extrabold text-xl md:text-2xl tracking-tight">
                        {(formatPrice(vehicle.price, vehicle.currency) || '').replace('KSH', 'KSh')}
                    </p>
                </div>

                {/* Minimalist Tech Specs */}
                <div className="grid grid-cols-3 gap-4 pt-5 border-t border-slate-100">
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
