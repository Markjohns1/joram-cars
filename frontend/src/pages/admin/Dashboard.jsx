/**
 * Admin Dashboard
 * 
 * Overview of system statistics.
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    Car, MessageSquare, FileText, ArrowUpRight,
    TrendingUp, Eye, DollarSign, UserPlus
} from 'lucide-react';
import { AdminLayout } from './components';

import { Button } from '../../components/common';
import { adminAPI } from '../../api';
import { useAuth } from '../../context';

function StatCard({ title, value, icon: Icon, color, trend, link }) {
    return (
        <motion.div
            whileHover={{ y: -2 }}
            className="bg-white p-6 border border-slate-200 rounded-[5px] relative overflow-hidden group shadow-sm"
        >
            <div className={`absolute top-6 right-6 opacity-[0.02] group-hover:opacity-10 transition-all duration-500 text-${color}-600 group-hover:scale-110`}>
                <Icon size={64} />
            </div>

            <div className={`relative z-10`}>
                <div className={`w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-600 mb-4`}>
                    <Icon size={20} />
                </div>

                <h3 className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-1">{title}</h3>
                <p className="text-2xl font-black text-slate-900 mb-2">{value}</p>

                {trend && (
                    <div className="flex items-center gap-1 text-green-600 text-[10px] font-bold uppercase tracking-wider">
                        <TrendingUp size={12} />
                        <span>{trend} vs last month</span>
                    </div>
                )}

                {link && (
                    <Link to={link} className="absolute inset-0 z-20" aria-label={`View ${title}`} />
                )}
            </div>
        </motion.div>
    );
}

function QuickAction({ title, icon: Icon, onClick, color }) {
    return (
        <button
            onClick={onClick}
            className="flex items-center gap-4 p-4 bg-white border border-slate-200 rounded-[5px] hover:bg-slate-50 transition-all text-left group shadow-sm"
        >
            <div className={`w-12 h-12 rounded-full bg-${color}-50 flex items-center justify-center text-${color}-600 group-hover:scale-110 transition-transform`}>
                <Icon size={24} />
            </div>
            <div>
                <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors">{title}</h3>
                <span className="text-xs text-gray-500 flex items-center gap-1">
                    Perform Action <ArrowUpRight size={12} />
                </span>
            </div>
        </button>
    );
}

export default function Dashboard() {
    const { isAdmin } = useAuth();
    const [stats, setStats] = useState({
        total_vehicles: 0,
        total_views: 0,
        new_enquiries: 0,
        pending_sell_requests: 0,
        conversion_rate: 0,
        total_inventory_value: 0,
        enquiries_wow: 0,
        avg_days_to_sell: 0
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            const data = await adminAPI.getDashboardStats();
            setStats(data);
        } catch (error) {
            // Silent error for dashboard stats
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AdminLayout title="System Overview">
            <div className="flex justify-end mb-6">
                <Link to="/admin/users/new">
                    <Button
                        className="btn-premium btn-premium-primary whitespace-nowrap"
                    >
                        <UserPlus size={18} className="mr-2" />
                        Add New User
                    </Button>
                </Link>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="Active Fleet"
                    value={stats.total_vehicles}
                    icon={Car}
                    color="blue"
                    link="/admin/vehicles"
                />
                <StatCard
                    title="Traffic Volume"
                    value={(stats?.total_views || 0).toLocaleString()}
                    icon={Eye}
                    trend="8.5%"
                />
                <StatCard
                    title="Sales Leads"
                    value={stats.new_enquiries}
                    icon={MessageSquare}
                    link="/admin/enquiries"
                />
                <StatCard
                    title="Acquisition Leads"
                    value={stats.pending_sell_requests}
                    icon={FileText}
                    link="/admin/sell-requests"
                />
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* 1. Informative Business Insights */}
                <div className="lg:col-span-2 space-y-6">
                    {isAdmin && (
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-slate-900 p-6 text-white overflow-hidden relative group border border-slate-800 rounded-[5px]">
                                <TrendingUp className="absolute -bottom-4 -right-4 w-32 h-32 opacity-[0.02] group-hover:scale-110 transition-transform" />
                                <h4 className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-4">Lead Conversion</h4>
                                <div className="flex items-end gap-2 mb-2">
                                    <span className="text-3xl font-black">{stats.conversion_rate}%</span>
                                    <span className={`text-xs font-bold mb-1 ${stats.enquiries_wow >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                        {stats.enquiries_wow >= 0 ? '+' : ''}{stats.enquiries_wow}% WoW
                                    </span>
                                </div>
                                <p className="text-slate-400 text-xs leading-relaxed">System performance based on View-to-Enquiry ratio.</p>
                            </div>
                            <div className="bg-white border border-slate-200 p-6 overflow-hidden relative group rounded-[5px] shadow-sm">
                                <DollarSign className="absolute -bottom-4 -right-4 w-32 h-32 text-slate-500 opacity-[0.02] group-hover:scale-110 transition-transform" />
                                <h4 className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-4">Inventory Value (Est.)</h4>
                                <div className="flex items-end gap-2 mb-2">
                                    <span className="text-3xl font-black text-slate-900">KSh {(stats.total_inventory_value || 0).toLocaleString()}</span>
                                </div>
                                <p className="text-slate-500 text-xs leading-relaxed">Estimated market value of active stock.</p>
                            </div>
                        </div>
                    )}

                    <div className="bg-white border border-slate-200 p-6 rounded-[5px]">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Growth Performance</h2>
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 py-1 bg-slate-50 rounded-full">
                                Real-Time Wisdom
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                            <div>
                                <span className="text-slate-400 text-[9px] font-bold uppercase tracking-widest block mb-2">Avg. Days to Sell</span>
                                <p className="text-2xl font-black text-slate-900">{stats.avg_days_to_sell} <span className="text-xs font-bold text-slate-400">Days</span></p>
                            </div>
                            <div>
                                <span className="text-slate-400 text-[9px] font-bold uppercase tracking-widest block mb-2">Enquiry Pulse</span>
                                <p className="text-2xl font-black text-slate-900">{stats.new_enquiries + stats.pending_sell_requests} <span className="text-xs font-bold text-slate-400">Leads</span></p>
                            </div>
                            <div className="col-span-2 md:col-span-1 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-8">
                                <span className="text-slate-400 text-[9px] font-bold uppercase tracking-widest block mb-2">Visitor Intent</span>
                                <p className="text-2xl font-black text-blue-600">{stats.conversion_rate}%</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="space-y-6">
                    <div className="bg-white border border-slate-200 p-6 rounded-[5px] shadow-sm">
                        <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
                        <div className="flex flex-col gap-3">
                            <Link to="/admin/vehicles/new">
                                <QuickAction title="Add New Vehicle" icon={Car} color="blue" />
                            </Link>
                            <Link to="/admin/enquiries">
                                <QuickAction title="Check Messages" icon={MessageSquare} color="green" />
                            </Link>
                            <Link to="/admin/sell-requests">
                                <QuickAction title="Value a Car" icon={DollarSign} color="orange" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
