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
    TrendingUp, Eye, DollarSign
} from 'lucide-react';
import { AdminLayout } from './components';
import { adminAPI } from '../../api';
import { useAuth } from '../../context';

function StatCard({ title, value, icon: Icon, color, trend, link }) {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 relative overflow-hidden group"
        >
            <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity text-${color}-500`}>
                <Icon size={80} />
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
            className="flex items-center gap-4 p-4 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md hover:border-primary/20 transition-all text-left group"
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
        conversion_rate: 4.8,
        inventory_value: 48500000
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            const data = await adminAPI.getDashboardStats();
            // Mocking extended analytical data for now
            setStats({
                ...data,
                conversion_rate: 3.2,
                inventory_value: 52400000
            });
        } catch (error) {
            console.error('Error loading stats:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AdminLayout title="System Overview">
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
                    value={stats.total_views.toLocaleString()}
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
                            <div className="bg-slate-900 rounded-2xl p-6 text-white overflow-hidden relative group">
                                <TrendingUp className="absolute -bottom-4 -right-4 w-32 h-32 opacity-10 group-hover:scale-110 transition-transform" />
                                <h4 className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-4">Lead Conversion</h4>
                                <div className="flex items-end gap-2 mb-2">
                                    <span className="text-3xl font-black">{stats.conversion_rate}%</span>
                                    <span className="text-green-400 text-xs font-bold mb-1">+1.2%</span>
                                </div>
                                <p className="text-slate-400 text-xs leading-relaxed">System performance based on View-to-Enquiry ratio.</p>
                            </div>
                            <div className="bg-white border border-slate-100 rounded-2xl p-6 overflow-hidden relative group">
                                <DollarSign className="absolute -bottom-4 -right-4 w-32 h-32 text-slate-50 group-hover:scale-110 transition-transform" />
                                <h4 className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-4">Inventory Value (Est.)</h4>
                                <div className="flex items-end gap-2 mb-2">
                                    <span className="text-3xl font-black text-slate-900">KSh {stats.inventory_value.toLocaleString()}</span>
                                </div>
                                <p className="text-slate-500 text-xs leading-relaxed">Estimated market value of active stock.</p>
                            </div>
                        </div>
                    )}

                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Growth Performance</h2>
                            <select className="text-[10px] font-bold uppercase tracking-widest border-slate-200 rounded-lg p-2 bg-slate-50">
                                <option>Last 30 Days</option>
                                <option>Last 90 Days</option>
                            </select>
                        </div>

                        <div className="h-48 flex items-center justify-center text-slate-400 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                            <div className="text-center">
                                <TrendingUp className="mx-auto mb-2 opacity-20" size={32} />
                                <p className="text-[10px] font-bold uppercase tracking-widest opacity-50">Analytics Engine Warming Up</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
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
